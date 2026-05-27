"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoryboardStore } from "@/store/storyboardStore";
import StoryboardEditor from "@/components/storyboard/StoryboardEditor";

export default function StoryboardPage() {
  const router = useRouter();
  const { scenes, format } = useStoryboardStore();

  useEffect(() => {
    if (scenes.length === 0) router.replace("/create");
  }, [scenes.length, router]);

  if (scenes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Your Storyboard</h1>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {format === "image" ? "Image Ad" : "Video Ad"}
        </span>
      </div>
      <p className="text-gray-500 mb-8">
        Review and edit each scene. Drag to reorder. Then generate your ad.
      </p>
      <StoryboardEditor />
    </div>
  );
}
