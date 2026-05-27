"use client";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStoryboardStore } from "@/store/storyboardStore";
import { getProfile } from "@/lib/profile";
import SceneCard from "./SceneCard";
import { useState } from "react";

export default function StoryboardEditor() {
  const router = useRouter();
  const { scenes, format, updateScene, addScene, removeScene, setOperationName } =
    useStoryboardStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = scenes.findIndex((s) => s.id === active.id);
    const newIndex = scenes.findIndex((s) => s.id === over.id);
    const reordered = [...scenes];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    useStoryboardStore.setState({ scenes: reordered });
  }

  async function handleGenerate() {
    const profile = getProfile();
    if (!profile) { router.push("/profile"); return; }
    if (scenes.length === 0) { setError("Add at least one scene."); return; }

    setIsGenerating(true);
    setError(null);

    try {
      if (format === "image") {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, scenes }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        useStoryboardStore.setState({ operationName: null });
        sessionStorage.setItem("imageDataUrl", data.dataUrl);
        router.push("/create/storyboard/output");
      } else {
        const res = await fetch("/api/video/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, scenes }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setOperationName(data.operationName);
        router.push("/create/storyboard/output");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={scenes.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              showDuration={format === "video"}
              onUpdate={(updates) => updateScene(scene.id, updates)}
              onRemove={() => removeScene(scene.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={addScene}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium"
      >
        + Add Scene
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || scenes.length === 0}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating
          ? "Submitting..."
          : format === "image"
          ? "Generate Image Ad"
          : "Generate Video Ad"}
      </button>
    </div>
  );
}
