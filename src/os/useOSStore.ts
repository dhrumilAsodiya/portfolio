import { create } from 'zustand';
import {
  createInitialVfs,
  FolderNode,
  getVfsNode,
  insertVfsDirectory,
  insertVfsFile,
  removeVfsItem,
  resolveVfsPath,
} from './vfs';

export type DesktopOS = 'windows' | 'macos' | 'ubuntu';
export type MobileOS = 'android' | 'ios';
export type OSType = DesktopOS | MobileOS;

export type AppType =
  | 'terminal'
  | 'explorer'
  | 'about'
  | 'settings'
  | 'project-viewer'
  | 'tetris'
  | 'minesweeper'
  | 'memory-match'
  | 'game-2048';

export interface OSWindow {
  id: string;
  appType: AppType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  filePath?: string;
}

export interface OpenWindowOptions {
  title?: string;
  filePath?: string;
  width?: number;
  height?: number;
}

export interface VfsActionResult {
  ok: boolean;
  error?: string;
  path?: string;
}

export interface OSStoreState {
  currentOS: OSType | null;
  openWindows: OSWindow[];
  activeWindowId: string | null;
  nextZIndex: number;
  currentDirectory: string;
  vfs: FolderNode;
  shortcutsOpen: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airplaneMode: boolean;
  nightLight: boolean;
  brightness: number;
  volume: number;
}

export interface OSStoreActions {
  bootOS: (os: OSType) => void;
  shutdownOS: () => void;
  hardReset: () => void;
  openWindow: (appType: AppType, options?: OpenWindowOptions) => string;
  closeWindow: (id: string) => void;
  clearOpenWindows: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (
    id: string,
    width: number,
    height: number,
    x?: number,
    y?: number
  ) => void;
  setCurrentDirectory: (path: string) => boolean;
  createFile: (path: string, name: string, content?: string) => VfsActionResult;
  makeDirectory: (path: string, name: string) => VfsActionResult;
  deleteItem: (path: string) => VfsActionResult;
  toggleShortcuts: (open?: boolean) => void;
  setWifiEnabled: (enabled: boolean) => void;
  setBluetoothEnabled: (enabled: boolean) => void;
  setAirplaneMode: (enabled: boolean) => void;
  setNightLight: (enabled: boolean) => void;
  setBrightness: (brightness: number) => void;
  setVolume: (volume: number) => void;
}

export type OSStore = OSStoreState & OSStoreActions;

const DEFAULT_APP_CONFIG: Record<
  AppType,
  { title: string; width: number; height: number }
> = {
  terminal: { title: 'Terminal', width: 680, height: 430 },
  explorer: { title: 'File Explorer', width: 720, height: 460 },
  about: { title: 'About Dhrumil', width: 540, height: 400 },
  settings: { title: 'Settings', width: 480, height: 560 },
  'project-viewer': { title: 'Document Viewer', width: 640, height: 480 },
  tetris: { title: 'Tetris', width: 440, height: 530 },
  minesweeper: { title: 'Minesweeper', width: 380, height: 510 },
  'memory-match': { title: 'Memory Match', width: 520, height: 480 },
  'game-2048': { title: '2048', width: 420, height: 560 },
};

function createBaseState(): OSStoreState {
  return {
    currentOS: null,
    openWindows: [],
    activeWindowId: null,
    nextZIndex: 10,
    currentDirectory: '/',
    vfs: createInitialVfs(),
    shortcutsOpen: false,
    wifiEnabled: true,
    bluetoothEnabled: true,
    airplaneMode: false,
    nightLight: false,
    brightness: 100,
    volume: 72,
  };
}

let windowCounter = 0;

function createWindowId(appType: AppType): string {
  windowCounter += 1;
  return `${appType}-${windowCounter}`;
}

export const useOSStore = create<OSStore>((set, get) => ({
  ...createBaseState(),

  bootOS: (os) => {
    windowCounter = 0;
    set({
      ...createBaseState(),
      currentOS: os,
    });
  },

  shutdownOS: () => {
    windowCounter = 0;
    set(createBaseState());
  },

  hardReset: () => {
    windowCounter = 0;
    set(createBaseState());
  },

  openWindow: (appType, options) => {
    const state = get();
    const normalizedFilePath = options?.filePath
      ? resolveVfsPath(options.filePath, state.currentDirectory)
      : undefined;

    // Focus existing window if matching singleton app or identical document path
    const existing = state.openWindows.find((win) =>
      normalizedFilePath
        ? win.appType === appType && win.filePath === normalizedFilePath
        : win.appType === appType && !win.filePath
    );

    if (existing) {
      const nextZ = state.nextZIndex;
      set({
        openWindows: state.openWindows.map((win) =>
          win.id === existing.id
            ? { ...win, isMinimized: false, zIndex: nextZ }
            : win
        ),
        activeWindowId: existing.id,
        nextZIndex: nextZ + 1,
      });
      return existing.id;
    }

    const defaults = DEFAULT_APP_CONFIG[appType];
    const cascadeOffset = (state.openWindows.length % 6) * 28;
    const id = createWindowId(appType);
    const nextZ = state.nextZIndex;

    const newWindow: OSWindow = {
      id,
      appType,
      title: options?.title ?? defaults.title,
      x: 136 + cascadeOffset,
      y: 36 + cascadeOffset,
      width: options?.width ?? defaults.width,
      height: options?.height ?? defaults.height,
      zIndex: nextZ,
      isMinimized: false,
      isMaximized: false,
      filePath: normalizedFilePath,
    };

    set({
      openWindows: [...state.openWindows, newWindow],
      activeWindowId: id,
      nextZIndex: nextZ + 1,
    });

    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.openWindows.filter((win) => win.id !== id);
      let nextActive = state.activeWindowId;

      if (state.activeWindowId === id) {
        const visible = remaining.filter((w) => !w.isMinimized);
        if (visible.length > 0) {
          const top = visible.reduce((best, curr) =>
            curr.zIndex > best.zIndex ? curr : best
          );
          nextActive = top.id;
        } else {
          nextActive = null;
        }
      }

      return {
        openWindows: remaining,
        activeWindowId: nextActive,
      };
    });
  },

  clearOpenWindows: () => {
    set({
      openWindows: [],
      activeWindowId: null,
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const target = state.openWindows.find((win) => win.id === id);
      if (!target) return state;

      const nextZ = state.nextZIndex;
      return {
        openWindows: state.openWindows.map((win) =>
          win.id === id ? { ...win, isMinimized: false, zIndex: nextZ } : win
        ),
        activeWindowId: id,
        nextZIndex: nextZ + 1,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const updated = state.openWindows.map((win) =>
        win.id === id ? { ...win, isMinimized: true } : win
      );
      let nextActive = state.activeWindowId;

      if (state.activeWindowId === id) {
        const visible = updated.filter((w) => !w.isMinimized);
        if (visible.length > 0) {
          nextActive = visible.reduce((best, curr) =>
            curr.zIndex > best.zIndex ? curr : best
          ).id;
        } else {
          nextActive = null;
        }
      }

      return {
        openWindows: updated,
        activeWindowId: nextActive,
      };
    });
  },

  toggleMaximizeWindow: (id) => {
    set((state) => {
      const nextZ = state.nextZIndex;
      return {
        openWindows: state.openWindows.map((win) =>
          win.id === id
            ? { ...win, isMaximized: !win.isMaximized, isMinimized: false, zIndex: nextZ }
            : win
        ),
        activeWindowId: id,
        nextZIndex: nextZ + 1,
      };
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      openWindows: state.openWindows.map((win) =>
        win.id === id ? { ...win, x, y } : win
      ),
    }));
  },

  updateWindowSize: (id, width, height, x, y) => {
    set((state) => ({
      openWindows: state.openWindows.map((win) =>
        win.id === id
          ? {
              ...win,
              width,
              height,
              isMaximized: false,
              x: x ?? win.x,
              y: y ?? win.y,
            }
          : win
      ),
    }));
  },

  setCurrentDirectory: (path) => {
    const state = get();
    const resolved = resolveVfsPath(path, state.currentDirectory);
    const node = getVfsNode(state.vfs, resolved);
    if (!node || node.type !== 'directory') {
      return false;
    }
    set({ currentDirectory: resolved });
    return true;
  },

  createFile: (path, name, content = '') => {
    const state = get();
    const result = insertVfsFile(state.vfs, path, name, content, state.currentDirectory);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    set({ vfs: result.root });
    return { ok: true, path: result.targetPath };
  },

  makeDirectory: (path, name) => {
    const state = get();
    const result = insertVfsDirectory(state.vfs, path, name, state.currentDirectory);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    set({ vfs: result.root });
    return { ok: true, path: result.targetPath };
  },

  deleteItem: (path) => {
    const state = get();
    const result = removeVfsItem(state.vfs, path, state.currentDirectory);
    if (!result.ok || !result.targetPath) {
      return { ok: false, error: result.error };
    }

    const deletedPath = result.targetPath;
    const isAffectedPath = (p?: string) =>
      !!p && (p === deletedPath || p.startsWith(`${deletedPath}/`));

    let nextDirectory = state.currentDirectory;
    if (isAffectedPath(nextDirectory)) {
      const parent = resolveVfsPath('..', deletedPath);
      nextDirectory = getVfsNode(result.root, parent)?.type === 'directory' ? parent : '/';
    }

    // Close open document viewers pointing to removed items & fallback explorer paths to parent
    const nextWindows = state.openWindows
      .filter((win) => !(win.appType === 'project-viewer' && isAffectedPath(win.filePath)))
      .map((win) =>
        win.appType === 'explorer' && isAffectedPath(win.filePath)
          ? { ...win, filePath: nextDirectory, title: nextDirectory === '/' ? 'File Explorer' : nextDirectory.split('/').pop() || 'File Explorer' }
          : win
      );

    let nextActive = state.activeWindowId;
    if (nextActive && !nextWindows.some((w) => w.id === nextActive)) {
      const visible = nextWindows.filter((w) => !w.isMinimized);
      nextActive =
        visible.length > 0
          ? visible.reduce((best, curr) => (curr.zIndex > best.zIndex ? curr : best)).id
          : null;
    }

    set({
      vfs: result.root,
      currentDirectory: nextDirectory,
      openWindows: nextWindows,
      activeWindowId: nextActive,
    });

    return { ok: true, path: deletedPath };
  },

  toggleShortcuts: (open) => {
    set((state) => ({
      shortcutsOpen: typeof open === 'boolean' ? open : !state.shortcutsOpen,
    }));
  },

  setWifiEnabled: (enabled) => set({ wifiEnabled: enabled }),
  setBluetoothEnabled: (enabled) => set({ bluetoothEnabled: enabled }),
  setAirplaneMode: (enabled) => set({ airplaneMode: enabled }),
  setNightLight: (enabled) => set({ nightLight: enabled }),
  setBrightness: (brightness) => set({ brightness }),
  setVolume: (volume) => set({ volume }),
}));
