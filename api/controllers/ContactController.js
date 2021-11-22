import mongoose from "mongoose";
import moment from "moment";
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
} from "../models";
import {
    MQTT,
    AUTHENTICATION_CURRENCY,
    AUTHENTICATION_AMOUNT,
    SECRET,
    BUCKET,
    MAIL_FROM,
    MAIL_ONBOARDING_TOKEN,
    UPLOAD_PATH,
} from "../helpers";
import otplib from "otplib";
const AWS = require("aws-sdk");
var https = require("https");
var querystring = require("querystring");
import PushNotification from "../services/PushNotification";

const sgMail = require("@sendgrid/mail");
const jwt = require("../helpers/jwt");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

export const ContactController = {
    Contact: (request, h) => {
        const { payload, method } = request;
        const { credentials } = request.auth;

        if (method.toLowerCase() == "post") {
            const {
                user,
                contact,
                goals,
                conditions,
                consultations,
                name,
                number,
                cvv,
                month,
                year,
                vendor,
            } = payload;

            // TODO: Charging to card
            // Actual do to implement the charge is not included here
            // Groups & channels only use the ID
            // in the Redux store, for contacts, we use the
            // whole user objects
            // This is AUTO CONFIRMED NOW!!!! Due to credit card payments
            return ContactModel.create({
                user,
                contact,
                consultations,
                conditions,
                goals,
                vendor,
                confirmed: true,
                card: "LAST_4_DIGITS",
                token: "CARD_TOKEN",
                billAt: moment().add(2, "weeks").toDate(),
            })
                .then((res) => {
                    return ContactModel.findOne(res._id)
                        .populate([
                            {
                                path: "user",
                                modal: "User",
                                select: "_id name image title color",
                            },
                            {
                                path: "contact",
                                modal: "User",
                                select: "_id name image title color",
                            },
                        ])
                        .exec()
                        .then((contact) => {
                            // Send this to the coach
                            MQTT.dispatch(contact.contact._id, {
                                type: "CONTACTS_ADD",
                                payload: contact._id,
                            });

                            // Return this to the user
                            return h.response(contact).code(200);
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
            ContactModel.findOne({ _id: id })
                .exec()
                .then((contact) => {
                    if (contact) {
                        // Tell everybody to remove the contact
                        MQTT.dispatch(contact.contact._id, {
                            type: "CONTACTS_REMOVE",
                            payload: id,
                        });
                        MQTT.dispatch(contact.user._id, {
                            type: "CONTACTS_REMOVE",
                            payload: id,
                        });

                        // Delete the contact
                        return ContactModel.deleteOne({ _id: id }, function (
                            err
                        ) {
                            if (err) return handleError(err);

                            return h.response({ success: true }).code(200);
                        });
                    } else {
                        return h.response({ err: "No contact" }).code(500);
                    }
                })
                .catch((err) => {
                    return h.response({ err }).code(500);
                });
        }

        if (method.toLowerCase() == "put") {
            const { user, contact, confirmed } = payload;

            return ContactModel.findOneAndUpdate(
                {
                    $or: [
                        { user: user, contact: contact },
                        { user: contact, contact: user },
                    ],
                },
                {
                    confirmed,
                },
                {
                    upsert: true,
                    new: true,
                }
            )
                .exec()
                .then((contact) => {
                    return h.response(contact).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        }
    },

    Call: (request, h) => {
        const { payload, method } = request;
        const { credentials } = request.auth;
        const { id } = request.params;
        const { sender } = payload;

        // Find the contact
        return ContactModel.findOne({ _id: id })
            .select("user contact")
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "_id name device offline",
                },
                {
                    path: "contact",
                    model: "User",
                    select: "_id name device offline",
                },
            ])
            .exec()
            .then((contact) => {
                const text = `Incoming call from ${sender.name}`;

                // We are going to send a message to the person
                // Sho is not the sender
                // if (contact.contact.offline) new PushNotification().send(text, contact.contact.device);
                // if (contact.user.offline) new PushNotification().send(text, contact.user.device);
                // Test sending it always
                new PushNotification().send(text, contact.user.device);

                // Tell them all is good
                return h.response({ success: true }).code(200);
            })
            .catch((error) => {
                return h.response({ message: "Error" }).code(500);
            });
    },

    Confirm: (request, h) => {
        const { payload, method } = request;
        const { confirmed } = payload;
        const { credentials } = request.auth;
        const { id } = request.params;

        return ContactModel.findOneAndUpdate(
            { _id: id },
            { confirmed },
            { new: true }
        )
            .exec()
            .then((contact) => {
                return h.response(contact).code(200);
            })
            .catch((err) => {
                return h.response({ message: "Error" }).code(500);
            });
    },
};
