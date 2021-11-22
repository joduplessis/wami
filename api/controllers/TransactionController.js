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

export const TransactionController = (request, h) => {
    const { payload, method } = request;
    const { user } = request.auth.credentials;

    if (method.toLowerCase() == "post") {
        const { attendees, rate, expert, _id } = this.payload;

        /*
        return TransactionModel
            .create(payload)
            .then((res) => {
                return { res };
            })
            .catch((err) => {
                return { err };
            });
        */
        // Just return it for now
        // TODO: To be implemented with billing logic
        return { attendees, rate, expert, _id };
    }
};
