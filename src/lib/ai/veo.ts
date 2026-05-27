import "server-only";
import { GenerateVideosOperation } from "@google/genai";
import { ai } from "./client";
import { buildVideoPrompt } from "@/lib/prompts";
import type { Scene, UserProfile } from "@/types";

export async function submitVideoJob(
  profile: UserProfile,
  scenes: Scene[],
  durationSeconds: number = 8
): Promise<string> {
  const prompt = buildVideoPrompt(profile, scenes);
  // Veo 2.0 supports only 5-8 seconds
  const clampedDuration = Math.min(8, Math.max(5, durationSeconds));
  const operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt,
    config: {
      durationSeconds: clampedDuration,
      aspectRatio: "16:9",
    },
  });
  return operation.name!;
}

export async function pollVideoJob(operationName: string): Promise<{
  done: boolean;
  videoGcsUri?: string;
}> {
  // Construct a properly-typed operation object to satisfy the SDK
  const opObj = Object.assign(new GenerateVideosOperation(), { name: operationName });
  const operation = await ai.operations.getVideosOperation({ operation: opObj });
  console.log("[veo poll] done:", operation.done, "error:", JSON.stringify(operation.error));
  if (operation.done && operation.error) {
    throw new Error(operation.error.message as string ?? "Veo generation failed");
  }
  if (operation.done && operation.response?.generatedVideos?.[0]?.video?.uri) {
    return {
      done: true,
      videoGcsUri: operation.response.generatedVideos[0].video.uri,
    };
  }
  return { done: false };
}
