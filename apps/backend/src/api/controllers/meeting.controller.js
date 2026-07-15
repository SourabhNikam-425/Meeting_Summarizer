import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  createMeeting,
  getMeetingsByUser,
  getMeetingById,
  deleteMeeting,
  toggleActionItem,
} from "../../services/meeting.service.js";

const createSchema = z.object({
  title: z.string().min(1).max(200),
});

export const uploadMeeting = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  if (!req.file) throw new ApiError(400, "Audio file is required");

  const { title } = createSchema.parse(req.body);

  const meeting = await createMeeting({
    userId: req.user.id,
    title,
    audioPath: req.file.path,
    audioOriginalName: req.file.originalname,
  });

  res.status(201).json({ success: true, data: meeting });
});

export const listMeetings = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const meetings = await getMeetingsByUser(req.user.id);
  res.json({ success: true, data: meetings });
});

export const getMeeting = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const meeting = await getMeetingById(req.params.id, req.user.id);
  res.json({ success: true, data: meeting });
});

export const removeMeeting = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  await deleteMeeting(req.params.id, req.user.id);
  res.json({ success: true, message: "Meeting deleted" });
});

export const toggleItem = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const meeting = await toggleActionItem(
    req.params.id,
    req.params.itemId,
    req.user.id,
  );
  res.json({ success: true, data: meeting });
});
