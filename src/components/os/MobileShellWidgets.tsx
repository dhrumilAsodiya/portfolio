import { useMemo, useState } from 'react';
import {
  BatteryFull,
  Bell,
  Bluetooth,
  CloudSun,
  Moon,
  Plane,
  Power,
  RotateCcw,
  Search,
  Signal,
  Sun,
  Terminal as TerminalIcon,
  Volume2,
  Wifi,
  X,
} from 'lucide-react';
import { AppType } from '@/src/os/useOSStore';
import { FolderNode } from '@/src/os/vfs';

export type MobileTileIconKey =
  | 'explorer'
  | 'projects'
  | 'terminal'
  | 'tetris'
  | '2048'
  | 'about'
  | 'settings'
  | 'finanger'
  | 'vm'
  | 'skills'
  | 'resume';

export interface MobileAppTile {
  id: string;
  label: string;
  sublabel: string;
  appType: AppType;
  filePath?: string;
  title?: string;
  icon: MobileTileIconKey;
}

export function MobileAppIconBadge({
  icon,
  os,
  size = 'md',
}: {
  icon: MobileTileIconKey;
  os: 'android' | 'ios';
  size?: 'sm' | 'md';
}) {
  const isIOS = os === 'ios';
  const dim = size === 'sm' ? 'size-[50px]' : 'size-[54px]';

  if (isIOS) {
    // True 1:1 iOS 18 Squircle Icons (Apple continuous corner radius + native artwork)
    const radius = 'rounded-[13px] shadow-[0_6px_16px_rgba(0,0,0,0.35)] overflow-hidden';

    if (icon === 'explorer') {
      // Apple Files icon: crisp white background with Apple blue folder
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-white transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 36 36" className="size-9" aria-hidden="true">
            <path
              d="M4 10.5C4 9.12 5.12 8 6.5 8h6.7l2.2 2.4H29.5C30.88 10.4 32 11.52 32 12.9V26.5C32 27.88 30.88 29 29.5 29H6.5C5.12 29 4 27.88 4 26.5V10.5z"
              fill="#60a5fa"
            />
            <path
              d="M4 13.5h28v13c0 1.38-1.12 2.5-2.5 2.5h-23C5.12 29 4 27.88 4 26.5v-13z"
              fill="#007aff"
            />
          </svg>
        </div>
      );
    }

    if (icon === 'projects') {
      // Apple Xcode / Blueprint blue app icon
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-b from-[#38bdf8] to-[#007aff] transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 36 36" className="size-8" aria-hidden="true">
            <rect x="6" y="7" width="24" height="22" rx="4" fill="none" stroke="#fff" strokeWidth="2.2" />
            <path d="M14 14l-4 4 4 4M22 14l4 4-4 4M19.5 13l-3 10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      );
    }

    if (icon === 'settings') {
      // Apple Settings metallic gears icon
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-b from-[#d4d4d8] to-[#71717a] transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 36 36" className="size-9" aria-hidden="true">
            <circle cx="18" cy="18" r="10.5" fill="#27272a" stroke="#e4e4e7" strokeWidth="2.6" strokeDasharray="3.8 2.2" />
            <circle cx="18" cy="18" r="5.5" fill="#a1a1aa" />
            <circle cx="18" cy="18" r="2.2" fill="#18181b" />
          </svg>
        </div>
      );
    }

    if (icon === 'about') {
      // Apple Contacts / Developer Card icon
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-b from-[#6366f1] to-[#3b82f6] transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 36 36" className="size-8" aria-hidden="true">
            <circle cx="18" cy="13.5" r="4.8" fill="#fff" />
            <path d="M9.5 27.5c1.5-4.4 4.8-6.5 8.5-6.5s7 2.1 8.5 6.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    if (icon === 'skills' || icon === 'resume') {
      // Apple Notes yellow top bar + lined paper
      return (
        <div
          className={`flex ${dim} ${radius} flex-col bg-[#fefefe] transition-transform duration-150 group-active:scale-90`}
        >
          <div className="h-3.5 w-full bg-gradient-to-b from-[#facc15] to-[#eab308]" />
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-2.5">
            <span className="h-[1.5px] w-full rounded bg-slate-300" />
            <span className="h-[1.5px] w-4/5 rounded bg-slate-300" />
            <span className="h-[1.5px] w-3/5 rounded bg-slate-300" />
          </div>
        </div>
      );
    }

    if (icon === 'terminal') {
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center border border-white/15 bg-gradient-to-b from-[#2c2c30] to-[#111114] transition-transform duration-150 group-active:scale-90`}
        >
          <span className="font-mono text-base font-bold text-[#34d399]">&gt;_</span>
        </div>
      );
    }

    if (icon === '2048') {
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-br from-[#fbbf24] via-[#f97316] to-[#ea580c] text-white transition-transform duration-150 group-active:scale-90`}
        >
          <span className="font-mono text-[15px] font-black tracking-tighter drop-shadow">
            2048
          </span>
        </div>
      );
    }

    if (icon === 'tetris') {
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-br from-[#4f46e5] to-[#9333ea] transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
            <rect x="7" y="9" width="5.5" height="5.5" rx="1.2" fill="#38bdf8" />
            <rect x="13.2" y="9" width="5.5" height="5.5" rx="1.2" fill="#38bdf8" />
            <rect x="13.2" y="15.2" width="5.5" height="5.5" rx="1.2" fill="#facc15" />
            <rect x="19.4" y="15.2" width="5.5" height="5.5" rx="1.2" fill="#fb7185" />
          </svg>
        </div>
      );
    }

    if (icon === 'finanger') {
      // Apple Stocks/Finance green card
      return (
        <div
          className={`grid ${dim} ${radius} place-items-center bg-gradient-to-b from-[#166534] to-[#052e16] transition-transform duration-150 group-active:scale-90`}
        >
          <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
            <path d="M5 22l6.5-6 4.5 3.5L26 10" fill="none" stroke="#4ade80" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="10" r="2.2" fill="#bbf7d0" />
          </svg>
        </div>
      );
    }

    // 32-bit VM
    return (
      <div
        className={`grid ${dim} ${radius} place-items-center bg-gradient-to-br from-[#1e293b] to-[#0f172a] transition-transform duration-150 group-active:scale-90`}
      >
        <span className="font-mono text-xs font-bold text-sky-300">CPU32</span>
      </div>
    );
  }

  // Android 15 Material You Adaptive Tinted Circular Icons
  const circle =
    'rounded-full bg-[#1a2923]/92 border border-[#a8f0c6]/20 text-[#b7f3ce] shadow-[0_4px_12px_rgba(0,0,0,0.35)]';

  const renderAndroidGlyph = () => {
    switch (icon) {
      case 'explorer':
        return (
          <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
            <path d="M4 6a2 2 0 0 1 2-2h4.2l1.8 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
          </svg>
        );
      case 'projects':
        return (
          <svg viewBox="0 0 24 24" className="size-6 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
            <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'terminal':
        return <span className="font-mono text-sm font-bold">&gt;_</span>;
      case '2048':
        return <span className="font-mono text-xs font-black tracking-tighter">2048</span>;
      case 'tetris':
        return (
          <svg viewBox="0 0 24 24" className="size-5.5 fill-current" aria-hidden="true">
            <rect x="4" y="6" width="5" height="5" rx="1" />
            <rect x="9.5" y="6" width="5" height="5" rx="1" />
            <rect x="9.5" y="11.5" width="5" height="5" rx="1" />
            <rect x="15" y="11.5" width="5" height="5" rx="1" />
          </svg>
        );
      case 'finanger':
        return (
          <svg viewBox="0 0 24 24" className="size-6 stroke-current" fill="none" strokeWidth="2.1" aria-hidden="true">
            <path d="M4 17l5-5 4 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'vm':
        return <span className="font-mono text-[11px] font-bold">VM32</span>;
      case 'skills':
      case 'resume':
        return (
          <svg viewBox="0 0 24 24" className="size-5.5 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
            <path d="M7 4h7l4 4v12H7V4z" strokeLinejoin="round" />
            <path d="M10 12h4M10 16h3" strokeLinecap="round" />
          </svg>
        );
      case 'settings':
        return (
          <svg viewBox="0 0 24 24" className="size-5.5 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3.2" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="size-5.5 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="8.5" r="3.5" />
            <path d="M6 19.5c1.4-2.8 3.6-4 6-4s4.6 1.2 6 4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`grid ${dim} ${circle} place-items-center transition-transform duration-150 group-active:scale-90`}
    >
      {renderAndroidGlyph()}
    </div>
  );
}

function collectVfsFiles(
  node: FolderNode,
  prefix = ''
): { name: string; path: string }[] {
  const results: { name: string; path: string }[] = [];
  for (const child of Object.values(node.children)) {
    const fullPath = `${prefix}/${child.name}`;
    if (child.type === 'file') {
      results.push({ name: child.name, path: fullPath });
    } else {
      results.push(...collectVfsFiles(child, fullPath));
    }
  }
  return results;
}

export function MobileHomeWidgets({
  isIOS,
  now,
  onLaunchProjects,
  onLaunch2048,
}: {
  isIOS: boolean;
  now: Date;
  onLaunchProjects: () => void;
  onLaunch2048: () => void;
}) {
  const weekdayShort = now
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
  const weekdayLong = now.toLocaleDateString('en-US', { weekday: 'long' });
  const monthShort = now
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const dayNum = now.getDate();
  const hourStr = String(now.getHours() % 12 || 12).padStart(2, '0');
  const minStr = String(now.getMinutes()).padStart(2, '0');

  if (isIOS) {
    return (
      <div className="grid grid-cols-2 gap-3.5">
        {/* Authentic Apple Weather 2x2 Widget */}
        <div className="flex aspect-[1.06/1] flex-col justify-between rounded-[24px] bg-gradient-to-b from-[#2c6cc9]/90 via-[#3b82d6]/88 to-[#5aa3e8]/85 p-3.5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
          <div>
            <p className="text-[11px] font-semibold leading-tight">Ahmedabad</p>
            <p className="mt-0.5 text-[34px] font-light leading-none tracking-tight tabular-nums">
              24°
            </p>
          </div>
          <div>
            <CloudSun className="size-4 text-amber-200" />
            <p className="mt-0.5 text-[11px] font-medium leading-tight">Mostly Sunny</p>
            <p className="text-[10px] text-white/85">H:28° L:19°</p>
          </div>
        </div>

        {/* Authentic Apple Calendar + Quick Launch Stack Widget */}
        <div className="flex aspect-[1.06/1] flex-col justify-between rounded-[24px] bg-white/95 p-3.5 text-slate-900 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wide text-[#ff3b30]">
                {weekdayShort} · {monthShort}
              </p>
              <p className="text-[32px] font-semibold leading-none tracking-tight tabular-nums">
                {dayNum}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              {weekdayLong.slice(0, 3)}
            </span>
          </div>

          <div className="space-y-1">
            <p className="truncate text-[10px] font-semibold text-slate-700">
              Dhrumil Asodiya
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={onLaunch2048}
                className="flex-1 cursor-pointer rounded-lg bg-[#ff9500] py-1 text-[10px] font-bold text-white"
              >
                2048
              </button>
              <button
                type="button"
                onClick={onLaunchProjects}
                className="flex-1 cursor-pointer rounded-lg bg-[#007aff] py-1 text-[10px] font-bold text-white"
              >
                Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android 15 Pixel "At a Glance" + Material You Stacked Digital Clock Widget
  return (
    <div className="space-y-4">
      {/* Unboxed Pixel At a Glance */}
      <div className="flex items-start justify-between px-1">
        <div>
          <p className="text-[19px] font-normal tracking-tight text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
            {dateString}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-white/90">
            <Sun className="size-3.5 text-amber-300" />
            <span>24°C</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onLaunch2048}
          className="cursor-pointer rounded-full bg-[#a8f0c6] px-3 py-1 text-[11px] font-semibold text-[#062e18] shadow hover:brightness-105"
        >
          Play 2048
        </button>
      </div>

      {/* Pixel Material You Scalloped Pill Clock + Portfolio Chip */}
      <div className="flex items-center gap-3">
        <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-[32px] bg-[#1e352c]/88 text-[#b7f3ce] shadow-lg backdrop-blur-md">
          <span className="text-[32px] font-medium leading-none tracking-tight tabular-nums">
            {hourStr}
          </span>
          <span className="text-[32px] font-medium leading-none tracking-tight text-[#82f0b5] tabular-nums">
            {minStr}
          </span>
        </div>

        <div className="flex h-28 flex-1 flex-col justify-between rounded-[28px] bg-[#182822]/85 p-3.5 text-white shadow-lg backdrop-blur-md">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#82f0b5]">
              Android 15 · Pixel
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight">
              Dhrumil Asodiya
            </p>
            <p className="text-[11px] text-white/70">Java · Spring Boot · VM</p>
          </div>
          <button
            type="button"
            onClick={onLaunchProjects}
            className="w-fit cursor-pointer rounded-full bg-white/12 px-3 py-1 text-[10px] font-medium text-[#b7f3ce] hover:bg-white/20"
          >
            Open /projects
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileSearchOverlay({
  isIOS,
  tiles,
  vfs,
  onLaunchTile,
  onLaunchFile,
  onClose,
}: {
  isIOS: boolean;
  tiles: MobileAppTile[];
  vfs: FolderNode;
  onLaunchTile: (tile: MobileAppTile) => void;
  onLaunchFile: (name: string, path: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const files = useMemo(() => collectVfsFiles(vfs), [vfs]);
  const q = query.trim().toLowerCase();

  const matchedTiles = useMemo(
    () =>
      tiles.filter(
        (t) =>
          t.label.toLowerCase().includes(q) || t.sublabel.toLowerCase().includes(q)
      ),
    [tiles, q]
  );

  const matchedFiles = useMemo(
    () =>
      files.filter(
        (f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
      ),
    [files, q]
  );

  return (
    <div
      role="dialog"
      aria-label={isIOS ? 'iOS Spotlight Search' : 'Pixel App Search'}
      onClick={onClose}
      className="absolute inset-0 z-[965] flex flex-col bg-black/78 px-4 pt-14 pb-6 text-white backdrop-blur-2xl"
    >
      <div onClick={(e) => e.stopPropagation()} className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2.5 ${
            isIOS ? 'rounded-2xl bg-white/15' : 'rounded-full bg-[#1e2a24]'
          }`}
        >
          <Search className="size-4 shrink-0 text-white/75" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isIOS ? 'Spotlight Search' : 'Search apps & VFS files...'}
            aria-label="Search mobile apps and files"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full bg-white/15 hover:bg-white/25"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto pr-1">
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/55">
              Applications
            </p>
            <div className="grid grid-cols-4 gap-3">
              {matchedTiles.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => {
                    onLaunchTile(tile);
                    onClose();
                  }}
                  className="group flex cursor-pointer flex-col items-center gap-1.5 text-center"
                >
                  <MobileAppIconBadge
                    icon={tile.icon}
                    os={isIOS ? 'ios' : 'android'}
                    size="sm"
                  />
                  <span className="line-clamp-1 text-[11px] font-medium">
                    {tile.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/55">
              Files (VFS)
            </p>
            <div className="space-y-1.5">
              {matchedFiles.slice(0, 6).map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => {
                    onLaunchFile(file.name, file.path);
                    onClose();
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white/[0.08] px-3.5 py-2.5 text-left text-xs hover:bg-white/14"
                >
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="ml-2 font-mono text-[10px] text-white/55">
                    {file.path}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface MobileQuickPanelProps {
  isIOS: boolean;
  wifiEnabled: boolean;
  setWifiEnabled: (v: boolean) => void;
  bluetoothEnabled: boolean;
  setBluetoothEnabled: (v: boolean) => void;
  airplaneMode: boolean;
  setAirplaneMode: (v: boolean) => void;
  nightLight: boolean;
  setNightLight: (v: boolean) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  onLaunch2048: () => void;
  onLaunchTerminal: () => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
  onClose: () => void;
}

export function MobileQuickPanel({
  isIOS,
  wifiEnabled,
  setWifiEnabled,
  bluetoothEnabled,
  setBluetoothEnabled,
  airplaneMode,
  setAirplaneMode,
  nightLight,
  setNightLight,
  brightness,
  setBrightness,
  volume,
  setVolume,
  onLaunch2048,
  onLaunchTerminal,
  onRebootToGrub,
  onShutdown,
  onClose,
}: MobileQuickPanelProps) {
  const [notifCleared, setNotifCleared] = useState(false);

  if (isIOS) {
    // 1:1 iOS 18 Control Center (circular buttons + 2x2 Connectivity + Tall Vertical Capsule Sliders)
    return (
      <div
        role="dialog"
        aria-label="iOS 18 Control Center"
        onClick={onClose}
        className="absolute inset-0 z-[970] flex flex-col justify-between bg-black/74 px-5 pt-12 pb-6 text-white backdrop-blur-3xl"
      >
        <div onClick={(e) => e.stopPropagation()} className="space-y-4">
          {/* Top Bar: Battery + Circular Power Button */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-medium">
              <BatteryFull className="size-4 text-emerald-400" />
              <span>98%</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRebootToGrub}
                title="Switch OS (GRUB)"
                aria-label="Switch OS via GRUB"
                className="grid size-9 cursor-pointer place-items-center rounded-full bg-white/14 hover:bg-white/25"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={onShutdown}
                title="Power Off"
                aria-label="Power Off to Portfolio"
                className="grid size-9 cursor-pointer place-items-center rounded-full bg-red-600 text-white hover:bg-red-500"
              >
                <Power className="size-4" />
              </button>
            </div>
          </div>

          {/* Bento Row 1: 2x2 Connectivity + Now Playing */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-2.5 rounded-[28px] bg-white/14 p-3">
              <button
                type="button"
                aria-label="Airplane Mode"
                onClick={() => setAirplaneMode(!airplaneMode)}
                className={`grid cursor-pointer place-items-center rounded-full transition-colors ${
                  airplaneMode ? 'bg-[#ff9500] text-white' : 'bg-white/16 text-white'
                }`}
              >
                <Plane className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Cellular"
                onClick={() => setAirplaneMode(false)}
                className={`grid cursor-pointer place-items-center rounded-full transition-colors ${
                  !airplaneMode ? 'bg-[#34c759] text-white' : 'bg-white/16 text-white/60'
                }`}
              >
                <Signal className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Wi-Fi"
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className={`grid cursor-pointer place-items-center rounded-full transition-colors ${
                  wifiEnabled && !airplaneMode ? 'bg-[#0a84ff] text-white' : 'bg-white/16 text-white/60'
                }`}
              >
                <Wifi className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Bluetooth"
                onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                className={`grid cursor-pointer place-items-center rounded-full transition-colors ${
                  bluetoothEnabled && !airplaneMode ? 'bg-[#0a84ff] text-white' : 'bg-white/16 text-white/60'
                }`}
              >
                <Bluetooth className="size-5" />
              </button>
            </div>

            <div className="flex aspect-square flex-col justify-between rounded-[28px] bg-white/14 p-3.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Trinity OS
                </p>
                <p className="mt-1 text-xs font-semibold">iOS 18 Ready</p>
                <p className="text-[10px] text-white/65">Stateful VFS RW</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunch2048();
                }}
                className="w-full cursor-pointer rounded-2xl bg-[#ff9500] py-2 text-xs font-bold text-white"
              >
                Play 2048
              </button>
            </div>
          </div>

          {/* Bento Row 2: Toggles on Left + Tall iOS Capsule Sliders on Right */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNightLight(!nightLight)}
                className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[22px] text-[10px] font-medium transition-colors ${
                  nightLight ? 'bg-amber-400 text-slate-950' : 'bg-white/14 text-white'
                }`}
              >
                <Moon className="size-5" />
                <span>Night</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchTerminal();
                }}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[22px] bg-white/14 text-[10px] font-medium text-white hover:bg-white/22"
              >
                <TerminalIcon className="size-5" />
                <span>CLI</span>
              </button>

              <button
                type="button"
                onClick={onRebootToGrub}
                className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-[22px] bg-white/14 py-3 text-xs font-medium hover:bg-white/22"
              >
                <RotateCcw className="size-4" />
                <span>GRUB Boot</span>
              </button>
            </div>

            {/* Authentic iOS Brightness & Volume Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-between rounded-[24px] bg-white/14 p-2.5">
                <span className="text-[10px] font-mono text-white/70 tabular-nums">
                  {brightness}%
                </span>
                <input
                  type="range"
                  min={55}
                  max={105}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  aria-label="Screen brightness"
                  className="h-16 w-12 -rotate-90 cursor-pointer accent-white"
                />
                <Sun className="size-4 text-white" />
              </div>

              <div className="flex flex-col items-center justify-between rounded-[24px] bg-white/14 p-2.5">
                <span className="text-[10px] font-mono text-white/70 tabular-nums">
                  {volume}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="System volume"
                  className="h-16 w-12 -rotate-90 cursor-pointer accent-white"
                />
                <Volume2 className="size-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mx-auto cursor-pointer rounded-full bg-white/14 px-5 py-1.5 text-xs font-medium hover:bg-white/24"
        >
          Close Control Center
        </button>
      </div>
    );
  }

  // 1:1 Android 15 Pixel Quick Settings Shade (AMOLED #0e1110 + Pill Brightness + 2x3 Pill Tiles)
  return (
    <div
      role="dialog"
      aria-label="Android 15 Quick Settings"
      onClick={onClose}
      className="absolute inset-0 z-[970] flex flex-col justify-between bg-[#0b0e0d]/96 px-4 pt-11 pb-5 text-white backdrop-blur-2xl"
    >
      <div onClick={(e) => e.stopPropagation()} className="space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-medium text-white/80">Trinity-5G · 98%</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quick Settings"
            className="grid size-7 cursor-pointer place-items-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Material You Thick Pill Brightness Slider */}
        <label className="flex items-center gap-3 rounded-full bg-[#1a221e] px-4 py-3 text-xs">
          <Sun className="size-4 shrink-0 text-[#a8f0c6]" />
          <input
            type="range"
            min={55}
            max={105}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            aria-label="Display brightness"
            className="h-2 flex-1 cursor-pointer accent-[#a8f0c6]"
          />
          <span className="font-mono text-[10px] text-white/70 tabular-nums">
            {brightness}%
          </span>
        </label>

        {/* Material You 2x3 Large Rounded Pill Quick Tiles */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className={`flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-3.5 text-left transition-colors ${
              wifiEnabled && !airplaneMode
                ? 'bg-[#a8f0c6] text-[#052e16]'
                : 'bg-[#1a221e] text-white/90'
            }`}
          >
            <Wifi className="size-4.5 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold">Internet</p>
              <p className="truncate text-[10px] opacity-80">
                {wifiEnabled && !airplaneMode ? 'Trinity-5G' : 'Off'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className={`flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-3.5 text-left transition-colors ${
              bluetoothEnabled && !airplaneMode
                ? 'bg-[#a8f0c6] text-[#052e16]'
                : 'bg-[#1a221e] text-white/90'
            }`}
          >
            <Bluetooth className="size-4.5 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold">Bluetooth</p>
              <p className="text-[10px] opacity-80">
                {bluetoothEnabled && !airplaneMode ? 'On' : 'Off'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setNightLight(!nightLight)}
            className={`flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-3.5 text-left transition-colors ${
              nightLight
                ? 'bg-[#a8f0c6] text-[#052e16]'
                : 'bg-[#1a221e] text-white/90'
            }`}
          >
            <Moon className="size-4.5 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold">Night Light</p>
              <p className="text-[10px] opacity-80">{nightLight ? 'Active' : 'Off'}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAirplaneMode(!airplaneMode)}
            className={`flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-3.5 text-left transition-colors ${
              airplaneMode
                ? 'bg-[#a8f0c6] text-[#052e16]'
                : 'bg-[#1a221e] text-white/90'
            }`}
          >
            <Plane className="size-4.5 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold">Airplane</p>
              <p className="text-[10px] opacity-80">{airplaneMode ? 'On' : 'Off'}</p>
            </div>
          </button>
        </div>

        {/* Volume Slider */}
        <label className="flex items-center gap-3 rounded-full bg-[#1a221e] px-4 py-2.5 text-xs">
          <Volume2 className="size-4 shrink-0 text-white/80" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Media volume"
            className="h-1.5 flex-1 cursor-pointer accent-[#a8f0c6]"
          />
          <span className="font-mono text-[10px] text-white/70 tabular-nums">
            {volume}%
          </span>
        </label>

        {/* Notifications */}
        <div className="rounded-[24px] bg-[#171c1a] p-3.5 text-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-white/90">
              <Bell className="size-3.5 text-[#a8f0c6]" />
              <span>Notifications</span>
            </span>
            {!notifCleared && (
              <button
                type="button"
                onClick={() => setNotifCleared(true)}
                className="cursor-pointer rounded-full bg-white/10 px-2.5 py-0.5 text-[10px]"
              >
                Clear all
              </button>
            )}
          </div>
          {notifCleared ? (
            <p className="py-2 text-center text-[11px] text-white/50">
              No notifications
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunch2048();
              }}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white/[0.06] p-2.5 text-left hover:bg-white/12"
            >
              <div>
                <p className="font-semibold text-white">2048 Mobile Ready</p>
                <p className="text-[10px] text-white/65">
                  Tap to play swipe puzzle full-screen
                </p>
              </div>
              <span className="rounded-lg bg-[#a8f0c6] px-2 py-1 font-mono text-[10px] font-bold text-[#052e16]">
                OPEN
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Power & GRUB Footer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between pt-2"
      >
        <button
          type="button"
          onClick={onRebootToGrub}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#1a221e] px-4 py-2.5 text-xs font-medium hover:bg-white/15"
        >
          <RotateCcw className="size-3.5" />
          <span>GRUB Boot</span>
        </button>
        <button
          type="button"
          onClick={onShutdown}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-red-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-red-500"
        >
          <Power className="size-3.5" />
          <span>Power off</span>
        </button>
      </div>
    </div>
  );
}
