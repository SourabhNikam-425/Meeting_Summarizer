import { getFlashModel } from "./gemini.client.js";
import { logger } from "../../config/logger.js";
import { ApiError } from "../../utils/ApiError.js";

export async function summarizeMeeting(transcript) {
  logger.info("Starting summarization");

  const model = getFlashModel();

  const prompt = `You are an expert meeting analyst. Analyze the following meeting transcript and return a JSON object (no markdown, no code fences) with exactly these fields:

{
  "summary": "<3–5 sentence executive summary of the meeting>",
  "keyDecisions": ["<decision 1>", "<decision 2>", ...],
  "actionItems": [
    { "text": "<action item description>", "assignee": "<person name or null>" },
    ...
  ]
}

Rules:
- Be concise and specific
- Extract concrete decisions that were explicitly made
- Action items must be actionable tasks with clear owners if mentioned
- If no decisions or action items exist, return empty arrays
- Return ONLY the JSON object, no explanations

Meeting Transcript:
---
${transcript}
---`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  logger.debug({ raw: raw.slice(0, 200) }, "Raw Gemini summary response");

  try {
    // Strip possible markdown code fences
    const cleaned = raw
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    if (
      !parsed.summary ||
      !Array.isArray(parsed.keyDecisions) ||
      !Array.isArray(parsed.actionItems)
    ) {
      throw new Error("Missing required fields in Gemini response");
    }

    logger.info(
      {
        decisions: parsed.keyDecisions.length,
        actions: parsed.actionItems.length,
      },
      "Summarization complete",
    );

    return parsed;
  } catch (e) {
    logger.error({ raw, err: e }, "Failed to parse Gemini JSON response");
    throw new ApiError(502, "Failed to parse AI summary response");
  }
}
