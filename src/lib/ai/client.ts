import "server-only";
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
});
