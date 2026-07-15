import fs from "fs";
import path from "path";
import { getFlashModel } from "./gemini.client.js";
import { logger } from "../../config/logger.js";
import { ApiError } from "../../utils/ApiError.js";

const AUDIO_MIME_MAP = {
  ".mp3": "audio/mp3",
  ".mpeg": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "audio/mp4",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".webm": "audio/webm",
  ".flac": "audio/flac",
};

export async function transcribeAudio(audioFilePath) {
  const ext = path.extname(audioFilePath).toLowerCase();
  const mimeType = AUDIO_MIME_MAP[ext] ?? "audio/mpeg";

  logger.info({ audioFilePath, mimeType }, "Starting transcription");

  const fileBuffer = fs.readFileSync(audioFilePath);
  const base64Audio = fileBuffer.toString("base64");

  const model = getFlashModel();

  const prompt = `You are a professional meeting transcriptionist.
Transcribe the following audio recording completely and accurately.
- Include all spoken words
- Format as a clean, readable transcript
- Do NOT add speaker labels unless you can clearly distinguish voices
- Do NOT add timestamps
- Return only the transcript text, nothing else.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    },
  ]);

  const transcript = result.response.text().trim();

  if (!transcript || transcript.length < 10) {
    throw new ApiError(422, "Could not extract transcript from audio");
  }

  logger.info({ chars: transcript.length }, "Transcription complete");
  return transcript;
}
