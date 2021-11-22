import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        rating: Number,
    },
    { timestamps: true }
);

export const RatingModel = mongoose.model("Rating", RatingSchema);
