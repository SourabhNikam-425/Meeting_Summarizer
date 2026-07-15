import mongoose, { Schema } from "mongoose";

const actionItemSchema = new Schema({
  text: { type: String, required: true },
  assignee: { type: String, default: null },
  isDone: { type: Boolean, default: false },
});

const meetingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
    audioPath: { type: String, required: true },
    audioOriginalName: { type: String, required: true },
    audioDuration: { type: Number, default: null },
    transcript: { type: String, default: null },
    summary: { type: String, default: null },
    keyDecisions: [{ type: String }],
    actionItems: [actionItemSchema],
    errorMessage: { type: String, default: null },
  },
  { timestamps: true },
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
