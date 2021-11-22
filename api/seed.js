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
    RatingModel,
} from "./models";
const moment = require("moment-timezone");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
});

// Add any DB seed values here & run with: npm run seed
// UserModel.create({ email: "another@wami.app", password: "password" })
