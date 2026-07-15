import fs from "fs";
import { Meeting } from "../db/models/Meeting.js";
import { transcribeAudio } from "./gemini/transcribe.service.js";
import { summarizeMeeting } from "./gemini/summarize.service.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export async function createMeeting(input) {
  const meeting = await Meeting.create({
    userId: new mongoose.Types.ObjectId(input.userId),
    title: input.title,
    audioPath: input.audioPath,
    audioOriginalName: input.audioOriginalName,
    status: "pending",
  });

  processMeeting(meeting._id.toString()).catch((err) => {
    logger.error({ err, meetingId: meeting._id }, "Meeting processing failed");
  });

  return meeting;
}

async function processMeeting(meetingId) {
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) return;

  try {
    // Step 1: Transcription
    await Meeting.findByIdAndUpdate(meetingId, { status: "processing" });

    const transcript = await transcribeAudio(meeting.audioPath);

    await Meeting.findByIdAndUpdate(meetingId, { transcript });

    // Step 2: Summarization
    const { summary, keyDecisions, actionItems } =
      await summarizeMeeting(transcript);

    await Meeting.findByIdAndUpdate(meetingId, {
      status: "done",
      summary,
      keyDecisions,
      actionItems: actionItems.map((a) => ({
        text: a.text,
        assignee: a.assignee,
        isDone: false,
      })),
    });

    logger.info({ meetingId }, "Meeting processed successfully");
  } catch (error) {
    logger.error({ err: error, meetingId }, "Error processing meeting");
    await Meeting.findByIdAndUpdate(meetingId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getMeetingsByUser(userId) {
  return Meeting.find({ userId }).sort({ createdAt: -1 });
}

export async function getMeetingById(id, userId) {
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid meeting ID");
  const meeting = await Meeting.findOne({ _id: id, userId });
  if (!meeting) throw new ApiError(404, "Meeting not found");
  return meeting;
}

export async function deleteMeeting(id, userId) {
  if (!mongoose.isValidObjectId(id))
    throw new ApiError(400, "Invalid meeting ID");
  const meeting = await Meeting.findOneAndDelete({ _id: id, userId });
  if (!meeting) throw new ApiError(404, "Meeting not found");
  // Clean up uploaded file
  try {
    if (fs.existsSync(meeting.audioPath)) fs.unlinkSync(meeting.audioPath);
  } catch {
    /* ignore file cleanup errors */
  }
}

export async function toggleActionItem(meetingId, itemId, userId) {
  const meeting = await Meeting.findOne({ _id: meetingId, userId });
  if (!meeting) throw new ApiError(404, "Meeting not found");

  const item = meeting.actionItems.find((a) => a._id.toString() === itemId);
  if (!item) throw new ApiError(404, "Action item not found");

  item.isDone = !item.isDone;
  await meeting.save();
  return meeting;
}
