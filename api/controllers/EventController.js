import mongoose from "mongoose";
import {
    CalendarModel,
    ChannelModel,
    EventModel,
    FollowerModel,
    GroupModel,
    MessageModel,
    TagModel,
    TransactionModel,
    UserModel,
} from "../models";
import {
    DEFAULT_APPOINTMENT_NOTE,
    MQTT,
    MAIL_EVENT_INVOICE,
    MAIL_EVENT_RECEIPT,
    MAIL_FROM,
} from "../helpers";

// Not a ES6 import
const moment = require("moment-timezone");
var https = require("https");
var querystring = require("querystring");
const sgMail = require("@sendgrid/mail");
import PushNotification from "../services/PushNotification";

export const EventController = {
    Event: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return EventModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((event) => {
                    return h.response({ event }).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "post") {
            const {
                user_id,
                expert_id,
                start_time,
                is_offline,
                from_expert,
            } = payload;

            return UserModel.findOne({ _id: user_id })
                .exec()
                .then((user) => {
                    return UserModel.findOne({ _id: expert_id })
                        .exec()
                        .then((expert) => {
                            // Finally we need to get the correct calendar that is being
                            // used. Each calendar will contain different details
                            return CalendarModel.findOne({
                                _id: expert.calendar,
                            })
                                .exec()
                                .then((calendar) => {
                                    return EventModel.create({
                                        notes: DEFAULT_APPOINTMENT_NOTE,
                                        processed: false,
                                        rate: calendar.rate,
                                        address: calendar.address,
                                        location: calendar.location,
                                        start: moment(start_time).toISOString(),
                                        end: moment(start_time)
                                            .add(calendar.interval, "minutes")
                                            .toISOString(),
                                        offline: is_offline,
                                        mandatory: true,
                                        owner: user_id,
                                        expert: expert_id,
                                        calendar: calendar._id,
                                        attendees: [
                                            {
                                                user: user_id,
                                                status: from_expert
                                                    ? "INVITED"
                                                    : "CONFIRMED",
                                            },
                                            {
                                                user: expert_id,
                                                status: from_expert
                                                    ? "CONFIRMED"
                                                    : "INVITED",
                                            },
                                        ],
                                    })
                                        .then((event) => {
                                            // Tell the user
                                            MQTT.dispatch(user_id, {
                                                type: "EVENTS_ADD",
                                                payload: event._id,
                                            });

                                            // Tell the expert
                                            MQTT.dispatch(expert_id, {
                                                type: "EVENTS_ADD",
                                                payload: event._id,
                                            });

                                            // Send them a PN
                                            new PushNotification().send(
                                                "You have a new appointment",
                                                user.device
                                            );

                                            // Populate doesn't work within the create context
                                            // So we manually fetch the whole object and return it
                                            return EventModel.findOne({
                                                _id: event._id,
                                            })
                                                .populate([
                                                    {
                                                        path: "owner",
                                                        model: "User",
                                                        select:
                                                            "_id name title color",
                                                    },
                                                    {
                                                        path: "expert",
                                                        model: "User",
                                                        select:
                                                            "_id name title color",
                                                    },
                                                    {
                                                        path: "attendees.user",
                                                        populate: {
                                                            path: "user",
                                                            model: "User",
                                                        },
                                                    },
                                                ])
                                                .exec()
                                                .then((ev) => {
                                                    return h
                                                        .response(ev)
                                                        .code(200);
                                                })
                                                .catch((err) => {
                                                    return h
                                                        .response({
                                                            message: "Error",
                                                        })
                                                        .code(500);
                                                });
                                        })
                                        .catch((err) => {
                                            return h
                                                .response({ message: "Error" })
                                                .code(500);
                                        });
                                })
                                .catch((err) => {
                                    return h
                                        .response({ message: "Error" })
                                        .code(500);
                                });
                        })
                        .catch((err) => {
                            return h.response({ message: "Error" }).code(500);
                        });
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "delete") {
            const { id } = request.params;

            // Find all members & delete
            return EventModel.findOne({ _id: id })
                .select("attendees")
                .exec()
                .then((event) => {
                    event.attendees.map((attendee) => {
                        MQTT.dispatch(attendee.user, {
                            type: "EVENTS_REMOVE",
                            payload: id,
                        });
                    });

                    return EventModel.deleteOne({ _id: id }, function (err) {
                        if (err)
                            return h.response({ message: "Error" }).code(500);

                        return h.response({ successs: true }).code(200);
                    });
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }
    },

    Process: (request, h) => {
        const { payload, method } = request;
        const { credentials } = request.auth;
        const { id } = request.params;

        return EventModel.findOneAndUpdate({ _id: id }, { processed: true })
            .exec()
            .then((event) => {
                return h.response({ success: true }).code(200);
            })
            .catch((err) => {
                console.log(err);
                return h.response({ message: "Error" }).code(500);
            });
    },

    Attendee: {
        Update: (request, h) => {
            const { payload, method } = request;
            const { credentials } = request.auth;
            const { id } = request.params;
            const { user, status } = payload;

            return EventModel.findOneAndUpdate(
                { _id: id, "attendees.user": user },
                { $set: { "attendees.$.status": status } },
                { new: true }
            )
                .exec()
                .then((event) => {
                    return h.response(event).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        },
    },
};
