import { useMemo, useState } from 'react';
import {
  Bell,
  Bluetooth,
  CloudSun,
  FilePlus2,
  FolderPlus,
  Moon,
  Plane,
  Power,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Terminal as TerminalIcon,
  Volume2,
  Wifi,
} from 'lucide-react';
import { AppType, OSWindow, useOSStore } from '@/src/os/useOSStore';
import { FolderNode } from '@/src/os/vfs';

export interface MacAppItem {
  id: string;
  appType: AppType;
  label: string;
  options?: { title?: string; filePath?: string };
}

export type MacFlyout =
  | 'apple'
  | 'file'
  | 'edit'
  | 'go'
  | 'window'
  | 'control-center'
  | 'notifications'
  | 'spotlight'
  | 'launchpad'
  | null;

export function MacAppIcon({
  appType,
  idHint,
  className = 'size-7',
}: {
  appType: AppType | 'launchpad' | 'trash';
  idHint?: string;
  className?: string;
}) {
  if (appType === 'launchpad') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="#e2e8f0" />
        <rect x="7" y="7" width="5" height="5" rx="1.4" fill="#ef4444" />
        <rect x="13.5" y="7" width="5" height="5" rx="1.4" fill="#f59e0b" />
        <rect x="20" y="7" width="5" height="5" rx="1.4" fill="#10b981" />
        <rect x="7" y="13.5" width="5" height="5" rx="1.4" fill="#3b82f6" />
        <rect x="13.5" y="13.5" width="5" height="5" rx="1.4" fill="#8b5cf6" />
        <rect x="20" y="13.5" width="5" height="5" rx="1.4" fill="#ec4899" />
        <rect x="7" y="20" width="5" height="5" rx="1.4" fill="#06b6d4" />
        <rect x="13.5" y="20" width="5" height="5" rx="1.4" fill="#64748b" />
        <rect x="20" y="20" width="5" height="5" rx="1.4" fill="#0f172a" />
      </svg>
    );
  }

  if (appType === 'trash') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="7" y="8" width="18" height="20" rx="3" fill="#cbd5e1" opacity="0.9" />
        <rect x="5.5" y="6.5" width="21" height="3" rx="1.5" fill="#94a3b8" />
        <path
          d="M11.5 12v11M16 12v11M20.5 12v11"
          stroke="#475569"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (appType === 'explorer') {
    if (idHint === 'projects') {
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path
            d="M3 8.5C3 7.12 4.12 6 5.5 6h6.2l2 2.2H26.5C27.88 8.2 29 9.32 29 10.7V23.5C29 24.88 27.88 26 26.5 26H5.5C4.12 26 3 24.88 3 23.5V8.5z"
            fill="#60a5fa"
          />
          <path
            d="M3 11.5h26v12c0 1.38-1.12 2.5-2.5 2.5h-21C4.12 26 3 24.88 3 23.5v-12z"
            fill="#3b82f6"
          />
          <path
            d="M12.5 16.5l-2.6 2.5 2.6 2.5M19.5 16.5l2.6 2.5-2.6 2.5"
            stroke="#eff6ff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    }

    // Authentic Finder two-tone smiling face squircle
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="macFinderBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="url(#macFinderBlue)" />
        <path
          d="M16.8 2.5H22.5C26.36 2.5 29.5 5.64 29.5 9.5v13c0 3.86-3.14 7-7 7h-5.2c-1.8-5.5-2.1-13-0.5-27z"
          fill="#e2e8f0"
        />
        <rect x="10.2" y="10.5" width="2" height="3.8" rx="1" fill="#0f172a" />
        <rect x="19.8" y="10.5" width="2" height="3.8" rx="1" fill="#0f172a" />
        <path
          d="M9.5 19.5c2 2.5 4.4 3.4 6.5 3.4s4.5-.9 6.5-3.4"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (appType === 'terminal') {
    return (
      <div
        className={`grid place-items-center rounded-[22%] border border-white/25 bg-gradient-to-b from-[#2b2b32] to-[#121216] shadow-md ${className}`}
      >
        <span className="font-mono text-[11px] font-bold leading-none text-white">
          &gt;_
        </span>
      </div>
    );
  }

  if (appType === 'memory-match') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="macMemGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="url(#macMemGrad)" />
        <rect x="7" y="8" width="9" height="12" rx="2" fill="#f8fafc" opacity="0.92" />
        <rect x="16" y="12" width="9" height="12" rx="2" fill="#fde047" />
        <circle cx="20.5" cy="18" r="2" fill="#4f46e5" />
      </svg>
    );
  }

  if (appType === 'tetris') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="#1e1b4b" />
        <rect x="7.5" y="9" width="5.2" height="5.2" rx="1.2" fill="#38bdf8" />
        <rect x="13.4" y="9" width="5.2" height="5.2" rx="1.2" fill="#38bdf8" />
        <rect x="13.4" y="15" width="5.2" height="5.2" rx="1.2" fill="#c084fc" />
        <rect x="19.3" y="15" width="5.2" height="5.2" rx="1.2" fill="#fb7185" />
      </svg>
    );
  }

  if (appType === 'about') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="#475569" />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke="#e2e8f0" strokeWidth="2.4" strokeDasharray="3.2 2" />
        <circle cx="16" cy="16" r="4.5" fill="#94a3b8" />
        <circle cx="16" cy="16" r="2" fill="#0f172a" />
      </svg>
    );
  }

  // Document / Preview sheet
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="5" y="3.5" width="22" height="25" rx="4" fill="#f8fafc" />
      <rect x="9" y="9.5" width="14" height="2" rx="1" fill="#3b82f6" />
      <rect x="9" y="14" width="12" height="1.8" rx="0.9" fill="#64748b" />
      <rect x="9" y="18" width="10" height="1.8" rx="0.9" fill="#94a3b8" />
    </svg>
  );
}

function collectVfsFiles(
  node: FolderNode,
  prefix = ''
): { name: string; path: string; updatedAt: string }[] {
  const results: { name: string; path: string; updatedAt: string }[] = [];
  for (const child of Object.values(node.children)) {
    const fullPath = `${prefix}/${child.name}`;
    if (child.type === 'file') {
      results.push({ name: child.name, path: fullPath, updatedAt: child.updatedAt });
    } else {
      results.push(...collectVfsFiles(child, fullPath));
    }
  }
  return results;
}

export interface MacMenuBarProps {
  activeAppName: string;
  clockTime: string;
  activeFlyout: MacFlyout;
  wifiEnabled: boolean;
  airplaneMode: boolean;
  onToggleFlyout: (target: Exclude<MacFlyout, null>) => void;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onCreateNewFolder: () => void;
  onZoomActive: () => void;
  onMinimizeActive: () => void;
  onCloseActive: () => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
}

export function MacMenuBar({
  activeAppName,
  clockTime,
  activeFlyout,
  wifiEnabled,
  airplaneMode,
  onToggleFlyout,
  onOpenApp,
  onCreateNewFolder,
  onZoomActive,
  onMinimizeActive,
  onCloseActive,
  onRebootToGrub,
  onShutdown,
}: MacMenuBarProps) {
  return (
    <header
      onClick={(e) => e.stopPropagation()}
      className="relative z-[950] flex h-7 w-full shrink-0 items-center justify-between border-b border-white/14 bg-black/48 px-3 text-xs text-white backdrop-blur-2xl select-none"
    >
      {/* Left: Apple Logo + Active App + Menu Items */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Apple Menu */}
        <div className="relative">
          <button
            type="button"
            aria-label="Apple system menu"
            onClick={() => onToggleFlyout('apple')}
            className={`flex h-5 cursor-pointer items-center rounded px-2 transition-colors hover:bg-white/15 ${
              activeFlyout === 'apple' ? 'bg-white/22' : ''
            }`}
          >
            <svg viewBox="0 0 14 17" className="size-3.5 fill-current" aria-hidden="true">
              <path d="M11.6 9.1c0-2 1.6-3 1.7-3.1-0.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.4 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.4-1.9.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.1zM9.6 3.1c.6-.7 1-1.7.8-2.6-.8 0-1.8.6-2.4 1.3-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.4-1.2z" />
            </svg>
          </button>

          {activeFlyout === 'apple' && (
            <div className="absolute top-6 left-0 z-[985] w-56 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs shadow-2xl backdrop-blur-3xl">
              <button
                type="button"
                onClick={() => onOpenApp('about')}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <span>About This Mac</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleFlyout('control-center')}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <span>System Settings...</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleFlyout('launchpad')}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <span>Launchpad</span>
              </button>
              <div className="my-1 border-t border-white/12" />
              <button
                type="button"
                onClick={onRebootToGrub}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <span>Restart to GRUB...</span>
              </button>
              <button
                type="button"
                onClick={onShutdown}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left text-red-300 hover:bg-red-600 hover:text-white"
              >
                <span>Shut Down...</span>
              </button>
            </div>
          )}
        </div>

        <span className="max-w-36 truncate font-semibold tracking-tight">
          {activeAppName}
        </span>

        {/* File / Edit / Go / Window Menus */}
        <div className="relative hidden items-center gap-0.5 sm:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => onToggleFlyout('file')}
              className={`cursor-pointer rounded px-2 py-0.5 hover:bg-white/15 ${
                activeFlyout === 'file' ? 'bg-white/20' : ''
              }`}
            >
              File
            </button>
            {activeFlyout === 'file' && (
              <div className="absolute top-6 left-0 z-[985] w-52 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs shadow-2xl backdrop-blur-3xl">
                <button
                  type="button"
                  onClick={() => onOpenApp('explorer')}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  New Finder Window
                </button>
                <button
                  type="button"
                  onClick={onCreateNewFolder}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  New Folder (VFS)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp('terminal')}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  New Terminal Shell
                </button>
                <div className="my-1 border-t border-white/12" />
                <button
                  type="button"
                  onClick={onCloseActive}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => onToggleFlyout('edit')}
              className={`cursor-pointer rounded px-2 py-0.5 hover:bg-white/15 ${
                activeFlyout === 'edit' ? 'bg-white/20' : ''
              }`}
            >
              Edit
            </button>
            {activeFlyout === 'edit' && (
              <div className="absolute top-6 left-0 z-[985] w-48 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs shadow-2xl backdrop-blur-3xl">
                <button
                  type="button"
                  onClick={() => onToggleFlyout('spotlight')}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Spotlight Find...
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp('memory-match')}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Launch Memory Match
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => onToggleFlyout('go')}
              className={`cursor-pointer rounded px-2 py-0.5 hover:bg-white/15 ${
                activeFlyout === 'go' ? 'bg-white/20' : ''
              }`}
            >
              Go
            </button>
            {activeFlyout === 'go' && (
              <div className="absolute top-6 left-0 z-[985] w-48 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs shadow-2xl backdrop-blur-3xl">
                <button
                  type="button"
                  onClick={() => onOpenApp('explorer', { title: 'Projects', filePath: '/projects' })}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Projects (/projects)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp('explorer', { title: 'Macintosh HD', filePath: '/' })}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Macintosh HD (/)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFlyout('launchpad')}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Applications
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => onToggleFlyout('window')}
              className={`cursor-pointer rounded px-2 py-0.5 hover:bg-white/15 ${
                activeFlyout === 'window' ? 'bg-white/20' : ''
              }`}
            >
              Window
            </button>
            {activeFlyout === 'window' && (
              <div className="absolute top-6 left-0 z-[985] w-48 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs shadow-2xl backdrop-blur-3xl">
                <button
                  type="button"
                  onClick={onMinimizeActive}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Minimize
                </button>
                <button
                  type="button"
                  onClick={onZoomActive}
                  className="w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                >
                  Zoom / Fill
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Wi-Fi, Spotlight, Control Center Icon, Clock (Notification Center) */}
      <div className="flex items-center gap-1 text-[11px]">
        <button
          type="button"
          aria-label="Wi-Fi status"
          onClick={() => onToggleFlyout('control-center')}
          className="grid h-5 w-7 cursor-pointer place-items-center rounded hover:bg-white/15"
        >
          {airplaneMode ? (
            <Plane className="size-3.5 text-amber-300" />
          ) : (
            <Wifi className={`size-3.5 ${wifiEnabled ? 'text-white' : 'text-white/40'}`} />
          )}
        </button>

        <button
          type="button"
          aria-label="Spotlight Search"
          title="Spotlight Search"
          onClick={() => onToggleFlyout('spotlight')}
          className={`grid h-5 w-7 cursor-pointer place-items-center rounded hover:bg-white/15 ${
            activeFlyout === 'spotlight' ? 'bg-white/22' : ''
          }`}
        >
          <Search className="size-3.5 text-white" />
        </button>

        <button
          type="button"
          aria-label="Control Center"
          title="Control Center"
          onClick={() => onToggleFlyout('control-center')}
          className={`grid h-5 w-7 cursor-pointer place-items-center rounded hover:bg-white/15 ${
            activeFlyout === 'control-center' ? 'bg-white/22' : ''
          }`}
        >
          {/* Authentic two-pill macOS Control Center glyph */}
          <svg viewBox="0 0 18 16" className="size-3.5 stroke-current" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="14" height="5" rx="2.5" strokeWidth="1.4" />
            <circle cx="11.5" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
            <rect x="2" y="9" width="14" height="5" rx="2.5" strokeWidth="1.4" />
            <circle cx="6.5" cy="11.5" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Notification Center"
          onClick={() => onToggleFlyout('notifications')}
          className={`h-5 cursor-pointer rounded px-2 font-medium whitespace-nowrap tabular-nums hover:bg-white/15 ${
            activeFlyout === 'notifications' ? 'bg-white/22' : ''
          }`}
        >
          {clockTime}
        </button>
      </div>
    </header>
  );
}

export interface MacControlCenterProps {
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
  onRebootToGrub: () => void;
  onShutdown: () => void;
}

export function MacControlCenter({
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
  onRebootToGrub,
  onShutdown,
}: MacControlCenterProps) {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div
      role="dialog"
      aria-label="macOS Control Center"
      onClick={(e) => e.stopPropagation()}
      className="fixed top-9 right-3 z-[985] w-[min(92vw,320px)] space-y-2.5 rounded-2xl border border-white/20 bg-[#1c1c24]/86 p-3 text-white shadow-[0_24px_70px_rgba(0,0,0,0.68)] backdrop-blur-3xl"
    >
      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Left Connectivity Module */}
        <div className="space-y-2 rounded-xl border border-white/12 bg-white/[0.08] p-2.5">
          <button
            type="button"
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className="flex w-full cursor-pointer items-center gap-2.5 text-left"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
                wifiEnabled && !airplaneMode ? 'bg-[#0a84ff] text-white' : 'bg-white/15 text-white/75'
              }`}
            >
              <Wifi className="size-3.5" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold">Wi-Fi</p>
              <p className="truncate text-[10px] text-white/65">
                {wifiEnabled && !airplaneMode ? 'Trinity-5G' : 'Off'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className="flex w-full cursor-pointer items-center gap-2.5 text-left"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
                bluetoothEnabled && !airplaneMode ? 'bg-[#0a84ff] text-white' : 'bg-white/15 text-white/75'
              }`}
            >
              <Bluetooth className="size-3.5" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold">Bluetooth</p>
              <p className="truncate text-[10px] text-white/65">
                {bluetoothEnabled && !airplaneMode ? 'On' : 'Off'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAirplaneMode(!airplaneMode)}
            className="flex w-full cursor-pointer items-center gap-2.5 text-left"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
                airplaneMode ? 'bg-amber-500 text-slate-950' : 'bg-white/15 text-white/75'
              }`}
            >
              <Plane className="size-3.5" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold">Airplane</p>
              <p className="truncate text-[10px] text-white/65">
                {airplaneMode ? 'On' : 'Off'}
              </p>
            </div>
          </button>
        </div>

        {/* Right Focus & Night Shift */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setFocusMode((f) => !f)}
            className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.08] p-2.5 text-left hover:bg-white/[0.12]"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full ${
                focusMode ? 'bg-[#5e5ce6] text-white' : 'bg-white/15 text-white/80'
              }`}
            >
              <Moon className="size-3.5" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold">Focus</p>
              <p className="text-[10px] text-white/65">{focusMode ? 'Do Not Disturb' : 'Off'}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setNightLight(!nightLight)}
            className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
              nightLight
                ? 'border-amber-400/40 bg-amber-500/20'
                : 'border-white/12 bg-white/[0.08] hover:bg-white/[0.12]'
            }`}
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full ${
                nightLight ? 'bg-amber-400 text-slate-950' : 'bg-white/15 text-white/80'
              }`}
            >
              <Sparkles className="size-3.5" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold">Night Shift</p>
              <p className="text-[10px] text-white/65">{nightLight ? 'Warm' : 'Off'}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Display Slider */}
      <div className="rounded-xl border border-white/12 bg-white/[0.08] px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="font-semibold">Display</span>
          <span className="font-mono text-[10px] text-white/65 tabular-nums">{brightness}%</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Sun className="size-3.5 shrink-0 text-white/80" />
          <input
            type="range"
            min={55}
            max={105}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            aria-label="Display brightness"
            className="h-1.5 flex-1 cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Sound Slider */}
      <div className="rounded-xl border border-white/12 bg-white/[0.08] px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="font-semibold">Sound</span>
          <span className="font-mono text-[10px] text-white/65 tabular-nums">{volume}%</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Volume2 className="size-3.5 shrink-0 text-white/80" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Sound volume"
            className="h-1.5 flex-1 cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Boot / Session Footer */}
      <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px]">
        <button
          type="button"
          onClick={onRebootToGrub}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 py-2 font-medium hover:bg-white/18"
        >
          <RotateCcw className="size-3.5" />
          <span>Switch OS (GRUB)</span>
        </button>
        <button
          type="button"
          onClick={onShutdown}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-400/35 bg-red-600/80 py-2 font-medium text-white hover:bg-red-500"
        >
          <Power className="size-3.5" />
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  );
}

export function MacNotificationCenter({ now }: { now: Date }) {
  const [cleared, setCleared] = useState(false);

  const monthShort = now
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
  const weekdayLong = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = now.getDate();

  return (
    <div
      role="dialog"
      aria-label="macOS Notification Center and Widgets"
      onClick={(e) => e.stopPropagation()}
      className="fixed top-9 right-3 bottom-20 z-[985] flex w-[min(92vw,320px)] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/20 bg-[#1c1c24]/82 p-3.5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.68)] backdrop-blur-3xl"
    >
      {/* Notifications */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <Bell className="size-3.5 text-[#60a5fa]" />
            <span>Notification Center</span>
          </span>
          {!cleared && (
            <button
              type="button"
              onClick={() => setCleared(true)}
              className="cursor-pointer rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] hover:bg-white/20"
            >
              Clear
            </button>
          )}
        </div>

        {cleared ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.05] py-5 text-center text-xs text-white/55">
            No Notifications
          </p>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="rounded-xl border border-white/15 bg-white/[0.09] p-3">
              <p className="font-semibold text-white">Memory Match Exclusive</p>
              <p className="mt-0.5 text-[11px] text-white/75">
                Flip 12 cards of Java, Spring Boot, Next.js, PostgreSQL, Docker &amp; Git in the Dock.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/[0.07] p-3">
              <p className="font-semibold text-white">macOS Sequoia · VFS Ready</p>
              <p className="mt-0.5 text-[11px] text-white/70">
                Use Spotlight or Finder to explore projects and notes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* macOS Widgets Bento */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/90 text-slate-900 shadow-lg">
          <div className="bg-[#ff3b30] px-3 py-1 text-[10px] font-bold tracking-wider text-white">
            {monthShort}
          </div>
          <div className="px-3 py-2.5">
            <p className="text-[10px] font-medium text-slate-500">{weekdayLong}</p>
            <p className="text-3xl font-bold leading-none tracking-tight tabular-nums">
              {dayNum}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/15 bg-gradient-to-b from-sky-500/80 to-blue-700/85 p-3 shadow-lg">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold text-white/90">Local</span>
            <CloudSun className="size-4 text-amber-200" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none tabular-nums">24°</p>
            <p className="mt-1 text-[10px] text-sky-100">Clear Sky</p>
          </div>
        </div>
      </div>

      {/* Developer Stack Widget */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-3 text-xs">
        <p className="font-semibold text-white">Dhrumil Asodiya</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/70">
          Java · Spring Boot · Next.js · PostgreSQL · Docker · 32-bit VM
        </p>
      </div>
    </div>
  );
}

export function MacSpotlightOverlay({
  apps,
  vfs,
  onOpenApp,
  onToggleNightLight,
  onRebootToGrub,
  onClose,
}: {
  apps: MacAppItem[];
  vfs: FolderNode;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onToggleNightLight: () => void;
  onRebootToGrub: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const vfsFiles = useMemo(() => collectVfsFiles(vfs), [vfs]);
  const q = query.trim().toLowerCase();

  const matchedApps = useMemo(
    () => apps.filter((a) => a.label.toLowerCase().includes(q)),
    [apps, q]
  );

  const matchedFiles = useMemo(
    () =>
      vfsFiles.filter(
        (f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
      ),
    [vfsFiles, q]
  );

  return (
    <div
      role="dialog"
      aria-label="macOS Spotlight Search"
      onClick={onClose}
      className="fixed inset-0 z-[985] flex items-start justify-center bg-black/25 px-4 pt-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/25 bg-[#1e1e26]/90 text-white shadow-[0_30px_90px_rgba(0,0,0,0.75)] backdrop-blur-3xl"
      >
        <div className="flex items-center gap-3 border-b border-white/12 px-4 py-3.5">
          <Search className="size-5 shrink-0 text-white/70" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (matchedApps.length > 0) {
                  const first = matchedApps[0];
                  onOpenApp(first.appType, first.options);
                  onClose();
                } else if (matchedFiles.length > 0) {
                  const firstFile = matchedFiles[0];
                  onOpenApp('project-viewer', { title: firstFile.name, filePath: firstFile.path });
                  onClose();
                }
              }
            }}
            placeholder="Spotlight Search — apps, projects, commands"
            aria-label="Spotlight Search"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2.5 text-xs">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Applications
          </p>
          {matchedApps.length === 0 ? (
            <p className="px-2 py-1.5 text-white/45">No matching apps</p>
          ) : (
            matchedApps.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onOpenApp(item.appType, item.options);
                  onClose();
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <MacAppIcon appType={item.appType} idHint={item.id} className="size-6 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))
          )}

          <p className="mt-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Documents (VFS)
          </p>
          {matchedFiles.length === 0 ? (
            <p className="px-2 py-1.5 text-white/45">No matching files</p>
          ) : (
            matchedFiles.slice(0, 5).map((file) => (
              <button
                key={file.path}
                type="button"
                onClick={() => {
                  onOpenApp('project-viewer', { title: file.name, filePath: file.path });
                  onClose();
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <MacAppIcon appType="project-viewer" className="size-5 shrink-0" />
                  <span className="truncate font-medium">{file.name}</span>
                </div>
                <span className="ml-2 font-mono text-[10px] opacity-70">{file.path}</span>
              </button>
            ))
          )}

          {!q && (
            <>
              <p className="mt-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                System Actions
              </p>
              <button
                type="button"
                onClick={() => {
                  onToggleNightLight();
                  onClose();
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <Sparkles className="size-4 text-amber-300" />
                <span>Toggle Night Shift</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onRebootToGrub();
                  onClose();
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[#0a84ff] hover:text-white"
              >
                <RotateCcw className="size-4" />
                <span>Switch OS via GRUB Bootloader</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MacLaunchpadOverlay({
  apps,
  onOpenApp,
  onRebootToGrub,
  onShutdown,
  onClose,
}: {
  apps: MacAppItem[];
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? apps.filter((a) => a.label.toLowerCase().includes(q)) : apps;
  }, [apps, query]);

  return (
    <div
      role="dialog"
      aria-label="macOS Launchpad"
      onClick={onClose}
      className="fixed inset-x-0 top-7 bottom-0 z-[940] flex flex-col items-center overflow-y-auto bg-black/48 px-6 py-10 text-white backdrop-blur-2xl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mb-10 flex w-full max-w-xs items-center gap-2 rounded-lg border border-white/20 bg-white/12 px-3 py-1.5"
      >
        <Search className="size-3.5 text-white/70" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Launchpad"
          aria-label="Search Launchpad"
          className="w-full bg-transparent text-xs text-white placeholder:text-white/55 outline-none"
        />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-3xl grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5"
      >
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onOpenApp(item.appType, item.options);
              onClose();
            }}
            className="flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl p-3 text-center transition-transform hover:scale-105 active:scale-95"
          >
            <MacAppIcon appType={item.appType} idHint={item.id} className="size-14 drop-shadow-xl" />
            <span className="text-xs font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
              {item.label}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            onRebootToGrub();
            onClose();
          }}
          className="flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl p-3 text-center transition-transform hover:scale-105 active:scale-95"
        >
          <span className="grid size-14 place-items-center rounded-[22%] border border-white/25 bg-slate-700/80 shadow-xl">
            <RotateCcw className="size-6 text-white" />
          </span>
          <span className="text-xs font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
            GRUB Boot
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onShutdown();
            onClose();
          }}
          className="flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl p-3 text-center transition-transform hover:scale-105 active:scale-95"
        >
          <span className="grid size-14 place-items-center rounded-[22%] border border-red-400/40 bg-red-600/85 shadow-xl">
            <Power className="size-6 text-white" />
          </span>
          <span className="text-xs font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
            Shut Down
          </span>
        </button>
      </div>
    </div>
  );
}

export function MacDesktopContextMenu({
  x,
  y,
  onClose,
  onOpenSpotlight,
  onOpenLaunchpad,
  onToggleNightLight,
  onRebootToGrub,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onOpenSpotlight: () => void;
  onOpenLaunchpad: () => void;
  onToggleNightLight: () => void;
  onRebootToGrub: () => void;
}) {
  const makeDirectory = useOSStore((s) => s.makeDirectory);
  const createFile = useOSStore((s) => s.createFile);
  const openWindow = useOSStore((s) => s.openWindow);

  const handleNewFolder = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    makeDirectory('/', `untitled folder ${suffix}`);
    openWindow('explorer', { title: 'Finder', filePath: '/' });
    onClose();
  };

  const handleNewNote = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    const name = `Note-${suffix}.txt`;
    createFile('/', name, 'Created from macOS Sequoia Desktop.\n');
    openWindow('project-viewer', { title: name, filePath: `/${name}` });
    onClose();
  };

  return (
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{
        left: Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 220 : x),
        top: Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 250 : y),
      }}
      className="fixed z-[995] w-52 rounded-xl border border-white/20 bg-[#1e1e26]/92 p-1 text-xs text-white shadow-2xl backdrop-blur-3xl"
    >
      <button
        type="button"
        onClick={handleNewFolder}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <FolderPlus className="size-3.5" />
        <span>New Folder</span>
      </button>

      <button
        type="button"
        onClick={handleNewNote}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <FilePlus2 className="size-3.5" />
        <span>New Text File</span>
      </button>

      <button
        type="button"
        onClick={() => {
          openWindow('terminal');
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <TerminalIcon className="size-3.5" />
        <span>Open Terminal</span>
      </button>

      <div className="my-1 border-t border-white/12" />

      <button
        type="button"
        onClick={() => {
          onOpenSpotlight();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <Search className="size-3.5" />
        <span>Spotlight Search...</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onOpenLaunchpad();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <Sparkles className="size-3.5" />
        <span>Launchpad</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onToggleNightLight();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <Moon className="size-3.5" />
        <span>Toggle Night Shift</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onRebootToGrub();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
      >
        <RotateCcw className="size-3.5" />
        <span>Switch OS (GRUB)</span>
      </button>
    </div>
  );
}

export interface MacDockProps {
  dockApps: MacAppItem[];
  openWindows: OSWindow[];
  activeWindowId: string | null;
  launchpadActive: boolean;
  onToggleLaunchpad: () => void;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onFocusOrMinimizeWindow: (win: OSWindow) => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
}

export function MacDock({
  dockApps,
  openWindows,
  activeWindowId,
  launchpadActive,
  onToggleLaunchpad,
  onOpenApp,
  onFocusOrMinimizeWindow,
  onRebootToGrub,
  onShutdown,
}: MacDockProps) {
  const extraWindows = openWindows.filter((w) => w.appType === 'project-viewer');

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative z-[950] flex w-full shrink-0 justify-center px-3 pt-1 pb-2.5 select-none"
    >
      <nav
        aria-label="macOS Sequoia Dock"
        className="flex items-end gap-2 rounded-2xl border border-white/25 bg-white/16 px-3 py-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        {/* Launchpad */}
        <button
          type="button"
          onClick={onToggleLaunchpad}
          title="Launchpad"
          aria-label="Launchpad"
          className="group relative grid size-11 cursor-pointer place-items-center transition-transform duration-150 hover:-translate-y-2 hover:scale-115"
        >
          <span className="pointer-events-none absolute -top-7 hidden rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] whitespace-nowrap text-white backdrop-blur-md group-hover:block">
            Launchpad
          </span>
          <MacAppIcon appType="launchpad" className="size-10 drop-shadow-md" />
          {launchpadActive && (
            <span aria-hidden="true" className="absolute -bottom-1 size-1 rounded-full bg-white" />
          )}
        </button>

        {/* Pinned Apps (including Memory Match exclusive) */}
        {dockApps.map((item) => {
          const matchingWindow = openWindows.find(
            (w) =>
              w.appType === item.appType &&
              (item.options?.filePath ? w.filePath === item.options.filePath : !w.filePath)
          );
          const running = Boolean(matchingWindow);
          const isFocused =
            matchingWindow &&
            matchingWindow.id === activeWindowId &&
            !matchingWindow.isMinimized;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                matchingWindow
                  ? onFocusOrMinimizeWindow(matchingWindow)
                  : onOpenApp(item.appType, item.options)
              }
              title={item.label}
              aria-label={`Open ${item.label}`}
              className={`group relative grid size-11 cursor-pointer place-items-center transition-transform duration-150 hover:-translate-y-2 hover:scale-115 ${
                isFocused ? '-translate-y-0.5' : ''
              }`}
            >
              <span className="pointer-events-none absolute -top-7 hidden rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] whitespace-nowrap text-white backdrop-blur-md group-hover:block">
                {item.label}
              </span>
              <MacAppIcon
                appType={item.appType}
                idHint={item.id}
                className="size-10 drop-shadow-md"
              />
              {running && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 size-1 rounded-full bg-white"
                />
              )}
            </button>
          );
        })}

        {/* Open Document Windows */}
        {extraWindows.length > 0 && (
          <>
            <div className="mx-0.5 mb-1 h-8 w-px bg-white/25" />
            {extraWindows.map((win) => (
              <button
                key={win.id}
                type="button"
                onClick={() => onFocusOrMinimizeWindow(win)}
                title={win.title}
                aria-label={win.title}
                className="group relative grid size-11 cursor-pointer place-items-center transition-transform duration-150 hover:-translate-y-2 hover:scale-115"
              >
                <span className="pointer-events-none absolute -top-7 hidden rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] whitespace-nowrap text-white backdrop-blur-md group-hover:block">
                  {win.title}
                </span>
                <MacAppIcon appType="project-viewer" className="size-10 drop-shadow-md" />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 size-1 rounded-full bg-white"
                />
              </button>
            ))}
          </>
        )}

        <div className="mx-0.5 mb-1 h-8 w-px bg-white/25" />

        {/* GRUB Switcher */}
        <button
          type="button"
          onClick={onRebootToGrub}
          title="Restart to GRUB Bootloader"
          aria-label="Restart to GRUB Bootloader"
          className="group relative grid size-11 cursor-pointer place-items-center rounded-xl border border-white/20 bg-white/10 transition-transform duration-150 hover:-translate-y-2 hover:scale-115"
        >
          <span className="pointer-events-none absolute -top-7 hidden rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] whitespace-nowrap text-white backdrop-blur-md group-hover:block">
            GRUB Bootloader
          </span>
          <RotateCcw className="size-4.5 text-white" />
        </button>

        {/* Trash / Exit */}
        <button
          type="button"
          onClick={onShutdown}
          title="Shut Down to Portfolio"
          aria-label="Shut Down to Portfolio"
          className="group relative grid size-11 cursor-pointer place-items-center transition-transform duration-150 hover:-translate-y-2 hover:scale-115"
        >
          <span className="pointer-events-none absolute -top-7 hidden rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] whitespace-nowrap text-white backdrop-blur-md group-hover:block">
            Trash / Shut Down
          </span>
          <MacAppIcon appType="trash" className="size-10 drop-shadow-md" />
        </button>
      </nav>
    </div>
  );
}
