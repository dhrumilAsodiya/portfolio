import { useMemo, useState } from 'react';
import {
  BatteryFull,
  Bell,
  Bluetooth,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FilePlus2,
  FolderPlus,
  LayoutGrid,
  Moon,
  Plane,
  Power,
  RotateCcw,
  Search,
  ShieldAlert,
  Sun,
  Terminal as TerminalIcon,
  Volume2,
  Wifi,
  X,
} from 'lucide-react';
import { AppType, OSWindow, useOSStore } from '@/src/os/useOSStore';
import { FolderNode } from '@/src/os/vfs';

export interface UbuntuAppItem {
  id: string;
  appType: AppType;
  label: string;
  options?: { title?: string; filePath?: string };
}

export type UbuntuFlyout =
  | 'activities'
  | 'app-grid'
  | 'calendar'
  | 'quick-settings'
  | null;

export function UbuntuAppIcon({
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
          d="M3 8.5C3 7.12 4.12 6 5.5 6h6.4l2.1 2.3H26.5C27.88 8.3 29 9.42 29 10.8V23.5C29 24.88 27.88 26 26.5 26H5.5C4.12 26 3 24.88 3 23.5V8.5z"
          fill={isProjects ? '#c44216' : '#f47421'}
        />
        <path
          d="M3 11.8h26v11.7c0 1.38-1.12 2.5-2.5 2.5h-21C4.12 26 3 24.88 3 23.5V11.8z"
          fill={isProjects ? '#e95420' : '#ff8c3a'}
        />
        {isProjects ? (
          <path
            d="M12.5 16.2L9.8 18.9l2.7 2.7M19.5 16.2l2.7 2.7-2.7 2.7M17 15.6l-2 6.6"
            stroke="#fff7ed"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <rect x="11" y="17.5" width="10" height="2.2" rx="1.1" fill="#fff7ed" opacity="0.9" />
        )}
      </svg>
    );
  }

  if (appType === 'terminal') {
    return (
      <div
        className={`grid place-items-center rounded-lg border border-white/15 bg-[#300a24] shadow-inner ${className}`}
      >
        <span className="font-mono text-[10px] font-bold leading-none text-white">
          $_
        </span>
      </div>
    );
  }

  if (appType === 'tetris') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="3" y="3" width="26" height="26" rx="7" fill="#2c0f26" />
        <rect x="8" y="9" width="5" height="5" rx="1" fill="#e95420" />
        <rect x="13.5" y="9" width="5" height="5" rx="1" fill="#f97316" />
        <rect x="13.5" y="14.5" width="5" height="5" rx="1" fill="#a855f7" />
        <rect x="19" y="14.5" width="5" height="5" rx="1" fill="#38bdf8" />
      </svg>
    );
  }

  if (appType === 'about') {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#e95420" />
        <circle cx="16" cy="16" r="6.8" fill="none" stroke="#ffffff" strokeWidth="2.4" />
        <circle cx="16" cy="7.2" r="2.1" fill="#ffffff" stroke="#e95420" strokeWidth="0.9" />
        <circle cx="8.4" cy="20.4" r="2.1" fill="#ffffff" stroke="#e95420" strokeWidth="0.9" />
        <circle cx="23.6" cy="20.4" r="2.1" fill="#ffffff" stroke="#e95420" strokeWidth="0.9" />
      </svg>
    );
  }

  // Document viewer (Yaru text editor icon)
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="6" y="4" width="20" height="24" rx="3" fill="#f5f5f4" />
      <rect x="9.5" y="10" width="13" height="2" rx="1" fill="#e95420" />
      <rect x="9.5" y="14.5" width="11" height="1.8" rx="0.9" fill="#57534e" />
      <rect x="9.5" y="18.5" width="9" height="1.8" rx="0.9" fill="#78716c" />
      <rect x="9.5" y="22.5" width="7" height="1.8" rx="0.9" fill="#a8a29e" />
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

export interface UbuntuTopBarProps {
  activeAppName: string;
  clockTime: string;
  activeFlyout: UbuntuFlyout;
  onToggleFlyout: (target: Exclude<UbuntuFlyout, null>) => void;
  wifiEnabled: boolean;
  airplaneMode: boolean;
  volume: number;
}

export function UbuntuTopBar({
  activeAppName,
  clockTime,
  activeFlyout,
  onToggleFlyout,
  wifiEnabled,
  airplaneMode,
  volume,
}: UbuntuTopBarProps) {
  return (
    <header
      onClick={(e) => e.stopPropagation()}
      className="relative z-[950] grid h-7 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-white/8 bg-[#131313]/95 px-2 text-xs text-white select-none"
    >
      {/* Left: GNOME 46 Dynamic Workspace Pill + Active App Label */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Activities overview"
          title="Activities Overview"
          onClick={() => onToggleFlyout('activities')}
          className={`inline-flex h-5 cursor-pointer items-center gap-1.5 rounded-full px-2.5 transition-colors hover:bg-white/14 ${
            activeFlyout === 'activities' || activeFlyout === 'app-grid'
              ? 'bg-white/20'
              : ''
          }`}
        >
          <span className="h-1.5 w-4 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white/45" />
        </button>

        <span className="hidden truncate font-medium text-white/90 sm:inline">
          {activeAppName}
        </span>
      </div>

      {/* Center: GNOME Date & Time Trigger */}
      <button
        type="button"
        aria-label="Calendar and notifications"
        onClick={() => onToggleFlyout('calendar')}
        className={`h-5 cursor-pointer rounded-full px-3 font-medium whitespace-nowrap tabular-nums transition-colors hover:bg-white/14 ${
          activeFlyout === 'calendar' ? 'bg-white/20' : ''
        }`}
      >
        {clockTime}
      </button>

      {/* Right: GNOME System Status Cluster */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          aria-label="System quick settings"
          title="Quick Settings"
          onClick={() => onToggleFlyout('quick-settings')}
          className={`inline-flex h-5 cursor-pointer items-center gap-2.5 rounded-full px-2.5 transition-colors hover:bg-white/14 ${
            activeFlyout === 'quick-settings' ? 'bg-white/20' : ''
          }`}
        >
          {airplaneMode ? (
            <Plane className="size-3.5 text-amber-300" />
          ) : (
            <Wifi
              className={`size-3.5 ${wifiEnabled ? 'text-white' : 'text-white/40'}`}
            />
          )}
          <Volume2
            className={`size-3.5 ${volume > 0 ? 'text-white' : 'text-white/40'}`}
          />
          <span className="inline-flex items-center gap-1">
            <BatteryFull className="size-3.5 text-white" />
            <span className="hidden text-[10px] text-white/75 tabular-nums sm:inline">
              98%
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}

export interface UbuntuDockProps {
  apps: UbuntuAppItem[];
  openWindows: OSWindow[];
  activeWindowId: string | null;
  activeFlyout: UbuntuFlyout;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onFocusOrMinimizeWindow: (win: OSWindow) => void;
  onToggleAppGrid: () => void;
}

export function UbuntuDock({
  apps,
  openWindows,
  activeWindowId,
  activeFlyout,
  onOpenApp,
  onFocusOrMinimizeWindow,
  onToggleAppGrid,
}: UbuntuDockProps) {
  const extraWindows = openWindows.filter((w) => w.appType === 'project-viewer');

  return (
    <aside
      aria-label="Ubuntu Yaru Dock"
      onClick={(e) => e.stopPropagation()}
      className="z-[900] flex h-full w-16 shrink-0 flex-col items-center justify-between border-r border-white/10 bg-[#1a0d17]/90 py-2.5 backdrop-blur-2xl select-none"
    >
      <div className="flex w-full flex-col items-center gap-2">
        {apps.map((item) => {
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
              onClick={() =>
                matchingWindow
                  ? onFocusOrMinimizeWindow(matchingWindow)
                  : onOpenApp(item.appType, item.options)
              }
              title={item.label}
              aria-label={`Open ${item.label}`}
              className={`group relative grid size-11 cursor-pointer place-items-center rounded-xl transition-all hover:bg-white/12 active:scale-95 ${
                isFocused ? 'bg-white/16 shadow-inner' : isRunning ? 'bg-white/8' : ''
              }`}
            >
              {isRunning && (
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 -left-1.5 w-1 -translate-y-1/2 rounded-full bg-[#e95420] transition-all ${
                    isFocused ? 'h-4' : 'h-1.5'
                  }`}
                />
              )}
              <UbuntuAppIcon
                appType={item.appType}
                idHint={item.id}
                className="size-7 transition-transform duration-150 group-hover:scale-105"
              />
            </button>
          );
        })}

        {extraWindows.map((win) => {
          const isFocused = win.id === activeWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              type="button"
              onClick={() => onFocusOrMinimizeWindow(win)}
              title={win.title}
              aria-label={win.title}
              className={`relative grid size-11 cursor-pointer place-items-center rounded-xl transition-all hover:bg-white/12 ${
                isFocused ? 'bg-white/16' : 'bg-white/8'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 -left-1.5 w-1 -translate-y-1/2 rounded-full bg-[#e95420] ${
                  isFocused ? 'h-4' : 'h-1.5'
                }`}
              />
              <UbuntuAppIcon appType={win.appType} className="size-6" />
            </button>
          );
        })}
      </div>

      {/* Bottom 9-dot Show Applications Launcher */}
      <button
        type="button"
        onClick={onToggleAppGrid}
        title="Show Applications"
        aria-label="Show Applications"
        className={`grid size-11 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-white/14 ${
          activeFlyout === 'app-grid' ? 'bg-[#e95420]/25 text-[#ff8c66]' : 'text-white/90'
        }`}
      >
        <LayoutGrid className="size-5.5" />
      </button>
    </aside>
  );
}

export function UbuntuCalendarPopover({ now }: { now: Date }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [cleared, setCleared] = useState(false);

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
  const weekdayBanner = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateBanner = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-label="GNOME Calendar and Notifications"
      onClick={(e) => e.stopPropagation()}
      className="fixed top-9 left-1/2 z-[985] grid w-[min(94vw,640px)] -translate-x-1/2 grid-cols-1 gap-4 rounded-2xl border border-white/12 bg-[#222222]/96 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.72)] backdrop-blur-3xl sm:grid-cols-[1.15fr_1fr]"
    >
      {/* Left: Notifications Feed + Do Not Disturb */}
      <div className="flex flex-col justify-between border-b border-white/10 pb-4 sm:border-r sm:border-b-0 sm:pr-4 sm:pb-0">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <Bell className="size-3.5 text-[#e95420]" />
              <span>Notifications</span>
            </span>
            {!cleared && (
              <button
                type="button"
                onClick={() => setCleared(true)}
                className="cursor-pointer rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-white/80 hover:bg-white/15"
              >
                Clear
              </button>
            )}
          </div>

          {cleared ? (
            <div className="flex h-36 flex-col items-center justify-center text-center text-xs text-white/50">
              <Bell className="mb-2 size-6 opacity-40" />
              <span>No Notifications</span>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-white/8 bg-white/[0.06] p-3">
                <p className="font-semibold text-white">Red Team Breach Ready</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-white/68">
                  Open Terminal and run{' '}
                  <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[#ff8c66]">
                    play breach
                  </code>{' '}
                  to crack the 4-digit server PIN.
                </p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
                <p className="font-semibold text-white">Ubuntu 24.04 LTS</p>
                <p className="mt-0.5 text-[11px] text-white/65">
                  GNOME 46 · Yaru Theme · Stateful VFS mounted.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-white/80">Do Not Disturb</span>
          <button
            type="button"
            role="switch"
            aria-checked={doNotDisturb}
            aria-label="Do Not Disturb"
            onClick={() => setDoNotDisturb((d) => !d)}
            className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
              doNotDisturb ? 'bg-[#e95420]' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
                doNotDisturb ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Right: GNOME Month Calendar */}
      <div>
        <div className="mb-3">
          <p className="text-[11px] text-white/55">{weekdayBanner}</p>
          <p className="text-sm font-semibold text-white">{dateBanner}</p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonthOffset((m) => m - 1)}
            className="grid size-7 cursor-pointer place-items-center rounded-full hover:bg-white/12"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs font-semibold text-white/90">{monthLabel}</span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonthOffset((m) => m + 1)}
            className="grid size-7 cursor-pointer place-items-center rounded-full hover:bg-white/12"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-white/50">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={`${d}-${i}`} className="py-1">
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
                className={`grid size-7 place-items-center rounded-full tabular-nums ${
                  isCurrentMonth && day === todayDate
                    ? 'bg-[#e95420] font-semibold text-white'
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

export interface UbuntuQuickSettingsProps {
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
  onOpenTerminal: () => void;
  onRebootToGrub: () => void;
  onShutdown: () => void;
}

export function UbuntuQuickSettings({
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
  onOpenTerminal,
  onRebootToGrub,
  onShutdown,
}: UbuntuQuickSettingsProps) {
  const [powerMode, setPowerMode] = useState<'Balanced' | 'Performance' | 'Power Saver'>(
    'Balanced'
  );
  const [showPowerOptions, setShowPowerOptions] = useState(false);

  const cyclePowerMode = () => {
    setPowerMode((prev) =>
      prev === 'Balanced'
        ? 'Performance'
        : prev === 'Performance'
          ? 'Power Saver'
          : 'Balanced'
    );
  };

  return (
    <div
      role="dialog"
      aria-label="GNOME Quick Settings"
      onClick={(e) => e.stopPropagation()}
      className="fixed top-9 right-3 z-[985] w-[min(92vw,340px)] rounded-2xl border border-white/12 bg-[#222222]/96 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.72)] backdrop-blur-3xl"
    >
      {/* Top Action Row: Battery Badge + Circular Utility Buttons */}
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/90">
          <BatteryFull className="size-4 text-emerald-400" />
          <span className="tabular-nums">98%</span>
        </span>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={onRebootToGrub}
            title="Switch OS (GRUB)"
            aria-label="Switch OS via GRUB"
            className="grid size-8 cursor-pointer place-items-center rounded-full bg-white/10 hover:bg-white/18"
          >
            <RotateCcw className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowPowerOptions((p) => !p)}
            title="Power Off / Session"
            aria-label="Power menu"
            className={`grid size-8 cursor-pointer place-items-center rounded-full transition-colors ${
              showPowerOptions ? 'bg-[#e95420] text-white' : 'bg-white/10 hover:bg-white/18'
            }`}
          >
            <Power className="size-3.5" />
          </button>

          {showPowerOptions && (
            <div className="absolute top-10 right-0 z-20 w-48 rounded-xl border border-white/12 bg-[#2c2c2c] p-1 text-xs shadow-2xl">
              <button
                type="button"
                onClick={onRebootToGrub}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-white/10"
              >
                <RotateCcw className="size-3.5" />
                <span>Restart to GRUB...</span>
              </button>
              <button
                type="button"
                onClick={onShutdown}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-300 hover:bg-[#e95420] hover:text-white"
              >
                <Power className="size-3.5" />
                <span>Power Off to Portfolio</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Yaru Sliders */}
      <div className="mb-4 space-y-3">
        <label className="flex items-center gap-3 text-xs">
          <Volume2 className="size-4 shrink-0 text-white/80" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Output volume"
            className="h-1.5 flex-1 cursor-pointer accent-[#e95420]"
          />
          <span className="w-8 text-right font-mono text-[10px] text-white/65 tabular-nums">
            {volume}%
          </span>
        </label>

        <label className="flex items-center gap-3 text-xs">
          <Sun className="size-4 shrink-0 text-white/80" />
          <input
            type="range"
            min={55}
            max={105}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            aria-label="Screen brightness"
            className="h-1.5 flex-1 cursor-pointer accent-[#e95420]"
          />
          <span className="w-8 text-right font-mono text-[10px] text-white/65 tabular-nums">
            {brightness}%
          </span>
        </label>
      </div>

      {/* GNOME 46 Two-Column Pill Toggles */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setWifiEnabled(!wifiEnabled)}
          className={`flex cursor-pointer items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors ${
            wifiEnabled && !airplaneMode
              ? 'bg-[#e95420] text-white'
              : 'bg-white/10 text-white/85 hover:bg-white/16'
          }`}
        >
          <Wifi className="size-4 shrink-0" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Wired / Wi-Fi</span>
            <span className="block truncate text-[10px] opacity-80">
              {wifiEnabled && !airplaneMode ? 'Trinity-5G' : 'Disconnected'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          className={`flex cursor-pointer items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors ${
            bluetoothEnabled && !airplaneMode
              ? 'bg-[#e95420] text-white'
              : 'bg-white/10 text-white/85 hover:bg-white/16'
          }`}
        >
          <Bluetooth className="size-4 shrink-0" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Bluetooth</span>
            <span className="block text-[10px] opacity-80">
              {bluetoothEnabled && !airplaneMode ? 'On' : 'Off'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={cyclePowerMode}
          className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-2.5 text-left text-white/90 transition-colors hover:bg-white/16"
        >
          <Cpu className="size-4 shrink-0 text-[#ff8c66]" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Power Mode</span>
            <span className="block truncate text-[10px] opacity-75">{powerMode}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setNightLight(!nightLight)}
          className={`flex cursor-pointer items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors ${
            nightLight
              ? 'bg-[#e95420] text-white'
              : 'bg-white/10 text-white/85 hover:bg-white/16'
          }`}
        >
          <Moon className="size-4 shrink-0" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Night Light</span>
            <span className="block text-[10px] opacity-80">
              {nightLight ? 'Active' : 'Off'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAirplaneMode(!airplaneMode)}
          className={`flex cursor-pointer items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors ${
            airplaneMode
              ? 'bg-[#e95420] text-white'
              : 'bg-white/10 text-white/85 hover:bg-white/16'
          }`}
        >
          <Plane className="size-4 shrink-0" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Airplane Mode</span>
            <span className="block text-[10px] opacity-80">
              {airplaneMode ? 'Enabled' : 'Off'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenTerminal}
          className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-2.5 text-left text-white/90 transition-colors hover:bg-white/16"
        >
          <ShieldAlert className="size-4 shrink-0 text-[#ff8c66]" />
          <div className="min-w-0 leading-tight">
            <span className="block font-medium">Red Team CLI</span>
            <span className="block truncate font-mono text-[10px] opacity-75">
              play breach
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export interface UbuntuActivitiesOverlayProps {
  mode: 'activities' | 'app-grid';
  apps: UbuntuAppItem[];
  openWindows: OSWindow[];
  vfs: FolderNode;
  onOpenApp: (appType: AppType, options?: { title?: string; filePath?: string }) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onSwitchMode: (mode: 'activities' | 'app-grid') => void;
  onClose: () => void;
}

export function UbuntuActivitiesOverlay({
  mode,
  apps,
  openWindows,
  vfs,
  onOpenApp,
  onFocusWindow,
  onCloseWindow,
  onSwitchMode,
  onClose,
}: UbuntuActivitiesOverlayProps) {
  const [query, setQuery] = useState('');
  const vfsFiles = useMemo(() => collectVfsFiles(vfs), [vfs]);
  const q = query.trim().toLowerCase();

  const filteredApps = useMemo(
    () => apps.filter((a) => a.label.toLowerCase().includes(q)),
    [apps, q]
  );

  const filteredFiles = useMemo(
    () =>
      vfsFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
      ),
    [vfsFiles, q]
  );

  return (
    <div
      role="dialog"
      aria-label={mode === 'app-grid' ? 'Ubuntu Show Applications' : 'Ubuntu Activities Overview'}
      onClick={onClose}
      className="fixed inset-x-0 top-7 bottom-0 left-16 z-[940] flex flex-col items-center overflow-y-auto bg-[#120810]/82 px-6 py-8 text-white backdrop-blur-2xl"
    >
      {/* GNOME Search Pill */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="mb-6 flex w-full max-w-md items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 shadow-lg focus-within:border-[#e95420]"
      >
        <Search className="size-4 shrink-0 text-white/70" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search apps & VFS files"
          aria-label="Search Ubuntu applications and files"
          className="w-full bg-transparent text-xs text-white placeholder:text-white/50 outline-none"
        />
      </div>

      {/* Mode Switcher Tabs */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="mb-8 flex items-center gap-2 rounded-full border border-white/12 bg-black/30 p-1 text-xs"
      >
        <button
          type="button"
          onClick={() => onSwitchMode('activities')}
          className={`cursor-pointer rounded-full px-4 py-1 font-medium transition-colors ${
            mode === 'activities'
              ? 'bg-[#e95420] text-white'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Workspaces
        </button>
        <button
          type="button"
          onClick={() => onSwitchMode('app-grid')}
          className={`cursor-pointer rounded-full px-4 py-1 font-medium transition-colors ${
            mode === 'app-grid'
              ? 'bg-[#e95420] text-white'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Search Results OR Overview/App Grid */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex-1"
      >
        {q ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                Applications
              </p>
              {filteredApps.length === 0 ? (
                <p className="text-xs text-white/45">No matching applications.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredApps.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onOpenApp(item.appType, item.options);
                        onClose();
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-left text-xs hover:bg-white/14"
                    >
                      <UbuntuAppIcon
                        appType={item.appType}
                        idHint={item.id}
                        className="size-7 shrink-0"
                      />
                      <span className="truncate font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                Files (VFS)
              </p>
              {filteredFiles.length === 0 ? (
                <p className="text-xs text-white/45">No matching files in VFS.</p>
              ) : (
                <div className="space-y-1.5">
                  {filteredFiles.slice(0, 6).map((file) => (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => {
                        onOpenApp('project-viewer', { title: file.name, filePath: file.path });
                        onClose();
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-left text-xs hover:bg-white/14"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <UbuntuAppIcon appType="project-viewer" className="size-6 shrink-0" />
                        <span className="truncate font-medium">{file.name}</span>
                      </div>
                      <span className="ml-2 font-mono text-[10px] text-white/50">
                        {file.path}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : mode === 'activities' ? (
          <div>
            {openWindows.length === 0 ? (
              <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] p-8 text-center">
                <p className="text-sm font-semibold text-white">
                  Workspace 1 is empty
                </p>
                <p className="mt-1 text-xs text-white/65">
                  Open Files, launch Terminal, or run{' '}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[#ff8c66]">
                    play breach
                  </code>{' '}
                  for Red Team Breach.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenApp('terminal');
                      onClose();
                    }}
                    className="cursor-pointer rounded-full bg-[#e95420] px-4 py-2 text-xs font-medium text-white hover:bg-[#d84815]"
                  >
                    Open Terminal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenApp('explorer', { title: 'Projects', filePath: '/projects' });
                      onClose();
                    }}
                    className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20"
                  >
                    Browse /projects
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-center text-xs font-medium text-white/65">
                  Click a window card to switch focus
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {openWindows.map((win) => (
                    <div
                      key={win.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#241b24]/95 shadow-xl transition-transform hover:scale-[1.02] hover:border-[#e95420]"
                    >
                      <button
                        type="button"
                        aria-label={`Close ${win.title}`}
                        onClick={() => onCloseWindow(win.id)}
                        className="absolute top-2.5 right-2.5 z-10 grid size-6 cursor-pointer place-items-center rounded-full bg-black/55 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#e95420] hover:text-white"
                      >
                        <X className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onFocusWindow(win.id);
                          onClose();
                        }}
                        className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center"
                      >
                        <UbuntuAppIcon appType={win.appType} className="size-12" />
                        <div>
                          <p className="text-xs font-semibold text-white">{win.title}</p>
                          <p className="mt-0.5 text-[11px] text-white/55">
                            {win.isMinimized ? 'Minimized' : 'Active'} ·{' '}
                            {win.filePath ?? win.appType}
                          </p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {apps.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onOpenApp(item.appType, item.options);
                  onClose();
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-transparent p-4 text-center transition-colors hover:border-white/12 hover:bg-white/10 active:scale-95"
              >
                <UbuntuAppIcon
                  appType={item.appType}
                  idHint={item.id}
                  className="size-12 drop-shadow-lg"
                />
                <span className="text-xs font-medium text-white/95">{item.label}</span>
              </button>
            ))}

            {/* Explicit Ubuntu CLI Game Card -> launches Terminal */}
            <button
              type="button"
              onClick={() => {
                onOpenApp('terminal');
                onClose();
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-transparent p-4 text-center transition-colors hover:border-white/12 hover:bg-white/10 active:scale-95"
            >
              <div className="grid size-12 place-items-center rounded-xl border border-[#e95420]/50 bg-[#300a24] shadow-lg">
                <ShieldAlert className="size-6 text-[#ff8c66]" />
              </div>
              <span className="text-xs font-medium text-white/95">
                Red Team Breach
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UbuntuDesktopContextMenu({
  x,
  y,
  onClose,
  onOpenAppGrid,
  onToggleNightLight,
  onRebootToGrub,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onOpenAppGrid: () => void;
  onToggleNightLight: () => void;
  onRebootToGrub: () => void;
}) {
  const makeDirectory = useOSStore((s) => s.makeDirectory);
  const createFile = useOSStore((s) => s.createFile);
  const openWindow = useOSStore((s) => s.openWindow);

  const handleNewFolder = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    makeDirectory('/', `Folder_${suffix}`);
    openWindow('explorer', { title: 'Files', filePath: '/' });
    onClose();
  };

  const handleNewDocument = () => {
    const suffix = Math.floor(10 + Math.random() * 89);
    const name = `notes-${suffix}.txt`;
    createFile('/', name, 'Created from Ubuntu 24.04 GNOME Desktop.\n');
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
      className="fixed z-[995] w-52 rounded-xl border border-white/12 bg-[#282828]/96 p-1.5 text-xs text-white shadow-2xl backdrop-blur-2xl"
    >
      <button
        type="button"
        onClick={handleNewFolder}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <FolderPlus className="size-3.5" />
        <span>New Folder</span>
      </button>

      <button
        type="button"
        onClick={handleNewDocument}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <FilePlus2 className="size-3.5" />
        <span>New Document</span>
      </button>

      <button
        type="button"
        onClick={() => {
          openWindow('terminal');
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <TerminalIcon className="size-3.5" />
        <span>Open in Terminal</span>
      </button>

      <div className="my-1 border-t border-white/10" />

      <button
        type="button"
        onClick={() => {
          onOpenAppGrid();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <LayoutGrid className="size-3.5" />
        <span>Show Applications</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onToggleNightLight();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <Check className="size-3.5" />
        <span>Toggle Night Light</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onRebootToGrub();
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#e95420]"
      >
        <RotateCcw className="size-3.5" />
        <span>Switch OS (GRUB)</span>
      </button>
    </div>
  );
}
