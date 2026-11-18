import { useEffect, useRef, useState } from 'react';
import {
  Bomb,
  FolderOpen,
  Gamepad2,
  Layers,
  Maximize2,
  Minimize2,
  Minus,
  Terminal,
  User,
  X,
} from 'lucide-react';
import { Rnd } from 'react-rnd';
import { AppType, useOSStore } from '@/src/os/useOSStore';
import { OSWindowContent } from './OSWindowContent';
import {
  MacAppIcon,
  MacControlCenter,
  MacDesktopContextMenu,
  MacDock,
  MacFlyout,
  MacLaunchpadOverlay,
  MacMenuBar,
  MacNotificationCenter,
  MacSpotlightOverlay,
} from './MacOSShell';
import {
  UbuntuActivitiesOverlay,
  UbuntuAppIcon,
  UbuntuCalendarPopover,
  UbuntuDesktopContextMenu,
  UbuntuDock,
  UbuntuFlyout,
  UbuntuQuickSettings,
  UbuntuTopBar,
} from './UbuntuShell';
import {
  SnapLayoutPreset,
  Win11AppIcon,
  Win11CalendarCenter,
  Win11DesktopContextMenu,
  Win11QuickSettings,
  Win11SnapLayoutsMenu,
  Win11StartMenu,
  Win11Taskbar,
  Win11WidgetsBoard,
} from './Windows11Shell';

interface DesktopEnvironmentProps {
  onShutdownToPortfolio: () => void;
}

const DESKTOP_APPS: {
  id: string;
  appType: AppType;
  label: string;
  windowsOnly?: boolean;
  macosDockOnly?: boolean;
  options?: { title?: string; filePath?: string };
}[] = [
  { id: 'explorer', appType: 'explorer', label: 'File Explorer' },
  {
    id: 'projects',
    appType: 'explorer',
    label: 'Projects',
    options: { title: 'Projects', filePath: '/projects' },
  },
  { id: 'terminal', appType: 'terminal', label: 'Terminal' },
  { id: 'tetris', appType: 'tetris', label: 'Tetris' },
  { id: 'minesweeper', appType: 'minesweeper', label: 'Minesweeper', windowsOnly: true },
  { id: 'memory-match', appType: 'memory-match', label: 'Memory Match', macosDockOnly: true },
  { id: 'about', appType: 'about', label: 'About Me' },
];

function formatClock(os: 'windows' | 'macos' | 'ubuntu', now: Date): {
  time: string;
  date: string;
} {
  if (os === 'macos') {
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return { time: `${weekday} ${monthDay}  ${time}`, date: '' };
  }

  if (os === 'ubuntu') {
    const monthDay = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return { time: `${monthDay}  ${time}`, date: '' };
  }

  // Windows taskbar stacked time + date
  return {
    time: now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    date: now.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export function DesktopEnvironment({
  onShutdownToPortfolio,
}: DesktopEnvironmentProps) {
  const currentOS = useOSStore((s) => s.currentOS);
  const openWindows = useOSStore((s) => s.openWindows);
  const activeWindowId = useOSStore((s) => s.activeWindowId);

  const shutdownOS = useOSStore((s) => s.shutdownOS);
  const openWindow = useOSStore((s) => s.openWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const toggleMaximizeWindow = useOSStore((s) => s.toggleMaximizeWindow);
  const updateWindowPosition = useOSStore((s) => s.updateWindowPosition);
  const updateWindowSize = useOSStore((s) => s.updateWindowSize);
  const makeDirectory = useOSStore((s) => s.makeDirectory);

  const vfs = useOSStore((s) => s.vfs);
  const wifiEnabled = useOSStore((s) => s.wifiEnabled);
  const bluetoothEnabled = useOSStore((s) => s.bluetoothEnabled);
  const airplaneMode = useOSStore((s) => s.airplaneMode);
  const nightLight = useOSStore((s) => s.nightLight);
  const brightness = useOSStore((s) => s.brightness);
  const volume = useOSStore((s) => s.volume);

  const setWifiEnabled = useOSStore((s) => s.setWifiEnabled);
  const setBluetoothEnabled = useOSStore((s) => s.setBluetoothEnabled);
  const setAirplaneMode = useOSStore((s) => s.setAirplaneMode);
  const setNightLight = useOSStore((s) => s.setNightLight);
  const setBrightness = useOSStore((s) => s.setBrightness);
  const setVolume = useOSStore((s) => s.setVolume);

  const [now, setNow] = useState(() => new Date());
  const [win11Flyout, setWin11Flyout] = useState<
    'start' | 'search' | 'quick-settings' | 'calendar' | 'widgets' | 'tray' | null
  >(null);
  const [ubuntuFlyout, setUbuntuFlyout] = useState<UbuntuFlyout>(null);
  const [macFlyout, setMacFlyout] = useState<MacFlyout>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(
    null
  );
  const [snapHoverWindowId, setSnapHoverWindowId] = useState<string | null>(null);
  const [dragSnapZone, setDragSnapZone] = useState<
    'left-half' | 'right-half' | 'maximize' | null
  >(null);

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const snapCloseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!win11Flyout && !ubuntuFlyout && !macFlyout && !desktopContextMenu) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!menuContainerRef.current?.contains(e.target as Node)) {
        setWin11Flyout(null);
        setUbuntuFlyout(null);
        setMacFlyout(null);
        setDesktopContextMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setWin11Flyout(null);
        setUbuntuFlyout(null);
        setMacFlyout(null);
        setDesktopContextMenu(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [win11Flyout, ubuntuFlyout, macFlyout, desktopContextMenu]);

  if (!currentOS) return null;

  const isWindows = currentOS === 'windows';
  const isMacOS = currentOS === 'macos';
  const isUbuntu = currentOS === 'ubuntu';
  const clockOS: 'windows' | 'macos' | 'ubuntu' = isMacOS
    ? 'macos'
    : isUbuntu
      ? 'ubuntu'
      : 'windows';
  const clock = formatClock(clockOS, now);

  const activeWindow = openWindows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeAppName = activeWindow?.title ?? (isMacOS ? 'Finder' : 'Files');

  const handleShutdown = () => {
    setWin11Flyout(null);
    setUbuntuFlyout(null);
    setMacFlyout(null);
    shutdownOS();
    onShutdownToPortfolio();
  };

  const handleRebootToGrub = () => {
    setWin11Flyout(null);
    setUbuntuFlyout(null);
    setMacFlyout(null);
    shutdownOS();
  };

  const handleSnapWindow = (winId: string, preset: SnapLayoutPreset) => {
    const ws = workspaceRef.current;
    const width = ws?.clientWidth ?? 1200;
    const height = ws?.clientHeight ?? 640;
    const halfW = Math.floor(width / 2);
    const halfH = Math.floor(height / 2);
    const twoThirdsW = Math.floor(width * 0.65);

    const layouts: Record<SnapLayoutPreset, { x: number; y: number; w: number; h: number }> = {
      'left-half': { x: 0, y: 0, w: halfW, h: height },
      'right-half': { x: halfW, y: 0, w: width - halfW, h: height },
      'left-two-thirds': { x: 0, y: 0, w: twoThirdsW, h: height },
      'right-one-third': { x: twoThirdsW, y: 0, w: width - twoThirdsW, h: height },
      'top-left': { x: 0, y: 0, w: halfW, h: halfH },
      'top-right': { x: halfW, y: 0, w: width - halfW, h: halfH },
      'bottom-left': { x: 0, y: halfH, w: halfW, h: height - halfH },
      'bottom-right': { x: halfW, y: halfH, w: width - halfW, h: height - halfH },
    };

    const rect = layouts[preset];
    focusWindow(winId);
    updateWindowSize(winId, rect.w, rect.h, rect.x, rect.y);
    setSnapHoverWindowId(null);
  };

  const detectDragSnapZone = (
    event: unknown,
    d: { x: number; y: number },
    winWidth: number
  ): 'left-half' | 'right-half' | 'maximize' | null => {
    if (!isWindows) return null;
    const ws = workspaceRef.current;
    if (!ws) return null;

    const wsRect = ws.getBoundingClientRect();
    let clientX: number | null = null;
    let clientY: number | null = null;

    if (event && typeof event === 'object') {
      const e = event as { clientX?: number; clientY?: number; touches?: { clientX: number; clientY: number }[] };
      if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    }

    if (clientX !== null && clientY !== null) {
      if (clientX - wsRect.left <= 18) return 'left-half';
      if (wsRect.right - clientX <= 18) return 'right-half';
      if (clientY - wsRect.top <= 14) return 'maximize';
    }

    if (d.x <= 2) return 'left-half';
    if (d.x + winWidth >= wsRect.width - 2) return 'right-half';
    if (d.y <= 2) return 'maximize';
    return null;
  };

  const handleShowDesktop = () => {
    openWindows.forEach((w) => {
      if (!w.isMinimized) minimizeWindow(w.id);
    });
    setWin11Flyout(null);
  };

  const renderAppIcon = (appType: AppType, className = 'size-5', idHint?: string) => {
    if (isWindows) {
      return <Win11AppIcon appType={appType} idHint={idHint} className={className} />;
    }
    if (isUbuntu) {
      return <UbuntuAppIcon appType={appType} idHint={idHint} className={className} />;
    }
    if (isMacOS) {
      return <MacAppIcon appType={appType} idHint={idHint} className={className} />;
    }
    if (appType === 'terminal') return <Terminal className={className} />;
    if (appType === 'tetris') return <Gamepad2 className={className} />;
    if (appType === 'minesweeper') return <Bomb className={className} />;
    if (appType === 'memory-match') return <Layers className={className} />;
    if (appType === 'about') return <User className={className} />;
    return <FolderOpen className={className} />;
  };

  const visibleDesktopApps = DESKTOP_APPS.filter(
    (item) => (!item.windowsOnly || isWindows) && !item.macosDockOnly
  );

  const macosDockApps = DESKTOP_APPS.filter(
    (item) => !item.windowsOnly && (!item.macosDockOnly || isMacOS)
  );

  return (
    <div
      ref={menuContainerRef}
      onClick={() => {
        setWin11Flyout(null);
        setUbuntuFlyout(null);
        setMacFlyout(null);
        setDesktopContextMenu(null);
      }}
      style={
        (isWindows || isUbuntu || isMacOS) && brightness !== 100
          ? { filter: `brightness(${brightness}%)` }
          : undefined
      }
      className={`os-root ${currentOS}-theme relative flex h-dvh w-full flex-col overflow-hidden`}
      data-os={currentOS}
    >
      {/* Night Light / Night Shift warm tint overlay */}
      {(isWindows || isUbuntu || isMacOS) && nightLight && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[999] bg-amber-500/15 mix-blend-multiply"
        />
      )}
      {/* 1. TOP GLOBAL PANEL (macOS Menu Bar OR Ubuntu GNOME Top Bar; omitted on Windows) */}
      {isMacOS && (
        <MacMenuBar
          activeAppName={activeAppName}
          clockTime={clock.time}
          activeFlyout={macFlyout}
          wifiEnabled={wifiEnabled}
          airplaneMode={airplaneMode}
          onToggleFlyout={(target) => {
            setDesktopContextMenu(null);
            setMacFlyout((prev) => (prev === target ? null : target));
          }}
          onOpenApp={(appType, options) => {
            setMacFlyout(null);
            openWindow(appType, options);
          }}
          onCreateNewFolder={() => {
            const suffix = Math.floor(10 + Math.random() * 89);
            makeDirectory('/', `untitled folder ${suffix}`);
            openWindow('explorer', { title: 'Finder', filePath: '/' });
            setMacFlyout(null);
          }}
          onZoomActive={() => {
            if (activeWindowId) toggleMaximizeWindow(activeWindowId);
            setMacFlyout(null);
          }}
          onMinimizeActive={() => {
            if (activeWindowId) minimizeWindow(activeWindowId);
            setMacFlyout(null);
          }}
          onCloseActive={() => {
            if (activeWindowId) closeWindow(activeWindowId);
            setMacFlyout(null);
          }}
          onRebootToGrub={handleRebootToGrub}
          onShutdown={handleShutdown}
        />
      )}

      {isUbuntu && (
        <UbuntuTopBar
          activeAppName={activeAppName}
          clockTime={clock.time}
          activeFlyout={ubuntuFlyout}
          onToggleFlyout={(target) => {
            setDesktopContextMenu(null);
            setUbuntuFlyout((prev) => (prev === target ? null : target));
          }}
          wifiEnabled={wifiEnabled}
          airplaneMode={airplaneMode}
          volume={volume}
        />
      )}

      {/* 2. MIDDLE STAGE: Left Ubuntu Dock (optional) + Window-Bounded <main> */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Ubuntu Pinned Left Edge Yaru Dock */}
        {isUbuntu && (
          <UbuntuDock
            apps={visibleDesktopApps}
            openWindows={openWindows}
            activeWindowId={activeWindowId}
            activeFlyout={ubuntuFlyout}
            onOpenApp={(appType, options) => {
              setUbuntuFlyout(null);
              openWindow(appType, options);
            }}
            onFocusOrMinimizeWindow={(win) => {
              setUbuntuFlyout(null);
              if (win.isMinimized || win.id !== activeWindowId) {
                focusWindow(win.id);
              } else {
                minimizeWindow(win.id);
              }
            }}
            onToggleAppGrid={() => {
              setDesktopContextMenu(null);
              setUbuntuFlyout((prev) => (prev === 'app-grid' ? null : 'app-grid'));
            }}
          />
        )}

        {/* Desktop Canvas: <Rnd bounds="parent"> constrains ALL dragging & resizing inside this unobstructed region */}
        <main
          ref={workspaceRef}
          onClick={() => setSelectedIconId(null)}
          onContextMenu={(e) => {
            if (!isWindows && !isUbuntu && !isMacOS) return;
            const target = e.target as HTMLElement;
            if (target.closest('.os-window-frame')) return;
            e.preventDefault();
            setWin11Flyout(null);
            setUbuntuFlyout(null);
            setMacFlyout(null);
            setDesktopContextMenu({ x: e.clientX, y: e.clientY });
          }}
          className="os-workspace relative min-h-0 flex-1 overflow-hidden p-4 sm:p-5"
        >
          {/* Desktop Shortcut Icons (macOS right-aligned like Finder; Windows & Ubuntu left-aligned) */}
          <div
            aria-label="Trinity OS Desktop Shortcuts"
            className={`flex w-24 flex-col gap-2 ${
              isMacOS ? 'ml-auto items-end' : 'items-start'
            }`}
          >
            {visibleDesktopApps.map((item) => {
              const isSelected = (isWindows || isUbuntu || isMacOS) && selectedIconId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIconId(item.id);
                    openWindow(item.appType, item.options);
                  }}
                  className={`flex w-[84px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[7px] border px-1.5 py-2 text-center transition-colors ${
                    isWindows
                      ? isSelected
                        ? 'border-white/30 bg-white/15'
                        : 'border-transparent hover:border-white/15 hover:bg-white/10'
                      : isUbuntu
                        ? isSelected
                          ? 'border-[#e95420]/70 bg-[#e95420]/25'
                          : 'border-transparent hover:border-white/15 hover:bg-white/10'
                        : isSelected
                          ? 'border-white/35 bg-white/20 backdrop-blur-sm'
                          : 'border-transparent hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {isWindows ? (
                    <Win11AppIcon
                      appType={item.appType}
                      idHint={item.id}
                      className="size-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
                    />
                  ) : isUbuntu ? (
                    <UbuntuAppIcon
                      appType={item.appType}
                      idHint={item.id}
                      className="size-10 drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
                    />
                  ) : (
                    <MacAppIcon
                      appType={item.appType}
                      idHint={item.id}
                      className="size-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]"
                    />
                  )}
                  <span className="text-[11px] font-medium leading-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                    {isMacOS && item.id === 'explorer' ? 'Macintosh HD' : item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Windows 11 Drag-to-Edge Snap Assist Preview Overlay */}
          {isWindows && dragSnapZone && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute z-[890] p-2 transition-all duration-150 ${
                dragSnapZone === 'left-half'
                  ? 'inset-y-0 left-0 w-1/2'
                  : dragSnapZone === 'right-half'
                    ? 'inset-y-0 right-0 w-1/2'
                    : 'inset-0'
              }`}
            >
              <div className="h-full w-full rounded-xl border-2 border-[#60cdff]/75 bg-[#60cdff]/16 shadow-[0_0_40px_rgba(96,205,255,0.22)] backdrop-blur-md" />
            </div>
          )}

          {/* Single-Tree react-rnd Window Manager */}
          {openWindows
            .filter((win) => !win.isMinimized)
            .map((win) => {
              const isActive = win.id === activeWindowId;
              return (
                <Rnd
                  key={win.id}
                  size={{
                    width: win.isMaximized ? '100%' : win.width,
                    height: win.isMaximized ? '100%' : win.height,
                  }}
                  position={{
                    x: win.isMaximized ? 0 : win.x,
                    y: win.isMaximized ? 0 : win.y,
                  }}
                  minWidth={360}
                  minHeight={240}
                  bounds="parent"
                  dragHandleClassName="os-window-drag-handle"
                  disableDragging={win.isMaximized}
                  enableResizing={!win.isMaximized}
                  style={{ zIndex: win.zIndex }}
                  onMouseDown={() => focusWindow(win.id)}
                  onDragStart={() => focusWindow(win.id)}
                  onDrag={(e, d) => {
                    if (!isWindows) return;
                    const zone = detectDragSnapZone(e, d, win.width);
                    setDragSnapZone((prev) => (prev === zone ? prev : zone));
                  }}
                  onResizeStart={() => focusWindow(win.id)}
                  onDragStop={(e, d) => {
                    if (isWindows) {
                      const zone = detectDragSnapZone(e, d, win.width) ?? dragSnapZone;
                      setDragSnapZone(null);
                      if (zone === 'left-half' || zone === 'right-half') {
                        handleSnapWindow(win.id, zone);
                        return;
                      }
                      if (zone === 'maximize') {
                        if (!win.isMaximized) toggleMaximizeWindow(win.id);
                        return;
                      }
                    }
                    updateWindowPosition(win.id, d.x, d.y);
                  }}
                  onResizeStop={(_e, _dir, ref, _delta, position) => {
                    updateWindowSize(
                      win.id,
                      parseInt(ref.style.width, 10),
                      parseInt(ref.style.height, 10),
                      position.x,
                      position.y
                    );
                  }}
                  className="os-window-frame"
                >
                  <section
                    aria-label={win.title}
                    onMouseDown={() => focusWindow(win.id)}
                    className={`os-surface flex h-full w-full flex-col overflow-hidden border shadow-2xl transition-shadow ${
                      isWindows ? 'rounded-lg' : 'rounded-xl'
                    } ${
                      isActive
                        ? 'border-[var(--os-accent)] shadow-[0_24px_60px_rgba(0,0,0,0.6)]'
                        : 'border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    {/* OS-Authentic Window Chrome */}
                    <div
                      onDoubleClick={() => toggleMaximizeWindow(win.id)}
                      className={`os-window-drag-handle relative shrink-0 cursor-grab border-b select-none active:cursor-grabbing ${
                        isWindows
                          ? 'flex h-9 items-center justify-between gap-3 border-white/10 bg-[#1c2333]/92 pl-3 pr-0'
                          : isMacOS
                            ? 'grid h-9 grid-cols-[1fr_auto_1fr] items-center gap-2 border-white/12 bg-white/[0.07] px-3'
                            : 'grid h-10 grid-cols-[1fr_auto_1fr] items-center gap-2 border-white/10 bg-[#2c2c2c] px-3'
                      }`}
                    >
                      {isMacOS ? (
                        <>
                          <div className="group/traffic flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Close ${win.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeWindow(win.id);
                              }}
                              className="grid size-3 cursor-pointer place-items-center rounded-full bg-[#ff5f57] text-[8px] font-bold leading-none text-black/0 transition-colors group-hover/traffic:text-black/75"
                            >
                              ×
                            </button>
                            <button
                              type="button"
                              aria-label={`Minimize ${win.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                minimizeWindow(win.id);
                              }}
                              className="grid size-3 cursor-pointer place-items-center rounded-full bg-[#febc2e] text-[8px] font-bold leading-none text-black/0 transition-colors group-hover/traffic:text-black/75"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              aria-label={`${win.isMaximized ? 'Restore' : 'Maximize'} ${win.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMaximizeWindow(win.id);
                              }}
                              className="grid size-3 cursor-pointer place-items-center rounded-full bg-[#28c840] text-[8px] font-bold leading-none text-black/0 transition-colors group-hover/traffic:text-black/75"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex min-w-0 items-center justify-center gap-1.5 text-xs font-medium text-white/95">
                            {renderAppIcon(win.appType, 'size-3.5 shrink-0')}
                            <span className="truncate">{win.title}</span>
                          </div>

                          <div aria-hidden="true" />
                        </>
                      ) : isUbuntu ? (
                        <>
                          <div className="flex items-center">
                            {renderAppIcon(win.appType, 'size-4 shrink-0')}
                          </div>
                          <span className="truncate text-center text-xs font-semibold text-white/95">
                            {win.title}
                          </span>
                        </>
                      ) : (
                        <div className="flex min-w-0 items-center gap-2 text-xs font-medium">
                          {renderAppIcon(win.appType, 'size-4 shrink-0')}
                          <span className="truncate">{win.title}</span>
                        </div>
                      )}

                      {isMacOS ? null : isWindows ? (
                        <div
                          className="relative flex h-full shrink-0 items-stretch"
                          onMouseLeave={() => {
                            snapCloseTimerRef.current = window.setTimeout(
                              () => setSnapHoverWindowId(null),
                              180
                            );
                          }}
                          onMouseEnter={() => {
                            if (snapCloseTimerRef.current !== null) {
                              window.clearTimeout(snapCloseTimerRef.current);
                            }
                          }}
                        >
                          <button
                            type="button"
                            aria-label={`Minimize ${win.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              minimizeWindow(win.id);
                            }}
                            className="grid h-full w-11 cursor-pointer place-items-center text-white/85 transition-colors hover:bg-white/10"
                          >
                            <Minus className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            aria-label={`${win.isMaximized ? 'Restore' : 'Maximize'} ${win.title}`}
                            onMouseEnter={() => {
                              if (snapCloseTimerRef.current !== null) {
                                window.clearTimeout(snapCloseTimerRef.current);
                              }
                              setSnapHoverWindowId(win.id);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSnapHoverWindowId(null);
                              toggleMaximizeWindow(win.id);
                            }}
                            className="grid h-full w-11 cursor-pointer place-items-center text-white/85 transition-colors hover:bg-white/10"
                          >
                            {win.isMaximized ? (
                              <Minimize2 className="size-3" />
                            ) : (
                              <Maximize2 className="size-3" />
                            )}
                          </button>

                          {snapHoverWindowId === win.id && (
                            <Win11SnapLayoutsMenu
                              onSnap={(preset) => handleSnapWindow(win.id, preset)}
                            />
                          )}

                          <button
                            type="button"
                            aria-label={`Close ${win.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeWindow(win.id);
                            }}
                            className="grid h-full w-11 cursor-pointer place-items-center text-white/85 transition-colors hover:bg-[#c42b1c] hover:text-white"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex shrink-0 items-center justify-end gap-1.5">
                          <button
                            type="button"
                            aria-label={`Minimize ${win.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              minimizeWindow(win.id);
                            }}
                            className="grid size-6 cursor-pointer place-items-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-white/20"
                          >
                            <Minus className="size-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`${win.isMaximized ? 'Restore' : 'Maximize'} ${win.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMaximizeWindow(win.id);
                            }}
                            className="grid size-6 cursor-pointer place-items-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-white/20"
                          >
                            {win.isMaximized ? (
                              <Minimize2 className="size-3" />
                            ) : (
                              <Maximize2 className="size-3" />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={`Close ${win.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeWindow(win.id);
                            }}
                            className="grid size-6 cursor-pointer place-items-center rounded-full bg-[#3e3e3e] text-white/90 transition-colors hover:bg-[#e95420] hover:text-white"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Window Body */}
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <OSWindowContent win={win} />
                    </div>
                  </section>
                </Rnd>
              );
            })}
        </main>
      </div>

      {/* 3. BOTTOM NAVIGATION BAR: Windows 11 Centered Taskbar + Flyouts OR macOS Floating Dock */}
      {isWindows && (
        <>
          {(win11Flyout === 'start' || win11Flyout === 'search') && (
            <Win11StartMenu
              apps={visibleDesktopApps}
              vfs={vfs}
              focusSearchOnOpen={win11Flyout === 'search'}
              onOpenApp={(appType, options) => openWindow(appType, options)}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
              onClose={() => setWin11Flyout(null)}
            />
          )}

          {win11Flyout === 'quick-settings' && (
            <Win11QuickSettings
              wifiEnabled={wifiEnabled}
              setWifiEnabled={setWifiEnabled}
              bluetoothEnabled={bluetoothEnabled}
              setBluetoothEnabled={setBluetoothEnabled}
              airplaneMode={airplaneMode}
              setAirplaneMode={setAirplaneMode}
              nightLight={nightLight}
              setNightLight={setNightLight}
              brightness={brightness}
              setBrightness={setBrightness}
              volume={volume}
              setVolume={setVolume}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
            />
          )}

          {win11Flyout === 'calendar' && <Win11CalendarCenter now={now} />}

          {win11Flyout === 'widgets' && (
            <Win11WidgetsBoard
              onOpenApp={(appType, options) => openWindow(appType, options)}
              onClose={() => setWin11Flyout(null)}
            />
          )}

          {desktopContextMenu && (
            <Win11DesktopContextMenu
              x={desktopContextMenu.x}
              y={desktopContextMenu.y}
              onClose={() => setDesktopContextMenu(null)}
              onRefresh={() => setSelectedIconId(null)}
              onToggleNightLight={() => setNightLight(!nightLight)}
              onRebootToGrub={handleRebootToGrub}
            />
          )}

          <Win11Taskbar
            pinnedApps={visibleDesktopApps}
            openWindows={openWindows}
            activeWindowId={activeWindowId}
            activeFlyout={win11Flyout}
            clock={clock}
            onToggleFlyout={(target) => {
              setDesktopContextMenu(null);
              setWin11Flyout((prev) => (prev === target ? null : target));
            }}
            onOpenApp={(appType, options) => {
              setWin11Flyout(null);
              openWindow(appType, options);
            }}
            onFocusOrMinimizeWindow={(win) => {
              setWin11Flyout(null);
              if (win.isMinimized || win.id !== activeWindowId) {
                focusWindow(win.id);
              } else {
                minimizeWindow(win.id);
              }
            }}
            onShowDesktop={handleShowDesktop}
            onRebootToGrub={handleRebootToGrub}
            onShutdown={handleShutdown}
          />
        </>
      )}

      {isUbuntu && (
        <>
          {ubuntuFlyout === 'calendar' && <UbuntuCalendarPopover now={now} />}

          {ubuntuFlyout === 'quick-settings' && (
            <UbuntuQuickSettings
              wifiEnabled={wifiEnabled}
              setWifiEnabled={setWifiEnabled}
              bluetoothEnabled={bluetoothEnabled}
              setBluetoothEnabled={setBluetoothEnabled}
              airplaneMode={airplaneMode}
              setAirplaneMode={setAirplaneMode}
              nightLight={nightLight}
              setNightLight={setNightLight}
              brightness={brightness}
              setBrightness={setBrightness}
              volume={volume}
              setVolume={setVolume}
              onOpenTerminal={() => {
                setUbuntuFlyout(null);
                openWindow('terminal');
              }}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
            />
          )}

          {(ubuntuFlyout === 'activities' || ubuntuFlyout === 'app-grid') && (
            <UbuntuActivitiesOverlay
              mode={ubuntuFlyout}
              apps={visibleDesktopApps}
              openWindows={openWindows}
              vfs={vfs}
              onOpenApp={(appType, options) => openWindow(appType, options)}
              onFocusWindow={(id) => focusWindow(id)}
              onCloseWindow={(id) => closeWindow(id)}
              onSwitchMode={(nextMode) => setUbuntuFlyout(nextMode)}
              onClose={() => setUbuntuFlyout(null)}
            />
          )}

          {desktopContextMenu && (
            <UbuntuDesktopContextMenu
              x={desktopContextMenu.x}
              y={desktopContextMenu.y}
              onClose={() => setDesktopContextMenu(null)}
              onOpenAppGrid={() => setUbuntuFlyout('app-grid')}
              onToggleNightLight={() => setNightLight(!nightLight)}
              onRebootToGrub={handleRebootToGrub}
            />
          )}
        </>
      )}

      {isMacOS && (
        <>
          {macFlyout === 'control-center' && (
            <MacControlCenter
              wifiEnabled={wifiEnabled}
              setWifiEnabled={setWifiEnabled}
              bluetoothEnabled={bluetoothEnabled}
              setBluetoothEnabled={setBluetoothEnabled}
              airplaneMode={airplaneMode}
              setAirplaneMode={setAirplaneMode}
              nightLight={nightLight}
              setNightLight={setNightLight}
              brightness={brightness}
              setBrightness={setBrightness}
              volume={volume}
              setVolume={setVolume}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
            />
          )}

          {macFlyout === 'notifications' && <MacNotificationCenter now={now} />}

          {macFlyout === 'spotlight' && (
            <MacSpotlightOverlay
              apps={macosDockApps}
              vfs={vfs}
              onOpenApp={(appType, options) => openWindow(appType, options)}
              onToggleNightLight={() => setNightLight(!nightLight)}
              onRebootToGrub={handleRebootToGrub}
              onClose={() => setMacFlyout(null)}
            />
          )}

          {macFlyout === 'launchpad' && (
            <MacLaunchpadOverlay
              apps={macosDockApps}
              onOpenApp={(appType, options) => openWindow(appType, options)}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
              onClose={() => setMacFlyout(null)}
            />
          )}

          {desktopContextMenu && (
            <MacDesktopContextMenu
              x={desktopContextMenu.x}
              y={desktopContextMenu.y}
              onClose={() => setDesktopContextMenu(null)}
              onOpenSpotlight={() => setMacFlyout('spotlight')}
              onOpenLaunchpad={() => setMacFlyout('launchpad')}
              onToggleNightLight={() => setNightLight(!nightLight)}
              onRebootToGrub={handleRebootToGrub}
            />
          )}

          <MacDock
            dockApps={macosDockApps}
            openWindows={openWindows}
            activeWindowId={activeWindowId}
            launchpadActive={macFlyout === 'launchpad'}
            onToggleLaunchpad={() => {
              setDesktopContextMenu(null);
              setMacFlyout((prev) => (prev === 'launchpad' ? null : 'launchpad'));
            }}
            onOpenApp={(appType, options) => {
              setMacFlyout(null);
              openWindow(appType, options);
            }}
            onFocusOrMinimizeWindow={(win) => {
              setMacFlyout(null);
              if (win.isMinimized || win.id !== activeWindowId) {
                focusWindow(win.id);
              } else {
                minimizeWindow(win.id);
              }
            }}
            onRebootToGrub={handleRebootToGrub}
            onShutdown={handleShutdown}
          />
        </>
      )}
    </div>
  );
}
