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

export const CalendarController = (request, h) => {
    const { payload, method } = request;
    const { user } = request.auth.credentials;
    const { id } = request.params;

    return CalendarModel.findOneAndUpdate({ _id: id }, payload, {
        upsert: true,
        new: true,
    })
        .exec()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        });
};
