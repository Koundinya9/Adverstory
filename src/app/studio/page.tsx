"use client";
import { useState, useEffect } from "react";
import Sidebar, { type View } from "@/components/shell/Sidebar";
import ContextHub, { type ExtendedProfile, loadExtendedProfile } from "@/components/views/ContextHub";
import StoryboardView, { initialCampaign, type Campaign } from "@/components/views/StoryboardView";
import WorkspaceView, { type WorkspaceResult } from "@/components/views/WorkspaceView";

function buildAIProfile(p: ExtendedProfile) {
  return {
    companyName: p.companyName,
    productDescription: `${p.category} brand. Guidelines: ${p.guidelines}`,
    toneStyle: p.toneStyle,
    targetAudience: p.targetAudience,
  };
}

export default function StudioPage() {
  const [view, setView] = useState<View>("context");
  const [contextSaved, setContextSaved] = useState(false);
  const [savedProfile, setSavedProfile] = useState<ExtendedProfile>({
    companyName: "", category: "", toneStyle: "", vibes: [], targetAudience: "", guidelines: "",
  });

  useEffect(() => {
    const stored = loadExtendedProfile();
    if (stored) { setSavedProfile(stored); setContextSaved(true); }
  }, []);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<WorkspaceResult | null>(null);

  function handleContextSave(p: ExtendedProfile) {
    setSavedProfile(p);
    setContextSaved(true);
  }

  async function handleGenerate() {
    setGenerating(true);
    setView("workspace");
    setResult(null);

    const aiProfile = buildAIProfile(savedProfile);
    const scenes = campaign.scenes.map((s) => ({
      id: String(s.id),
      title: `Scene ${campaign.scenes.indexOf(s) + 1}`,
      visualDescription: s.beat,
      narration: s.beat,
      duration: campaign.format === "video" ? campaign.duration / campaign.scenes.length : undefined,
    }));

    try {
      if (campaign.format === "image") {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: aiProfile, scenes }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResult({
          format: "image",
          prompt: campaign.prompt,
          aspect: campaign.aspect,
          sceneCount: campaign.scenes.length,
          imageDataUrl: data.dataUrl,
        });
      } else {
        const res = await fetch("/api/video/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: aiProfile, scenes, duration: campaign.duration }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResult({
          format: "video",
          prompt: campaign.prompt,
          aspect: campaign.aspect,
          duration: campaign.duration,
          sceneCount: campaign.scenes.length,
          operationName: data.operationName,
        });
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="studio-shell">
      <Sidebar view={view} setView={setView} contextSaved={contextSaved} />
      <div className="studio-main">
        {view === "context" && (
          <ContextHub onSave={handleContextSave} contextSaved={contextSaved} />
        )}
        {view === "storyboard" && (
          <StoryboardView
            profile={savedProfile}
            contextSaved={contextSaved}
            campaign={campaign}
            setCampaign={setCampaign}
            onGenerate={handleGenerate}
            generating={generating}
          />
        )}
        {view === "workspace" && (
          <WorkspaceView
            result={result}
            generating={generating}
            onRegenerate={handleGenerate}
            onNew={() => { setCampaign(initialCampaign()); setView("storyboard"); }}
          />
        )}
      </div>
    </div>
  );
}
