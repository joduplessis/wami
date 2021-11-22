import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import mongoose from 'mongoose';
import {
    CalendarModel,
    ChannelModel,
    EventModel,
    ContactModel,
    GroupModel,
    MessageModel,
    TagModel,
    TransactionModel,
    UserModel,
    RatingModel,
    TaskModel
} from '../models';
import {
    USER,
    GROUP,
    CHANNEL
} from './';

const moment = require('moment-timezone');

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value;
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(ast.value);
            }

            return null;
        },
    }),

    Query: {
        groups: (_, { id }) => {
            return GroupModel
                .find({members: id})
                .exec()
                .then((groups) => {
                    return groups;
                })
                .catch((err) => {
                    return [];
                });
        },
        contacts: (_, { id }) => {
            return ContactModel
                .find({ $or: [
                    {user: id},
                    {contact: id}
                ]})
                .populate([
                    {
                        path: 'contact',
                        model: 'User'
                    },
                    {
                        path: 'user',
                        model: 'User'
                    }
                ])
                .exec()
                .then((contacts) => {
                    return contacts;
                })
                .catch((err) => {
                    return [];
                });
        },
        contact: (_, { id }) => {
            return ContactModel
                .findOne({ _id: id })
                .populate([
                    {
                        path: 'contact',
                        model: 'User'
                    },
                    {
                        path: 'user',
                        model: 'User'
                    }
                ])
                .exec()
                .then((contact) => {
                    return contact;
                })
                .catch((err) => {
                    return [];
                });
        },
        tags: () => {
            return TagModel
                .find({})
                .exec()
                .then((tags) => {
                    return tags;
                })
                .catch((err) => {
                    return [];
                });
        },
        messages: (_, { topic }) => {
            let query;

            return MessageModel
                .find({ topic })
                .sort({ createdAt: 'asc'})
                .limit(50)
                .exec()
                .then((messages) => {
                    return messages;
                })
                .catch((err) => {
                    return [];
                });
        },
        events: (_, { id }) => {
            return EventModel
                .find({
                    'attendees.user' : id,
                    'processed': false
                })
                .exec()
                .then((ev) => {
                    return ev; // <- event is reserved
                })
                .catch((err) => {
                    return [];
                });
        },
        channels: (_, { id }) => {
            return GroupModel
                .find({ members: id })
                .exec()
                .then((groups) => {
                    const groupIds = groups.map((group, _) => {
                        return group._id;
                    });

                    return ChannelModel
                        .find({
                            $or: [
                                { user: id },
                                { group: { $in: groupIds } },
                                { members: id }
                            ]
                        })
                        .exec()
                        .then((channels) => {
                            return channels;
                        })
                        .catch((err) => {
                            return [];
                        });
                })
                .catch((err) => {
                    return [];
                });
        },
        usersForTag: (_, { tag, count }) => {
            return UserModel
                .find({ tags: tag })
                .populate({
                    path: 'calendar',
                    model: 'Calendar'
                })
                .limit(count)
                .exec()
                .then((users) => {
                    return users;
                })
                .catch((err) => {
                    return [];
                });
        },
        userTransactions: (_, { id, count }) => {
            return TransactionModel
                .find({
                    $or: [
                        { user: id },
                        { expert: id }
                    ]
                })
                .limit(count)
                .exec()
                .then((transactions) => {
                    return transactions;
                })
                .catch((err) => {
                    return {};
                });
        },
        tag: (_, { id }) => {
            return TagModel
                .findOne({_id: id})
                .exec()
                .then((tag) => {
                    return tag;
                })
                .catch((err) => {
                    return {};
                });
        },
        user: (_, { id }) => {
            return UserModel
                .findOne({_id: id})
                .populate({
                    path: 'calendar',
                    model: 'Calendar'
                })
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        userAvailability: (_, { id }) => {

            // Get the expert
            return UserModel
                .findOne({_id: id})
                .populate({
                    path: 'calendar',
                    model: 'Calendar'
                })
                .exec()
                .then((user) => {

                    if (!user.calendar) {
                        return null;
                    }

                    // We just take the first calendar for the time being
                    const { _id, days, start, end, interval, timezone } = user.calendar;

                    // Set the start date to today & then the end to 7 days from now
                    const startDay = moment(new Date()).startOf('day');
                    const endDay = moment(new Date()).add(7, 'days').endOf('day');

                    // We search for all events in this calendar
                    // Greater than/lesser than with dates
                    return EventModel
                        .find({
                            calendar: _id,
                            start: {
                                $gt: startDay.toISOString(),
                                $lt: endDay.toISOString()
                            }
                        })
                        .exec()
                        .then((events) => {

                            const available = [];
                            const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

                            // Our main loop where we'll be comparing date
                            // We iterate over each day here
                            for (let day = startDay; day.isBefore(endDay); day.add(1, 'days')) {

                                // Current weekday
                                const currentWeekday = weekdays[day.isoWeekday()];

                                // Only if the expert is working on this weekday
                                if (days.indexOf(currentWeekday) != -1) {

                                    // Manually, create the day-time limit
                                    // We shift them into the correct timezone of the expert's calendar
                                    const startTimeOfDay = moment.tz((day.format('YYYY-MM-DD') + ' ' + start), timezone);
                                    const endTimeOfDay = moment.tz((day.format('YYYY-MM-DD') + ' ' + end), timezone);

                                    // Timezone formatter, this output the actual '+200' bit
                                    // This is based on the calendar of the expert
                                    const tz = startTimeOfDay.clone().tz(timezone).format('Z');

                                    // This gets the difference in hours between start & end times
                                    // We use this to subdivide with the intervals to see how many slots are open for today
                                    const totalAmountOfHoursInDay = endTimeOfDay.diff(startTimeOfDay, 'hours');

                                    // We use a decimal divider for the division as it's easier
                                    const totalAmountOfSlotsInDay = Math.floor(totalAmountOfHoursInDay / (interval / 60));

                                    // So here we iterate the number of timeslots there are
                                    for (let slot = 0; slot < totalAmountOfSlotsInDay; slot++) {

                                        // We calculate which events fall within this time frame, and remove them
                                        // All events here have a UCT value of +00
                                        // Before using it to filter the events, we need to make it timezone-correct
                                        const eventsThatConflict = events.filter((event) => {

                                            // Update the times here as we're accommodating MongoDB's UCT +00
                                            const eventStart = moment(event.start).tz(timezone);
                                            const eventEnd = moment(event.end).tz(timezone);

                                            // This should be normal time that is in the DB
                                            // And then the correct
                                            // console.log('UNCORRECTED', moment(event.start).tz('UTC').format('MM/DD/YYYY HH:mm:ss'))
                                            // console.log('__CORRECTED', moment(event.start).tz(timezone).format('MM/DD/YYYY HH:mm:ss'))
                                            // console.log('START OF EVENT: ', moment(event.start).tz(timezone).format('MM/DD/YYYY HH:mm:ss'));
                                            // console.log('CURRENT TIME SLOT: ', startTimeOfDay.tz(timezone).format('MM/DD/YYYY HH:mm:ss'));
                                            // If there are any overlaps & equaled events
                                            if (
                                                (eventStart.isAfter(startTimeOfDay) && eventEnd.isBefore(endTimeOfDay)) ||
                                                (eventStart.isAfter(startTimeOfDay) && eventEnd.isBefore(endTimeOfDay)) ||
                                                (eventStart.isBefore(startTimeOfDay) && eventEnd.isAfter(endTimeOfDay)) ||
                                                (eventStart.isBefore(startTimeOfDay) && eventEnd.isAfter(startTimeOfDay)) ||
                                                (eventStart.isSame(startTimeOfDay) && eventEnd.isSame(startTimeOfDay.clone().add(interval, 'minutes')))
                                            ) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        });

                                        // Add the date to the array, only if there are no conflicts
                                        if (eventsThatConflict.length == 0) {

                                            // We add the timezone manually here so it can be serialized to the client
                                            // Not relying on moment for serialization, rather be safe, convey UTC in text
                                            // We have already set the timezone, so don't do it again with the .tz
                                            available.push(startTimeOfDay.format('MM/DD/YYYY HH:mm:ss') + '' + tz);
                                        }

                                        // Increase the time for start & end
                                        startTimeOfDay.add(interval, 'minutes');
                                        endTimeOfDay.add(interval, 'minutes');
                                    }
                                }
                            }

                            return available;
                        })
                        .catch((err) => {
                            console.log(err);

                            return [];
                        });
                })
                .catch((err) => {
                    console.log(err);

                    return [];
                });
        },
        userContact: (_, { id, cid }) => {
            return ContactModel
                .findOne({
                    user: id,
                    contact: cid
                })
                .exec()
                .then((contact) => {
                    return contact;
                })
                .catch((err) => {
                    return null;
                });
        },
        userTasks: (_, { id }) => {
            return TaskModel
                .find({
                    user: id,
                })
                .exec()
                .then((tasks) => {
                    return tasks;
                })
                .catch((err) => {
                    return null;
                });
        },
        userTasksFromCoach: (_, { id, cid }) => {
            return TaskModel
                .find({
                    user: id,
                    contact: cid
                })
                .exec()
                .then((tasks) => {
                    return tasks;
                })
                .catch((err) => {
                    return null;
                });
        },
        users: () => {
            return UserModel
                .find({})
                .populate({
                    path: 'calendar',
                    model: 'Calendar'
                })
                .exec()
                .then((users) => {
                    return users;
                })
                .catch((err) => {
                    return [];
                });
        },
        calendarsGeo: (_, { longitude, latitude }) => {
            return CalendarModel
                .find({
                    location: {
                        $near: {
                            $geometry: { type: "Point", coordinates: [longitude, latitude] },
                            $maxDistance: 5000
                        }
                    }
                })
                .populate({
                    path: 'user',
                    model: 'User'
                })
                .exec()
                .then((calendars) => {
                    return calendars;
                })
                .catch((err) => {
                    return [];
                });
        },
        coachSearch: (_, { tag, term }) => {

            // Basic Mongoose search fields
            let mongooseSearchObject = {
                plan: 1,
                tags: tag,
            };

            // If the term is blank we don't add it
            // $or together with $text doesn't seem to work
            // So we do this:
            if (term.trim() != "") mongooseSearchObject.$text = { $search: term };


            return UserModel
                .find(mongooseSearchObject)
                .exec()
                .then((users) => {
                    return users;
                })
                .catch((err) => {
                    return [];
                });
        },
        userSearch: (_, { term }) => {
            return UserModel
                .find({
                    $or: [
                        {name: new RegExp(term, 'i')},
                        {tags: new RegExp(term, 'i')},
                        {description: new RegExp(term, 'i')}
                    ]
                })
                .exec()
                .then((users) => {
                    return users;
                })
                .catch((err) => {
                    return [];
                });
        },
        channelSearch: (_, { term }) => {
            return ChannelModel
                .find({
                    $text: {$search: term}
                })
                .exec()
                .then((channels) => {
                    return channels;
                })
                .catch((err) => {
                    return [];
                });
        },
        channelsForTag: (_, { tag, count }) => {
            return ChannelModel
                .find({
                    tags: tag,
                    private: false
                })
                .limit(count)
                .exec()
                .then((channels) => {
                    return channels;
                })
                .catch((err) => {
                    return [];
                });
        },
        channel: (_, { id }) => {
            return ChannelModel
                .findOne({_id: id})
                .exec()
                .then((channel) => {
                    return channel;
                })
                .catch((err) => {
                    return [];
                });
        },
        userRating: (_, { id }) => {
            return RatingModel
                .find({user: id})
                .exec()
                .then((ratings) => {
                    const combinedRating = ratings.reduce((accumulator, currentValue) => {
                        return accumulator.rating ? accumulator.rating + currentValue.rating : accumulator + currentValue.rating;
                    });

                    return combinedRating / ratings.length;
                })
                .catch((err) => {
                    return [];
                });
        },
        group: (_, { id }) => {
            return GroupModel
                .findOne({_id: id})
                .exec()
                .then((group) => {
                    return group;
                })
                .catch((err) => {
                    return [];
                });
        },
        groupMembers: (_, { id }) => {
            return GroupModel
                .findOne({ _id: id })
                .populate({
                    path: 'members',
                    model: 'User'
                })
                .exec()
                .then((group) => {
                    return group.members;
                })
                .catch((err) => {
                    return [];
                });
        },
        groupChannels: (_, { id }) => {
            return ChannelModel
                .find({ group: id })
                .exec()
                .then((channels) => {
                    return channels;
                })
                .catch((err) => {
                    return [];
                });
        },
        channelMembers: (_, { id }) => {
            return ChannelModel
                .findOne({_id: id})
                .populate({
                    path: 'members',
                    model: 'User'
                })
                .exec()
                .then((channel) => {
                    return channel.members;
                })
                .catch((err) => {
                    return [];
                });
        },
        attachments: (_, { topic }) => {
            return MessageModel
                .find({
                    $and: [
                    {
                        $or: [
                            {mime: "image/png"},
                            {mime: "image/jpg"},
                            {mime: "image/jpeg"},
                        ]
                    },
                    {
                        topic
                    }
                    ]
                })
                .exec()
                .then((messages) => {
                    return messages;
                })
                .catch((err) => {
                    return [];
                });
        },
        event: (_, { id }) => {
            return EventModel
                .findOne({_id: id})
                .exec()
                .then((ev) => {
                    return ev; // <- event is reserved
                })
                .catch((err) => {
                    return [];
                });
        },
        calendar: (_, { id }) => {
            return CalendarModel
                .findOne({_id: id})
                .exec()
                .then((calendar) => {
                    return calendar;
                })
                .catch((err) => {
                    return [];
                });
        },
    },

    User: {
        calendar: (user) => {
            return UserModel
                .findOne({_id: user._id})
                .populate({
                    path: 'calendar',
                    model: 'Calendar'
                })
                .exec()
                .then((user) => {
                    return user.calendar;
                })
                .catch((err) => {
                    return {};
                });
        },
        tags: (user) => {
            return UserModel
                .findOne({_id: user._id})
                .populate({
                    path: 'tags',
                    model: 'Tag'
                })
                .exec()
                .then((user) => {
                    return user.tags;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Rating: {
        user: (rating) => {
            return UserModel
                .findOne({_id: rating.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Task: {
        contact: (task) => {
            return UserModel
                .findOne({_id: task.contact})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        user: (task) => {
            return UserModel
                .findOne({_id: task.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        tasklist: (task) => {
            return TaskListModel
                .findOne({_id: task.tasklist})
                .exec()
                .then((tasklist) => {
                    return tasklist;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Calendar: {
        user: (calendar) => {
            return UserModel
                .findOne({_id: calendar.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Channel: {
        group: (channel) => {
            return GroupModel
                .findOne({_id: channel.group})
                .exec()
                .then((group) => {
                    return group;
                })
                .catch((err) => {
                    return {};
                });
        },
        user: (channel) => {
            return UserModel
                .findOne({_id: channel.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        members: (channel) => {
            return ChannelModel
                .findOne({_id: channel.id})
                .populate({
                    path: 'members',
                    model: 'User'
                })
                .exec()
                .then((channel) => {
                    return JSON.parse(JSON.stringify(channel.members));
                })
                .catch((err) => {
                    return {};
                });
        },
        tags: (channel) => {
            return ChannelModel
                .findOne({_id: channel._id})
                .populate({
                    path: 'tags',
                    model: 'Tag'
                })
                .exec()
                .then((channel) => {
                    return JSON.parse(JSON.stringify(channel.tags));
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Event: {
        owner: (event) => {
            return UserModel
                .findOne({_id: event.owner})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        expert: (event) => {
            return UserModel
                .findOne({_id: event.expert})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        calendar: (event) => {
            return CalendarModel
                .findOne({_id: event.calendar})
                .exec()
                .then((calendar) => {
                    return calendar;
                })
                .catch((err) => {
                    return {};
                });
        },
        attendees: (event) => {
            return EventModel
                .findOne({_id: event.id})
                .populate({
                    path: 'attendees.user',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                })
                .exec()
                .then((event) => {
                    return event.attendees;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Contact: {
        user: (contact) => {
            return UserModel
                .findOne({_id: contact.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
        contact: (contact) => {
            return UserModel
                .findOne({_id: contact.contact})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Group: {
        members: (group) => {
            return GroupModel
                .findOne({_id: group.id})
                .populate({
                    path: 'members',
                    model: 'User'
                })
                .exec()
                .then((group) => {
                    return JSON.parse(JSON.stringify(group.members));
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Message: {
        sender: (message) => {
            return UserModel
                .findOne({_id: message.sender})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    return {};
                });
        },
    },

    Transaction: {
        user: (transaction) => {
            return UserModel
                .findOne({_id: transaction.user})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        },
        expert: (transaction) => {
            return UserModel
                .findOne({_id: transaction.expert})
                .exec()
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        },
        event: (transaction) => {
            return EventModel
                .findOne({_id: transaction.event})
                .exec()
                .then((event) => {
                    return event;
                })
                .catch((err) => {
                    console.log(err);
                    return {};
                });
        }
    },

};
