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
    GROUP,
    USER,
    DEFAULT_IMAGE,
    DEFAULT_DESCRIPTION,
    DEFAULT_COLOR,
    DEFAULT_TAG,
    MQTT,
} from "../helpers";

export const GroupController = {
    Group: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return GroupModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((group) => {
                    return h.response(group).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "post") {
            const { name, _id } = payload;

            return GroupModel.create({
                name,
                members: [_id],
            })
                .then((group) => {
                    return h.response(group).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "delete") {
            const { id } = request.params;

            // Find all members & delete
            return GroupModel.findOne({ _id: id })
                .select("members")
                .exec()
                .then((group) => {
                    // Tell all group members to delete the channel
                    group.members.map((member) => {
                        MQTT.dispatch(member, {
                            type: "GROUPS_REMOVE",
                            payload: group._id,
                        });
                    });

                    // Find all members & delete
                    return ChannelModel.find({ group: group._id })
                        .select("members")
                        .exec()
                        .then((channels) => {
                            // Iterate over all channels
                            channels.map((channel) => {
                                // Iterate over all members
                                channel.members.map((member) => {
                                    // Tell them to delete the channel
                                    MQTT.dispatch(member, {
                                        type: "CHANNELS_REMOVE",
                                        payload: channel._id,
                                    });
                                });
                            });

                            // Now delete the group
                            return GroupModel.deleteOne(
                                { _id: group._id },
                                function (err) {
                                    if (err)
                                        return h
                                            .response({ message: "Error" })
                                            .code(500);

                                    // And now delete all the channels
                                    return ChannelModel.find({
                                        group: group._id,
                                    })
                                        .remove()
                                        .exec()
                                        .then((res) => {
                                            return h
                                                .response({ success: true })
                                                .code(200);
                                        })
                                        .catch((err) => {
                                            return h
                                                .response({ message: "Error" })
                                                .code(500);
                                        });
                                }
                            ).catch((err) => {
                                return h
                                    .response({ message: "Error" })
                                    .code(500);
                            });
                        });
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }
    },

    Member: {
        Add: (request, h) => {
            const { payload, method } = request;
            const { id } = request.params;
            const { _id } = payload;
            const { user } = request.auth.credentials;

            return GroupModel.findOneAndUpdate(
                { _id: id },
                { $push: { members: [_id] } },
                { new: true }
            )
                .exec()
                .then((group) => {
                    // Get the user & return that
                    return UserModel.findOne({ _id })
                        .select("_id name title image color")
                        .exec()
                        .then((user) => {
                            MQTT.dispatch(_id, {
                                type: "GROUPS_ADD",
                                payload: id,
                            });

                            return h.response(user).code(200);
                        })
                        .catch((err) => {
                            return h
                                .response({ message: "Error finding user" })
                                .code(500);
                        });
                })
                .catch((err) => {
                    return h.response({ message: err }).code(500);
                });
        },

        Remove: (request, h) => {
            const { payload, method } = request;
            const { id } = request.params;
            const { _id } = payload;
            const { user } = request.auth.credentials;

            return GroupModel.findOneAndUpdate(
                { _id: id },
                { $pull: { members: _id } },
                { new: true }
            )
                .exec()
                .then((group) => {
                    MQTT.dispatch(_id, {
                        type: "GROUPS_REMOVE",
                        payload: id,
                    });

                    return h.response(group).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        },
    },
};
