"use client";
import { useStoryboardStore } from "@/store/storyboardStore";
import ImageResult from "@/components/output/ImageResult";
import VideoResult from "@/components/output/VideoResult";

export default function OutputPage() {
  const format = useStoryboardStore((s) => s.format);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {format === "image" ? "Your Image Ad" : "Your Video Ad"}
      </h1>
      <p className="text-gray-500 mb-8">
        {format === "video"
          ? "Veo is generating your video. This usually takes 1-3 minutes."
          : "Here's your AI-generated image ad."}
      </p>
      {format === "image" ? <ImageResult /> : <VideoResult />}
    </div>
  );
}
