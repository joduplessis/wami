import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        // Normal user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        // User conditions
        conditions: { type: [String], default: [] },
        consultations: { type: [String], default: [] },
        goals: { type: [String], default: [] },
        confirmed: Boolean,

        // Transaction
        card: { type: String, default: null },
        vendor: { type: String, default: null },
        token: { type: String, default: null },

        // Today + 2 weeks
        active: {
            type: Date,
            default: +Date.now() + 1 * 7 * 24 * 60 * 60 * 1000,
        },

        // Coach
        contact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const ContactModel = mongoose.model("Contact", ContactSchema);
