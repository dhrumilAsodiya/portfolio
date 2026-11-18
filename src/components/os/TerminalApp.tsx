import { useEffect, useRef } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { OSType, useOSStore } from '@/src/os/useOSStore';
import {
  formatVfsPathForOS,
  getVfsNode,
  listVfsDirectory,
  resolveVfsPath,
} from '@/src/os/vfs';

interface TerminalAppProps {
  windowId: string;
}

const FORTUNES = [
  '“First, solve the problem. Then, write the code.” — John Johnson',
  '“Java bytecode in, deterministic execution out.” — 32-bit VM Emulator Notes',
  '“Multi-tenant isolation is easiest when designed into the schema on day one.”',
  '“There is no place like 127.0.0.1.”',
  '“Every Spring Boot service starts with a clean domain model.”',
];

function buildPrompt(os: OSType | null, cwd: string): string {
  const formattedPath = formatVfsPathForOS(cwd, os);
  if (os === 'windows') {
    return `\x1b[1;36m${formattedPath}>\x1b[0m `;
  }
  return `\x1b[1;32mdhrumil@portfolio\x1b[0m:\x1b[1;34m${formattedPath}\x1b[0m$ `;
}

function formatDisplayPath(path: string, os: OSType | null): string {
  if (os === 'windows') {
    return formatVfsPathForOS(path, 'windows');
  }
  return path;
}

function splitParentAndName(
  targetPath: string,
  cwd: string
): {
  parentDir: string;
  name: string;
  fullPath: string;
} {
  const resolved = resolveVfsPath(targetPath, cwd);
  if (resolved === '/') {
    return { parentDir: '/', name: '', fullPath: '/' };
  }
  const segments = resolved.split('/').filter(Boolean);
  const name = segments[segments.length - 1] ?? '';
  const parentDir =
    segments.length <= 1 ? '/' : '/' + segments.slice(0, -1).join('/');
  return { parentDir, name, fullPath: resolved };
}

function stripSurroundingQuotes(text: string): string {
  const trimmed = text.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Splits a command line into arguments while honoring single and double quotes.
 */
function tokenizeShellLine(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (/\s/.test(ch)) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += ch;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Finds `>` or `>>` outside of single/double quotes for shell redirection.
 */
function parseRedirection(input: string): {
  lhs: string;
  operator: '>' | '>>';
  target: string;
} | null {
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '>') {
      const isAppend = input[i + 1] === '>';
      const operator: '>' | '>>' = isAppend ? '>>' : '>';
      const lhs = input.slice(0, i).trim();
      const rhsRaw = input.slice(i + (isAppend ? 2 : 1)).trim();
      const rhsTokens = tokenizeShellLine(rhsRaw);
      const target = rhsTokens[0] ?? '';
      return { lhs, operator, target };
    }
  }

  return null;
}

const BREACH_MAX_ATTEMPTS = 7;

interface BreachGameState {
  isGameActive: boolean;
  secretPin: string;
  attemptNumber: number;
}

function generateServerPin(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

function evaluatePinGuess(
  secret: string,
  guess: string
): { exact: number; wrongPos: number } {
  const secretChars = secret.split('');
  const guessChars = guess.split('');
  const secretUsed = [false, false, false, false];
  const guessUsed = [false, false, false, false];

  let exact = 0;
  for (let i = 0; i < 4; i++) {
    if (guessChars[i] === secretChars[i]) {
      exact += 1;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  let wrongPos = 0;
  for (let i = 0; i < 4; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 4; j++) {
      if (!secretUsed[j] && guessChars[i] === secretChars[j]) {
        wrongPos += 1;
        secretUsed[j] = true;
        break;
      }
    }
  }

  return { exact, wrongPos };
}

export function TerminalApp({ windowId }: TerminalAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentOS = useOSStore((s) => s.currentOS);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.35,
      convertEol: true,
      theme: {
        background: '#07090d',
        foreground: '#e4e4e7',
        cursor: '#4ade80',
        selectionBackground: 'rgba(96, 165, 250, 0.35)',
        black: '#18181b',
        red: '#f87171',
        green: '#4ade80',
        yellow: '#facc15',
        blue: '#60a5fa',
        magenta: '#c084fc',
        cyan: '#22d3ee',
        white: '#f4f4f5',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);

    const safeFit = () => {
      try {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          fitAddon.fit();
        }
      } catch {
        // Ignore fit error during unmounting
      }
    };

    safeFit();
    const resizeObserver = new ResizeObserver(() => safeFit());
    resizeObserver.observe(container);

    let lineBuffer = '';
    const history: string[] = [];
    let historyCursor = 0;

    const breachGame: BreachGameState = {
      isGameActive: false,
      secretPin: '',
      attemptNumber: 1,
    };

    const writePrompt = () => {
      const state = useOSStore.getState();
      term.write(buildPrompt(state.currentOS, state.currentDirectory));
    };

    const writeBreachPrompt = () => {
      term.write(
        `\x1b[1;31m[BREACH ${breachGame.attemptNumber}/${BREACH_MAX_ATTEMPTS}]\x1b[0m \x1b[33mPIN>\x1b[0m `
      );
    };

    const startRedTeamBreach = () => {
      breachGame.isGameActive = true;
      breachGame.secretPin = generateServerPin();
      breachGame.attemptNumber = 1;

      term.write('\x1b[H\x1b[2J');
      term.clear();
      term.writeln('\x1b[1;31m====================================================\x1b[0m');
      term.writeln('\x1b[1;31m  RED TEAM BREACH // REMOTE AUTH TARGET 10.42.0.7\x1b[0m');
      term.writeln('\x1b[1;31m====================================================\x1b[0m');
      term.writeln(
        `\x1b[36mMission:\x1b[0m Crack the 4-digit server PIN in \x1b[1;33m${BREACH_MAX_ATTEMPTS} attempts\x1b[0m.`
      );
      term.writeln(
        "\x1b[90mEnter a 4-digit PIN (0000-9999). Type 'abort' or Ctrl+C to exit.\x1b[0m\r\n"
      );
      writeBreachPrompt();
    };

    const handleBreachGuess = (rawGuess: string) => {
      const guess = rawGuess.trim();
      const lower = guess.toLowerCase();

      if (lower === 'abort' || lower === 'exit' || lower === 'quit') {
        breachGame.isGameActive = false;
        term.writeln('\x1b[33m[DISCONNECTED]\x1b[0m Session aborted. Returning to shell.\r\n');
        writePrompt();
        return;
      }

      if (!/^\d{4}$/.test(guess)) {
        term.writeln(
          '\x1b[31m[ERROR]\x1b[0m Invalid PIN format. Enter exactly 4 digits (e.g. 4812).'
        );
        writeBreachPrompt();
        return;
      }

      const { exact, wrongPos } = evaluatePinGuess(breachGame.secretPin, guess);

      if (exact === 4) {
        breachGame.isGameActive = false;
        term.writeln('');
        term.writeln(
          `\x1b[1;32m[BREACH SUCCESSFUL]\x1b[0m Access granted in ${breachGame.attemptNumber}/${BREACH_MAX_ATTEMPTS} attempts! Server PIN: \x1b[1;32m${breachGame.secretPin}\x1b[0m\r\n`
        );
        writePrompt();
        return;
      }

      term.writeln(
        `  \x1b[36m>\x1b[0m \x1b[1;32m${exact}\x1b[0m digits correct and in right position, \x1b[1;33m${wrongPos}\x1b[0m digits correct but wrong position.`
      );

      if (breachGame.attemptNumber >= BREACH_MAX_ATTEMPTS) {
        breachGame.isGameActive = false;
        term.writeln('');
        term.writeln(
          `\x1b[1;31m[LOCKOUT TRIGGERED — ACCESS DENIED]\x1b[0m All ${BREACH_MAX_ATTEMPTS} attempts failed. Server PIN was \x1b[1;37m${breachGame.secretPin}\x1b[0m.\r\n`
        );
        writePrompt();
        return;
      }

      breachGame.attemptNumber += 1;
      writeBreachPrompt();
    };

    const printBanner = () => {
      const os = useOSStore.getState().currentOS;
      if (os === 'windows') {
        term.writeln('\x1b[1;37mTrinity OS [Version 1.0.0 — Windows CMD Shell]\x1b[0m');
        term.writeln('Dhrumil Asodiya — Full-Stack Java Developer Stateful VFS');
        term.writeln(
          "Type \x1b[33mhelp\x1b[0m for commands, \x1b[33mdir\x1b[0m to list VFS, \x1b[33mmkdir\x1b[0m / \x1b[33mecho \"text\" > file\x1b[0m / \x1b[33mdel\x1b[0m to edit.\r\n"
        );
      } else if (os === 'ubuntu') {
        term.writeln('\x1b[1;32mTrinity OS v1 — Ubuntu POSIX Portfolio Shell\x1b[0m');
        term.writeln('Dhrumil Asodiya — Full-Stack Java Developer');
        term.writeln(
          "Type \x1b[36mhelp\x1b[0m for commands, \x1b[36mls\x1b[0m / \x1b[36mmkdir\x1b[0m / \x1b[36mtouch\x1b[0m, or \x1b[1;31mplay breach\x1b[0m for the Red Team PIN challenge.\r\n"
        );
      } else {
        term.writeln('\x1b[1;32mTrinity OS v1 — POSIX Stateful Portfolio Shell\x1b[0m');
        term.writeln('Dhrumil Asodiya — Full-Stack Java Developer');
        term.writeln(
          "Type \x1b[36mhelp\x1b[0m for commands, \x1b[36mls\x1b[0m to browse, \x1b[36mmkdir\x1b[0m / \x1b[36mtouch\x1b[0m / \x1b[36mrm\x1b[0m / \x1b[36mecho \"text\" > file\x1b[0m.\r\n"
        );
      }
      writePrompt();
    };

    const clearCurrentInput = () => {
      for (let i = 0; i < lineBuffer.length; i++) {
        term.write('\b \b');
      }
      lineBuffer = '';
    };

    const handleDirectoryList = (rawArg?: string) => {
      const state = useOSStore.getState();
      const target = rawArg ? rawArg : state.currentDirectory;
      const resolved = resolveVfsPath(target, state.currentDirectory);
      const entries = listVfsDirectory(state.vfs, resolved);

      if (!entries) {
        term.writeln(
          `\x1b[31mDirectory not found:\x1b[0m ${formatDisplayPath(resolved, state.currentOS)}`
        );
        return;
      }

      if (state.currentOS === 'windows') {
        term.writeln(`\r\n Directory of ${formatVfsPathForOS(resolved, 'windows')}\r\n`);
        entries.forEach((node) => {
          const date = node.updatedAt;
          if (node.type === 'directory') {
            term.writeln(`${date}    <DIR>          \x1b[1;36m${node.name}\x1b[0m`);
          } else {
            const sizeStr = String(node.sizeBytes).padStart(10, ' ');
            term.writeln(`${date}    ${sizeStr} B  ${node.name}`);
          }
        });
        term.writeln(`               ${entries.length} entry(s)\r\n`);
      } else {
        const formatted = entries
          .map((node) =>
            node.type === 'directory'
              ? `\x1b[1;34m${node.name}/\x1b[0m`
              : `\x1b[0m${node.name}`
          )
          .join('  ');
        term.writeln(formatted || '(empty directory)');
      }
    };

    const handleReadFile = (rawArg?: string) => {
      if (!rawArg) {
        term.writeln('Usage: specify a filename (e.g. about.txt or projects/finanger.md)');
        return;
      }
      const state = useOSStore.getState();
      const node = getVfsNode(state.vfs, rawArg, state.currentDirectory);
      if (!node) {
        term.writeln(`\x1b[31mFile not found:\x1b[0m ${rawArg}`);
        return;
      }
      if (node.type === 'directory') {
        term.writeln(`\x1b[33m${rawArg}\x1b[0m is a directory.`);
        return;
      }
      term.writeln('');
      node.content.split('\n').forEach((line) => term.writeln(line));
      term.writeln('');
    };

    const executeCommand = (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const state = useOSStore.getState();
      const isWindows = state.currentOS === 'windows';

      if (trimmed.toLowerCase() === 'sudo rm -rf /') {
        term.writeln('\x1b[31mPermission denied:\x1b[0m Cannot delete root directory (/).');
        return;
      }

      // Check shell redirection: echo "text" > filename (or >> append, or Windows type nul > filename)
      const redirection = parseRedirection(trimmed);
      if (redirection) {
        const { lhs, operator, target } = redirection;
        const lhsLower = lhs.toLowerCase();

        if (!target) {
          term.writeln('\x1b[31mSyntax error:\x1b[0m Expected target filename after ' + operator);
          return;
        }

        if (lhsLower === 'echo' || lhsLower.startsWith('echo ')) {
          const textBody = lhs.length > 4 ? stripSurroundingQuotes(lhs.slice(4)) : '';
          const { parentDir, name, fullPath } = splitParentAndName(
            target,
            state.currentDirectory
          );

          if (!name) {
            term.writeln('\x1b[31mInvalid filename:\x1b[0m ' + target);
            return;
          }

          let nextContent = textBody;
          if (operator === '>>') {
            const existing = getVfsNode(state.vfs, fullPath);
            if (existing?.type === 'file') {
              nextContent = existing.content ? `${existing.content}\n${textBody}` : textBody;
            }
          }

          const res = state.createFile(parentDir, name, nextContent);
          if (!res.ok) {
            term.writeln(`\x1b[31mError:\x1b[0m ${res.error}`);
          } else {
            const shown = formatDisplayPath(res.path ?? fullPath, state.currentOS);
            term.writeln(`Wrote \x1b[32m${shown}\x1b[0m (${nextContent.length} B)`);
          }
          return;
        }

        if (isWindows && lhsLower.startsWith('type nul')) {
          const { parentDir, name, fullPath } = splitParentAndName(
            target,
            state.currentDirectory
          );
          const existing = getVfsNode(state.vfs, fullPath);
          if (existing) {
            term.writeln(
              `\x1b[31m${existing.type === 'directory' ? 'Directory' : 'File'} already exists:\x1b[0m ${name}`
            );
            return;
          }
          const res = state.createFile(parentDir, name, '');
          if (!res.ok) {
            term.writeln(`\x1b[31mError:\x1b[0m ${res.error}`);
          } else {
            const shown = formatDisplayPath(res.path ?? fullPath, state.currentOS);
            term.writeln(`Created empty file \x1b[36m${shown}\x1b[0m`);
          }
          return;
        }

        term.writeln(
          `\x1b[31mUnsupported redirection.\x1b[0m Try: echo "text" > <filename>`
        );
        return;
      }

      const parts = tokenizeShellLine(trimmed);
      if (parts.length === 0) return;

      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help': {
          term.writeln('\x1b[1;37mAvailable Commands:\x1b[0m');
          if (isWindows) {
            term.writeln('  \x1b[36mdir [path]\x1b[0m                  List files and folders (e.g. dir projects\\)');
            term.writeln('  \x1b[36mtype <file>\x1b[0m                 Print file contents');
            term.writeln('  \x1b[36mcd <dir>\x1b[0m                    Change directory (use \\ or ..)');
            term.writeln('  \x1b[36mmkdir <dir>\x1b[0m                 Create a new folder');
            term.writeln('  \x1b[36mmkfile <file>\x1b[0m               Create an empty file (or: type nul > file)');
            term.writeln('  \x1b[36mecho "text" > <file>\x1b[0m        Create or write a file with content');
            term.writeln('  \x1b[36mdel <name>\x1b[0m                  Delete a file or folder');
            term.writeln('  \x1b[36mcls\x1b[0m                         Clear terminal screen');
          } else {
            term.writeln('  \x1b[32mls [path]\x1b[0m                   List files and folders');
            term.writeln('  \x1b[32mcat <file>\x1b[0m                  Print file contents');
            term.writeln('  \x1b[32mcd <dir>\x1b[0m                    Change directory');
            term.writeln('  \x1b[32mpwd\x1b[0m                         Print working directory');
            term.writeln('  \x1b[32mmkdir <dirname>\x1b[0m             Create a new folder');
            term.writeln('  \x1b[32mtouch <filename>\x1b[0m            Create a new empty file');
            term.writeln('  \x1b[32mecho "text" > <file>\x1b[0m        Create or write a file with content');
            term.writeln('  \x1b[32mrm <name>\x1b[0m                   Delete a file or folder');
            term.writeln('  \x1b[32mclear\x1b[0m                       Clear terminal screen');
          }
          term.writeln('  \x1b[33mopen <file>\x1b[0m                 Open VFS file or folder in GUI viewer');
          term.writeln('  \x1b[33mtetris\x1b[0m                      Launch interactive 10x20 Tetris game');
          if (state.currentOS === 'ubuntu') {
            term.writeln('  \x1b[31mplay breach\x1b[0m                 Ubuntu-exclusive Red Team PIN breach game');
          }
          term.writeln('  \x1b[33mwhoami\x1b[0m                      Display developer identity');
          term.writeln('  \x1b[33mneofetch\x1b[0m                    Show Trinity OS & stack summary');
          term.writeln('  \x1b[33mfortune\x1b[0m                     Random engineering quote');
          term.writeln('  \x1b[33mexit\x1b[0m                        Close terminal window');
          break;
        }

        case 'dir': {
          if (!isWindows) {
            term.writeln("bash: dir: command syntax not valid in POSIX shell. Use 'ls'.");
            break;
          }
          const dirArg = args.find((a) => !/^\/[a-zA-Z]$/.test(a));
          handleDirectoryList(dirArg);
          break;
        }

        case 'ls': {
          if (isWindows) {
            term.writeln("'ls' is not recognized as an internal or external command. Try 'dir'.");
            break;
          }
          const pathArg = args.find((a) => !a.startsWith('-'));
          handleDirectoryList(pathArg);
          break;
        }

        case 'cls': {
          if (!isWindows) {
            term.writeln("bash: cls: command not found. Use 'clear'.");
            break;
          }
          term.write('\x1b[H\x1b[2J');
          term.clear();
          break;
        }

        case 'clear': {
          if (isWindows) {
            term.writeln("'clear' is not recognized on Windows CMD. Try 'cls'.");
            break;
          }
          term.write('\x1b[H\x1b[2J');
          term.clear();
          break;
        }

        case 'type': {
          if (!isWindows) {
            term.writeln("Use 'cat <file>' to read files in POSIX mode.");
            break;
          }
          handleReadFile(args[0]);
          break;
        }

        case 'cat': {
          if (isWindows) {
            term.writeln("'cat' is not recognized on Windows CMD. Try 'type <file>'.");
            break;
          }
          handleReadFile(args[0]);
          break;
        }

        case 'pwd': {
          if (isWindows) {
            term.writeln(formatVfsPathForOS(state.currentDirectory, 'windows'));
          } else {
            term.writeln(state.currentDirectory);
          }
          break;
        }

        case 'cd': {
          const target = args[0] ?? '/';
          const ok = state.setCurrentDirectory(target);
          if (!ok) {
            term.writeln(`\x1b[31mDirectory not found:\x1b[0m ${target}`);
          }
          break;
        }

        case 'mkdir':
        case 'md': {
          if (cmd === 'md' && !isWindows) {
            term.writeln("bash: md: command not found. Use 'mkdir <dirname>'.");
            break;
          }
          const target = args[0];
          if (!target) {
            term.writeln(`Usage: ${cmd} <dirname>`);
            break;
          }
          const { parentDir, name, fullPath } = splitParentAndName(
            target,
            state.currentDirectory
          );
          if (!name) {
            term.writeln(`\x1b[31m${cmd}:\x1b[0m Invalid directory name "${target}"`);
            break;
          }
          const res = state.makeDirectory(parentDir, name);
          if (!res.ok) {
            term.writeln(`\x1b[31m${cmd}:\x1b[0m ${res.error}`);
          } else {
            const shown = formatDisplayPath(res.path ?? fullPath, state.currentOS);
            term.writeln(`Created directory \x1b[34m${shown}\x1b[0m`);
          }
          break;
        }

        case 'touch':
        case 'mkfile': {
          if (cmd === 'touch' && isWindows) {
            term.writeln(
              "Use 'mkfile <filename>', 'type nul > <filename>', or 'echo \"text\" > <filename>' in Windows CMD."
            );
            break;
          }
          if (cmd === 'mkfile' && !isWindows) {
            term.writeln("bash: mkfile: command not found. Use 'touch <filename>'.");
            break;
          }
          const target = args[0];
          if (!target) {
            term.writeln(`Usage: ${cmd} <filename>`);
            break;
          }
          const { parentDir, name, fullPath } = splitParentAndName(
            target,
            state.currentDirectory
          );
          if (!name) {
            term.writeln(`\x1b[31m${cmd}:\x1b[0m Invalid filename "${target}"`);
            break;
          }

          const existing = getVfsNode(state.vfs, fullPath);
          if (existing) {
            term.writeln(
              `\x1b[31m${cmd}:\x1b[0m ${
                existing.type === 'directory'
                  ? `Directory already exists: ${name}`
                  : `File already exists: ${name}`
              }`
            );
            break;
          }

          const res = state.createFile(parentDir, name, '');
          if (!res.ok) {
            term.writeln(`\x1b[31m${cmd}:\x1b[0m ${res.error}`);
          } else {
            const shown = formatDisplayPath(res.path ?? fullPath, state.currentOS);
            term.writeln(`Created empty file \x1b[32m${shown}\x1b[0m`);
          }
          break;
        }

        case 'rm':
        case 'del':
        case 'rmdir':
        case 'rd': {
          if ((cmd === 'del' || cmd === 'rd') && !isWindows) {
            term.writeln(`bash: ${cmd}: command not found. Use 'rm <name>'.`);
            break;
          }
          if (cmd === 'rm' && isWindows) {
            term.writeln("'rm' is not recognized on Windows CMD. Try 'del <name>' or 'rmdir <dir>'.");
            break;
          }
          const targetArg = args.find((a) => !a.startsWith('-'));
          if (!targetArg) {
            term.writeln(`Usage: ${cmd} <name>`);
            break;
          }

          const resolved = resolveVfsPath(targetArg, state.currentDirectory);
          const existing = getVfsNode(state.vfs, resolved);
          if (!existing) {
            term.writeln(
              `\x1b[31m${cmd}:\x1b[0m File or directory not found: ${targetArg}`
            );
            break;
          }

          const res = state.deleteItem(resolved);
          if (!res.ok) {
            term.writeln(`\x1b[31m${cmd}:\x1b[0m ${res.error}`);
          } else {
            const shown = formatDisplayPath(res.path ?? resolved, state.currentOS);
            term.writeln(`Removed \x1b[33m${shown}\x1b[0m`);
          }
          break;
        }

        case 'open': {
          const target = args[0];
          if (!target) {
            term.writeln('Usage: open <file-or-folder>');
            break;
          }
          const resolved = resolveVfsPath(target, state.currentDirectory);
          const node = getVfsNode(state.vfs, resolved);
          if (!node) {
            term.writeln(`\x1b[31mCannot open:\x1b[0m "${target}" not found.`);
            break;
          }
          if (node.type === 'directory') {
            state.openWindow('explorer', { title: node.name, filePath: resolved });
          } else {
            state.openWindow('project-viewer', { title: node.name, filePath: resolved });
          }
          term.writeln(
            `Launched GUI window for \x1b[36m${formatDisplayPath(resolved, state.currentOS)}\x1b[0m`
          );
          break;
        }

        case 'whoami': {
          term.writeln('\x1b[1;32mDhrumil Asodiya\x1b[0m — Full-Stack Java Developer');
          break;
        }

        case 'neofetch': {
          const projectCount =
            listVfsDirectory(state.vfs, '/projects')?.length ?? 0;
          term.writeln('\x1b[1;36m  _____     _       _ _         ___  ____  \x1b[0m');
          term.writeln('\x1b[1;36m |_   _| __(_)_ __ (_) |_ _   _/ _ \\/ ___| \x1b[0m  \x1b[1;37mUser:\x1b[0m dhrumil@trinity');
          term.writeln('\x1b[1;36m   | || \'__| | \'_ \\| | __| | | | | | \\___ \\ \x1b[0m  \x1b[1;37mRole:\x1b[0m Full-Stack Java Developer');
          term.writeln('\x1b[1;36m   | || |  | | | | | | |_| |_| | |_| |___) |\x1b[0m  \x1b[1;37mOS:\x1b[0m ' + (state.currentOS ?? 'unknown'));
          term.writeln('\x1b[1;36m   |_||_|  |_|_| |_|_|\\__|\\__, |\\___/|____/ \x1b[0m  \x1b[1;37mStack:\x1b[0m Java · Spring Boot · Next.js · Postgres');
          term.writeln(`\x1b[1;36m                          |___/             \x1b[0m  \x1b[1;37mVFS:\x1b[0m Stateful Zustand RW (/projects: ${projectCount} entries)`);
          break;
        }

        case 'fortune': {
          const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
          term.writeln(`\x1b[33m${quote}\x1b[0m`);
          break;
        }

        case 'echo': {
          term.writeln(args.join(' '));
          break;
        }

        case 'tetris': {
          state.openWindow('tetris', { title: 'Tetris' });
          term.writeln('Launching \x1b[1;35mTetris\x1b[0m (10x20)... Use Arrow keys + Space to play.');
          break;
        }

        case 'play': {
          if (args[0]?.toLowerCase() === 'breach') {
            if (state.currentOS !== 'ubuntu') {
              term.writeln(
                '\x1b[33mRed Team Breach is exclusive to Ubuntu.\x1b[0m Switch to Ubuntu via GRUB to play.'
              );
              break;
            }
            startRedTeamBreach();
            break;
          }
          term.writeln("Usage: play breach (Ubuntu Red Team PIN cracking mini-game)");
          break;
        }

        case 'exit': {
          state.closeWindow(windowId);
          break;
        }

        default: {
          term.writeln(
            isWindows
              ? `'${cmd}' is not recognized as an internal or external command. Type 'help'.`
              : `bash: ${cmd}: command not found. Type 'help'.`
          );
        }
      }
    };

    const handleTabComplete = () => {
      const parts = lineBuffer.split(/\s+/);
      const last = parts[parts.length - 1] ?? '';
      const state = useOSStore.getState();
      const entries = listVfsDirectory(state.vfs, state.currentDirectory) ?? [];
      const matches = entries.filter((e) => e.name.startsWith(last));
      if (matches.length === 1) {
        const sep = state.currentOS === 'windows' ? '\\' : '/';
        const suffix =
          matches[0].name.slice(last.length) + (matches[0].type === 'directory' ? sep : '');
        lineBuffer += suffix;
        term.write(suffix);
      } else if (matches.length > 1) {
        term.writeln('');
        term.writeln(matches.map((m) => m.name).join('  '));
        writePrompt();
        term.write(lineBuffer);
      }
    };

    const dataDisposable = term.onData((data) => {
      // Enter
      if (data === '\r') {
        term.writeln('');
        const cmd = lineBuffer;
        lineBuffer = '';

        if (breachGame.isGameActive) {
          handleBreachGuess(cmd);
          return;
        }

        if (cmd.trim()) {
          history.push(cmd);
        }
        historyCursor = history.length;
        executeCommand(cmd);
        if (
          !breachGame.isGameActive &&
          useOSStore.getState().openWindows.some((w) => w.id === windowId)
        ) {
          writePrompt();
        }
        return;
      }

      // Ctrl+C
      if (data === '\x03') {
        term.writeln('^C');
        lineBuffer = '';
        if (breachGame.isGameActive) {
          breachGame.isGameActive = false;
          term.writeln('\x1b[31m[BREACH ABORTED]\x1b[0m Returning to bash shell.\r\n');
        }
        writePrompt();
        return;
      }

      // Ctrl+L
      if (data === '\x0c') {
        term.write('\x1b[H\x1b[2J');
        term.clear();
        if (breachGame.isGameActive) {
          writeBreachPrompt();
        } else {
          writePrompt();
        }
        term.write(lineBuffer);
        return;
      }

      // Tab autocomplete (disabled during PIN guessing mode)
      if (data === '\t') {
        if (!breachGame.isGameActive) {
          handleTabComplete();
        }
        return;
      }

      // Backspace
      if (data === '\x7f') {
        if (lineBuffer.length > 0) {
          lineBuffer = lineBuffer.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      // Up arrow (history back, disabled during PIN guessing mode)
      if (data === '\x1b[A') {
        if (!breachGame.isGameActive && historyCursor > 0) {
          historyCursor -= 1;
          clearCurrentInput();
          lineBuffer = history[historyCursor] ?? '';
          term.write(lineBuffer);
        }
        return;
      }

      // Down arrow (history forward, disabled during PIN guessing mode)
      if (data === '\x1b[B') {
        if (!breachGame.isGameActive && historyCursor < history.length) {
          historyCursor += 1;
          clearCurrentInput();
          lineBuffer = history[historyCursor] ?? '';
          term.write(lineBuffer);
        }
        return;
      }

      // Printable characters (supports pasted multi-char chunks too)
      if (data >= ' ' || data.length > 1) {
        const clean = data.replace(/[\r\n]/g, '');
        if (clean) {
          lineBuffer += clean;
          term.write(clean);
        }
      }
    });

    printBanner();
    term.focus();

    return () => {
      dataDisposable.dispose();
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [windowId, currentOS]);

  return (
    <div
      className="h-full w-full overflow-hidden bg-[#07090d] p-2"
      onClick={(e) => {
        const textarea = e.currentTarget.querySelector('textarea');
        textarea?.focus();
      }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
