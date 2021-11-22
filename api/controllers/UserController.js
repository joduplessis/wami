import mongoose from "mongoose";
import {
    SECRET,
    BUCKET,
    MAIL_FROM,
    MAIL_ONBOARDING_TOKEN,
    UPLOAD_PATH,
} from "../helpers";
import { UserModel, CalendarModel, RatingModel } from "../models";
import otplib from "otplib";
const AWS = require("aws-sdk");
var https = require("https");
var querystring = require("querystring");

const sgMail = require("@sendgrid/mail");
const jwt = require("../helpers/jwt");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

export const UserController = {
    Documents: {
        Professional: async (request, h) => {
            const data = request.payload;
            const file = data["file"];
            const { token } = request.params;

            if (!file) throw new Error("no file");

            const originalname = file.hapi.filename;
            const filename = `${uuid.v1()}.${originalname}`;
            const path = `${UPLOAD_PATH}/${filename}`;
            const fileStream = fs.createWriteStream(path);
            const buffer = file._data;

            await fileStream.write(buffer);

            // Suucessful upload
            // Then update them
            return UserModel.findOneAndUpdate(
                { onboarding: token },
                { professional: [filename] },
                { new: true }
            )
                .exec()
                .then((user) => {
                    return h.response(data).code(200);
                })
                .catch((err) => {
                    fs.unlink(path, (err) => {
                        if (err) throw err;

                        console.log("successfully deleted file");
                    });

                    return h.response({ message: "Error" }).code(500);
                });
        },

        Banking: async (request, h) => {
            const data = request.payload;
            const file = data["file"];
            const { token } = request.params;

            if (!file) throw new Error("no file");

            const originalname = file.hapi.filename;
            const filename = `${uuid.v1()}.${originalname}`;
            const path = `${UPLOAD_PATH}/${filename}`;
            const fileStream = fs.createWriteStream(path);
            const buffer = file._data;

            await fileStream.write(buffer);

            return UserModel.findOneAndUpdate(
                { onboarding: token },
                { banking: [filename] },
                { new: true }
            )
                .exec()
                .then((user) => {
                    return h.response(data).code(200);
                })
                .catch((err) => {
                    fs.unlink(path, (err) => {
                        if (err) throw err;

                        console.log("successfully deleted file");
                    });

                    return h.response({ message: "Error" }).code(500);
                });
        },
    },

    User: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;
        const { id } = request.params;

        // Standard user update
        return UserModel.findOneAndUpdate({ _id: id }, payload, { new: true })
            .exec()
            .then((user) => {
                return h.response(user).code(200);
            })
            .catch((err) => {
                return h.response({ err }).code(500);
            });
    },

    Device: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;
        const { id } = request.params;
        const { device } = payload;

        // Standard user update
        return UserModel.findOneAndUpdate({ _id: id }, { device })
            .exec()
            .then((res) => {
                return h.response({ success: true }).code(200);
            })
            .catch((err) => {
                return h.response({ err }).code(500);
            });
    },

    Offline: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;
        const { id } = request.params;
        const { offline } = payload;

        // Standard user update
        return UserModel.findOneAndUpdate({ _id: id }, { offline })
            .exec()
            .then((res) => {
                return h.response({ success: true }).code(200);
            })
            .catch((err) => {
                return h.response({ err }).code(500);
            });
    },

    Rating: (request, h) => {
        const { payload, method } = request;
        const { user } = request.auth.credentials;
        const { id } = request.params;
        const { rating } = payload;

        // First find the user
        return RatingModel.create({
            user: id,
            rating,
        })
            .then((res) => {
                return h.response({ success: true }).code(200);
            })
            .catch((err) => {
                return h.response({ err }).code(500);
            });
    },

    Onboarding: {
        Token: (request, h) => {
            const { email } = request.payload;
            const token = uuid.v4();

            // Update the user
            return UserModel.findOne({ email })
                .then((result) => {
                    if (result.calendar)
                        return h
                            .response({ message: "Calendar exists" })
                            .code(409);

                    // Update the user
                    return UserModel.findOneAndUpdate(
                        { email },
                        {
                            onboarding: token,
                        },
                        { new: true }
                    )
                        .then((result) => {
                            // Send them the email
                            return sgMail
                                .send({
                                    to: email,
                                    from: MAIL_FROM,
                                    subject: MAIL_ONBOARDING_TOKEN,
                                    text: "template",
                                    html: "template",
                                    template_id:
                                        "d-65e12a720a954020aa2281d97ab13602",
                                    dynamic_template_data: {
                                        token: token,
                                    },
                                })
                                .then((res) => {
                                    return h
                                        .response({ message: "Success" })
                                        .code(200);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return h
                                        .response({ message: "Error" })
                                        .code(500);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            return h.response({ message: "Error" }).code(500);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    return h.response({ message: "Error" }).code(500);
                });
        },

        Complete: (request, h) => {
            const { payload, method } = request;
            const {
                email,
                token,
                description,
                tags,
                title,
                descriptors,
            } = payload;

            // Update the user
            return UserModel.findOne({ email })
                .then((result) => {
                    return CalendarModel.create({
                        available: 10,
                        rate: 890,
                        days: [
                            "MONDAY",
                            "TUESDAY",
                            "WEDNESDAY",
                            "THURSDAY",
                            "FRIDAY",
                        ],
                        start: "08:00",
                        end: "17:00",
                        daybreak: "05:00",
                        interval: 30,
                        timezone: "Africa/Johannesburg",
                        address: "Durban",
                        location: {
                            type: "Point",
                            coordinates: [31.0746, -29.7381],
                        },
                        user: result._id,
                    })
                        .then((res) => {
                            // Update the user
                            return UserModel.findOneAndUpdate(
                                { onboarding: token },
                                {
                                    onboarding: null,
                                    calendar: res._id,
                                    plan: 1,
                                    description,
                                    tags,
                                    title,
                                    descriptors,
                                },
                                { new: true }
                            )
                                .then((result) => {
                                    console.log(result);
                                    return h
                                        .response({ message: "Success" })
                                        .code(200);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    return h
                                        .response({ message: "Error" })
                                        .code(500);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            return h.response({ message: "Error" }).code(500);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    return h.response({ message: "Error" }).code(500);
                });
        },
    },
};
