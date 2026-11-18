import { useMemo, useState } from 'react';
import {
  Accessibility,
  BatteryCharging,
  BatteryFull,
  Bluetooth,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CloudSun,
  FilePlus2,
  FolderPlus,
  Moon,
  Plane,
  Power,
  RefreshCw,
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

export interface Win11AppItem {
  id: string;
  appType: AppType;
  label: string;
  options?: { title?: string; filePath?: string };
}

export function Win11Logo({ className = 'size-4.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="win11Blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#69d2ff" />
          <stop offset="100%" stopColor="#0078d4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="9.2" height="9.2" rx="1" fill="url(#win11Blue)" />
      <rect x="12.8" y="2" width="9.2" height="9.2" rx="1" fill="url(#win11Blue)" />
      <rect x="2" y="12.8" width="9.2" height="9.2" rx="1" fill="url(#win11Blue)" />
      <rect x="12.8" y="12.8" width="9.2" height="9.2" rx="1" fill="url(#win11Blue)" />
    </svg>
  );
}

export function Win11AppIcon({
  appType,
  idHint,
  className = 'size-6',
}: {
  appType: AppType;
  idHint?: string;
  className?: string;
}) {
  if (appType === 'explorer') {
    const isProjects = idHint === 'projects';
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <path
          d="M3 8.5C3 7.12 4.12 6 5.5 6h6.4l2.2 2.4H26.5C27.88 8.4 29 9.52 29 10.9V23.5C29 24.88 27.88 26 26.5 26H5.5C4.12 26 3 24.88 3 23.5V8.5z"
          fill={isProjects ? '#38bdf8' : '#facc15'}
        />
        <path
          d="M3 12h26v11.5c0 1.38-1.12 2.5-2.5 2.5h-21C4.12 26 3 24.88 3 23.5V12z"
          fill={isProjects ? '#0284c7' : '#eab308'}
        />
        <rect x="10" y="23.5" width="12" height="2.5" rx="1.2" fill="#0078d4" />
      </svg>
    );
  }

  if (appType === 'terminal') {
    return (
      <div
        className={`grid place-items-center rounded-[5px] border border-white/20 bg-[#1c212b] shadow-inner ${className}`}
      >
        <span className="font-mono text-[10px] font-bold leading-none text-[#60cdff]">
          &gt;_
        </span>
      </div>
    );
  }

  if (appType === 'tetris') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="4" y="4" width="24" height="24" rx="6" fill="#1e1b4b" />
        <rect x="8" y="10" width="5" height="5" rx="1" fill="#22d3ee" />
        <rect x="13.5" y="10" width="5" height="5" rx="1" fill="#22d3ee" />
        <rect x="13.5" y="15.5" width="5" height="5" rx="1" fill="#a855f7" />
        <rect x="19" y="15.5" width="5" height="5" rx="1" fill="#facc15" />
      </svg>
    );
  }

  if (appType === 'minesweeper') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="3" y="3" width="26" height="26" rx="6" fill="#334155" />
        <circle cx="16" cy="16" r="6" fill="#0f172a" />
        <path
          d="M16 7v3M16 22v3M7 16h3M22 16h3M9.8 9.8l2.1 2.1M20.1 20.1l2.1 2.1M22.2 9.8l-2.1 2.1M11.9 20.1l-2.1 2.1"
          stroke="#f87171"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="1.7" fill="#ffffff" />
      </svg>
    );
  }

  if (appType === 'about') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#0078d4" />
        <circle cx="16" cy="12" r="4.3" fill="#e0f2fe" />
        <path
          d="M8.5 24.2c1.8-3.6 4.7-5.2 7.5-5.2s5.7 1.6 7.5 5.2"
          fill="#bae6fd"
        />
      </svg>
    );
  }

  // Document viewer
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M7 4h12l6 6v18H7V4z"
        fill="#e2e8f0"
      />
      <path d="M19 4v6h6l-6-6z" fill="#94a3b8" />
      <rect x="10.5" y="14" width="11" height="2" rx="1" fill="#0078d4" />
      <rect x="10.5" y="18.5" width="8" height="2" rx="1" fill="#64748b" />
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

export interface Win11StartMenuProps {
  apps: Win11AppItem[];
  vfs: FolderNode;
  focusSearchOnOpen?: boolean;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
  onClose: () => void;
}

export function Win11StartMenu({
  apps,
  vfs,
  focusSearchOnOpen,
  onOpenApp,
  onRebootToGrub,
  onShutdown,
  onClose,
}: Win11StartMenuProps) {
  const [query, setQuery] = useState('');
  const [showAllApps, setShowAllApps] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const vfsFiles = useMemo(() => collectVfsFiles(vfs), [vfs]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredApps = useMemo(
    () => apps.filter((a) => a.label.toLowerCase().includes(trimmedQuery)),
    [apps, trimmedQuery]
  );
  const filteredFiles = useMemo(
    () =>
      vfsFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(trimmedQuery) ||
          f.path.toLowerCase().includes(trimmedQuery)
      ),
    [vfsFiles, trimmedQuery]
  );

  const recommendedFiles = useMemo(() => {
    const preferred = ['/projects/finanger.md', '/projects/32bit-vm-emulator.md', '/skills.txt', '/resume.md'];
    const picked = preferred
      .map((p) => vfsFiles.find((f) => f.path === p))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
    return picked.length > 0 ? picked : vfsFiles.slice(0, 4);
  }, [vfsFiles]);

  const sortedApps = useMemo(
    () => [...apps].sort((a, b) => a.label.localeCompare(b.label)),
    [apps]
  );

  return (
    <div
      role="dialog"
      aria-label="Windows 11 Start Menu"
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 left-1/2 z-[985] flex w-[min(94vw,560px)] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#1b2232]/92 text-white shadow-[0_28px_80px_rgba(0,0,0,0.72)] backdrop-blur-3xl"
    >
      {/* Top Acrylic Search Field */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2.5 rounded-full border border-white/15 border-b-2 border-b-[#60cdff] bg-[#121722]/90 px-4 py-2">
          <Search className="size-4 shrink-0 text-[#60cdff]" />
          <input
            type="text"
            autoFocus={focusSearchOnOpen}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for apps, settings, and documents"
            aria-label="Search Windows 11 apps and files"
            className="w-full bg-transparent text-xs text-white placeholder:text-white/50 outline-none"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-h-[400px] min-h-[300px] overflow-y-auto px-6 pb-5">
        {trimmedQuery ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-white/75">Apps</p>
              {filteredApps.length === 0 ? (
                <p className="text-xs text-white/45">No matching apps.</p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {filteredApps.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onOpenApp(item.appType, item.options);
                        onClose();
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-white/10"
                    >
                      <Win11AppIcon appType={item.appType} idHint={item.id} className="size-6 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-white/75">Documents (VFS)</p>
              {filteredFiles.length === 0 ? (
                <p className="text-xs text-white/45">No matching VFS files.</p>
              ) : (
                <div className="space-y-1">
                  {filteredFiles.slice(0, 6).map((file) => (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => {
                        onOpenApp('project-viewer', { title: file.name, filePath: file.path });
                        onClose();
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-white/10"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Win11AppIcon appType="project-viewer" className="size-5 shrink-0" />
                        <span className="truncate font-medium">{file.name}</span>
                      </div>
                      <span className="ml-2 shrink-0 font-mono text-[10px] text-white/50">
                        {file.path}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : showAllApps ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">All apps</span>
              <button
                type="button"
                onClick={() => setShowAllApps(false)}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] hover:bg-white/15"
              >
                <ChevronLeft className="size-3" />
                <span>Back</span>
              </button>
            </div>
            <div className="space-y-1">
              {sortedApps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onOpenApp(item.appType, item.options);
                    onClose();
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-xs hover:bg-white/10"
                >
                  <Win11AppIcon appType={item.appType} idHint={item.id} className="size-6 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Pinned</span>
                <button
                  type="button"
                  onClick={() => setShowAllApps(true)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] hover:bg-white/15"
                >
                  <span>All apps</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {apps.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onOpenApp(item.appType, item.options);
                      onClose();
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-center transition-colors hover:bg-white/10 active:scale-95"
                  >
                    <Win11AppIcon appType={item.appType} idHint={item.id} className="size-8" />
                    <span className="line-clamp-1 text-[11px] text-white/90">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Recommended</span>
                <button
                  type="button"
                  onClick={() => {
                    onOpenApp('explorer', { title: 'Projects', filePath: '/projects' });
                    onClose();
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] hover:bg-white/15"
                >
                  <span>More</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {recommendedFiles.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => {
                      onOpenApp('project-viewer', { title: file.name, filePath: file.path });
                      onClose();
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/10"
                  >
                    <Win11AppIcon appType="project-viewer" className="size-7 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-white">{file.name}</p>
                      <p className="truncate font-mono text-[10px] text-white/50">{file.path}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile & Power Bar */}
      <div className="relative flex items-center justify-between border-t border-white/10 bg-black/25 px-6 py-3">
        <button
          type="button"
          onClick={() => {
            onOpenApp('about');
            onClose();
          }}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-left hover:bg-white/10"
        >
          <span className="grid size-7 place-items-center rounded-full bg-[#0078d4] text-xs font-bold text-white">
            DA
          </span>
          <span className="text-xs font-medium text-white/90">Dhrumil Asodiya</span>
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Power options"
            onClick={() => setShowPowerMenu((p) => !p)}
            className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-white/12"
          >
            <Power className="size-4 text-white/90" />
          </button>

          {showPowerMenu && (
            <div className="absolute right-0 bottom-10 z-20 w-48 rounded-lg border border-white/15 bg-[#202738]/95 p-1 text-xs shadow-2xl backdrop-blur-2xl">
              <button
                type="button"
                onClick={onRebootToGrub}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-white/12"
              >
                <RotateCcw className="size-3.5" />
                <span>Restart to GRUB</span>
              </button>
              <button
                type="button"
                onClick={onShutdown}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-red-300 hover:bg-red-600 hover:text-white"
              >
                <Power className="size-3.5" />
                <span>Shut down to Portfolio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface Win11QuickSettingsProps {
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

export function Win11QuickSettings({
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
}: Win11QuickSettingsProps) {
  return (
    <div
      role="dialog"
      aria-label="Windows 11 Quick Settings"
      onClick={(e) => e.stopPropagation()}
      className="fixed right-3 bottom-14 z-[985] w-[min(92vw,340px)] overflow-hidden rounded-xl border border-white/15 bg-[#1b2232]/94 text-white shadow-[0_24px_70px_rgba(0,0,0,0.68)] backdrop-blur-3xl"
    >
      <div className="grid grid-cols-3 gap-2.5 p-4">
        {[
          {
            label: 'Wi-Fi',
            active: wifiEnabled && !airplaneMode,
            icon: <Wifi className="size-4" />,
            onClick: () => setWifiEnabled(!wifiEnabled),
          },
          {
            label: 'Bluetooth',
            active: bluetoothEnabled && !airplaneMode,
            icon: <Bluetooth className="size-4" />,
            onClick: () => setBluetoothEnabled(!bluetoothEnabled),
          },
          {
            label: 'Airplane',
            active: airplaneMode,
            icon: <Plane className="size-4" />,
            onClick: () => setAirplaneMode(!airplaneMode),
          },
          {
            label: 'Night light',
            active: nightLight,
            icon: <Moon className="size-4" />,
            onClick: () => setNightLight(!nightLight),
          },
          {
            label: 'Energy saver',
            active: false,
            icon: <BatteryCharging className="size-4" />,
            onClick: () => setBrightness(brightness > 75 ? 70 : 100),
          },
          {
            label: 'Accessibility',
            active: false,
            icon: <Accessibility className="size-4" />,
            onClick: () => {},
          },
        ].map((tile) => (
          <div key={tile.label} className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={tile.onClick}
              className={`grid h-11 w-full cursor-pointer place-items-center rounded-md border text-xs transition-colors ${
                tile.active
                  ? 'border-[#60cdff]/60 bg-[#60cdff] text-slate-950'
                  : 'border-white/12 bg-white/8 text-white hover:bg-white/14'
              }`}
            >
              {tile.icon}
            </button>
            <span className="text-[11px] text-white/80">{tile.label}</span>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-3 border-t border-white/10 px-4 py-3.5">
        <label className="flex items-center gap-3 text-xs">
          <Sun className="size-4 shrink-0 text-white/80" />
          <input
            type="range"
            min={55}
            max={105}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            aria-label="Screen brightness"
            className="h-1.5 flex-1 cursor-pointer accent-[#60cdff]"
          />
          <span className="w-8 text-right font-mono text-[10px] text-white/65 tabular-nums">
            {brightness}%
          </span>
        </label>

        <label className="flex items-center gap-3 text-xs">
          <Volume2 className="size-4 shrink-0 text-white/80" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="System volume"
            className="h-1.5 flex-1 cursor-pointer accent-[#60cdff]"
          />
          <span className="w-8 text-right font-mono text-[10px] text-white/65 tabular-nums">
            {volume}%
          </span>
        </label>
      </div>

      {/* Footer Tray Actions */}
      <div className="flex items-center justify-between border-t border-white/10 bg-black/25 px-4 py-2.5 text-xs">
        <span className="flex items-center gap-1.5 text-[11px] text-white/75">
          <BatteryFull className="size-4 text-emerald-400" />
          <span>98%</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRebootToGrub}
            className="inline-flex cursor-pointer items-center gap-1 rounded border border-white/15 bg-white/8 px-2 py-1 text-[11px] hover:bg-white/15"
          >
            <RotateCcw className="size-3" />
            <span>GRUB</span>
          </button>
          <button
            type="button"
            onClick={onShutdown}
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#c42b1c] px-2 py-1 text-[11px] font-medium text-white hover:bg-[#b02315]"
          >
            <Power className="size-3" />
            <span>Shut down</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Win11CalendarCenter({ now }: { now: Date }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();
  const todayDate = now.getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-label="Windows 11 Notifications and Calendar"
      onClick={(e) => e.stopPropagation()}
      className="fixed right-3 bottom-14 z-[985] flex w-[min(92vw,340px)] flex-col gap-3"
    >
      {/* Notifications Panel */}
      <div className="rounded-xl border border-white/15 bg-[#1b2232]/94 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-3xl">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold">Notifications</span>
          {!notificationsCleared && (
            <button
              type="button"
              onClick={() => setNotificationsCleared(true)}
              className="cursor-pointer rounded px-2 py-0.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>
        {notificationsCleared ? (
          <p className="py-4 text-center text-xs text-white/55">
            No new notifications
          </p>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-2.5">
              <p className="font-medium text-white">Trinity OS Ready</p>
              <p className="mt-0.5 text-[11px] text-white/65">
                Minesweeper, Tetris &amp; Stateful VFS are active on Windows 11.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Calendar Panel */}
      <div className="rounded-xl border border-white/15 bg-[#1b2232]/94 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.68)] backdrop-blur-3xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold">{monthLabel}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonthOffset((m) => m - 1)}
              className="grid size-7 cursor-pointer place-items-center rounded hover:bg-white/12"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonthOffset((m) => m + 1)}
              className="grid size-7 cursor-pointer place-items-center rounded hover:bg-white/12"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-white/55">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
          {cells.map((day, idx) =>
            day === null ? (
              <span key={`empty-${idx}`} />
            ) : (
              <span
                key={`day-${day}`}
                className={`grid size-8 place-items-center rounded-full tabular-nums ${
                  isCurrentMonth && day === todayDate
                    ? 'bg-[#60cdff] font-semibold text-slate-950'
                    : 'text-white/85 hover:bg-white/10'
                }`}
              >
                {day}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function Win11WidgetsBoard({
  onOpenApp,
  onClose,
}: {
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Windows 11 Widgets"
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 left-3 z-[985] w-[min(92vw,340px)] space-y-3 rounded-xl border border-white/15 bg-[#1b2232]/92 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.68)] backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/90">Widgets</span>
        <span className="text-[11px] text-white/55">Dhrumil Asodiya</span>
      </div>

      <div className="rounded-xl border border-white/12 bg-gradient-to-br from-sky-500/20 to-blue-600/10 p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white/70">Ahmedabad / Local</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">24°C</p>
            <p className="text-xs text-sky-200">Mostly Sunny</p>
          </div>
          <CloudSun className="size-9 text-amber-300" />
        </div>
      </div>

      <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5 text-xs">
        <p className="font-semibold text-white">Engineering Stack</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/70">
          Java · Spring Boot · Next.js · PostgreSQL · Multi-Tenant SaaS · 32-bit VM
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              onOpenApp('explorer', { title: 'Projects', filePath: '/projects' });
              onClose();
            }}
            className="cursor-pointer rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] hover:bg-white/20"
          >
            Open /projects
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenApp('minesweeper');
              onClose();
            }}
            className="cursor-pointer rounded-md border border-[#60cdff]/35 bg-[#60cdff]/20 px-2.5 py-1 text-[11px] text-[#60cdff] hover:bg-[#60cdff]/30"
          >
            Play Minesweeper
          </button>
        </div>
      </div>
    </div>
  );
}

export type SnapLayoutPreset =
  | 'left-half'
  | 'right-half'
  | 'left-two-thirds'
  | 'right-one-third'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export function Win11SnapLayoutsMenu({
  onSnap,
}: {
  onSnap: (preset: SnapLayoutPreset) => void;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-9 right-1 z-[990] grid grid-cols-3 gap-2 rounded-lg border border-white/18 bg-[#202738]/96 p-2.5 shadow-2xl backdrop-blur-2xl"
    >
      {/* 50 / 50 Split */}
      <div className="flex h-10 w-14 gap-1 rounded border border-white/12 bg-black/25 p-1">
        <button
          type="button"
          title="Snap Left Half"
          onClick={() => onSnap('left-half')}
          className="flex-1 cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
        <button
          type="button"
          title="Snap Right Half"
          onClick={() => onSnap('right-half')}
          className="flex-1 cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
      </div>

      {/* 66 / 33 Split */}
      <div className="flex h-10 w-14 gap-1 rounded border border-white/12 bg-black/25 p-1">
        <button
          type="button"
          title="Snap Left 65%"
          onClick={() => onSnap('left-two-thirds')}
          className="w-2/3 cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
        <button
          type="button"
          title="Snap Right 35%"
          onClick={() => onSnap('right-one-third')}
          className="w-1/3 cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
      </div>

      {/* 4 Quadrants */}
      <div className="grid h-10 w-14 grid-cols-2 grid-rows-2 gap-1 rounded border border-white/12 bg-black/25 p-1">
        <button
          type="button"
          title="Snap Top Left"
          onClick={() => onSnap('top-left')}
          className="cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
        <button
          type="button"
          title="Snap Top Right"
          onClick={() => onSnap('top-right')}
          className="cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
        <button
          type="button"
          title="Snap Bottom Left"
          onClick={() => onSnap('bottom-left')}
          className="cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
        <button
          type="button"
          title="Snap Bottom Right"
          onClick={() => onSnap('bottom-right')}
          className="cursor-pointer rounded-xs bg-white/20 hover:bg-[#60cdff]"
        />
      </div>
    </div>
  );
}

export function Win11DesktopContextMenu({
  x,
  y,
  onClose,
  onRefresh,
  onToggleNightLight,
  onRebootToGrub,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onToggleNightLight: () => void;
  onRebootToGrub: () => void;
}) {
  const makeDirectory = useOSStore((s) => s.makeDirectory);
  const createFile = useOSStore((s) => s.createFile);
  const openWindow = useOSStore((s) => s.openWindow);

  const handleNewFolder = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    makeDirectory('/', `New folder (${suffix})`);
    openWindow('explorer', { title: 'File Explorer', filePath: '/' });
    onClose();
  };

  const handleNewFile = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    const name = `Note-${suffix}.txt`;
    createFile('/', name, 'Created from Windows 11 Desktop Context Menu.\n');
    openWindow('project-viewer', { title: name, filePath: `/${name}` });
    onClose();
  };

  return (
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{
        left: Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 220 : x),
        top: Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 260 : y),
      }}
      className="fixed z-[995] w-52 rounded-lg border border-white/15 bg-[#1f2636]/96 p-1.5 text-xs text-white shadow-2xl backdrop-blur-2xl"
    >
      <button
        type="button"
        onClick={() => {
          onRefresh();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <RefreshCw className="size-3.5 text-white/75" />
        <span>Refresh</span>
      </button>

      <div className="my-1 border-t border-white/10" />

      <button
        type="button"
        onClick={handleNewFolder}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <FolderPlus className="size-3.5 text-[#facc15]" />
        <span>New Folder (VFS)</span>
      </button>

      <button
        type="button"
        onClick={handleNewFile}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <FilePlus2 className="size-3.5 text-[#60cdff]" />
        <span>New Text Document</span>
      </button>

      <button
        type="button"
        onClick={() => {
          openWindow('terminal');
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <TerminalIcon className="size-3.5 text-emerald-300" />
        <span>Open in Terminal</span>
      </button>

      <div className="my-1 border-t border-white/10" />

      <button
        type="button"
        onClick={() => {
          onToggleNightLight();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <Sparkles className="size-3.5 text-amber-300" />
        <span>Toggle Night light</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onRebootToGrub();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-white/10"
      >
        <RotateCcw className="size-3.5 text-white/75" />
        <span>Switch OS (GRUB)</span>
      </button>
    </div>
  );
}

export interface Win11TaskbarProps {
  pinnedApps: Win11AppItem[];
  openWindows: OSWindow[];
  activeWindowId: string | null;
  activeFlyout: 'start' | 'search' | 'quick-settings' | 'calendar' | 'widgets' | 'tray' | null;
  clock: { time: string; date: string };
  onToggleFlyout: (
    target: 'start' | 'search' | 'quick-settings' | 'calendar' | 'widgets' | 'tray'
  ) => void;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onFocusOrMinimizeWindow: (win: OSWindow) => void;
  onShowDesktop: () => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
}

export function Win11Taskbar({
  pinnedApps,
  openWindows,
  activeWindowId,
  activeFlyout,
  clock,
  onToggleFlyout,
  onOpenApp,
  onFocusOrMinimizeWindow,
  onShowDesktop,
  onRebootToGrub,
  onShutdown,
}: Win11TaskbarProps) {
  const extraWindows = openWindows.filter(
    (w) => w.appType === 'project-viewer'
  );

  return (
    <footer
      aria-label="Windows 11 Taskbar"
      onClick={(e) => e.stopPropagation()}
      className="relative z-[950] grid h-12 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center border-t border-white/10 bg-[#121722]/82 px-2 text-white backdrop-blur-3xl select-none"
    >
      {/* Left: Windows 11 Widgets Weather Pill */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onToggleFlyout('widgets')}
          aria-label="Open Windows 11 Widgets"
          className={`hidden h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 text-left transition-colors hover:bg-white/10 sm:inline-flex ${
            activeFlyout === 'widgets' ? 'bg-white/12' : ''
          }`}
        >
          <CloudSun className="size-4.5 text-amber-300" />
          <div className="leading-tight">
            <span className="block text-[11px] font-medium tabular-nums">24°C</span>
            <span className="block text-[10px] text-white/65">Sunny</span>
          </div>
        </button>
      </div>

      {/* Center: Start, Search, Pinned Apps & Running Windows */}
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          aria-label="Start"
          title="Start"
          onClick={() => onToggleFlyout('start')}
          className={`grid size-9 cursor-pointer place-items-center rounded-md transition-all hover:bg-white/10 active:scale-90 ${
            activeFlyout === 'start' ? 'bg-white/14' : ''
          }`}
        >
          <Win11Logo className="size-5" />
        </button>

        {/* Windows 11 Taskbar Search Pill */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => onToggleFlyout('search')}
          className={`hidden h-8 w-36 cursor-pointer items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-3 text-xs text-white/75 transition-colors hover:bg-white/[0.13] md:inline-flex lg:w-44 ${
            activeFlyout === 'search' ? 'bg-white/[0.16] text-white' : ''
          }`}
        >
          <Search className="size-3.5 text-white/80" />
          <span>Search</span>
        </button>

        {/* Pinned Taskbar Icons */}
        {pinnedApps.map((item) => {
          const matchingWindow = openWindows.find(
            (w) =>
              w.appType === item.appType &&
              (item.options?.filePath ? w.filePath === item.options.filePath : !w.filePath)
          );
          const isRunning = Boolean(matchingWindow);
          const isFocused =
            matchingWindow &&
            matchingWindow.id === activeWindowId &&
            !matchingWindow.isMinimized;

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() =>
                matchingWindow
                  ? onFocusOrMinimizeWindow(matchingWindow)
                  : onOpenApp(item.appType, item.options)
              }
              className={`relative grid size-9 cursor-pointer place-items-center rounded-md transition-all hover:bg-white/10 active:scale-90 ${
                isFocused ? 'bg-white/12' : ''
              }`}
            >
              <Win11AppIcon appType={item.appType} idHint={item.id} className="size-5.5" />
              {isRunning && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0.5 h-[3px] rounded-full transition-all ${
                    isFocused ? 'w-4 bg-[#60cdff]' : 'w-1.5 bg-white/60'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Open Document Viewer Tabs */}
        {extraWindows.map((win) => {
          const isFocused = win.id === activeWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              type="button"
              title={win.title}
              aria-label={win.title}
              onClick={() => onFocusOrMinimizeWindow(win)}
              className={`relative grid size-9 cursor-pointer place-items-center rounded-md transition-all hover:bg-white/10 active:scale-90 ${
                isFocused ? 'bg-white/12' : ''
              }`}
            >
              <Win11AppIcon appType={win.appType} className="size-5" />
              <span
                aria-hidden="true"
                className={`absolute bottom-0.5 h-[3px] rounded-full transition-all ${
                  isFocused ? 'w-4 bg-[#60cdff]' : 'w-1.5 bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Right: Hidden Icons Chevron, Quick Settings Cluster, Clock/Calendar, Show Desktop Sliver */}
      <div className="flex h-full items-center justify-end gap-0.5">
        {/* Hidden Overflow Tray */}
        <div className="relative">
          <button
            type="button"
            aria-label="Show hidden icons"
            title="Show hidden icons"
            onClick={() => onToggleFlyout('tray')}
            className={`grid size-8 cursor-pointer place-items-center rounded-md hover:bg-white/10 ${
              activeFlyout === 'tray' ? 'bg-white/12' : ''
            }`}
          >
            <ChevronUp className="size-3.5 text-white/85" />
          </button>

          {activeFlyout === 'tray' && (
            <div className="fixed right-28 bottom-14 z-[985] w-44 rounded-lg border border-white/15 bg-[#1b2232]/95 p-1.5 text-xs shadow-2xl backdrop-blur-2xl">
              <button
                type="button"
                onClick={onRebootToGrub}
                className="flex w-full cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-left hover:bg-white/10"
              >
                <RotateCcw className="size-3.5" />
                <span>Switch OS (GRUB)</span>
              </button>
              <button
                type="button"
                onClick={onShutdown}
                className="flex w-full cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-left text-red-300 hover:bg-[#c42b1c] hover:text-white"
              >
                <Power className="size-3.5" />
                <span>Exit to Portfolio</span>
              </button>
            </div>
          )}
        </div>

        {/* Wi-Fi + Volume + Battery Quick Settings Trigger */}
        <button
          type="button"
          aria-label="Quick Settings"
          title="Quick Settings"
          onClick={() => onToggleFlyout('quick-settings')}
          className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 transition-colors hover:bg-white/10 ${
            activeFlyout === 'quick-settings' ? 'bg-white/12' : ''
          }`}
        >
          <Wifi className="size-3.5 text-white/90" />
          <Volume2 className="size-3.5 text-white/90" />
          <BatteryFull className="size-4 text-white/90" />
        </button>

        {/* Clock & Date (Calendar Center Trigger) */}
        <button
          type="button"
          aria-label="Notifications and Calendar"
          onClick={() => onToggleFlyout('calendar')}
          className={`hidden h-9 cursor-pointer flex-col items-end justify-center rounded-md px-2 text-right text-[11px] leading-tight tabular-nums transition-colors hover:bg-white/10 sm:flex ${
            activeFlyout === 'calendar' ? 'bg-white/12' : ''
          }`}
        >
          <span className="font-medium text-white/95">{clock.time}</span>
          <span className="text-[10px] text-white/75">{clock.date}</span>
        </button>

        {/* Far-Right Show Desktop Sliver */}
        <button
          type="button"
          onClick={onShowDesktop}
          aria-label="Show desktop"
          title="Show desktop"
          className="ml-0.5 h-full w-2 cursor-pointer border-l border-white/10 hover:bg-white/15"
        />
      </div>
    </footer>
  );
}
