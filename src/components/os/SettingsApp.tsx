import {
  BatteryCharging,
  Bluetooth,
  ChevronRight,
  Cpu,
  Info,
  Keyboard,
  Moon,
  Plane,
  RotateCcw,
  Sun,
  User,
  Volume2,
  Wifi,
} from 'lucide-react';
import { useOSStore } from '@/src/os/useOSStore';

function ToggleSwitch({
  checked,
  onChange,
  label,
  isIOS,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  isIOS: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        checked
          ? isIOS
            ? 'bg-[#34c759]'
            : 'bg-[#a8f0c6]'
          : 'bg-white/20'
      }`}
    >
      <span
        className={`size-5 rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        } ${checked && !isIOS ? 'bg-[#052e16]' : 'bg-white'}`}
      />
    </button>
  );
}

export function SettingsApp() {
  const currentOS = useOSStore((s) => s.currentOS);
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
  const openWindow = useOSStore((s) => s.openWindow);
  const shutdownOS = useOSStore((s) => s.shutdownOS);
  const toggleShortcuts = useOSStore((s) => s.toggleShortcuts);

  const isIOS = currentOS === 'ios';
  const deviceLabel = isIOS
    ? 'iPhone 16 Pro · iOS 18.2'
    : currentOS === 'android'
      ? 'Pixel 9 Pro · Android 15'
      : `Trinity OS · ${currentOS?.toUpperCase() ?? 'SYSTEM'}`;

  if (isIOS) {
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-[#000000] px-4 py-4 text-sm text-white">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>

        {/* Apple Account Profile Banner */}
        <button
          type="button"
          onClick={() => openWindow('about', { title: 'About Dhrumil' })}
          className="mb-5 flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[#1c1c1e] p-3 text-left transition-colors hover:bg-[#252529]"
        >
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-base font-bold text-white">
            DA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Dhrumil Asodiya</p>
            <p className="truncate text-xs text-white/60">
              Full-Stack Java Developer · iCloud+
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-white/40" />
        </button>

        {/* Connectivity Group */}
        <div className="mb-5 divide-y divide-white/10 overflow-hidden rounded-2xl bg-[#1c1c1e]">
          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#ff9500] text-white">
                <Plane className="size-4" />
              </span>
              <span className="text-[13px] font-medium">Airplane Mode</span>
            </div>
            <ToggleSwitch
              checked={airplaneMode}
              onChange={setAirplaneMode}
              label="Airplane Mode"
              isIOS
            />
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#0a84ff] text-white">
                <Wifi className="size-4" />
              </span>
              <div>
                <p className="text-[13px] font-medium">Wi-Fi</p>
                <p className="text-[11px] text-white/55">
                  {wifiEnabled && !airplaneMode ? 'Trinity-5G' : 'Off'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={wifiEnabled && !airplaneMode}
              onChange={(next) => setWifiEnabled(next)}
              disabled={airplaneMode}
              label="Wi-Fi"
              isIOS
            />
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#0a84ff] text-white">
                <Bluetooth className="size-4" />
              </span>
              <div>
                <p className="text-[13px] font-medium">Bluetooth</p>
                <p className="text-[11px] text-white/55">
                  {bluetoothEnabled && !airplaneMode ? 'On' : 'Off'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={bluetoothEnabled && !airplaneMode}
              onChange={(next) => setBluetoothEnabled(next)}
              disabled={airplaneMode}
              label="Bluetooth"
              isIOS
            />
          </div>
        </div>

        {/* Display & Sound Group */}
        <div className="mb-5 divide-y divide-white/10 overflow-hidden rounded-2xl bg-[#1c1c1e]">
          <div className="space-y-2.5 px-3.5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-[#0a84ff] text-white">
                  <Sun className="size-4" />
                </span>
                <span className="text-[13px] font-medium">Display &amp; Brightness</span>
              </div>
              <span className="font-mono text-xs text-white/60 tabular-nums">
                {brightness}%
              </span>
            </div>
            <input
              type="range"
              min={55}
              max={105}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              aria-label="Display brightness"
              className="h-1.5 w-full cursor-pointer accent-[#0a84ff]"
            />
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#ff9f0a] text-white">
                <Moon className="size-4" />
              </span>
              <div>
                <p className="text-[13px] font-medium">Night Shift</p>
                <p className="text-[11px] text-white/55">Warm amber screen tint</p>
              </div>
            </div>
            <ToggleSwitch
              checked={nightLight}
              onChange={setNightLight}
              label="Night Shift"
              isIOS
            />
          </div>

          <div className="space-y-2.5 px-3.5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-[#ff2d55] text-white">
                  <Volume2 className="size-4" />
                </span>
                <span className="text-[13px] font-medium">Sounds &amp; Haptics</span>
              </div>
              <span className="font-mono text-xs text-white/60 tabular-nums">
                {volume}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Sounds volume"
              className="h-1.5 w-full cursor-pointer accent-[#0a84ff]"
            />
          </div>
        </div>

        {/* Battery & About Group */}
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl bg-[#1c1c1e]">
          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#34c759] text-white">
                <BatteryCharging className="size-4" />
              </span>
              <span className="text-[13px] font-medium">Battery</span>
            </div>
            <span className="text-xs font-medium text-[#34c759] tabular-nums">
              98% · Healthy
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#636366] text-white">
                <Info className="size-4" />
              </span>
              <div>
                <p className="text-[13px] font-medium">About</p>
                <p className="text-[11px] text-white/55">{deviceLabel}</p>
              </div>
            </div>
            <span className="font-mono text-[11px] text-white/45">Stateful VFS</span>
          </div>

          <button
            type="button"
            onClick={() => toggleShortcuts(true)}
            className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-left hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#5856d6] text-white">
                <Keyboard className="size-4" />
              </span>
              <span className="text-[13px] font-medium">Keyboard Shortcuts</span>
            </div>
            <ChevronRight className="size-4 text-white/40" />
          </button>

          <button
            type="button"
            onClick={shutdownOS}
            className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-left hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-[#3a3a3c] text-white">
                <RotateCcw className="size-4" />
              </span>
              <span className="text-[13px] font-medium">Switch OS (GRUB Bootloader)</span>
            </div>
            <ChevronRight className="size-4 text-white/40" />
          </button>
        </div>
      </div>
    );
  }

  // Android 15 Material You (and desktop fallback) Settings
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#0f1512] px-4 py-4 text-sm text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-normal tracking-tight text-[#e3f2e8]">
            Settings
          </h2>
          <p className="text-[11px] text-[#a8f0c6]/75">{deviceLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => openWindow('about', { title: 'About Dhrumil' })}
          aria-label="Open Developer Profile"
          className="grid size-9 cursor-pointer place-items-center rounded-full bg-[#1e352c] text-[#a8f0c6] hover:bg-[#264237]"
        >
          <User className="size-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Network & internet */}
        <section className="space-y-3 rounded-[24px] bg-[#18221e] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#243830] text-[#a8f0c6]">
                <Wifi className="size-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-medium">Internet</p>
                <p className="text-[11px] text-white/60">
                  {wifiEnabled && !airplaneMode ? 'Connected · Trinity-5G' : 'Disconnected'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={wifiEnabled && !airplaneMode}
              onChange={(next) => setWifiEnabled(next)}
              disabled={airplaneMode}
              label="Internet"
              isIOS={false}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#243830] text-[#a8f0c6]">
                <Plane className="size-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-medium">Airplane mode</p>
                <p className="text-[11px] text-white/60">
                  {airplaneMode ? 'Radios disabled' : 'Off'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={airplaneMode}
              onChange={setAirplaneMode}
              label="Airplane mode"
              isIOS={false}
            />
          </div>
        </section>

        {/* Connected devices */}
        <section className="rounded-[24px] bg-[#18221e] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#243830] text-[#a8f0c6]">
                <Bluetooth className="size-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-medium">Connected devices</p>
                <p className="text-[11px] text-white/60">
                  Bluetooth {bluetoothEnabled && !airplaneMode ? 'enabled' : 'off'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={bluetoothEnabled && !airplaneMode}
              onChange={(next) => setBluetoothEnabled(next)}
              disabled={airplaneMode}
              label="Bluetooth"
              isIOS={false}
            />
          </div>
        </section>

        {/* Display & Sound */}
        <section className="space-y-3.5 rounded-[24px] bg-[#18221e] p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[13px] font-medium">
                <Sun className="size-4 text-[#a8f0c6]" />
                <span>Display brightness</span>
              </div>
              <span className="font-mono text-xs text-[#a8f0c6] tabular-nums">
                {brightness}%
              </span>
            </div>
            <input
              type="range"
              min={55}
              max={105}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              aria-label="Display brightness"
              className="h-2 w-full cursor-pointer accent-[#a8f0c6]"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#243830] text-[#a8f0c6]">
                <Moon className="size-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-medium">Night Light</p>
                <p className="text-[11px] text-white/60">
                  {nightLight ? 'Amber tint active' : 'Off'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={nightLight}
              onChange={setNightLight}
              label="Night Light"
              isIOS={false}
            />
          </div>

          <div className="space-y-2 border-t border-white/8 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[13px] font-medium">
                <Volume2 className="size-4 text-[#a8f0c6]" />
                <span>Media &amp; system volume</span>
              </div>
              <span className="font-mono text-xs text-[#a8f0c6] tabular-nums">
                {volume}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Media volume"
              className="h-2 w-full cursor-pointer accent-[#a8f0c6]"
            />
          </div>
        </section>

        {/* Battery & About */}
        <section className="divide-y divide-white/8 rounded-[24px] bg-[#18221e] px-4">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <BatteryCharging className="size-4.5 text-[#a8f0c6]" />
              <div>
                <p className="text-[13px] font-medium">Battery</p>
                <p className="text-[11px] text-white/60">Adaptive Charging</p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-[#a8f0c6]">98%</span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <Cpu className="size-4.5 text-[#a8f0c6]" />
              <div>
                <p className="text-[13px] font-medium">About emulated device</p>
                <p className="text-[11px] text-white/60">
                  Dhrumil Asodiya · Stateful VFS
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openWindow('about', { title: 'About Dhrumil' })}
              className="cursor-pointer rounded-full bg-[#243830] px-3 py-1 text-[11px] font-medium text-[#a8f0c6] hover:bg-[#2d463c]"
            >
              Profile
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 py-3.5">
            <button
              type="button"
              onClick={() => toggleShortcuts(true)}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#243830] px-3 py-2 text-xs font-medium text-[#a8f0c6] hover:bg-[#2d463c]"
            >
              <Keyboard className="size-3.5" />
              <span>Shortcuts (F1)</span>
            </button>
            <button
              type="button"
              onClick={shutdownOS}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
            >
              <RotateCcw className="size-3.5" />
              <span>GRUB Boot</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
