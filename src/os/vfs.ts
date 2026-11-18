export type VfsNodeType = 'file' | 'directory';

export interface FileNode {
  name: string;
  type: 'file';
  extension: string;
  sizeBytes: number;
  updatedAt: string;
  content: string;
}

export interface FolderNode {
  name: string;
  type: 'directory';
  updatedAt: string;
  children: Record<string, VfsNode>;
}

export type VfsNode = FileNode | FolderNode;

// Backwards-compatible aliases
export type VfsFileNode = FileNode;
export type VfsDirectoryNode = FolderNode;

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx > 0 && idx < filename.length - 1 ? filename.slice(idx + 1).toLowerCase() : 'txt';
}

const makeFileNode = (
  name: string,
  updatedAt: string,
  content: string
): FileNode => ({
  name,
  type: 'file',
  extension: getExtension(name),
  sizeBytes: content.length,
  updatedAt,
  content,
});

function buildDefaultPortfolioVfs(): FolderNode {
  return {
    name: 'root',
    type: 'directory',
    updatedAt: '2026-11-16',
    children: {
      'about.txt': makeFileNode(
        'about.txt',
        '2026-11-16',
        [
          'NAME: Dhrumil Asodiya',
          'ROLE: Full-Stack Java Developer',
          'STACK: Java, Spring Boot, Next.js, TypeScript, PostgreSQL, Python, Docker',
          '',
          'ABOUT',
          '-----',
          'Full-Stack Java Developer focused on clean backend architectures, multi-tenant',
          'systems, low-level VM internals, and responsive developer-centric web interfaces.',
          '',
          'DIRECTORY GUIDE',
          '---------------',
          '  /about.txt        Profile overview',
          '  /skills.txt       Core languages, frameworks, and tooling',
          '  /resume.md        Experience & education summary',
          '  /projects/        Case studies for 5 featured builds',
          '  /system/          Trinity OS metadata & kernel info',
        ].join('\n')
      ),

      'skills.txt': makeFileNode(
        'skills.txt',
        '2026-11-16',
        [
          'CORE SKILLS — DHRUMIL ASODIYA',
          '=============================',
          '',
          '[Backend & Systems]',
          '  - Java (Core, JVM Internals, Bitwise / VM Emulation)',
          '  - Spring Boot, Spring Security, JPA / Hibernate, REST APIs',
          '  - Python (CLI Engineering, InquirerPy, Jinja2)',
          '',
          '[Frontend & UI]',
          '  - Next.js, React, TypeScript, Tailwind CSS, Framer Motion',
          '  - Interactive State Management (Zustand), xterm.js',
          '',
          '[Databases & Infrastructure]',
          '  - PostgreSQL (Multi-tenant isolation, relational modeling)',
          '  - Linux, Git, Docker, Gradle / Maven',
        ].join('\n')
      ),

      'resume.md': makeFileNode(
        'resume.md',
        '2026-11-16',
        [
          '# Dhrumil Asodiya',
          '**Full-Stack Java Developer**',
          '',
          '## Summary',
          'Software engineer experienced across Spring Boot microservices, Next.js',
          'full-stack web applications, PostgreSQL data architecture, and systems-level',
          'Java & Python developer tooling.',
          '',
          '## Featured Projects',
          '- **Finanger** — Personal finance tracker (Spring Boot, Next.js, PostgreSQL)',
          '- **Career Compass** — Academic & career guidance platform (GTU University Project)',
          '- **Multi-Tenant Configurable Form Builder** — Dynamic schema & tenant-isolated forms',
          '- **32-bit Virtual Machine Emulator** — Custom instruction set & register VM in Java',
          '- **CLI Project Generator** — Interactive scaffolding CLI (Python, InquirerPy, Jinja2)',
        ].join('\n')
      ),

      projects: {
        name: 'projects',
        type: 'directory',
        updatedAt: '2026-11-16',
        children: {
          'finanger.md': makeFileNode(
            'finanger.md',
            '2026-11-12',
            [
              '# Finanger — Personal Finance Tracker',
              '',
              '**Stack:** Spring Boot · Next.js · PostgreSQL · TypeScript',
              '',
              '## Overview',
              'Full-stack personal finance management application built to track income,',
              'recurring expenses, savings goals, and category budgets with strict financial',
              'ledger consistency.',
              '',
              '## Architecture',
              '- **Backend (Spring Boot):** RESTful domain services, DTO validation,',
              '  transactional ledger updates, and JWT-secured API endpoints.',
              '- **Database (PostgreSQL):** Normalized relational schemas for accounts,',
              '  double-entry style transaction logs, and aggregated monthly summaries.',
              '- **Frontend (Next.js):** Responsive dashboard with real-time filtering,',
              '  cash-flow breakdowns, and clean transaction entry flows.',
            ].join('\n')
          ),

          'career-compass.md': makeFileNode(
            'career-compass.md',
            '2026-11-08',
            [
              '# Career Compass — GTU University Project',
              '',
              '**Context:** Gujarat Technological University (GTU) Capstone / Academic Build',
              '',
              '## Overview',
              'Student-focused career exploration and academic roadmap platform built for GTU',
              'undergraduates to map degree coursework, technical skill tracks, and career',
              'milestones in one structured workspace.',
              '',
              '## Highlights',
              '- Structured role and skill-path discovery tailored to engineering cohorts.',
              '- Milestone tracking connecting academic subjects with industry readiness.',
              '- Built with modular backend APIs and a clear, accessible student interface.',
            ].join('\n')
          ),

          'multi-tenant-form-builder.md': makeFileNode(
            'multi-tenant-form-builder.md',
            '2026-11-04',
            [
              '# Multi-Tenant Configurable Form Builder',
              '',
              '**Stack:** Java / Spring Boot · PostgreSQL · React / Next.js',
              '',
              '## Overview',
              'SaaS-ready dynamic form engine allowing independent organizations (tenants) to',
              'design, version, validate, and collect custom structured submissions without',
              'code deployments.',
              '',
              '## Architecture',
              '- **Tenant Isolation:** Scoped tenant context resolution ensuring strict data',
              '  boundaries across form definitions, themes, and submission payloads.',
              '- **Configurable Schema Engine:** JSON-driven field types, conditional rules,',
              '  custom validation constraints, and extensible submission webhooks.',
            ].join('\n')
          ),

          '32bit-vm-emulator.md': makeFileNode(
            '32bit-vm-emulator.md',
            '2026-10-29',
            [
              '# 32-bit Virtual Machine Emulator',
              '',
              '**Stack:** Core Java (Systems & Low-Level Architecture)',
              '',
              '## Overview',
              'A custom 32-bit virtual machine and instruction-set architecture (ISA)',
              'emulator implemented from scratch in Java to execute compiled bytecode',
              'programs deterministically.',
              '',
              '## Technical Highlights',
              '- **Fetch-Decode-Execute Cycle:** Deterministic CPU loop modeling general-',
              '  purpose 32-bit registers, instruction pointer (IP), stack pointer (SP), and flags.',
              '- **Memory & Stack Model:** Linear addressable byte/word memory space with',
              '  stack frames, arithmetic/logic opcodes, branching, and call/ret semantics.',
              '- **Diagnostics:** Step-by-step register dump and instruction trace inspection.',
            ].join('\n')
          ),

          'cli-project-generator.md': makeFileNode(
            'cli-project-generator.md',
            '2026-10-20',
            [
              '# CLI Project Generator',
              '',
              '**Stack:** Python · InquirerPy · Jinja2',
              '',
              '## Overview',
              'Interactive command-line scaffolding tool that eliminates boilerplate setup by',
              'guiding developers through structured prompts and rendering tailored project',
              'trees automatically.',
              '',
              '## Technical Highlights',
              '- **InquirerPy Prompts:** Keyboard-friendly fuzzy selection, validation,',
              '  and conditional configuration flows directly in the terminal.',
              '- **Jinja2 Templating:** Dynamic rendering of source files, build configs,',
              '  Dockerfiles, and README templates based on selected stack options.',
            ].join('\n')
          ),
        },
      },

      system: {
        name: 'system',
        type: 'directory',
        updatedAt: '2026-11-16',
        children: {
          'trinity-os.txt': makeFileNode(
            'trinity-os.txt',
            '2026-11-16',
            [
              'TRINITY OS v1 — KERNEL MANIFEST',
              '-------------------------------',
              'Architecture : Single-Tree Adaptive Desktop/Mobile Shell',
              'Maintainer   : Dhrumil Asodiya',
              'VFS Mode     : Stateful In-Memory Zustand VFS (Reset on Reboot)',
              'Boot Targets : Windows | macOS | Ubuntu (Desktop) / Android | iOS (Mobile)',
              '',
              'CLI Tips: Try mkdir, touch, echo "hi" > note.txt, rm, ls/dir, or neofetch.',
            ].join('\n')
          ),
        },
      },
    },
  };
}

export function createInitialVfs(): FolderNode {
  return buildDefaultPortfolioVfs();
}

export const PORTFOLIO_VFS: FolderNode = buildDefaultPortfolioVfs();

function cloneNode(node: VfsNode): VfsNode {
  if (node.type === 'file') {
    return { ...node };
  }
  const clonedChildren: Record<string, VfsNode> = {};
  for (const [key, child] of Object.entries(node.children)) {
    clonedChildren[key] = cloneNode(child);
  }
  return {
    ...node,
    children: clonedChildren,
  };
}

/**
 * Validates a single file/folder name (no slashes, empty string, '.' or '..').
 */
export function isValidNodeName(name: string): boolean {
  const clean = name.trim();
  if (!clean || clean === '.' || clean === '..') return false;
  if (clean.includes('/') || clean.includes('\\')) return false;
  return true;
}

/**
 * Normalizes a POSIX-style or Windows-style path relative to `cwd` against the VFS.
 */
export function resolveVfsPath(inputPath: string, cwd = '/'): string {
  const raw = inputPath.trim().replace(/\\/g, '/');
  if (!raw || raw === '~') return '/';

  // Handle Windows drive prefix like C:\Users\Dhrumil -> /
  const stripped = raw
    .replace(/^[a-zA-Z]:\/Users\/Dhrumil\/?/i, '/')
    .replace(/^[a-zA-Z]:\/?/i, '/')
    .replace(/^~\//, '/');

  const isAbsolute = stripped.startsWith('/');
  const baseSegments = isAbsolute ? [] : cwd.split('/').filter(Boolean);
  const nextSegments = stripped.split('/').filter(Boolean);

  const stack = [...baseSegments];
  for (const seg of nextSegments) {
    if (seg === '.') continue;
    if (seg === '..') {
      stack.pop();
      continue;
    }
    stack.push(seg);
  }

  return '/' + stack.join('/');
}

/**
 * Looks up a VFS node inside `root` at an exact normalized path.
 */
export function getVfsNode(
  root: FolderNode,
  targetPath: string,
  cwd = '/'
): VfsNode | null {
  const normalized = resolveVfsPath(targetPath, cwd);
  if (normalized === '/') return root;

  const segments = normalized.split('/').filter(Boolean);
  let cursor: VfsNode = root;

  for (const seg of segments) {
    if (cursor.type !== 'directory') return null;
    const child: VfsNode | undefined = cursor.children[seg];
    if (!child) return null;
    cursor = child;
  }

  return cursor;
}

/**
 * Lists child nodes inside a directory path, folders first then files alphabetically.
 */
export function listVfsDirectory(
  root: FolderNode,
  dirPath: string,
  cwd = '/'
): VfsNode[] | null {
  const node = getVfsNode(root, dirPath, cwd);
  if (!node || node.type !== 'directory') return null;

  return Object.values(node.children).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function updateDirectoryAtPath(
  root: FolderNode,
  dirPath: string,
  updater: (dir: FolderNode) => FolderNode | null
): FolderNode | null {
  const normalized = resolveVfsPath(dirPath, '/');
  const segments = normalized.split('/').filter(Boolean);

  const recur = (cursor: FolderNode, depth: number): FolderNode | null => {
    if (depth === segments.length) {
      return updater(cursor);
    }
    const seg = segments[depth];
    const nextChild = cursor.children[seg];
    if (!nextChild || nextChild.type !== 'directory') return null;
    const updatedChild = recur(nextChild, depth + 1);
    if (!updatedChild) return null;
    return {
      ...cursor,
      updatedAt: todayStamp(),
      children: {
        ...cursor.children,
        [seg]: updatedChild,
      },
    };
  };

  return recur(root, 0);
}

export interface VfsMutationOutput {
  root: FolderNode;
  ok: boolean;
  error?: string;
  targetPath?: string;
}

/**
 * Immutably creates or updates a file at `dirPath/name` inside `root`.
 */
export function insertVfsFile(
  root: FolderNode,
  dirPath: string,
  name: string,
  content: string,
  cwd = '/'
): VfsMutationOutput {
  const cleanName = name.trim();
  if (!isValidNodeName(cleanName)) {
    return { root, ok: false, error: `Invalid filename: "${name}"` };
  }

  const normalizedDir = resolveVfsPath(dirPath, cwd);
  const parentNode = getVfsNode(root, normalizedDir);
  if (!parentNode || parentNode.type !== 'directory') {
    return { root, ok: false, error: `Directory not found: ${normalizedDir}` };
  }

  const existing = parentNode.children[cleanName];
  if (existing && existing.type === 'directory') {
    return {
      root,
      ok: false,
      error: `Cannot create file: "${cleanName}" is an existing directory`,
    };
  }

  const nextFile = makeFileNode(cleanName, todayStamp(), content);
  const updatedRoot = updateDirectoryAtPath(root, normalizedDir, (dir) => ({
    ...dir,
    updatedAt: todayStamp(),
    children: {
      ...dir.children,
      [cleanName]: nextFile,
    },
  }));

  if (!updatedRoot) {
    return { root, ok: false, error: `Failed to write to ${normalizedDir}` };
  }

  const createdPath =
    normalizedDir === '/' ? `/${cleanName}` : `${normalizedDir}/${cleanName}`;
  return { root: updatedRoot, ok: true, targetPath: createdPath };
}

/**
 * Immutably creates a directory at `dirPath/name` inside `root`.
 */
export function insertVfsDirectory(
  root: FolderNode,
  dirPath: string,
  name: string,
  cwd = '/'
): VfsMutationOutput {
  const cleanName = name.trim();
  if (!isValidNodeName(cleanName)) {
    return { root, ok: false, error: `Invalid directory name: "${name}"` };
  }

  const normalizedDir = resolveVfsPath(dirPath, cwd);
  const parentNode = getVfsNode(root, normalizedDir);
  if (!parentNode || parentNode.type !== 'directory') {
    return { root, ok: false, error: `Directory not found: ${normalizedDir}` };
  }

  const existing = parentNode.children[cleanName];
  if (existing) {
    return {
      root,
      ok: false,
      error:
        existing.type === 'directory'
          ? `Directory already exists: ${cleanName}`
          : `File already exists: ${cleanName}`,
    };
  }

  const newDir: FolderNode = {
    name: cleanName,
    type: 'directory',
    updatedAt: todayStamp(),
    children: {},
  };

  const updatedRoot = updateDirectoryAtPath(root, normalizedDir, (dir) => ({
    ...dir,
    updatedAt: todayStamp(),
    children: {
      ...dir.children,
      [cleanName]: newDir,
    },
  }));

  if (!updatedRoot) {
    return { root, ok: false, error: `Failed to create folder in ${normalizedDir}` };
  }

  const createdPath =
    normalizedDir === '/' ? `/${cleanName}` : `${normalizedDir}/${cleanName}`;
  return { root: updatedRoot, ok: true, targetPath: createdPath };
}

/**
 * Immutably removes a file or folder at `targetPath` inside `root`.
 */
export function removeVfsItem(
  root: FolderNode,
  targetPath: string,
  cwd = '/'
): VfsMutationOutput {
  const normalizedTarget = resolveVfsPath(targetPath, cwd);
  if (normalizedTarget === '/') {
    return { root, ok: false, error: 'Cannot delete root directory (/)' };
  }

  const segments = normalizedTarget.split('/').filter(Boolean);
  const itemName = segments[segments.length - 1];
  const parentPath =
    segments.length <= 1 ? '/' : '/' + segments.slice(0, -1).join('/');

  const parentNode = getVfsNode(root, parentPath);
  if (!parentNode || parentNode.type !== 'directory' || !parentNode.children[itemName]) {
    return { root, ok: false, error: `Path not found: ${normalizedTarget}` };
  }

  const updatedRoot = updateDirectoryAtPath(root, parentPath, (dir) => {
    const nextChildren: Record<string, VfsNode> = {};
    for (const [key, child] of Object.entries(dir.children)) {
      if (key !== itemName) {
        nextChildren[key] = cloneNode(child);
      }
    }
    return {
      ...dir,
      updatedAt: todayStamp(),
      children: nextChildren,
    };
  });

  if (!updatedRoot) {
    return { root, ok: false, error: `Failed to delete ${normalizedTarget}` };
  }

  return { root: updatedRoot, ok: true, targetPath: normalizedTarget };
}

/**
 * Formats an internal POSIX VFS path for display in Windows or POSIX CLI prompts.
 */
export function formatVfsPathForOS(
  vfsPath: string,
  os: 'windows' | 'macos' | 'ubuntu' | 'android' | 'ios' | null
): string {
  const normalized = resolveVfsPath(vfsPath, '/');
  if (os === 'windows') {
    if (normalized === '/') return 'C:\\Users\\Dhrumil';
    return 'C:\\Users\\Dhrumil\\' + normalized.slice(1).replace(/\//g, '\\');
  }
  return normalized === '/' ? '~' : `~${normalized}`;
}
