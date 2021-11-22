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
    ContactModel,
} from "../models";
import { CONTACT } from "../helpers";
import OneSignal from "onesignal-node";
import PushNotification from "../services/PushNotification";

export const MessageController = {
    Message: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "post") {
            const {
                text,
                mime,
                url,
                sender,
                reactions,
                topic,
            } = request.payload;

            return MessageModel.create({
                text,
                mime,
                url,
                sender,
                reactions,
                topic,
            })
                .then((message) => {
                    // Now check whether they're online
                    const topicKind = topic.split("/")[0];

                    // Only do this for coaches for now
                    // We're going to sending a message to people
                    // and it doesn't necessariyl need to finish
                    if (topicKind == CONTACT) {
                        const topicId = topic.split("/")[1];

                        // If there wasn't a hickup
                        if (topicId) {
                            // Find the people
                            ContactModel.findOne({ _id: topicId })
                                .select("user contact")
                                .populate([
                                    {
                                        path: "user",
                                        model: "User",
                                        select: "_id name device offline plan",
                                    },
                                    {
                                        path: "contact",
                                        model: "User",
                                        select: "_id name device offline plan",
                                    },
                                ])
                                .exec()
                                .then((contact) => {
                                    const text = `You have a new message!`;

                                    // if (contact.contact.offline) new PushNotification().send(text, contact.contact.device);
                                    // if (contact.user.offline) new PushNotification().send(text, contact.user.device);
                                    // Testing out Always sending messages
                                    new PushNotification().send(
                                        text,
                                        contact.contact.device
                                    );
                                    new PushNotification().send(
                                        text,
                                        contact.user.device
                                    );
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    }

                    // Here we determine if the user is offline - send them a message if they are
                    return h.response(message).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return MessageModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((message) => {
                    return h.response(message).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }
    },

    Reactions: {
        Add: (request, h) => {
            const { payload, method } = request;
            const { id } = request.params;
            const { reaction } = payload;
            const { user } = request.auth.credentials;

            return MessageModel.findOneAndUpdate(
                { _id: id },
                { $push: { reactions: [reaction] } },
                { new: true }
            )
                .exec()
                .then((message) => {
                    return h.response(message).code(200);
                })
                .catch((err) => {
                    return h.response(err).code(500);
                });
        },

        Remove: (request, h) => {
            const { payload, method } = request;
            const { id } = request.params;
            const { reaction } = payload;
            const { user } = request.auth.credentials;

            return MessageModel.findOneAndUpdate(
                { _id: id },
                { $pull: { reactions: reaction } },
                { new: true }
            )
                .exec()
                .then((message) => {
                    return h.response(message).code(200);
                })
                .catch((err) => {
                    return h.response(err).code(500);
                });
        },
    },
};
