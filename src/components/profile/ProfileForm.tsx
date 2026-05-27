"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile } from "@/lib/profile";
import type { UserProfile, ToneStyle } from "@/types";

const TONES: { value: ToneStyle; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
  { value: "luxury", label: "Luxury" },
  { value: "bold", label: "Bold" },
  { value: "minimal", label: "Minimal" },
];

export default function ProfileForm() {
  const router = useRouter();
  const existing = getProfile();
  const [form, setForm] = useState<UserProfile>(
    existing ?? {
      companyName: "",
      productDescription: "",
      toneStyle: "professional",
      targetAudience: "",
    }
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(form);
    router.push("/create");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Company / Brand Name</label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Acme Corp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product / Service Description</label>
        <textarea
          name="productDescription"
          value={form.productDescription}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Describe what you sell or offer..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tone / Style</label>
        <select
          name="toneStyle"
          value={form.toneStyle}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Target Audience</label>
        <input
          name="targetAudience"
          value={form.targetAudience}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Young professionals aged 25-35"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {existing ? "Update Profile" : "Save & Continue"}
      </button>
    </form>
  );
}
