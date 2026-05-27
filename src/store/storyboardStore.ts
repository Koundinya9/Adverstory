"use client";
import { create } from "zustand";
import type { Scene, AdFormat } from "@/types";

interface StoryboardState {
  roughIdea: string;
  format: AdFormat;
  scenes: Scene[];
  isGeneratingStoryboard: boolean;
  operationName: string | null;
  setRoughIdea: (idea: string) => void;
  setFormat: (format: AdFormat) => void;
  setScenes: (scenes: Scene[]) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  addScene: () => void;
  removeScene: (id: string) => void;
  setIsGenerating: (v: boolean) => void;
  setOperationName: (name: string | null) => void;
  reset: () => void;
}

export const useStoryboardStore = create<StoryboardState>((set) => ({
  roughIdea: "",
  format: "image",
  scenes: [],
  isGeneratingStoryboard: false,
  operationName: null,
  setRoughIdea: (roughIdea) => set({ roughIdea }),
  setFormat: (format) => set({ format }),
  setScenes: (scenes) => set({ scenes }),
  updateScene: (id, updates) =>
    set((s) => ({
      scenes: s.scenes.map((sc) => (sc.id === id ? { ...sc, ...updates } : sc)),
    })),
  addScene: () =>
    set((s) => ({
      scenes: [
        ...s.scenes,
        {
          id: crypto.randomUUID(),
          title: `Scene ${s.scenes.length + 1}`,
          visualDescription: "",
          narration: "",
          duration: 3,
        },
      ],
    })),
  removeScene: (id) =>
    set((s) => ({ scenes: s.scenes.filter((sc) => sc.id !== id) })),
  setIsGenerating: (v) => set({ isGeneratingStoryboard: v }),
  setOperationName: (name) => set({ operationName: name }),
  reset: () =>
    set({
      roughIdea: "",
      format: "image",
      scenes: [],
      isGeneratingStoryboard: false,
      operationName: null,
    }),
}));
