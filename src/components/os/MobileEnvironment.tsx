import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronUp,
  Power,
  RotateCcw,
  Search,
  Signal,
  Terminal as TerminalIcon,
  Wifi,
} from 'lucide-react';
import { AnimatePresence, motion, PanInfo, useReducedMotion } from 'motion/react';
import { useOSStore } from '@/src/os/useOSStore';
import {
  MobileAppIconBadge,
  MobileAppTile,
  MobileHomeWidgets,
  MobileQuickPanel,
  MobileSearchOverlay,
} from './MobileShellWidgets';
import { OSWindowContent } from './OSWindowContent';

interface MobileEnvironmentProps {
  onShutdownToPortfolio: () => void;
}

const MOBILE_APP_TILES: MobileAppTile[] = [
  {
    id: 'projects',
    label: 'Projects',
    sublabel: '5 Builds',
    appType: 'explorer',
    title: 'Projects',
    filePath: '/projects',
    icon: 'projects',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    sublabel: 'CLI Shell',
    appType: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
  },
  {
    id: 'settings',
    label: 'Settings',
    sublabel: 'System',
    appType: 'settings',
    title: 'Settings',
    icon: 'settings',
  },
  {
    id: 'about',
    label: 'About Me',
    sublabel: 'Developer',
    appType: 'about',
    title: 'About Dhrumil',
    icon: 'about',
  },
  {
    id: 'explorer',
    label: 'Files',
    sublabel: 'VFS Root',
    appType: 'explorer',
    title: 'File Explorer',
    filePath: '/',
    icon: 'explorer',
  },
  {
    id: 'finanger',
    label: 'Finanger',
    sublabel: 'Spring Boot',
    appType: 'project-viewer',
    title: 'finanger.md',
    filePath: '/projects/finanger.md',
    icon: 'finanger',
  },
  {
    id: 'vm-emulator',
    label: '32-bit VM',
    sublabel: 'Java ISA',
    appType: 'project-viewer',
    title: '32bit-vm-emulator.md',
    filePath: '/projects/32bit-vm-emulator.md',
    icon: 'vm',
  },
  {
    id: 'skills',
    label: 'Skills',
    sublabel: 'Stack',
    appType: 'project-viewer',
    title: 'skills.txt',
    filePath: '/skills.txt',
    icon: 'skills',
  },
  {
    id: 'resume',
    label: 'Resume',
    sublabel: 'CV.md',
    appType: 'project-viewer',
    title: 'resume.md',
    filePath: '/resume.md',
    icon: 'resume',
  },
  {
    id: 'tetris',
    label: 'Tetris',
    sublabel: '10×20 Game',
    appType: 'tetris',
    title: 'Tetris',
    icon: 'tetris',
  },
  {
    id: 'game-2048',
    label: '2048',
    sublabel: 'Swipe Puzzle',
    appType: 'game-2048',
    title: '2048',
    icon: '2048',
  },
];

const DOCK_TILE_IDS = ['explorer', 'terminal', 'game-2048', 'projects'] as const;

export function MobileEnvironment({
  onShutdownToPortfolio,
}: MobileEnvironmentProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentOS = useOSStore((s) => s.currentOS);
  const openWindows = useOSStore((s) => s.openWindows);
  const openWindow = useOSStore((s) => s.openWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const clearOpenWindows = useOSStore((s) => s.clearOpenWindows);
  const shutdownOS = useOSStore((s) => s.shutdownOS);
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
  const [overlay, setOverlay] = useState<'quick-panel' | 'search' | null>(null);
  const [islandExpanded, setIslandExpanded] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  if (!currentOS) return null;

  const isIOS = currentOS === 'ios';
  const osKey: 'android' | 'ios' = isIOS ? 'ios' : 'android';

  // Top-most open window renders full-screen on mobile (no react-rnd)
  const activeMobileWindow =
    openWindows.length > 0
      ? [...openWindows].sort((a, b) => b.zIndex - a.zIndex)[0]
      : null;

  const statusTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: isIOS,
  });

  const handleShutdown = () => {
    setOverlay(null);
    shutdownOS();
    onShutdownToPortfolio();
  };

  const handleRebootToGrub = () => {
    setOverlay(null);
    shutdownOS();
  };

  const handleSwipeUpHome = () => {
    clearOpenWindows();
  };

  const handleGesturePanEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y < -32 || info.velocity.y < -250) {
      handleSwipeUpHome();
    }
  };

  const launchTile = (tile: MobileAppTile) => {
    openWindow(tile.appType, {
      title: tile.title,
      filePath: tile.filePath,
    });
  };

  const dockTiles = DOCK_TILE_IDS.map((id) =>
    MOBILE_APP_TILES.find((t) => t.id === id)
  ).filter((t): t is MobileAppTile => Boolean(t));

  return (
    <div
      className={`os-root ${currentOS}-theme relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden sm:p-4`}
      data-os={currentOS}
    >
      {/* Desktop-only subtle studio bar outside the phone hardware bezel */}
      <div className="mb-2.5 hidden w-full max-w-[392px] items-center justify-between px-2 text-xs text-white/75 sm:flex">
        <span className="font-mono text-[11px] uppercase tracking-wider">
          {isIOS ? 'iPhone 16 Pro · iOS 18' : 'Pixel 9 Pro · Android 15'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRebootToGrub}
            aria-label="Reboot to GRUB bootloader"
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/20"
          >
            <RotateCcw className="size-3" />
            <span>GRUB</span>
          </button>
          <button
            type="button"
            onClick={handleShutdown}
            aria-label="Shutdown and return to portfolio"
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-red-600"
          >
            <Power className="size-3" />
            <span>Shutdown</span>
          </button>
        </div>
      </div>

      {/* 1:1 Smartphone Hardware Chassis (Edge-to-edge on real phones; framed 392x844 on desktop) */}
      <div className="relative flex h-full w-full flex-col sm:h-[min(88dvh,820px)] sm:w-[392px]">
        {/* Side Physical Hardware Buttons (Desktop chassis detail) */}
        <span
          aria-hidden="true"
          className="hidden sm:block sm:absolute sm:top-28 sm:-left-[13px] sm:h-12 sm:w-[3px] sm:rounded-l bg-white/25"
        />
        <span
          aria-hidden="true"
          className="hidden sm:block sm:absolute sm:top-44 sm:-left-[13px] sm:h-12 sm:w-[3px] sm:rounded-l bg-white/25"
        />
        <span
          aria-hidden="true"
          className="hidden sm:block sm:absolute sm:top-36 sm:-right-[13px] sm:h-16 sm:w-[3px] sm:rounded-r bg-white/25"
        />

        {/* Phone Screen Container */}
        <div
          style={brightness !== 100 ? { filter: `brightness(${brightness}%)` } : undefined}
          className={`relative flex h-full w-full flex-col overflow-hidden ${
            isIOS ? 'ios-wallpaper' : 'android-wallpaper'
          } sm:rounded-[48px] sm:border-[10px] sm:border-[#181a20] sm:ring-1 sm:ring-white/20 sm:shadow-[0_32px_90px_rgba(0,0,0,0.88)]`}
        >
          {/* Night Light / Night Shift warm tint overlay */}
          {nightLight && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[999] bg-amber-500/15 mix-blend-multiply"
            />
          )}

          {/* 1:1 Authentic Mobile Status Bar */}
          <header className="relative z-[920] grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5 pt-1 text-xs text-white select-none">
            {/* Left: Time */}
            <button
              type="button"
              onClick={() => setOverlay((o) => (o === 'quick-panel' ? null : 'quick-panel'))}
              className="flex cursor-pointer items-center gap-1.5 text-left font-semibold tracking-tight tabular-nums"
            >
              <span>{statusTime}</span>
            </button>

            {/* Center: iOS 18 Dynamic Island OR Android 15 Pixel Punch-Hole */}
            {isIOS ? (
              <button
                type="button"
                onClick={() => setIslandExpanded((v) => !v)}
                aria-label="Dynamic Island"
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-full bg-black px-3 text-[10px] font-medium text-white ring-1 ring-white/10 transition-all ${
                  islandExpanded ? 'h-8 min-w-[168px]' : 'h-[26px] min-w-[106px]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate max-w-[96px]">
                    {islandExpanded ? 'Trinity OS · VFS' : ''}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-[#111938] ring-1 ring-white/15"
                />
              </button>
            ) : (
              <div
                aria-hidden="true"
                className="size-3.5 rounded-full bg-black ring-1 ring-white/20"
              />
            )}

            {/* Right: Signal + Wi-Fi + Battery (Tap to open Control Center / Quick Settings) */}
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setOverlay((o) => (o === 'quick-panel' ? null : 'quick-panel'))}
                aria-label={isIOS ? 'Open Control Center' : 'Open Quick Settings'}
                title={isIOS ? 'Control Center' : 'Quick Settings'}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-1.5 py-1 hover:bg-white/15"
              >
                <Signal className="size-3.5" />
                {!airplaneMode && (
                  <Wifi
                    className={`size-3.5 ${wifiEnabled ? 'text-white' : 'text-white/40'}`}
                  />
                )}
                {/* iOS / Android Battery Pill */}
                <span className="inline-flex items-center rounded-[4px] border border-white/60 px-1 py-px text-[9px] font-bold leading-none tabular-nums">
                  98
                </span>
              </button>

              {/* On small mobile phones (when outer bar is hidden), keep compact GRUB switch handy */}
              <button
                type="button"
                onClick={handleRebootToGrub}
                aria-label="Reboot to GRUB"
                className="grid size-6 cursor-pointer place-items-center rounded-full bg-white/12 sm:hidden"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>
          </header>

          {/* Home Screen Content Area */}
          <main className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-4 pt-2 pb-1">
            <div className="space-y-5">
              <MobileHomeWidgets
                isIOS={isIOS}
                now={now}
                onLaunchProjects={() =>
                  openWindow('explorer', { title: 'Projects', filePath: '/projects' })
                }
                onLaunch2048={() => openWindow('game-2048', { title: '2048' })}
              />

              {/* 4-Column Home Screen Icons */}
              <section aria-label="Mobile Applications Grid">
                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                  {MOBILE_APP_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => launchTile(tile)}
                      className="group flex cursor-pointer flex-col items-center gap-1.5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--os-accent)]"
                    >
                      <MobileAppIconBadge icon={tile.icon} os={osKey} size="md" />
                      <span className="w-full truncate text-[11px] font-normal leading-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.85)]">
                        {tile.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Home Screen Controls (iOS Spotlight vs Android Pixel Dock + Google Bar) */}
            {isIOS ? (
              <div className="mt-4 flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOverlay('search')}
                  className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full bg-white/20 px-3.5 text-[11px] font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/28"
                >
                  <Search className="size-3" />
                  <span>Search</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {/* Android Pixel Dock Row (Unboxed icons just like Pixel Launcher) */}
                <div className="flex items-center justify-around px-1">
                  {dockTiles.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => launchTile(tile)}
                      aria-label={`Open ${tile.label}`}
                      className="group cursor-pointer"
                    >
                      <MobileAppIconBadge icon={tile.icon} os="android" size="sm" />
                    </button>
                  ))}
                </div>

                {/* Authentic Google Pixel Bottom Search Pill */}
                <div className="flex h-12 items-center justify-between rounded-full bg-[#222926]/94 px-4 shadow-lg backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setOverlay('search')}
                    className="flex flex-1 cursor-pointer items-center gap-3 text-left text-xs text-white/75"
                  >
                    <svg viewBox="0 0 24 24" className="size-4.5 shrink-0" aria-hidden="true">
                      <path
                        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3.1-4.3 3.1-7.3z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2.1 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H3v2.6C4.7 19.8 8.1 22 12 22z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.3 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3C2.4 8.8 2 10.4 2 12s.4 3.2 1 4.5l3.3-2.6z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.7 4.2 3 7.5l3.3 2.6C7.1 7.7 9.3 5.9 12 5.9z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Search apps &amp; files</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Open Terminal"
                    onClick={() => openWindow('terminal', { title: 'Terminal' })}
                    className="grid size-7 cursor-pointer place-items-center rounded-full text-[#a8f0c6] hover:bg-white/10"
                  >
                    <TerminalIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Bottom Dock / Gesture Navigation Footer */}
          <footer className="shrink-0 px-3 pt-1.5 pb-2 select-none">
            {isIOS && (
              <div className="mb-2.5 flex items-center justify-around rounded-[28px] bg-white/22 px-3 py-2.5 shadow-xl backdrop-blur-2xl">
                {dockTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => launchTile(tile)}
                    aria-label={`Open ${tile.label}`}
                    className="group cursor-pointer"
                  >
                    <MobileAppIconBadge icon={tile.icon} os="ios" size="sm" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center pt-0.5 pb-0.5">
              <span
                aria-hidden="true"
                className={`h-1 rounded-full ${
                  isIOS ? 'w-32 bg-white/90' : 'w-28 bg-white/75'
                }`}
              />
            </div>
          </footer>

          {/* Control Center (iOS 18) / Quick Settings Shade (Android 15) */}
          {overlay === 'quick-panel' && (
            <MobileQuickPanel
              isIOS={isIOS}
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
              onLaunch2048={() => openWindow('game-2048', { title: '2048' })}
              onLaunchTerminal={() => openWindow('terminal', { title: 'Terminal' })}
              onRebootToGrub={handleRebootToGrub}
              onShutdown={handleShutdown}
              onClose={() => setOverlay(null)}
            />
          )}

          {/* Spotlight / Pixel Search Overlay */}
          {overlay === 'search' && (
            <MobileSearchOverlay
              isIOS={isIOS}
              tiles={MOBILE_APP_TILES}
              vfs={vfs}
              onLaunchTile={launchTile}
              onLaunchFile={(name, path) =>
                openWindow('project-viewer', { title: name, filePath: path })
              }
              onClose={() => setOverlay(null)}
            />
          )}

          {/* Framer Motion Full-Screen Expanded App View */}
          <AnimatePresence>
            {activeMobileWindow && (
              <motion.section
                key={activeMobileWindow.id}
                role="dialog"
                aria-modal="true"
                aria-label={activeMobileWindow.title}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.88, y: 36, borderRadius: 28 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, y: 0, borderRadius: 0 }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, y: 48, borderRadius: 24 }
                }
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="os-surface absolute inset-0 z-[950] flex h-full w-full flex-col overflow-hidden"
              >
                {/* Full-Screen App Header */}
                <header className="os-topbar flex h-12 shrink-0 items-center justify-between gap-3 px-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => closeWindow(activeMobileWindow.id)}
                      aria-label={`Close ${activeMobileWindow.title} and go back`}
                      title="Back"
                      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 active:scale-95"
                    >
                      <ChevronLeft className="size-4.5" />
                    </button>
                    <span className="truncate">{activeMobileWindow.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShutdown}
                    className="inline-flex min-h-[32px] shrink-0 cursor-pointer items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    <Power className="size-3.5" />
                    <span>Shutdown</span>
                  </button>
                </header>

                {/* Full-Screen App Body */}
                <div className="min-h-0 flex-1 overflow-hidden">
                  <OSWindowContent win={activeMobileWindow} />
                </div>

                {/* Persistent Swipe Up / Home Control Bar */}
                <motion.div
                  onPanEnd={handleGesturePanEnd}
                  className="os-dock flex shrink-0 touch-none flex-col items-center justify-center gap-1.5 border-t border-current/15 px-4 pt-2 pb-3"
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-12 rounded-full bg-current opacity-40"
                  />
                  <button
                    type="button"
                    onClick={handleSwipeUpHome}
                    className="inline-flex min-h-[40px] w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-full border border-current/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-white/20 active:scale-95"
                  >
                    <ChevronUp className="size-4" />
                    <span>Swipe up / Home</span>
                  </button>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
