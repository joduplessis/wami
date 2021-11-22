import mongoose from "mongoose";
import { MQTT } from "../helpers";

const EventSchema = new mongoose.Schema(
    {
        notes: String,
        processed: Boolean,
        rate: Number,
        address: String,
        location: {
            type: { type: String },
            coordinates: [Number],
        },
        start: Date,
        end: Date,
        offline: Boolean,
        mandatory: Boolean,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        expert: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        calendar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Calendar",
        },
        attendees: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                status: {
                    type: String,
                    enum: ["INVITED", "CONFIRMED", "DECLINED"],
                    default: "INVITED",
                },
            },
        ],
    },
    { timestamps: true }
);

EventSchema.index({
    location: "2dsphere",
});

export const EventModel = mongoose.model("Event", EventSchema);
