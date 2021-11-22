import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        text: String,
        mime: String,
        url: String,
        reactions: [String],
        topic: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

MessageSchema.index({
    text: "text",
    mime: "text",
    topic: "text",
});

export const MessageModel = mongoose.model("Message", MessageSchema);
