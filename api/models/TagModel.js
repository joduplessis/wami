import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        image: Number,
    },
    { timestamps: true }
);

export const TagModel = mongoose.model("Tag", TagSchema);
