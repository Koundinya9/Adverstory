"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { useStoryboardStore } from "@/store/storyboardStore";
import type { AdFormat } from "@/types";

export default function CreatePage() {
  const router = useRouter();
  const { roughIdea, format, setRoughIdea, setFormat, setScenes, setIsGenerating } =
    useStoryboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getProfile()) router.replace("/profile");
  }, [router]);

  async function handleGenerate() {
    if (!roughIdea.trim()) { setError("Enter your ad idea first."); return; }
    const profile = getProfile();
    if (!profile) { router.push("/profile"); return; }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, roughIdea, format }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScenes(data.scenes);
      router.push("/create/storyboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate storyboard");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Ad</h1>
      <p className="text-gray-500 mb-8">
        Describe your rough idea and pick a format. AI will build the storyboard.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">What&apos;s the ad about?</label>
          <textarea
            value={roughIdea}
            onChange={(e) => setRoughIdea(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="e.g. A heartwarming ad showing how our coffee brings families together on Sunday mornings..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Ad Format</label>
          <div className="grid grid-cols-2 gap-4">
            {(["image", "video"] as AdFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`py-6 rounded-xl border-2 font-semibold transition-colors ${
                  format === f
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">{f === "image" ? "🖼️" : "🎬"}</div>
                <div>{f === "image" ? "Image Ad" : "Video Ad"}</div>
                <div className="text-xs font-normal mt-1 text-gray-400">
                  {f === "image" ? "Instant generation" : "1-3 min generation"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Building storyboard..." : "Generate Storyboard →"}
        </button>
      </div>
    </div>
  );
}
