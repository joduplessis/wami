import mongoose from "mongoose";
import {
    GROUP,
    USER,
    DEFAULT_IMAGE,
    DEFAULT_DESCRIPTION,
    DEFAULT_COLOR,
    DEFAULT_TAG,
    DEFAULT_PRIVATE,
    MQTT,
} from "../helpers";

const ChannelSchema = new mongoose.Schema(
    {
        name: String,
        description: { type: String, default: DEFAULT_DESCRIPTION },
        image: { type: String, default: DEFAULT_IMAGE },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref: "Tag",
            },
        ],
        private: { type: Boolean, default: DEFAULT_PRIVATE },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

ChannelSchema.index({
    name: "text",
    description: "text",
});

export const ChannelModel = mongoose.model("Channel", ChannelSchema);
