import mongoose from "mongoose";
import { MQTT, DEFAULT_IMAGE, DEFAULT_COLOR } from "../helpers";

const GroupSchema = new mongoose.Schema(
    {
        name: String,
        color: { type: String, default: DEFAULT_COLOR },
        image: { type: String, default: DEFAULT_IMAGE },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const GroupModel = mongoose.model("Group", GroupSchema);
