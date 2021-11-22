import { UserModel } from "../models";
import bcrypt from "bcrypt";
import {
    SECRET,
    MAIL_FROM,
    BUCKET,
    MAIL_PASSWORD_RESET,
    DEFAULT_IMAGE,
    DEFAULT_DESCRIPTION,
    DEFAULT_COLOR,
    DEFAULT_TAG,
    DEFAULT_COUNTRY,
    DEFAULT_TIMEZONE,
    DEFAULT_DATE,
} from "../helpers";

const otplib = require("otplib");
const sgMail = require("@sendgrid/mail");
const jwt = require("../helpers/jwt");
const uuid = require("uuid");
const AWS = require("aws-sdk");

export const AuthController = {
    Login: (request, h) => {
        const { host } = request.info;
        const { password } = request.payload;
        const email = request.payload.email.toLowerCase();

        return UserModel.findOne({ email })
            .exec()
            .then((usr) => {
                // If we find no user
                if (!usr)
                    return h.response({ message: "User not found" }).code(404);

                // If the passwords don't match
                return usr
                    .comparePassword(password)
                    .then((same) => {
                        if (!same)
                            return h
                                .response({ message: "Wrong password" })
                                .code(401);

                        // If all is good
                        return {
                            _id: usr._id,
                            token: jwt.encode(
                                {
                                    iss: host,
                                    sub: usr._id,
                                    exp: Date.now() / 1000 + 60 * 60 * 24 * 14,
                                },
                                SECRET
                            ),
                        };
                    })
                    .catch((err) => {
                        return h
                            .response({ message: "Comparison error" })
                            .code(500);
                    });
            })
            .catch((err) => {
                return h.response({ message: "Error" }).code(500);
            });
    },

    Upload: (request, h) => {
        const { host } = request.info;
        const { filename, mime, key } = request.payload;

        // If there are
        const Bucket = process.env.S3_BUCKET;
        const accessKeyId = process.env.S3_ACCESS_KEY_ID;
        const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
        const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);

        // Authenticate with S3
        const s3 = new AWS.S3({
            s3BucketEndpoint: true,
            endpoint,
            accessKeyId,
            secretAccessKey,
        });

        try {
            const Expires = 60 * 60;
            const Key = key;
            const ACL = "public-read";
            const ContentType = mime;
            const params = { Bucket, Key, Expires, ACL, ContentType };
            const url = s3.getSignedUrl("putObject", params);

            return h.response({ url }).code(200);
        } catch (err) {
            return h.response({ message: "Error" }).code(500);
        }
    },

    Signup: (request, h) => {
        const { password } = request.payload;
        const email = request.payload.email.toLowerCase();

        return UserModel.create({
            email,
            password,
        })
            .then((user) => {
                return h.response(user).code(200);
            })
            .catch((err) => {
                if (err.code == 11000) {
                    return h.response({ error: true }).code(401);
                } else {
                    return h.response({ error: true }).code(500);
                }
            });
    },

    Password: {
        Update: async (request, h) => {
            const { email, password, forgotten_password } = request.payload;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            return UserModel.findOneAndUpdate(
                { email, forgotten_password },
                {
                    password: hash,
                    forgotten_password: null,
                }
            )
                .exec()
                .then((user) => {
                    // If we find no user
                    if (!user)
                        return h
                            .response({ message: "User not found" })
                            .code(404);

                    return h.response({ success: true }).code(200);
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        },

        Reset: (request, h) => {
            const { email } = request.payload;
            const forgotten_password = otplib.authenticator.generate(SECRET);

            return UserModel.findOneAndUpdate({ email }, { forgotten_password })
                .exec()
                .then((user) => {
                    // If we find no user
                    if (!user)
                        return h
                            .response({ message: "User not found" })
                            .code(404);

                    // Send them the email
                    return sgMail
                        .send({
                            to: email,
                            from: MAIL_FROM,
                            subject: MAIL_PASSWORD_RESET,
                            text: "template",
                            html: "template",
                            template_id: "d-eff5cb965dc44d99be59b9209427324e",
                            dynamic_template_data: {
                                token: forgotten_password,
                            },
                        })
                        .then((res) => {
                            return h.response({ success: true }).code(200);
                        })
                        .catch((err) => {
                            return h.response({ message: "Error" }).code(500);
                        });
                })
                .catch((err) => {
                    return h.response({ message: "Error" }).code(500);
                });
        },
    },
};
