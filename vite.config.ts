import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {defineConfig, loadEnv, type Plugin, type ViteDevServer} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Dev-only API proxy: serves POST /api/chat locally without Vercel CLI.
      // GROQ_API_KEY is loaded into process.env server-side only and is never
      // exposed to the client bundle (no VITE_ prefix).
      {
        name: 'chat-api-dev-proxy',
        apply: 'serve',
        configureServer(server: ViteDevServer) {
          // Load .env into process.env without prefix filtering so
          // GROQ_API_KEY and ALLOWED_ORIGIN are available server-side.
          const env = loadEnv(server.config.mode, process.cwd(), '');
          Object.assign(process.env, env);

          const parseJsonBody = (req: http.IncomingMessage): Promise<any> =>
            new Promise((resolve, reject) => {
              const chunks: Buffer[] = [];
              req.on('data', (chunk: Buffer) => chunks.push(chunk));
              req.on('end', () => {
                try {
                  const raw = Buffer.concat(chunks).toString();
                  resolve(raw ? JSON.parse(raw) : {});
                } catch {
                  reject(new Error('Invalid JSON body'));
                }
              });
              req.on('error', reject);
            });

          // Extended types for Vercel-compatible req/res in dev middleware
          type ChatReq = http.IncomingMessage & { body?: any };
          type ChatRes = http.ServerResponse & {
            status?: (code: number) => ChatRes;
            json?: (data: any) => ChatRes;
            send?: (data: any) => ChatRes;
          };

          server.middlewares.use('/api/chat', async (req, res, next) => {
            const chatReq = req as ChatReq;
            const chatRes = res as ChatRes;

            if (chatReq.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body: any;
            try {
              body = await parseJsonBody(chatReq);
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              return;
            }

            // Attach parsed body to req (Express/Vercel-compatible)
            chatReq.body = body;

            // Provide Vercel-compatible response helpers on res if missing
            if (typeof chatRes.status !== 'function') {
              chatRes.status = function (code: number) {
                this.statusCode = code;
                return this as ChatRes;
              };
            }
            if (typeof chatRes.json !== 'function') {
              chatRes.json = function (data: any) {
                this.setHeader('Content-Type', 'application/json');
                this.end(JSON.stringify(data));
                return this as ChatRes;
              };
            }
            if (typeof chatRes.send !== 'function') {
              chatRes.send = function (data: any) {
                if (typeof data === 'object') {
                  this.setHeader('Content-Type', 'application/json');
                  this.end(JSON.stringify(data));
                } else {
                  this.setHeader('Content-Type', 'text/plain');
                  this.end(String(data));
                }
                return this as ChatRes;
              };
            }

            try {
              const mod = await server.ssrLoadModule(
                path.resolve(import.meta.dirname, 'api/chat.ts')
              );
              const handler = mod.POST ?? mod.default;

              // Build a Web Request from the Node http.IncomingMessage
              const port = (server.config.server as any)?.port || 3000;
              const url = new URL(
                req.url ?? '/api/chat',
                `http://localhost:${port}`
              );

              const headers: Record<string, string> = {};
              if (req.headers) {
                for (const [key, value] of Object.entries(req.headers)) {
                  if (value !== undefined) {
                    headers[key] = Array.isArray(value)
                      ? value.join(', ')
                      : String(value);
                  }
                }
              }

              const webRequest = new Request(url.toString(), {
                method: req.method || 'POST',
                headers,
                body: body ? JSON.stringify(body) : undefined,
              });

              const webResponse = await handler(webRequest);

              // Mirror the Web Response back to the Node ServerResponse
              res.statusCode = webResponse.status;
              webResponse.headers.forEach((value: string, key: string) => {
                res.setHeader(key, value);
              });
              res.end(await webResponse.text());
            } catch (err) {
              console.error('[chat-api] Error:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            }
          });
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const srcAssets = path.resolve(import.meta.dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
