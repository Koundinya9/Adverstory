"use client";
import { LogoIcon, ContextIcon, StoryboardIcon, WorkspaceIcon, HistoryIcon, HeartIcon, TagIcon, SettingsIcon } from "@/components/ui/Icons";

export type View = "context" | "storyboard" | "workspace";

const NAV: { id: View; label: string; sub: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "context",    label: "Context Hub",   sub: "Brand profile",      Icon: ContextIcon    },
  { id: "storyboard", label: "Storyboard",    sub: "Compose campaign",   Icon: StoryboardIcon },
  { id: "workspace",  label: "Workspace",     sub: "Generated outputs",  Icon: WorkspaceIcon  },
];

export default function Sidebar({
  view, setView, contextSaved,
}: {
  view: View; setView: (v: View) => void; contextSaved: boolean;
}) {
  return (
    <aside className="studio-sidebar hairline-r relative z-10">
      {/* Brand */}
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center text-white">
            <LogoIcon size={16} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-semibold tracking-tight text-white">Adverstory</span>
            <span className="text-[10px] font-mono text-white/35 mt-0.5 tracking-wider uppercase">AI Ad Studio</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex flex-col gap-1">
        <div className="label-mono px-3 pb-2 pt-1">Workflow</div>
        {NAV.map((n, i) => {
          const active = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`group relative w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200
                ${active ? "bg-white/[0.06] border border-white/[0.10]" : "border border-transparent hover:bg-white/[0.03]"}`}
            >
              <span className={`absolute left-[-9px] top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all
                ${active ? "h-6 bg-[#7C8CFF]" : "h-0"}`} />
              <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
                ${active ? "bg-[#7C8CFF]/15 text-[#7C8CFF]" : "text-white/55 group-hover:text-white/85"}`}>
                <n.Icon size={16} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`text-[13px] font-medium ${active ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                  {n.label}
                </span>
                <span className="text-[10.5px] text-white/35 mt-0.5">{n.sub}</span>
              </div>
              <span className="ml-auto text-[10px] font-mono text-white/25">0{i + 1}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 mt-6">
        <div className="h-px bg-white/[0.07]" />
      </div>

      {/* Secondary */}
      <div className="px-3 mt-5 flex flex-col gap-1">
        <div className="label-mono px-3 pb-2">Library</div>
        <SidebarLink Icon={HistoryIcon} label="Recent generations" badge="12" />
        <SidebarLink Icon={HeartIcon} label="Saved drafts" badge="3" />
        <SidebarLink Icon={TagIcon} label="Brand assets" />
      </div>

      {/* Footer */}
      <div className="mt-auto p-3">
        <div className={`p-3 rounded-lg glass mb-3 transition-all duration-300 ${contextSaved ? "" : "opacity-90"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="label-mono">Context</span>
            <span className={`text-[10px] font-mono ${contextSaved ? "text-[#7C8CFF]" : "text-amber-300/70"}`}>
              {contextSaved ? "● ACTIVE" : "○ DRAFT"}
            </span>
          </div>
          <div className="text-[11.5px] text-white/55 leading-relaxed">
            {contextSaved
              ? "Brand profile loaded. AI is grounded in your guidelines."
              : "Set your brand profile to ground generations."}
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C8CFF]/40 to-[#5B6BFF]/20 border border-white/10 flex items-center justify-center text-[11px] font-medium text-white">
            YO
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] text-white/85 truncate">You</div>
            <div className="text-[10.5px] text-white/35 truncate">adverstory studio</div>
          </div>
          <button className="text-white/40 hover:text-white/80 p-1.5 rounded-md hover:bg-white/[0.05] transition-colors">
            <SettingsIcon size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ Icon, label, badge }: {
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  badge?: string;
}) {
  return (
    <button className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-white/55 hover:text-white/95 hover:bg-white/[0.03] transition-colors group">
      <Icon size={14} />
      <span className="text-[12.5px]">{label}</span>
      {badge && <span className="ml-auto text-[10px] font-mono text-white/35 group-hover:text-white/55">{badge}</span>}
    </button>
  );
}
