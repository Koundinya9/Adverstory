import type { UserProfile } from "@/types";

const PROFILE_KEY = "adverstory_profile";

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function hasProfile(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PROFILE_KEY) !== null;
}
