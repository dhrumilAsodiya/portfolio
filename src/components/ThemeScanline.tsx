interface ThemeScanlineProps {
  active: boolean;
  targetTheme: 'light' | 'dark';
  fallbackMode: boolean;
}

export function ThemeScanline({ active, targetTheme, fallbackMode }: ThemeScanlineProps) {
  if (!active) return null;

  const isToDark = targetTheme === 'dark';

  return (
    <div
      id="theme-scanline-bar"
      aria-hidden="true"
      className={`theme-scanline-bar ${fallbackMode ? 'theme-scanline-bar--fallback' : ''}`}
    >
      <div className="theme-scanline-glitch-track">
        {/* Soft trailing raster gradient behind the sweeping line */}
        <div
          className="absolute inset-x-0 top-0 h-[18px]"
          style={{
            background: isToDark
              ? 'linear-gradient(to bottom, transparent, rgba(0, 0, 242, 0.35) 65%, rgba(133, 133, 249, 0.85))'
              : 'linear-gradient(to bottom, transparent, rgba(0, 0, 242, 0.25) 65%, rgba(0, 0, 242, 0.7))',
          }}
        />

        {/* Primary crisp horizontal beam */}
        <div
          className="absolute inset-x-0 top-[17px] h-[2px]"
          style={{
            background: isToDark ? '#f2f2ff' : '#0000f2',
            boxShadow: isToDark
              ? '0 0 12px rgba(133, 133, 249, 0.95), 0 0 2px #ffffff'
              : '0 0 10px rgba(0, 0, 242, 0.65)',
          }}
        />

        {/* Glitched horizontal chromatic & dark-fill slice segments */}
        <div
          className="absolute top-[13px] left-[4%] h-[3px] w-[19%]"
          style={{ background: isToDark ? '#030324' : '#f2f2f2' }}
        />
        <div
          className="absolute top-[15px] left-[16%] h-[2px] w-[24%]"
          style={{ background: '#f2f200' }}
        />
        <div
          className="absolute top-[19px] left-[31%] h-[3px] w-[15%]"
          style={{ background: isToDark ? '#8585f9' : '#0000f2' }}
        />
        <div
          className="absolute top-[14px] left-[52%] h-[2px] w-[18%]"
          style={{ background: '#f20079' }}
        />
        <div
          className="absolute top-[18px] left-[64%] h-[4px] w-[14%]"
          style={{ background: isToDark ? '#0a0a24' : '#ffffff' }}
        />
        <div
          className="absolute top-[16px] right-[5%] h-[2px] w-[21%]"
          style={{ background: isToDark ? '#f2f2ff' : '#3333f5' }}
        />
        <div
          className="absolute top-[21px] left-[8%] h-[2px] w-[32%]"
          style={{ background: isToDark ? 'rgba(133,133,249,0.55)' : 'rgba(0,0,242,0.45)' }}
        />
        <div
          className="absolute top-[22px] right-[18%] h-[2px] w-[24%]"
          style={{ background: isToDark ? 'rgba(242,242,0,0.6)' : 'rgba(242,0,121,0.5)' }}
        />
      </div>
    </div>
  );
}
