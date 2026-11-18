import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DesktopEnvironment } from '@/src/components/os/DesktopEnvironment';
import { GrubBootloader } from '@/src/components/os/GrubBootloader';
import { MobileEnvironment } from '@/src/components/os/MobileEnvironment';
import { ShortcutsOverlay } from '@/src/components/os/ShortcutsOverlay';
import { useOSStore } from '@/src/os/useOSStore';

interface OSPageProps {
  onExitToPortfolio: () => void;
}

export function OSPage({ onExitToPortfolio }: OSPageProps) {
  const currentOS = useOSStore((s) => s.currentOS);
  const bootOS = useOSStore((s) => s.bootOS);
  const hardReset = useOSStore((s) => s.hardReset);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const handleExit = () => {
    hardReset();
    onExitToPortfolio();
  };

  return (
    <div className="min-h-dvh w-full bg-[#000000]">
      <AnimatePresence mode="wait">
        {currentOS === null ? (
          <motion.div
            key="grub-bootloader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <GrubBootloader
              onSelectOS={bootOS}
              onExitToPortfolio={handleExit}
            />
          </motion.div>
        ) : isMobileViewport ? (
          <motion.div
            key={`mobile-${currentOS}`}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MobileEnvironment onShutdownToPortfolio={handleExit} />
          </motion.div>
        ) : (
          <motion.div
            key={`desktop-${currentOS}`}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <DesktopEnvironment onShutdownToPortfolio={handleExit} />
          </motion.div>
        )}
      </AnimatePresence>

      <ShortcutsOverlay />
    </div>
  );
}
