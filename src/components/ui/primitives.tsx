"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon, CloseIcon, PlusIcon, Spinner } from "./Icons";

// ─── BUTTON ───
type ButtonVariant = "primary" | "ghost" | "quiet" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  children, onClick, variant = "ghost", size = "md",
  icon, disabled = false, loading = false, className = "", glow = false,
}: {
  children?: React.ReactNode; onClick?: () => void; variant?: ButtonVariant;
  size?: ButtonSize; icon?: React.ReactNode; disabled?: boolean;
  loading?: boolean; className?: string; glow?: boolean;
}) {
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 h-8 text-[12px] rounded-md",
    md: "px-4 h-10 text-[13px] rounded-lg",
    lg: "px-5 h-11 text-[14px] rounded-xl",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "text-white bg-[#7C8CFF] hover:bg-[#5B6BFF] shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_-12px_rgba(124,140,255,0.8)]",
    ghost: "text-white/85 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.14]",
    quiet: "text-white/70 hover:text-white hover:bg-white/[0.05]",
    danger: "text-red-300/90 hover:text-red-200 bg-red-500/[0.06] hover:bg-red-500/[0.12] border border-red-400/[0.15]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none relative overflow-hidden
        ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${glow ? "accent-glow" : ""} ${className}`}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children && <span>{children}</span>}
    </button>
  );
}

// ─── FIELD ───
export function Field({ label, hint, children, optional }: {
  label: string; hint?: string; children: React.ReactNode; optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="label-mono">{label}</label>
        {optional && <span className="label-mono opacity-50">Optional</span>}
      </div>
      {children}
      {hint && <p className="text-[11.5px] text-faint leading-relaxed">{hint}</p>}
    </div>
  );
}

// ─── INPUT ───
export function Input({ value, onChange, placeholder, className = "", ...rest }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; className?: string; [key: string]: unknown;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-11 px-3.5 bg-white/[0.025] border border-white/[0.07] rounded-lg text-[13.5px] text-white/95
        placeholder:text-white/25 focus:bg-white/[0.04] focus:border-white/[0.15] transition-colors outline-none ${className}`}
      {...rest}
    />
  );
}

// ─── TEXTAREA ───
export function Textarea({ value, onChange, placeholder, rows = 4, className = "", ...rest }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; rows?: number; className?: string; [key: string]: unknown;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3.5 py-3 bg-white/[0.025] border border-white/[0.07] rounded-lg text-[13.5px] text-white/95
        placeholder:text-white/25 focus:bg-white/[0.04] focus:border-white/[0.15] transition-colors outline-none leading-relaxed resize-none ${className}`}
      {...rest}
    />
  );
}

// ─── SELECT ───
export function Select({ value, onChange, options, placeholder = "Select…" }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 px-3.5 flex items-center justify-between rounded-lg border bg-white/[0.025] text-[13.5px] transition-colors
          ${open ? "border-white/[0.18] bg-white/[0.05]" : "border-white/[0.07] hover:border-white/[0.12]"}`}
      >
        <span className={current ? "text-white/95" : "text-white/25"}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDownIcon size={14} className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1.5 w-full glass-strong rounded-lg p-1 anim-fade-up shadow-2xl shadow-black/60">
          {options.map((o) => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 h-9 flex items-center justify-between rounded-md text-[13px] transition-colors
                ${o.value === value ? "bg-white/[0.07] text-white" : "text-white/75 hover:bg-white/[0.05] hover:text-white"}`}
            >
              <span>{o.label}</span>
              {o.value === value && <CheckIcon size={13} className="text-[#7C8CFF]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TAG INPUT ───
export function TagInput({ tags, onChange, suggestions = [], placeholder = "Add tag…" }: {
  tags: string[]; onChange: (tags: string[]) => void;
  suggestions?: string[]; placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (val: string) => {
    const v = val.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setDraft("");
  };
  const remove = (t: string) => onChange(tags.filter((x) => x !== t));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 p-2 min-h-[44px] bg-white/[0.025] border border-white/[0.07] rounded-lg focus-within:border-white/[0.15] transition-colors">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 h-7 rounded-md bg-white/[0.06] border border-white/[0.08] text-[12px] text-white/90">
            {t}
            <button onClick={() => remove(t)} className="text-white/40 hover:text-white/90 transition-colors">
              <CloseIcon size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
            else if (e.key === "Backspace" && !draft && tags.length) remove(tags[tags.length - 1]);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[13px] text-white/95 placeholder:text-white/25 px-2"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {suggestions.filter((s) => !tags.includes(s)).map((s) => (
            <button key={s} onClick={() => add(s)}
              className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] text-white/55 hover:text-white/90 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.10] transition-colors">
              <PlusIcon size={10} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VIEW HEADER ───
export function ViewHeader({ eyebrow, title, description, actions }: {
  eyebrow: string; title: string; description?: string; actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-8 px-10 pt-10 pb-8">
      <div className="max-w-2xl">
        <div className="label-mono mb-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7C8CFF] anim-pulse-soft" />
          {eyebrow}
        </div>
        <h1 className="text-[34px] leading-[1.05] font-medium tracking-tight text-white">{title}</h1>
        {description && <p className="mt-3 text-[14px] leading-relaxed text-muted max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 pt-1">{actions}</div>}
    </div>
  );
}
