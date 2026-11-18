import { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  FilePlus2,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Trash2,
  User,
} from 'lucide-react';
import { OSWindow, useOSStore } from '@/src/os/useOSStore';
import { getVfsNode, listVfsDirectory, resolveVfsPath } from '@/src/os/vfs';
import { TerminalApp } from './TerminalApp';
import { TetrisApp } from './TetrisApp';
import { MinesweeperApp } from './MinesweeperApp';
import { MemoryMatchApp } from './MemoryMatchApp';
import { Mobile2048App } from './Mobile2048App';
import { SettingsApp } from './SettingsApp';

interface OSWindowContentProps {
  win: OSWindow;
}

export function OSWindowContent({ win }: OSWindowContentProps) {
  const currentOS = useOSStore((s) => s.currentOS);
  const currentDirectory = useOSStore((s) => s.currentDirectory);
  const vfs = useOSStore((s) => s.vfs);

  const setCurrentDirectory = useOSStore((s) => s.setCurrentDirectory);
  const openWindow = useOSStore((s) => s.openWindow);
  const createFile = useOSStore((s) => s.createFile);
  const makeDirectory = useOSStore((s) => s.makeDirectory);
  const deleteItem = useOSStore((s) => s.deleteItem);

  const [explorerPath, setExplorerPath] = useState<string>(
    win.filePath ?? (currentDirectory || '/')
  );
  const [copied, setCopied] = useState(false);

  // Stateful VFS inline creation bar state inside File Explorer
  const [creatingKind, setCreatingKind] = useState<'file' | 'folder' | null>(null);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [vfsFeedback, setVfsFeedback] = useState<string | null>(null);

  if (win.appType === 'explorer') {
    const safeExplorerPath =
      getVfsNode(vfs, explorerPath)?.type === 'directory' ? explorerPath : '/';
    const entries = listVfsDirectory(vfs, safeExplorerPath) ?? [];
    const segments = safeExplorerPath.split('/').filter(Boolean);

    const navigateUp = () => {
      if (safeExplorerPath === '/') return;
      const parent = resolveVfsPath('..', safeExplorerPath);
      setExplorerPath(parent);
      setCurrentDirectory(parent);
      setVfsFeedback(null);
    };

    const handleOpenEntry = (name: string, type: 'file' | 'directory') => {
      const nextPath = resolveVfsPath(name, safeExplorerPath);
      if (type === 'directory') {
        setExplorerPath(nextPath);
        setCurrentDirectory(nextPath);
        setVfsFeedback(null);
      } else {
        openWindow('project-viewer', {
          title: name,
          filePath: nextPath,
        });
      }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!creatingKind) return;
      const clean = newName.trim();
      if (!clean) {
        setVfsFeedback('Please enter a name.');
        return;
      }

      const result =
        creatingKind === 'folder'
          ? makeDirectory(safeExplorerPath, clean)
          : createFile(safeExplorerPath, clean, newContent || `# ${clean}\n`);

      if (!result.ok) {
        setVfsFeedback(result.error ?? 'Operation failed.');
        return;
      }

      setCreatingKind(null);
      setNewName('');
      setNewContent('');
      setVfsFeedback(null);
    };

    const handleDelete = (name: string) => {
      const targetPath = resolveVfsPath(name, safeExplorerPath);
      const res = deleteItem(targetPath);
      if (!res.ok) {
        setVfsFeedback(res.error ?? 'Unable to delete item.');
      } else {
        setVfsFeedback(null);
      }
    };

    return (
      <div className="flex h-full flex-col text-sm">
        {/* Path & Stateful Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/15 px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={navigateUp}
              disabled={safeExplorerPath === '/'}
              aria-label="Go up one directory"
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded border border-current/15 disabled:cursor-not-allowed disabled:opacity-35 hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto font-mono text-xs"
            >
              <button
                type="button"
                onClick={() => {
                  setExplorerPath('/');
                  setCurrentDirectory('/');
                  setVfsFeedback(null);
                }}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-white/10"
              >
                root
              </button>
              {segments.map((seg, idx) => {
                const target = '/' + segments.slice(0, idx + 1).join('/');
                return (
                  <span key={target} className="flex items-center gap-1">
                    <ChevronRight className="size-3.5 opacity-50" />
                    <button
                      type="button"
                      onClick={() => {
                        setExplorerPath(target);
                        setCurrentDirectory(target);
                        setVfsFeedback(null);
                      }}
                      className="cursor-pointer rounded px-1.5 py-1 hover:bg-white/10"
                    >
                      {seg}
                    </button>
                  </span>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setCreatingKind((prev) => (prev === 'file' ? null : 'file'));
                setNewName('');
                setNewContent('');
                setVfsFeedback(null);
              }}
              className="inline-flex min-h-[28px] cursor-pointer items-center gap-1 rounded border border-current/20 px-2 py-1 text-xs hover:bg-white/10"
              title="Create new file in current folder"
            >
              <FilePlus2 className="size-3.5" />
              <span>New File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingKind((prev) => (prev === 'folder' ? null : 'folder'));
                setNewName('');
                setNewContent('');
                setVfsFeedback(null);
              }}
              className="inline-flex min-h-[28px] cursor-pointer items-center gap-1 rounded border border-current/20 px-2 py-1 text-xs hover:bg-white/10"
              title="Create new folder in current folder"
            >
              <FolderPlus className="size-3.5" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Inline Creation Bar */}
        {creatingKind && (
          <form
            onSubmit={handleCreateSubmit}
            className="flex flex-wrap items-center gap-2 border-b border-current/15 bg-white/[0.04] px-3 py-2 text-xs"
          >
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={
                creatingKind === 'folder' ? 'Folder name (e.g. notes)' : 'File name (e.g. todo.md)'
              }
              className="min-w-[140px] flex-1 rounded border border-current/25 bg-black/30 px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[var(--os-accent)]"
            />
            {creatingKind === 'file' && (
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Initial text content (optional)"
                className="min-w-[160px] flex-1 rounded border border-current/25 bg-black/30 px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[var(--os-accent)]"
              />
            )}
            <button
              type="submit"
              className="cursor-pointer rounded bg-[var(--os-accent)] px-3 py-1.5 font-medium text-black hover:opacity-90"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingKind(null);
                setVfsFeedback(null);
              }}
              className="cursor-pointer rounded border border-current/20 px-2.5 py-1.5 hover:bg-white/10"
            >
              Cancel
            </button>
          </form>
        )}

        {vfsFeedback && (
          <div className="border-b border-red-400/30 bg-red-500/15 px-3 py-1.5 font-mono text-xs text-red-200">
            {vfsFeedback}
          </div>
        )}

        {/* File & Folder Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {entries.length === 0 ? (
            <p className="p-4 text-xs opacity-60">Directory is empty.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {entries.map((entry) => {
                const isDir = entry.type === 'directory';
                return (
                  <div
                    key={entry.name}
                    className="group flex min-h-[52px] items-center justify-between gap-2 rounded-lg border border-current/12 bg-white/[0.04] px-3 py-2 transition-colors hover:border-[var(--os-accent)] hover:bg-white/[0.08]"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenEntry(entry.name, entry.type)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                    >
                      {isDir ? (
                        <Folder className="size-5 shrink-0 text-[var(--os-accent)]" />
                      ) : (
                        <FileText className="size-5 shrink-0 opacity-80" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-medium">
                          {entry.name}
                        </p>
                        <p className="text-[11px] opacity-60">
                          {isDir ? 'Folder' : `${entry.sizeBytes} B · ${entry.updatedAt}`}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(entry.name)}
                      aria-label={`Delete ${entry.name}`}
                      title={`Delete ${entry.name}`}
                      className="grid size-7 shrink-0 cursor-pointer place-items-center rounded opacity-60 transition-colors hover:bg-red-600 hover:text-white hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-current/15 px-3 py-1.5 font-mono text-[11px] opacity-65">
          <span>{entries.length} items (Stateful Zustand VFS)</span>
          <span>Live synced with Terminal</span>
        </div>
      </div>
    );
  }

  if (win.appType === 'project-viewer') {
    const targetPath = win.filePath ?? '/about.txt';
    const node = getVfsNode(vfs, targetPath);

    const handleCopy = async () => {
      if (!node || node.type !== 'file') return;
      try {
        await navigator.clipboard.writeText(node.content);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        setCopied(false);
      }
    };

    if (!node || node.type !== 'file') {
      return (
        <div className="p-5 text-sm opacity-75">
          Unable to read file at <code className="font-mono">{targetPath}</code>.
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-current/15 px-4 py-2 font-mono text-xs">
          <span className="truncate opacity-80">{targetPath}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[28px] cursor-pointer items-center gap-1.5 rounded border border-current/20 px-2.5 py-1 text-[11px] hover:bg-white/10"
          >
            <Copy className="size-3" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-[13px]">
          {node.content}
        </pre>
      </div>
    );
  }

  if (win.appType === 'about') {
    return (
      <div className="flex h-full flex-col justify-between gap-5 overflow-y-auto p-5 text-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-current/15 pb-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-current/20 bg-white/10">
              <User className="size-6 text-[var(--os-accent)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">Dhrumil Asodiya</h2>
              <p className="text-xs opacity-75">Full-Stack Java Developer</p>
            </div>
          </div>

          <p className="leading-relaxed opacity-90">
            Full-Stack Java Developer crafting Spring Boot microservices, Next.js web applications,
            multi-tenant SaaS architectures, low-level Java virtual machines, and Python CLI tooling.
          </p>

          <div className="space-y-1.5 text-xs">
            <p className="font-semibold uppercase tracking-wide opacity-70">Quick Open VFS Files</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => openWindow('explorer', { title: 'Projects', filePath: '/projects' })}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded border border-current/20 bg-white/5 px-3 py-1.5 hover:border-[var(--os-accent)]"
              >
                <FolderOpen className="size-3.5" />
                <span>Browse /projects</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  openWindow('project-viewer', { title: 'skills.txt', filePath: '/skills.txt' })
                }
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded border border-current/20 bg-white/5 px-3 py-1.5 hover:border-[var(--os-accent)]"
              >
                <FileText className="size-3.5" />
                <span>skills.txt</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  openWindow('project-viewer', { title: 'resume.md', filePath: '/resume.md' })
                }
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded border border-current/20 bg-white/5 px-3 py-1.5 hover:border-[var(--os-accent)]"
              >
                <FileText className="size-3.5" />
                <span>resume.md</span>
              </button>
            </div>
          </div>
        </div>

        <p className="border-t border-current/15 pt-3 font-mono text-[11px] opacity-65">
          Trinity OS v1 · Running on {currentOS?.toUpperCase()} shell (Stateful VFS)
        </p>
      </div>
    );
  }

  if (win.appType === 'settings') {
    return <SettingsApp />;
  }

  if (win.appType === 'tetris') {
    return <TetrisApp windowId={win.id} />;
  }

  if (win.appType === 'minesweeper') {
    return <MinesweeperApp />;
  }

  if (win.appType === 'memory-match') {
    return <MemoryMatchApp />;
  }

  if (win.appType === 'game-2048') {
    return <Mobile2048App />;
  }

  return <TerminalApp windowId={win.id} />;
}
