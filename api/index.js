import Bcrypt from "bcrypt";
import { ApolloServer, gql } from "apollo-server-hapi";
import Hapi from "hapi";
import mongoose from "mongoose";
import { typeDefs, resolvers, initRoutes } from "./helpers";
import { SECRET, UPLOAD_PATH } from "./helpers";
import { AuthJwt, AuthEmail } from "./plugins";
import PushNotification from "./services/PushNotification";
import OneSignal from "onesignal-node";
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
} from "./models";

const good = require("good");
const sgMail = require("@sendgrid/mail");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const jwt = require("./helpers/jwt");
const config = require("config");
const moment = require("moment-timezone");
const mqtt = require("mqtt");
const configGood = config.get("Good");
const configMqtt = config.get("Mqtt");
const app = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
        cors: true,
    },
});

// Seed the DB
import "./seed.js";

// Create the dir if it doesn't exist
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

// SendGrid config
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const init = async () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    });

    await app.register([good, AuthJwt, AuthEmail]);

    app.auth.strategy("jwt", "jwt");
    app.auth.strategy("email", "email");

    initRoutes(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        cache: false,
        context: ({ request, h }) => {
            /*
            // Check whether there is a token
            if (!request.headers.authorization) {
                throw new AuthorizationError('Apollo: you must be logged in');
            }

            if (!request.headers.authorization.split(' ')[1]) {
                throw new AuthorizationError('Apollo: you must be logged in');
            }

            try {
                const { authorization } = request.headers;
                const token = authorization.split(' ')[1];
                const payload = jwt.decode(token, SECRET);
                const { sub, exp } = payload;

                // If it's expired
                if (exp < Date.now()/1000)  throw new AuthorizationError('Apollo: your token has expired');

                // add the user to the context
                return { user: sub };

            } catch (err) {

                console.log(err);

                throw new AuthorizationError('Apollo: general error');
            }
            */
        },
    });

    server.applyMiddleware({ app });

    await app.start();

    // MQTT Initialization
    const client = mqtt.connect(process.env.MQTT_URI, {
        clean: false,
        queueQoSZero: true,
        useSSL: false,
        clientId: process.env.MQTT_CLIENT,
        will: {
            topic: "death",
            payload: "me",
        },
    });

    client.on("connect", function (e) {
        console.log(`Connected to MQTT broker at: ${process.env.MQTT_URI}`);

        // Always be available
        global.mqtt = client;
    });

    client.on("disconnect", (e) => {
        console.log("Disconnected MQTT connection", e);
    });

    client.on("close", (e) => {
        console.log("Closed MQTT connection", e);
    });

    client.on("message", (topic, data) => {
        var objectID = require("mongodb").ObjectID;

        // If the client connection drops, then mark them as inactive
        // So that they can receive push messages
        if (topic == "death" && objectID.isValid(data.toString())) {
            UserModel.findOneAndUpdate(
                { _id: data.toString() },
                { offline: true }
            ).exec();
        }
    });

    client.subscribe("death", { qos: 2 }, (err) =>
        console.log("Death subscription error: ", err)
    );

    console.log(`Server running at: ${app.info.uri}`);
};

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

// Start the Hapi app
init();
