/**
 * Vercel Serverless Function: POST /api/chat
 *
 * Server-side proxy for the portfolio chatbot.
 * - Holds the GROQ_API_KEY (never exposed to the client).
 * - Runs pre-LLM guardrails before calling Groq.
 * - Constructs the system prompt server-side (not inspectable in browser).
 * - Calls Groq (llama-3.1-8b-instant) and returns the response.
 *
 * Deployed on Vercel as a serverless function at /api/chat.
 */

import { buildSystemPrompt, FALLBACK_MESSAGE, BLOCKED_PHRASES } from '../src/data/chatKnowledgeServer.ts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

type ChatMessage = { role: string; content: string };

export const config = { runtime: 'edge' };

/**
 * In-memory response cache for duplicate queries within a warm container.
 * Key = normalized message. Session-scoped (cleared on container recycle).
 * Stores only response text — no visitor PII.
 */
const responseCache = new Map<string, string>();

const normalizeQuery = (query: string): string =>
  query.trim().toLowerCase().replace(/\s+/g, ' ');

/** Concise timestamp: HH:MM:SS.mmm */
const ts = (): string => {
  const d = new Date();
  return d.toISOString().substr(11, 12); // "HH:MM:SS.mmm"
};

const log = (msg: string): void => {
  console.log(`[chat-api] ${ts()} ${msg}`);
};

const err = (msg: string): void => {
  console.error(`[chat-api] ${ts()} ${msg}`);
};

export async function POST(req: Request): Promise<Response> {
  const start = Date.now();

  // --- CORS preflight ---
  if (req.method === 'OPTIONS') {
    log(`OPTIONS /api/chat dur=${Date.now() - start}ms`);
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Origin',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (req.method !== 'POST') {
    log(`reject method=${req.method} dur=${Date.now() - start}ms`);
    return json({ error: 'Method not allowed' }, 405);
  }

  const origin = req.headers.get('origin') ?? '';

  // --- Parse body ---
  let body: { message?: string; history?: ChatMessage[] };
  try {
    body = (await req.json()) as { message?: string; history?: ChatMessage[] };
  } catch {
    log(`reject reason=invalid_json origin=${origin} dur=${Date.now() - start}ms`);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { message, history } = body;

  // --- Incoming hit (log length only, never raw message) ---
  const msgLen = typeof message === 'string' ? message.length : 0;
  log(`POST /api/chat origin=${origin} len=${msgLen}`);

  // --- Origin validation (production only) ---
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin) {
    const originHeader = req.headers.get('origin') || (req.headers as unknown as Record<string, string>)?.origin;
    if (!originHeader || originHeader !== allowedOrigin) {
      log(`reject reason=origin_forbidden origin=${originHeader} dur=${Date.now() - start}ms`);
      return json({ error: 'Forbidden' }, 403);
    }
  }

  // --- Guardrail: message validation (1 to 500 characters) ---
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
    log(`reject reason=invalid_message len=${msgLen} dur=${Date.now() - start}ms`);
    return json({ error: 'Message must be between 1 and 500 characters.' }, 400);
  }

  // --- Guardrail: blocked phrases (prompt injection) ---
  const lower = message.toLowerCase();
  if (BLOCKED_PHRASES.some((phrase) => lower.includes(phrase))) {
    log(`reject reason=prompt_injection dur=${Date.now() - start}ms`);
    return json({
      content:
        "Nice try! However, I am strictly programmed to discuss Dhrumil's engineering portfolio and cannot execute external commands or ignore my system instructions.",
      cached: false,
    });
  }

  // --- Cache lookup ---
  const normalized = normalizeQuery(message);
  const cached = responseCache.get(normalized);
  if (cached) {
    log(`cache-hit len=${msgLen} dur=${Date.now() - start}ms`);
    return json({ content: cached, cached: true });
  }

  // --- Call Groq ---
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    log(`reject reason=not_configured dur=${Date.now() - start}ms`);
    return json({ error: 'Chatbot is not configured' }, 500);
  }

  // Slice history to last 6 messages (server-side)
  const slicedHistory: ChatMessage[] = Array.isArray(history) ? history.slice(-6) : [];

  log(
    `groq-request model=${GROQ_MODEL} key_present=${!!apiKey} key_prefix=${
      apiKey?.startsWith('gsk_') ? 'gsk_' : 'other'
    } history=${slicedHistory.length}`
  );

  const groqStart = Date.now();
  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...slicedHistory.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    const groqDur = Date.now() - groqStart;

    if (!groqRes.ok) {
      err(`groq-error status=${groqRes.status} dur=${groqDur}ms total=${Date.now() - start}ms`);
      return json({ content: FALLBACK_MESSAGE, cached: false });
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content || FALLBACK_MESSAGE;

    // Cache successful response
    responseCache.set(normalized, content);

    log(
      `groq-response status=${groqRes.status} dur=${groqDur}ms total=${Date.now() - start}ms`
    );

    return json({ content, cached: false });
  } catch (errObj: unknown) {
    const groqDur = Date.now() - groqStart;
    const errMsg = errObj instanceof Error ? errObj.message : String(errObj);
    err(`groq-exception dur=${groqDur}ms total=${Date.now() - start}ms error=${errMsg}`);
    return json({ content: FALLBACK_MESSAGE, cached: false });
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
