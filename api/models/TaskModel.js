import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        text: String,
        description: String,
        date: { type: Date, default: null },
        completed: { type: Boolean, default: false },
        tasklist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskList",
        },
        contact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

TaskSchema.index({
    topic: "text",
});

export const TaskModel = mongoose.model("Task", TaskSchema);
