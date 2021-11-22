import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema(
    {
        available: Number,
        rate: Number,
        days: [String],
        start: String,
        end: String,
        daybreak: String,
        interval: Number,
        timezone: String,
        address: String,
        location: {
            type: { type: String },
            coordinates: [Number],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

CalendarSchema.index({
    location: "2dsphere",
});

export const CalendarModel = mongoose.model("Calendar", CalendarSchema);
