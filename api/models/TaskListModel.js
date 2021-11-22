import mongoose from "mongoose";

const TaskListSchema = new mongoose.Schema(
    {
        title: String,
        subtitle: String,
        topic: String,
    },
    { timestamps: true }
);

TaskListSchema.index({
    topic: "text",
});

export const TaskListModel = mongoose.model("TaskList", TaskListSchema);
