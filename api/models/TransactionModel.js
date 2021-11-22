import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        amount: Number,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        expert: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
    },
    { timestamps: true }
);

export const TransactionModel = mongoose.model(
    "Transaction",
    TransactionSchema
);
