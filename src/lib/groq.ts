/**
 * Client-side chat API layer.
 *
 * All calls go to /api/chat (Vercel serverless function), which holds the
 * GROQ_API_KEY server-side. No API key, system prompt, or guardrail logic
 * lives in the frontend bundle.
 *
 * Maintains an in-memory response cache for duplicate questions within the
 * current browser session. Cache and history are cleared on refresh/unmount
 * (session-only, no persistence).
 */

export interface ChatResponse {
  content: string;
  cached: boolean;
}

const responseCache = new Map<string, string>();

const normalizeQuery = (query: string): string =>
  query.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Send a message to the /api/chat serverless function.
 * Returns { content, cached }.
 */
export async function chatWithApi(
  message: string,
  sessionHistory: { role: string; content: string }[] = [],
): Promise<ChatResponse> {
  const normalized = normalizeQuery(message);

  // Return cached response for duplicate queries within this session
  const cached = responseCache.get(normalized);
  if (cached) {
    return { content: cached, cached: true };
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: sessionHistory.slice(-6),
      }),
    });

    if (!res.ok) {
      const errMsg =
        'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';
      responseCache.set(normalized, errMsg);
      return { content: errMsg, cached: false };
    }

    const data = (await res.json()) as { content?: string; cached?: boolean };
    const content = data.content || FALLBACK_MESSAGE;

    if (data.cached) {
      return { content, cached: true };
    }

    // Cache successful responses for repeat queries (session-only)
    responseCache.set(normalized, content);

    return { content, cached: false };
  } catch {
    const errMsg =
      'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';
    responseCache.set(normalized, errMsg);
    return { content: errMsg, cached: false };
  }
}

const FALLBACK_MESSAGE =
  'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';

/**
 * Clear the in-memory cache (called on component unmount for session-only privacy).
 */
export function clearChatCache(): void {
  responseCache.clear();
}
