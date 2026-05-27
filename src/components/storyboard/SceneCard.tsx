"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Scene } from "@/types";

interface Props {
  scene: Scene;
  showDuration: boolean;
  onUpdate: (updates: Partial<Scene>) => void;
  onRemove: () => void;
}

export default function SceneCard({ scene, showDuration, onUpdate, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          ⠿
        </button>
        <input
          value={scene.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="flex-1 font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1"
        />
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
          title="Remove scene"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 ml-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Visual Description</label>
          <textarea
            value={scene.visualDescription}
            onChange={(e) => onUpdate({ visualDescription: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="What does the viewer see?"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {showDuration ? "Narration / Voiceover" : "On-screen Text / Caption"}
          </label>
          <textarea
            value={scene.narration}
            onChange={(e) => onUpdate({ narration: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="What does the audience hear or read?"
          />
        </div>

        {showDuration && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-gray-500">Duration (seconds)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={scene.duration ?? 3}
              onChange={(e) => onUpdate({ duration: Number(e.target.value) })}
              className="w-20 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
