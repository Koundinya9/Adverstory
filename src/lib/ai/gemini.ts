import "server-only";
import { ai } from "./client";
import { buildStoryboardPrompt } from "@/lib/prompts";
import type { Scene, UserProfile, AdFormat } from "@/types";

export async function generateStoryboard(
  profile: UserProfile,
  roughIdea: string,
  format: AdFormat
): Promise<Scene[]> {
  const prompt = buildStoryboardPrompt(profile, roughIdea, format);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
  const text = response.text ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as Scene[];
}
