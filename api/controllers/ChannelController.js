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
    DEFAULT_PRIVATE,
    MQTT,
} from "../helpers";

export const ChannelController = {
    Channel: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return ChannelModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((channel) => {
                    return h.response(channel).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "post") {
            const { _id, name, id, kind } = payload;

            return ChannelModel.create({
                name: name,
                user: kind == USER ? id : null,
                group: kind == GROUP ? id : null,
                members: [_id],
            })
                .then((channel) => {
                    // Return the entire object,
                    // We NEED the member data
                    return ChannelModel.findOne(channel._id)
                        .populate([
                            {
                                path: "user",
                                modal: "User",
                                select: "_id name image color",
                            },
                            {
                                path: "group",
                                modal: "Group",
                                select: "_id name image color members",
                            },
                        ])
                        .exec()
                        .then((channel) => {
                            return h.response(channel).code(200);
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
            return ChannelModel.findOne({ _id: id })
                .select("members")
                .exec()
                .then((channel) => {
                    channel.members.map((member) => {
                        MQTT.dispatch(member, {
                            type: "CHANNELS_REMOVE",
                            payload: id,
                        });
                    });

                    return ChannelModel.deleteOne({ _id: id }, function (err) {
                        if (err)
                            return h.response({ message: "Error" }).code(500);

                        return h.response({ success: true }).code(200);
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

            return ChannelModel.findOneAndUpdate(
                { _id: id },
                { $push: { members: [_id] } },
                { new: true }
            )
                .exec()
                .then((channel) => {
                    // Get the user & return that
                    return UserModel.findOne({ _id })
                        .select("_id name title image color")
                        .exec()
                        .then((user) => {
                            MQTT.dispatch(_id, {
                                type: "CHANNELS_ADD",
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

            return ChannelModel.findOneAndUpdate(
                { _id: id },
                { $pull: { members: _id } },
                { new: true }
            )
                .exec()
                .then((channel) => {
                    MQTT.dispatch(_id, {
                        type: "CHANNELS_REMOVE",
                        payload: id,
                    });

                    return h.response(channel).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        },
    },
};
