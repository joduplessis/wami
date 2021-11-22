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
    TaskModel,
    TaskListModel,
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

export const TaskController = {
    TaskList: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "post") {
            const { title, topic } = payload;

            return TaskListModel.create({
                topic,
                title,
            })
                .then((tasklist) => {
                    return h.response(tasklist).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return TaskListModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((tasklist) => {
                    return h.response(tasklist).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "delete") {
            const { id } = request.params;

            return TaskListModel.deleteOne({ _id: id }, function (err) {
                if (err) return h.response({ message: "Error" }).code(500);

                return h.response({ success: true }).code(200);
            });
        }
    },

    Task: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;

        if (method.toLowerCase() == "post") {
            const { text, description, user, contact } = payload;

            return TaskModel.create({
                text,
                description,
                user,
                contact,
                tasklist: null,
            })
                .then((task) => {
                    return h
                        .response({
                            _id: task._id,
                            text: task.text,
                            description: task.description,
                            completed: task.completed,
                            contact: {
                                _id: contact,
                            },
                        })
                        .code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "put") {
            const { id } = request.params;

            return TaskModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            })
                .exec()
                .then((task) => {
                    return h.response(task).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }

        if (method.toLowerCase() == "delete") {
            const { id } = request.params;

            return TaskModel.deleteOne({ _id: id }, function (err) {
                if (err) return h.response({ message: "Error" }).code(500);

                return h.response({ success: true }).code(200);
            });
        }
    },
};
