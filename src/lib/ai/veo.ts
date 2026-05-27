import "server-only";
import { GenerateVideosOperation } from "@google/genai";
import { ai } from "./client";
import { buildVideoPrompt } from "@/lib/prompts";
import type { Scene, UserProfile } from "@/types";

export async function submitVideoJob(
  profile: UserProfile,
  scenes: Scene[]
): Promise<string> {
  const prompt = buildVideoPrompt(profile, scenes);
  const operation = await ai.models.generateVideos({
    model: "veo-3.0-generate-001",
    prompt,
    config: {
      durationSeconds: 15,
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
  if (
    operation.done &&
    operation.response?.generatedVideos?.[0]?.video?.uri
  ) {
    return {
      done: true,
      videoGcsUri: operation.response.generatedVideos[0].video.uri,
    };
  }
  return { done: false };
}
