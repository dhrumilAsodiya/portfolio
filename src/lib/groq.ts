import { CHAT_SYSTEM_PROMPT, FALLBACK_MESSAGE } from '@/src/data/chatKnowledge';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

/**
 * In-memory cache for repeated queries. Key = normalized user message.
 * Persists only for the lifetime of the page session (cleared on refresh).
 */
const responseCache = new Map<string, string>();

const normalizeQuery = (query: string): string =>
  query.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Checks if a message is likely off-topic / not about Dhrumil or his portfolio.
 * Simple heuristic: very short greetings are allowed; obvious off-topic keywords trigger fallback.
 */
const isOffTopic = (message: string): boolean => {
  const lower = message.toLowerCase();
  const offTopicKeywords = [
    'politic', 'president', 'election', 'war', 'celebrity', 'movie', 'sports',
    'weather', 'recipe', 'crypto price', 'stock price', 'bitcoin', 'ethereum',
    'who is', 'tell me about', 'how to', 'write code for', 'build me a',
  ];
  return offTopicKeywords.some((kw) => lower.includes(kw));
};

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  cached: boolean;
}

/**
 * Send a message to GROQ and get a response.
 * Uses in-memory cache for repeated queries to save API calls.
 * Falls back to a canned message for off-topic queries.
 */
export async function chatWithGroq(
  message: string,
  sessionHistory: GroqMessage[] = [],
): Promise<ChatResponse> {
  const normalized = normalizeQuery(message);
  const cached = responseCache.get(normalized);

  if (cached) {
    return { content: cached, cached: true };
  }

  // Off-topic guard: skip API call entirely
  if (isOffTopic(message)) {
    responseCache.set(normalized, FALLBACK_MESSAGE);
    return { content: FALLBACK_MESSAGE, cached: false };
  }

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    const errorMsg = 'Chatbot is not configured. Please email me at dhrumilasodiya@gmail.com.';
    responseCache.set(normalized, errorMsg);
    return { content: errorMsg, cached: false };
  }

  const messages: GroqMessage[] = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
    ...sessionHistory.slice(-10), // keep last 10 turns for context
    { role: 'user', content: message },
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errMsg = 'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';
      responseCache.set(normalized, errMsg);
      return { content: errMsg, cached: false };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || FALLBACK_MESSAGE;

    // Cache the successful response for repeat queries
    responseCache.set(normalized, content);

    return { content, cached: false };
  } catch {
    const errMsg = 'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';
    responseCache.set(normalized, errMsg);
    return { content: errMsg, cached: false };
  }
}

/**
 * Clear the in-memory cache (useful for testing or session reset).
 */
export function clearChatCache(): void {
  responseCache.clear();
}
