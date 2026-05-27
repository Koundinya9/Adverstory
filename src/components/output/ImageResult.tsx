"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImageResult() {
  const router = useRouter();
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("imageDataUrl");
    if (!stored) { router.push("/create"); return; }
    setDataUrl(stored);
  }, [router]);

  if (!dataUrl) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <img src={dataUrl} alt="Generated ad" className="w-full rounded-xl shadow-lg" />
      <div className="flex gap-4">
        <a
          href={dataUrl}
          download="adverstory-ad.png"
          className="flex-1 bg-blue-600 text-white text-center font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Download Image
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
