export type AdFormat = "image" | "video";

export type ToneStyle = "professional" | "playful" | "luxury" | "bold" | "minimal";

export interface UserProfile {
  companyName: string;
  productDescription: string;
  toneStyle: ToneStyle;
  targetAudience: string;
}

export interface Scene {
  id: string;
  title: string;
  visualDescription: string;
  narration: string;
  duration?: number;
}

export interface Storyboard {
  roughIdea: string;
  format: AdFormat;
  scenes: Scene[];
}
