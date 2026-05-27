import type { UserProfile, Scene, AdFormat } from "@/types";

export function buildStoryboardPrompt(
  profile: UserProfile,
  roughIdea: string,
  format: AdFormat
): string {
  return `You are an expert advertising creative director.

Company: ${profile.companyName}
Product/Service: ${profile.productDescription}
Tone/Style: ${profile.toneStyle}
Target Audience: ${profile.targetAudience}

The user wants to create a ${format === "video" ? "video advertisement" : "image advertisement"}.
Their rough idea: "${roughIdea}"

Generate a scene-by-scene storyboard as a JSON array.
${format === "video" ? "Use 3-5 scenes. Each scene should be 2-5 seconds." : "Use 1-3 panels/frames for the image ad composition."}

Return ONLY a valid JSON array in this exact shape, no markdown, no explanation:
[
  {
    "id": "scene-1",
    "title": "Scene 1: Hook",
    "visualDescription": "Detailed description of what is shown visually",
    "narration": "Voiceover or on-screen text for this scene",
    "duration": 3
  }
]

Make each scene vivid, specific, and tightly aligned with the tone and audience.`;
}

export function buildImagePrompt(profile: UserProfile, scenes: Scene[]): string {
  const visuals = scenes.map((s) => s.visualDescription).join(". ");
  return `Create a professional advertisement image for ${profile.companyName}.
Product/Service: ${profile.productDescription}.
Tone: ${profile.toneStyle}. Target audience: ${profile.targetAudience}.
Visual concept: ${visuals}.
Photorealistic, high quality, 16:9 aspect ratio. No text overlays. No watermarks.`;
}

export function buildVideoPrompt(profile: UserProfile, scenes: Scene[]): string {
  const narrative = scenes
    .map((s) => `[${s.title}] ${s.visualDescription}. ${s.narration}`)
    .join(" ");
  return `A professional video advertisement for ${profile.companyName}.
Product/Service: ${profile.productDescription}.
Tone: ${profile.toneStyle}. Target audience: ${profile.targetAudience}.
Narrative: ${narrative}
Cinematic quality, smooth transitions, no text overlays.`;
}
