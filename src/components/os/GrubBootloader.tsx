import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { OSType } from '@/src/os/useOSStore';

interface BootOption {
  id: OSType;
  label: string;
  kernel: string;
  initrd: string;
  params: string;
}

const DESKTOP_OPTIONS: BootOption[] = [
  {
    id: 'windows',
    label: 'Windows 11 Workstation (x86_64 / NT Kernel)',
    kernel: '/boot/ntoskrnl-trinity-11.0',
    initrd: '/boot/trinity-vfs-stateful.img',
    params: 'ro=false shell=cmd.exe ui=taskbar',
  },
  {
    id: 'macos',
    label: 'macOS Sequoia Shell (arm64 / Darwin XNU)',
    kernel: '/boot/darwin-xnu-24.1',
    initrd: '/boot/trinity-vfs-stateful.img',
    params: 'ro=false shell=zsh ui=dock',
  },
  {
    id: 'ubuntu',
    label: 'Ubuntu 24.04 LTS Desktop (Linux 6.8 GNOME)',
    kernel: '/boot/vmlinuz-6.8.0-trinity-generic',
    initrd: '/boot/initrd.img-6.8.0-trinity',
    params: 'root=/dev/vfs0 rw quiet',
  },
];

const MOBILE_OPTIONS: BootOption[] = [
  {
    id: 'android',
    label: 'Android 15 Mobile Shell (arm64 / Linux Kernel)',
    kernel: '/boot/vmlinuz-android15-arm64',
    initrd: '/boot/ramdisk-trinity-mobile.img',
    params: 'androidboot.hardware=trinity ui=material',
  },
  {
    id: 'ios',
    label: 'iOS 18 Touch Environment (arm64 / Darwin)',
    kernel: '/boot/xnu-ios18-mobile',
    initrd: '/boot/ramdisk-trinity-mobile.img',
    params: 'darwin.shell=springboard vfs=stateful',
  },
];

interface GrubBootloaderProps {
  onSelectOS: (os: OSType) => void;
  onExitToPortfolio: () => void;
}

export function GrubBootloader({
  onSelectOS,
  onExitToPortfolio,
}: GrubBootloaderProps) {
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [bootingTarget, setBootingTarget] = useState<BootOption | null>(null);
  const [bootStep, setBootStep] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const bootTimerRef = useRef<number | null>(null);
  const stepTimersRef = useRef<number[]>([]);

  useEffect(() => {
    rootRef.current?.focus();
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    return () => {
      if (bootTimerRef.current !== null) {
        window.clearTimeout(bootTimerRef.current);
      }
      stepTimersRef.current.forEach((id) => window.clearTimeout(id));
      stepTimersRef.current = [];
    };
  }, []);

  const options = useMemo(
    () => (isMobileViewport ? MOBILE_OPTIONS : DESKTOP_OPTIONS),
    [isMobileViewport]
  );

  // Clamp index if viewport crosses the 768px threshold
  useEffect(() => {
    setSelectedIndex((prev) => Math.min(prev, options.length - 1));
  }, [options.length]);

  const triggerBoot = useCallback(
    (option: BootOption) => {
      if (bootingTarget) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        onSelectOS(option.id);
        return;
      }

      setBootingTarget(option);
      setBootStep(0);

      stepTimersRef.current = [
        window.setTimeout(() => setBootStep(1), 260),
        window.setTimeout(() => setBootStep(2), 560),
        window.setTimeout(() => setBootStep(3), 860),
      ];

      bootTimerRef.current = window.setTimeout(() => {
        onSelectOS(option.id);
      }, 1180);
    },
    [bootingTarget, onSelectOS]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (bootingTarget) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const choice = options[selectedIndex];
        if (choice) triggerBoot(choice);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onExitToPortfolio();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootingTarget, options, selectedIndex, triggerBoot, onExitToPortfolio]);

  const highlightedOption = options[selectedIndex] ?? options[0];

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="region"
      aria-label="GNU GRUB Retro BIOS Bootloader"
      className="relative flex min-h-dvh w-full flex-col justify-between rounded-none bg-[#000000] p-4 font-mono text-[#d4d4d4] outline-none select-none sm:p-8 md:p-12"
      style={{
        fontFamily: 'ui-monospace, "Courier New", Courier, monospace',
        textShadow: '0 0 6px rgba(255, 255, 255, 0.32)',
      }}
    >
      {/* Subtle CRT horizontal scanline texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-35"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-between gap-6">
        {/* Top BIOS Header */}
        <header className="space-y-1 text-center text-xs sm:text-sm">
          <p className="text-[#f5f5f5]">
            GNU GRUB  version 0.97-trinity  (640K lower / 3145728K upper memory)
          </p>
          <p className="text-[#8c8c8c] text-[11px] sm:text-xs">
            BIOS: DHRUMIL ASODIYA // FULL-STACK JAVA DEVELOPER · {isMobileViewport ? 'MOBILE TARGET (<768PX)' : 'DESKTOP TARGET (>=768PX)'}
          </p>
        </header>

        {/* Central Classic Rectangular GRUB Menu Frame (Zero rounded corners, strict monochrome) */}
        <main className="my-auto space-y-5">
          <div className="rounded-none border border-[#a3a3a3] bg-[#000000] p-2 sm:p-3">
            {bootingTarget ? (
              <div className="min-h-[220px] space-y-2 p-2 text-xs leading-relaxed sm:text-sm" aria-live="polite">
                <p className="text-[#f5f5f5]">
                  Booting &apos;{bootingTarget.label}&apos;
                </p>
                <p className="text-[#a3a3a3]">root (hd0,0)</p>
                <p className="text-[#d4d4d4]">
                  {` kernel ${bootingTarget.kernel} ${bootingTarget.params}`}
                </p>
                {bootStep >= 1 && (
                  <p className="text-[#d4d4d4]">
                    {`   [Linux-bzImage, setup=0x4200, size=0x4f9200]`}
                  </p>
                )}
                {bootStep >= 2 && (
                  <p className="text-[#d4d4d4]">
                    {` initrd ${bootingTarget.initrd}`}
                  </p>
                )}
                {bootStep >= 3 && (
                  <p className="text-[#f5f5f5]">
                    {`   [ OK ] Stateful Zustand VFS mounted at / -> launching shell...`}
                    <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#f5f5f5] align-middle" />
                  </p>
                )}
              </div>
            ) : (
              <ul
                role="listbox"
                aria-label="Select operating system with arrow keys and Enter"
                className="min-h-[220px] space-y-1 p-1 text-xs sm:text-sm"
              >
                {options.map((option, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <li
                      key={option.id}
                      role="option"
                      aria-selected={isSelected}
                      className={`rounded-none px-2.5 py-2 leading-snug ${
                        isSelected
                          ? 'bg-[#e5e5e5] font-semibold text-[#000000]'
                          : 'bg-[#000000] text-[#cccccc]'
                      }`}
                      style={
                        isSelected
                          ? { textShadow: 'none' }
                          : undefined
                      }
                    >
                      <span className="mr-2 inline-block w-3">
                        {isSelected ? '*' : ' '}
                      </span>
                      <span>{option.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Selected Kernel Inspection Line */}
          {!bootingTarget && highlightedOption && (
            <div className="rounded-none border border-[#404040] bg-[#000000] px-3 py-2 text-[11px] leading-relaxed text-[#a3a3a3] sm:text-xs">
              <p className="truncate text-[#d4d4d4]">
                kernel {highlightedOption.kernel} {highlightedOption.params}
              </p>
              <p className="truncate text-[#8c8c8c]">
                initrd {highlightedOption.initrd} (5 portfolio projects preloaded)
              </p>
            </div>
          )}

          {/* Classic GRUB Keyboard Instructions */}
          <div className="space-y-1.5 text-center text-xs leading-relaxed text-[#a3a3a3] sm:text-left sm:text-sm">
            <p>
              Use the <span className="text-[#f5f5f5]">↑</span> and{' '}
              <span className="text-[#f5f5f5]">↓</span> keys to select which entry is highlighted.
            </p>
            <p>
              Press <span className="text-[#f5f5f5]">ENTER</span> to boot the selected OS, or{' '}
              <span className="text-[#f5f5f5]">ESC</span> to return to portfolio (/).
            </p>
          </div>

          {/* Touch-only key fallback shown exclusively on <768px screens without physical arrow keys */}
          {!bootingTarget && (
            <div className="grid grid-cols-4 gap-2 pt-2 md:hidden">
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((prev) => (prev - 1 + options.length) % options.length)
                }
                className="min-h-[44px] rounded-none border border-[#737373] bg-[#000000] text-xs text-[#f5f5f5] active:bg-[#e5e5e5] active:text-[#000000]"
              >
                [▲ UP]
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((prev) => (prev + 1) % options.length)
                }
                className="min-h-[44px] rounded-none border border-[#737373] bg-[#000000] text-xs text-[#f5f5f5] active:bg-[#e5e5e5] active:text-[#000000]"
              >
                [▼ DN]
              </button>
              <button
                type="button"
                onClick={() => highlightedOption && triggerBoot(highlightedOption)}
                className="min-h-[44px] rounded-none border border-[#d4d4d4] bg-[#e5e5e5] text-xs font-bold text-[#000000]"
                style={{ textShadow: 'none' }}
              >
                [ENTER]
              </button>
              <button
                type="button"
                onClick={onExitToPortfolio}
                className="min-h-[44px] rounded-none border border-[#737373] bg-[#000000] text-xs text-[#a3a3a3] active:bg-[#e5e5e5] active:text-[#000000]"
              >
                [ESC]
              </button>
            </div>
          )}
        </main>

        {/* Bottom Raw BIOS Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#404040] pt-3 text-[11px] text-[#8c8c8c]">
          <span>GRUB CONSOLE :: KEYBOARD INPUT [↑/↓/ENTER/ESC]</span>
          <span>/dev/vfs0 :: STATEFUL RW</span>
        </footer>
      </div>
    </div>
  );
}
