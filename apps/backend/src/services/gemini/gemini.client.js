import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

let _client = null;

export function getGeminiClient() {
  if (!_client) {
    _client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return _client;
}

export function getFlashModel() {
  return getGeminiClient().getGenerativeModel({ model: "gemini-3.5-flash" });
}
