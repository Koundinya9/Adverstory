const Icon = ({ d, size = 18, stroke = 1.5, className = "", children }: {
  d?: string; size?: number; stroke?: number; className?: string; children?: React.ReactNode;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d ? <path d={d} /> : children}
  </svg>
);

type IconProps = { size?: number; className?: string; stroke?: number };

export const LogoIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
    <path d="M4 19 L12 4 L20 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 13 H16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="12" cy="4" r="1.4" fill="#7C8CFF" />
  </svg>
);

export const ContextIcon   = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></Icon>;
export const StoryboardIcon = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="9" rx="1.5"/><path d="M14 17h7"/></Icon>;
export const WorkspaceIcon  = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 20h8M12 17v3"/></Icon>;
export const SparkleIcon    = (p: IconProps) => <Icon {...p}><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/><path d="M19 3v3M20.5 4.5h-3M5 17v3M6.5 18.5h-3"/></Icon>;
export const ImageIcon      = (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-4 4 3 3-2 6 4"/></Icon>;
export const VideoIcon      = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 9l4-2v10l-4-2z"/></Icon>;
export const PlusIcon       = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
export const CheckIcon      = (p: IconProps) => <Icon {...p}><path d="M4 12l5 5 11-12"/></Icon>;
export const ChevronDownIcon = (p: IconProps) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
export const CloseIcon      = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
export const DownloadIcon   = (p: IconProps) => <Icon {...p}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></Icon>;
export const RefreshIcon    = (p: IconProps) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/></Icon>;
export const WandIcon       = (p: IconProps) => <Icon {...p}><path d="M14 4l2 2-9 9-2 .5.5-2zM16 6l3-3M19 9l3-3M4 20l1-1"/></Icon>;
export const SettingsIcon   = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="2.5"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"/></Icon>;
export const HistoryIcon    = (p: IconProps) => <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/></Icon>;
export const HeartIcon      = (p: IconProps) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></Icon>;
export const TagIcon        = (p: IconProps) => <Icon {...p}><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1"/></Icon>;

export const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin-slow 0.9s linear infinite' }}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2"/>
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
