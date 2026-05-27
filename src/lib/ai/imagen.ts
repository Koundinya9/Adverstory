import "server-only";
import { ai } from "./client";
import { buildImagePrompt } from "@/lib/prompts";
import type { Scene, UserProfile } from "@/types";

export async function generateImage(
  profile: UserProfile,
  scenes: Scene[]
): Promise<string> {
  const prompt = buildImagePrompt(profile, scenes);
  const response = await ai.models.generateImages({
    model: "imagen-3.0-fast-generate-001",
    prompt,
    config: { numberOfImages: 1, aspectRatio: "16:9" },
  });
  const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imageBytes) throw new Error("No image returned from Imagen");
  return `data:image/png;base64,${imageBytes}`;
}
