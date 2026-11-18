import { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { OSType, useOSStore } from '@/src/os/useOSStore';

interface ShortcutEntry {
  keys: string;
  action: string;
}

const OS_SHORTCUT_TITLES: Record<OSType, string> = {
  windows: 'Windows 11 Shortcuts & Controls',
  macos: 'macOS Sequoia Shortcuts & Controls',
  ubuntu: 'Ubuntu 24.04 Shortcuts & Controls',
  android: 'Android 15 Gestures & Controls',
  ios: 'iOS 18 Gestures & Controls',
};

const OS_SPECIFIC_SHORTCUTS: Record<OSType, ShortcutEntry[]> = {
  windows: [
    { keys: 'Drag to Left / Right Edge', action: 'Snap active window 50/50' },
    { keys: 'Drag to Top Edge', action: 'Maximize active window' },
    { keys: 'Hover Maximize Button', action: 'Open Snap Layouts (50/50, 65/35, Quadrants)' },
    { keys: 'Right-Click Desktop', action: 'Create VFS folder/file, Terminal, Night light' },
    { keys: 'Taskbar Start / Widgets / Tray', action: 'Open Start Search, Weather, Quick Settings, Calendar' },
    { keys: 'Minesweeper', action: 'Windows-exclusive desktop & Start app (Right-click flags)' },
  ],
  macos: [
    { keys: 'Top Bar Search Icon', action: 'Open Spotlight Search across apps & VFS files' },
    { keys: 'Top-Right Control Center', action: 'Adjust Wi-Fi, Bluetooth, Night Shift, Brightness & Sound' },
    { keys: 'Top-Right Date & Time', action: 'Slide open Notification Center & Widgets' },
    { keys: 'Dock Launchpad Icon', action: 'Open full-screen Launchpad app grid' },
    { keys: 'Memory Match (Dock)', action: 'macOS-exclusive 3D card match tech-stack game' },
  ],
  ubuntu: [
    { keys: 'Top-Left Pill (— •)', action: 'Toggle GNOME Activities Overview & window switcher' },
    { keys: 'Dock 9-Dot Button', action: 'Open Applications Grid & Red Team Breach card' },
    { keys: 'Top-Center Date & Time', action: 'Open Calendar, Notifications & Do Not Disturb' },
    { keys: 'Top-Right Status Pill', action: 'Open Quick Settings (Power Mode, Brightness, Volume)' },
    { keys: 'play breach (Terminal)', action: 'Ubuntu-exclusive Red Team 4-digit PIN cracking CLI game' },
  ],
  android: [
    { keys: 'Tap Status Bar', action: 'Pull down Android 15 Material You Quick Settings' },
    { keys: 'Bottom Google Search Bar', action: 'Search mobile apps & stateful VFS files' },
    { keys: 'Top-Left Back (<)', action: 'Close top app & return to previous screen' },
    { keys: 'Swipe up / Home', action: 'Minimize/clear open apps to Pixel Home Screen' },
    { keys: '2048 App', action: 'Swipe Up / Down / Left / Right on board to merge tiles' },
  ],
  ios: [
    { keys: 'Tap Top-Right Battery / Wi-Fi', action: 'Open iOS 18 Control Center' },
    { keys: 'Tap Dynamic Island', action: 'Expand active OS / VFS status capsule' },
    { keys: 'Spotlight Search Pill', action: 'Search iOS apps & VFS documents' },
    { keys: 'Top-Left Back (<)', action: 'Step back one screen from open full-screen app' },
    { keys: '2048 App', action: 'Swipe Up / Down / Left / Right on board to merge tiles' },
  ],
};

const UNIVERSAL_SHORTCUTS: ShortcutEntry[] = [
  { keys: 'F1', action: 'Toggle this Shortcuts & Controls overlay' },
  { keys: 'Esc', action: 'Dismiss active OS flyout, context menu, or overlay' },
  { keys: 'Tetris: ← / → / ↓', action: 'Move falling piece Left / Right / Soft drop' },
  { keys: 'Tetris: ↑ / Space', action: 'Rotate piece / Hard drop immediately' },
  { keys: 'Terminal: tetris', action: 'Launch Tetris window directly from CLI' },
  { keys: 'Terminal: help', action: 'List VFS shell commands (ls, cd, cat, mkdir, touch, rm)' },
];

export function ShortcutsOverlay() {
  const currentOS = useOSStore((s) => s.currentOS);
  const shortcutsOpen = useOSStore((s) => s.shortcutsOpen);
  const toggleShortcuts = useOSStore((s) => s.toggleShortcuts);

  useEffect(() => {
    if (!currentOS) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        toggleShortcuts();
      } else if (e.key === 'Escape' && shortcutsOpen) {
        toggleShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentOS, shortcutsOpen, toggleShortcuts]);

  if (!currentOS || !shortcutsOpen) return null;

  const osShortcuts = OS_SPECIFIC_SHORTCUTS[currentOS];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts and OS Controls"
      onClick={() => toggleShortcuts(false)}
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/65 p-4 text-white backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/18 bg-[#121622]/95 shadow-[0_28px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/12 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-sky-300">
              <Keyboard className="size-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {OS_SHORTCUT_TITLES[currentOS]}
              </h2>
              <p className="text-[11px] text-white/60">
                Quick reference for desktop, mobile, terminal &amp; built-in games
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleShortcuts(false)}
            aria-label="Close shortcuts overlay"
            className="grid size-8 cursor-pointer place-items-center rounded-lg bg-white/8 text-white/80 hover:bg-white/18 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[72dvh] space-y-5 overflow-y-auto p-5 text-xs">
          <section>
            <h3 className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-300">
              Active OS Controls
            </h3>
            <div className="space-y-1.5">
              {osShortcuts.map((item) => (
                <div
                  key={item.keys}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2"
                >
                  <kbd className="rounded border border-white/15 bg-black/45 px-2 py-0.5 font-mono text-[11px] font-medium text-white">
                    {item.keys}
                  </kbd>
                  <span className="text-white/80">{item.action}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              Global, Terminal &amp; Game Shortcuts
            </h3>
            <div className="space-y-1.5">
              {UNIVERSAL_SHORTCUTS.map((item) => (
                <div
                  key={item.keys}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2"
                >
                  <kbd className="rounded border border-white/15 bg-black/45 px-2 py-0.5 font-mono text-[11px] font-medium text-white">
                    {item.keys}
                  </kbd>
                  <span className="text-white/80">{item.action}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/12 bg-black/30 px-5 py-2.5 font-mono text-[11px] text-white/60">
          <span>Press F1 anytime to toggle</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
