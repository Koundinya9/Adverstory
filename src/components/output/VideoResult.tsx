"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStoryboardStore } from "@/store/storyboardStore";

export default function VideoResult() {
  const router = useRouter();
  const operationName = useStoryboardStore((s) => s.operationName);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("Generating your video... this takes 1-3 minutes.");
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!operationName) { router.push("/create"); return; }

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/video/status?operation=${encodeURIComponent(operationName)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.done && data.videoGcsUri) {
          clearInterval(intervalRef.current!);
          setVideoUrl(`/api/video/download?uri=${encodeURIComponent(data.videoGcsUri)}`);
          setStatus("Done!");
        }
      } catch (err) {
        clearInterval(intervalRef.current!);
        setError(err instanceof Error ? err.message : "Polling failed");
      }
    }, 10_000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [operationName, router]);

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/create/storyboard")}
          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          Back to Storyboard
        </button>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-600">{status}</p>
        <p className="text-sm text-gray-400">Checking every 10 seconds...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <video controls className="w-full rounded-xl shadow-lg" src={videoUrl} />
      <div className="flex gap-4">
        <a
          href={videoUrl}
          download="adverstory-ad.mp4"
          className="flex-1 bg-blue-600 text-white text-center font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Download Video
        </a>
        <button
          onClick={() => router.push("/create")}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Create Another
        </button>
      </div>
    </div>
  );
}
