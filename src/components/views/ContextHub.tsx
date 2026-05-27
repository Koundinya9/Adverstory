"use client";
import { useState, useEffect } from "react";
import { Button, Field, Input, Textarea, Select, TagInput, ViewHeader } from "@/components/ui/primitives";
import { RefreshIcon, CheckIcon, SparkleIcon } from "@/components/ui/Icons";
import type { UserProfile } from "@/types";

const VOICE_OPTIONS = [
  { value: "minimal-precise",     label: "Minimal & Precise" },
  { value: "warm-conversational", label: "Warm & Conversational" },
  { value: "bold-irreverent",     label: "Bold & Irreverent" },
  { value: "luxurious-refined",   label: "Luxurious & Refined" },
  { value: "technical-trusted",   label: "Technical & Trusted" },
  { value: "playful-energetic",   label: "Playful & Energetic" },
];

const CATEGORY_OPTIONS = [
  { value: "dtc-cpg",     label: "DTC / Consumer Goods" },
  { value: "saas",        label: "SaaS / Software" },
  { value: "fintech",     label: "Fintech & Banking" },
  { value: "fashion",     label: "Fashion & Apparel" },
  { value: "hospitality", label: "Hospitality & Travel" },
  { value: "wellness",    label: "Health & Wellness" },
  { value: "media",       label: "Media & Entertainment" },
];

const VIBE_SUGGESTIONS = ["editorial", "cinematic", "high-contrast", "warm grain", "monochrome", "saturated", "documentary", "studio lit"];

export interface ExtendedProfile {
  companyName: string;
  category: string;
  toneStyle: string;
  vibes: string[];
  targetAudience: string;
  guidelines: string;
}

const emptyProfile = (): ExtendedProfile => ({
  companyName: "",
  category: "",
  toneStyle: "",
  vibes: [],
  targetAudience: "",
  guidelines: "",
});

function computeCompleteness(p: ExtendedProfile): number {
  let hit = 0;
  if (p.companyName) hit++;
  if (p.category) hit++;
  if (p.toneStyle) hit++;
  if (p.vibes.length >= 2) hit++;
  if (p.targetAudience.trim().length > 30) hit++;
  if (p.guidelines.trim().length > 30) hit++;
  return hit / 6;
}

const STORAGE_KEY = "adverstory_extended_profile";

export function loadExtendedProfile(): ExtendedProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as ExtendedProfile) : null;
}

export default function ContextHub({
  onSave,
  contextSaved,
}: {
  onSave: (p: ExtendedProfile) => void;
  contextSaved: boolean;
}) {
  const [local, setLocal] = useState<ExtendedProfile>(emptyProfile());
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const stored = loadExtendedProfile();
    if (stored) setLocal(stored);
  }, []);

  const update = (patch: Partial<ExtendedProfile>) => setLocal((p) => ({ ...p, ...patch }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
      onSave(local);
      setSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2400);
    }, 600);
  };

  const dirty = JSON.stringify(local) !== JSON.stringify(loadExtendedProfile() ?? emptyProfile());
  const completeness = computeCompleteness(local);

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <ViewHeader
        eyebrow="01 · Context Hub"
        title="Define how the AI sees your brand."
        description="Everything you save here grounds every generation. The model reads it as the source of truth for voice, audience, and visual rules."
        actions={
          <>
            <Button variant="ghost" size="md" icon={<RefreshIcon size={14} />} onClick={() => setLocal(emptyProfile())}>
              Reset
            </Button>
            <Button
              variant="primary" size="md"
              icon={justSaved ? <CheckIcon size={14} stroke={2.5} /> : <CheckIcon size={14} stroke={2} />}
              loading={saving}
              disabled={!dirty && contextSaved}
              onClick={handleSave}
              glow={dirty || justSaved}
              className={justSaved ? "anim-pulse-glow" : ""}
            >
              {justSaved ? "Context saved" : saving ? "Saving" : "Save Context"}
            </Button>
          </>
        }
      />

      <div className="px-10 pb-16 grid grid-cols-12 gap-8 max-w-[1280px]">
        {/* Main */}
        <div className="col-span-8 flex flex-col gap-8">
          <div className="glass rounded-2xl p-7">
            <div className="grid grid-cols-2 gap-6">
              <Field label="Company / Product Name" hint="The name that will anchor every ad we generate.">
                <Input value={local.companyName} onChange={(e) => update({ companyName: e.target.value })} placeholder="e.g. Northwave Coffee Co." />
              </Field>
              <Field label="Category / Industry">
                <Select value={local.category} onChange={(v) => update({ category: v })} options={CATEGORY_OPTIONS} placeholder="Select a category…" />
              </Field>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <Field label="Brand Voice" hint="Sets the model's default register across copy & captions.">
                <Select value={local.toneStyle} onChange={(v) => update({ toneStyle: v })} options={VOICE_OPTIONS} placeholder="Choose a voice…" />
              </Field>
              <Field label="Visual Vibe" hint="Press Enter to add. Used in image & video prompts.">
                <TagInput tags={local.vibes} onChange={(t) => update({ vibes: t })} suggestions={VIBE_SUGGESTIONS} placeholder="cinematic, warm grain…" />
              </Field>
            </div>
          </div>

          <div className="glass rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="label-mono">Audience</span>
              <span className="text-[11px] text-white/35">— who this is for</span>
            </div>
            <Textarea
              rows={4}
              value={local.targetAudience}
              onChange={(e) => update({ targetAudience: e.target.value })}
              placeholder="Describe the person you're talking to. Demographics are fine; psychographics are better. What do they care about? What are they trying to do or feel?"
            />
          </div>

          <div className="glass rounded-2xl p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="label-mono">Core Assets & Guidelines</span>
                <span className="text-[11px] text-white/35">— do&apos;s, don&apos;ts, taglines, claims</span>
              </div>
            </div>
            <Textarea
              rows={6}
              value={local.guidelines}
              onChange={(e) => update({ guidelines: e.target.value })}
              placeholder={`Examples:\n• Never use the word "revolutionize"\n• Always lead with the texture, then the taste\n• Approved claims: "single-origin", "cold-extracted", "small-batch"`}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className={`relative rounded-2xl p-6 glass overflow-hidden transition-all duration-500 ${contextSaved ? "border-[#7C8CFF]/30" : ""}`}>
            {contextSaved && (
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl bg-[#7C8CFF]/20 pointer-events-none -translate-y-1/2 translate-x-1/2" />
            )}
            <div className="flex items-center justify-between mb-5">
              <span className="label-mono">Context Status</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border
                ${contextSaved ? "text-[#7C8CFF] border-[#7C8CFF]/30 bg-[#7C8CFF]/10" : "text-amber-300/80 border-amber-400/20 bg-amber-400/5"}`}>
                {contextSaved ? "ACTIVE" : "UNSAVED"}
              </span>
            </div>
            <div className="text-[13px] text-white/85 leading-relaxed mb-5">
              {contextSaved
                ? "The model has loaded your brand profile and will use it as ground truth for every generation."
                : "Save your context to ground every future generation in your brand."}
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/45">Completeness</span>
                <span className="text-white/85">{Math.round(completeness * 100)}%</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C8CFF] to-[#A4B0FF] transition-all duration-700"
                  style={{ width: `${completeness * 100}%`, boxShadow: "0 0 14px rgba(124,140,255,0.55)" }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 glass">
            <div className="label-mono mb-4">Profile Checklist</div>
            <div className="space-y-3">
              <CheckItem done={!!local.companyName} label="Product name" />
              <CheckItem done={!!local.category} label="Category selected" />
              <CheckItem done={!!local.toneStyle} label="Brand voice" />
              <CheckItem done={local.vibes.length >= 2} label="At least 2 visual vibe tags" />
              <CheckItem done={local.targetAudience.trim().length > 30} label="Audience defined (>30 chars)" />
              <CheckItem done={local.guidelines.trim().length > 30} label="Guidelines added" />
            </div>
          </div>

          <div className="rounded-2xl p-6 glass">
            <div className="flex items-center gap-2 mb-2.5">
              <SparkleIcon size={13} className="text-[#7C8CFF]" />
              <span className="label-mono">Studio Tip</span>
            </div>
            <p className="text-[12.5px] text-white/65 leading-relaxed">
              The more specific your guidelines, the fewer regenerations you&apos;ll need. Try writing a &quot;never do this&quot; list — it&apos;s how creative directors brief humans, and the model responds the same way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all
        ${done ? "border-[#7C8CFF] bg-[#7C8CFF]/15 text-[#7C8CFF]" : "border-white/15 bg-white/[0.02] text-transparent"}`}>
        <CheckIcon size={10} stroke={2.5} />
      </span>
      <span className={`text-[12.5px] transition-colors ${done ? "text-white/85" : "text-white/45"}`}>{label}</span>
    </div>
  );
}
