"use client";
import { Button, Textarea, ViewHeader } from "@/components/ui/primitives";
import { SparkleIcon, HistoryIcon, ImageIcon, VideoIcon, PlusIcon, RefreshIcon, CloseIcon, WandIcon } from "@/components/ui/Icons";
import type { ExtendedProfile } from "./ContextHub";

export interface SceneBeat {
  id: number;
  beat: string;
}

export interface Campaign {
  prompt: string;
  format: "image" | "video";
  aspect: string;
  duration: number;
  scenes: SceneBeat[];
}

const ASPECTS = [
  { id: "1:1",  w: 14, h: 14 },
  { id: "4:5",  w: 12, h: 15 },
  { id: "9:16", w: 9,  h: 16 },
  { id: "16:9", w: 20, h: 11 },
];

const DEFAULT_BEATS = [
  "The hook — what stops the scroll",
  "The reveal — show the product, in context",
  "The promise — what this delivers, in 5 words",
  "The proof — a quiet, honest moment",
  "The line — text on screen",
  "The end — logo, breath, exit",
];

const QUICK_PROMPTS = [
  { label: "Launch teaser", text: "A 10-second launch teaser. We open in near-silence. The product reveals itself in one continuous push-in shot. End on the new tagline." },
  { label: "Founder POV",   text: "A founder-led story. Eye-level handheld. The founder explains the one thing they were obsessed with while building this." },
  { label: "Before / After", text: "Before-and-after framing. Show the old way vs the new way. Quiet on the before, music kicks in on the after." },
];

export function defaultScene(n: number): SceneBeat {
  return { id: Date.now() + n + Math.floor(Math.random() * 1000), beat: DEFAULT_BEATS[n - 1] ?? "New beat" };
}

export function initialCampaign(): Campaign {
  return { prompt: "", format: "image", aspect: "4:5", duration: 15, scenes: [1, 2, 3].map(defaultScene) };
}

export default function StoryboardView({
  profile, contextSaved, campaign, setCampaign, onGenerate, generating,
}: {
  profile: ExtendedProfile;
  contextSaved: boolean;
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  onGenerate: () => void;
  generating: boolean;
}) {
  const update = (patch: Partial<Campaign>) => setCampaign((c) => ({ ...c, ...patch }));
  const setScene = (idx: number, patch: Partial<SceneBeat>) =>
    update({ scenes: campaign.scenes.map((s, i) => (i === idx ? { ...s, ...patch } : s)) });
  const addScene = () => {
    if (campaign.scenes.length >= 6) return;
    update({ scenes: [...campaign.scenes, defaultScene(campaign.scenes.length + 1)] });
  };
  const removeScene = (idx: number) => {
    if (campaign.scenes.length <= 1) return;
    update({ scenes: campaign.scenes.filter((_, i) => i !== idx) });
  };

  const canGenerate = campaign.prompt.trim().length > 8 && !!campaign.format;

  return (
    <div className="flex-1 h-full flex flex-col min-h-0">
      <ViewHeader
        eyebrow="02 · Interactive Storyboard"
        title="Compose the campaign. The model fills in the frames."
        description="Describe the rough idea. Pick a format. Tune scenes if you want — or hand it over to the AI to interpret your brief."
        actions={
          <>
            <Button variant="ghost" size="md" icon={<HistoryIcon size={14} />}>History</Button>
            <Button
              variant="primary" size="md"
              icon={generating ? undefined : <SparkleIcon size={14} />}
              loading={generating}
              disabled={!canGenerate || generating}
              onClick={onGenerate}
              glow
              className={canGenerate && !generating ? "anim-pulse-glow" : ""}
            >
              {generating ? "Generating…" : "Generate Ad with AI"}
            </Button>
          </>
        }
      />

      {!contextSaved && (
        <div className="mx-10 mb-6 glass rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ borderColor: "rgba(251,191,36,0.18)", background: "linear-gradient(180deg,rgba(251,191,36,0.04),rgba(255,255,255,0.015))" }}>
          <span className="w-7 h-7 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center text-[12px] font-mono shrink-0">!</span>
          <div className="text-[12.5px]">
            <span className="text-amber-200/95 font-medium">Context not saved. </span>
            <span className="text-white/55">Generations will use generic defaults. Save your brand profile in Context Hub for grounded output.</span>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 px-10 pb-10 grid grid-cols-12 gap-8">
        {/* Input panel */}
        <div className="col-span-4 flex flex-col gap-5 min-h-0 overflow-y-auto pr-1">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3.5">
              <span className="label-mono">Rough Idea / Prompt</span>
              <span className="text-[10px] font-mono text-white/35">{campaign.prompt.length} / 600</span>
            </div>
            <Textarea
              rows={9}
              value={campaign.prompt}
              onChange={(e) => update({ prompt: e.target.value.slice(0, 600) })}
              placeholder={`A 15-second hero spot for our autumn launch. The drink lands on a marble counter at golden hour. We hear the pour. The line on screen reads "Slow is the new fast." End on the logo.`}
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {QUICK_PROMPTS.map((p) => (
                <button key={p.label} onClick={() => update({ prompt: p.text })}
                  className="px-2.5 h-7 rounded-md text-[11px] text-white/55 hover:text-white/95 bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center gap-1.5">
                  <WandIcon size={10} /> {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3.5">
              <span className="label-mono">Output Format</span>
              <span className="text-[10px] font-mono text-white/35">Required</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormatCard active={campaign.format === "image"} onClick={() => update({ format: "image" })}
                Icon={ImageIcon} label="Image Ad" hint="Static · instant" meta="PNG · 16:9" />
              <FormatCard active={campaign.format === "video"} onClick={() => update({ format: "video" })}
                Icon={VideoIcon} label="Video Ad" hint="Motion · 1-3 min" meta="MP4 · 1080p" />
            </div>

            <div className="mt-5">
              <div className="label-mono mb-2.5">Aspect Ratio</div>
              <div className="flex gap-1.5">
                {ASPECTS.map((a) => (
                  <button key={a.id} onClick={() => update({ aspect: a.id })}
                    className={`flex-1 h-12 rounded-md border flex flex-col items-center justify-center gap-0.5 transition-all
                      ${campaign.aspect === a.id
                        ? "bg-white/[0.07] border-white/[0.18] text-white"
                        : "bg-white/[0.02] border-white/[0.06] text-white/55 hover:text-white/85 hover:border-white/[0.12]"}`}>
                    <div className="border border-current opacity-70" style={{ width: a.w, height: a.h, borderRadius: 1 }} />
                    <span className="text-[10px] font-mono mt-0.5">{a.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`mt-5 transition-all duration-300 ${campaign.format === "video" ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="label-mono">Length</span>
                <span className="text-[11px] font-mono text-white/85">{campaign.duration}s</span>
              </div>
              <input type="range" min="6" max="30" step="1" value={campaign.duration}
                onChange={(e) => update({ duration: +e.target.value })} className="thin" />
              <div className="flex justify-between text-[10px] font-mono text-white/35 mt-1.5">
                <span>6s</span><span>15s</span><span>30s</span>
              </div>
            </div>
          </div>

          {/* Inherited context */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3.5">
              <span className="label-mono">Inherited from Context</span>
              {contextSaved
                ? <span className="text-[10px] font-mono text-[#7C8CFF]">● LIVE</span>
                : <span className="text-[10px] font-mono text-amber-300/70">○ MISSING</span>}
            </div>
            <div className="space-y-2.5 text-[12px]">
              <ContextRow label="Brand" value={profile.companyName || "—"} />
              <ContextRow label="Voice" value={prettyVoice(profile.toneStyle)} />
              <ContextRow label="Vibe" value={profile.vibes.join(", ") || "—"} />
              <ContextRow label="Audience" value={truncate(profile.targetAudience, 60) || "—"} />
            </div>
          </div>
        </div>

        {/* Timeline / Canvas */}
        <div className="col-span-8 flex flex-col gap-5 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="label-mono">Scene Timeline</span>
              <span className="text-[11px] text-white/35">— {campaign.scenes.length} {campaign.scenes.length === 1 ? "scene" : "scenes"} · {campaign.format === "video" ? `${campaign.duration}s` : "single frame set"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" icon={<PlusIcon size={12} />} onClick={addScene} disabled={campaign.scenes.length >= 6}>
                Add scene
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-4">
              {campaign.scenes.map((scene, idx) => (
                <SceneCard key={scene.id} scene={scene} index={idx} total={campaign.scenes.length}
                  format={campaign.format} generating={generating}
                  onChange={(p) => setScene(idx, p)} onRemove={() => removeScene(idx)} />
              ))}
              {campaign.scenes.length < 6 && (
                <button onClick={addScene}
                  className="aspect-[9/12] rounded-xl border border-dashed border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-2 text-white/35 hover:text-white/85 group">
                  <span className="w-9 h-9 rounded-full border border-current flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusIcon size={14} />
                  </span>
                  <span className="text-[12px]">Add scene</span>
                </button>
              )}
            </div>

            {/* Timeline strip */}
            <div className="mt-6 glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="label-mono">Pacing</span>
                <span className="text-[10.5px] font-mono text-white/35">click to focus</span>
              </div>
              <div className="flex gap-1.5">
                {campaign.scenes.map((s, i) => {
                  const dur = campaign.format === "video" ? campaign.duration / campaign.scenes.length : 1;
                  return (
                    <div key={s.id} className={`group relative h-12 rounded-md glass hairline overflow-hidden cursor-pointer ${generating ? "anim-shimmer" : ""}`}
                      style={{ flex: dur }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
                      <div className="absolute inset-0 p-2 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-white/55">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[10px] font-mono text-white/85">
                          {campaign.format === "video" ? `${dur.toFixed(1)}s` : "still"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormatCard({ active, onClick, Icon, label, hint, meta }: {
  active: boolean; onClick: () => void;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; hint: string; meta: string;
}) {
  return (
    <button onClick={onClick}
      className={`relative group p-4 rounded-xl text-left transition-all overflow-hidden
        ${active ? "glass-strong accent-glow" : "glass hover:border-white/[0.18]"}`}
      style={active ? { borderColor: "rgba(124,140,255,0.4)" } : {}}>
      <div className="flex items-center justify-between mb-6">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
          ${active ? "bg-[#7C8CFF]/15 text-[#7C8CFF]" : "bg-white/[0.04] text-white/70 group-hover:text-white/95"}`}>
          <Icon size={16} />
        </div>
        <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all
          ${active ? "border-[#7C8CFF] bg-[#7C8CFF] text-white" : "border-white/15"}`}>
          {active && <CheckIcon size={10} stroke={3} />}
        </span>
      </div>
      <div className={`text-[14px] font-medium ${active ? "text-white" : "text-white/90"}`}>{label}</div>
      <div className="text-[11.5px] text-white/45 mt-0.5">{hint}</div>
      <div className="text-[10px] font-mono text-white/30 mt-2">{meta}</div>
    </button>
  );
}

function CheckIcon({ size = 14, stroke = 2 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5 11-12" />
    </svg>
  );
}

function SceneCard({ scene, index, total, format, generating, onChange, onRemove }: {
  scene: SceneBeat; index: number; total: number; format: string;
  generating: boolean; onChange: (p: Partial<SceneBeat>) => void; onRemove: () => void;
}) {
  const hue = ((scene.id * 37) % 60) + 220;
  const hue2 = hue + 30;
  return (
    <div className="group relative aspect-[9/12] rounded-xl glass hairline overflow-hidden flex flex-col">
      <div className="relative flex-1 overflow-hidden" style={{ background: `radial-gradient(circle at 40% 40%, hsla(${hue},60%,55%,0.18), transparent 70%), radial-gradient(circle at 80% 80%, hsla(${hue2},50%,40%,0.12), transparent 60%)` }}>
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/85 backdrop-blur">
            SCENE {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button title="Regenerate" className="w-7 h-7 rounded-md glass-strong flex items-center justify-center text-white/75 hover:text-white">
            <RefreshIcon size={11} />
          </button>
          {total > 1 && (
            <button onClick={onRemove} title="Remove" className="w-7 h-7 rounded-md glass-strong flex items-center justify-center text-white/55 hover:text-red-300">
              <CloseIcon size={11} />
            </button>
          )}
        </div>
        {generating && (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 anim-shimmer pointer-events-none" />
          </>
        )}
      </div>
      <div className="p-3 hairline-t">
        <input value={scene.beat} onChange={(e) => onChange({ beat: e.target.value })}
          className="w-full bg-transparent text-[12.5px] text-white/90 placeholder:text-white/30 outline-none"
          placeholder="Describe this beat…" />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] font-mono text-white/30">{scene.beat.length} chars</span>
          {format === "video" && <span className="text-[10px] font-mono text-white/30">~{(15 / total).toFixed(1)}s</span>}
        </div>
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="label-mono w-16 shrink-0">{label}</span>
      <span className="text-white/80 leading-snug">{value}</span>
    </div>
  );
}

const prettyVoice = (v: string) => !v ? "—" : v.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" & ");
const truncate = (s: string, n: number) => !s ? "" : s.length > n ? s.slice(0, n) + "…" : s;
