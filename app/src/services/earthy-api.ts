/**
 * Earthy's live answers. The server is the FastAPI app in /server, hosted on Vultr; it adds
 * CleanScape's context and calls Vultr Serverless Inference.
 *
 * Set EXPO_PUBLIC_EARTHY_API_URL (see .env.example) to the server's address. With no address the app
 * keeps its scripted demo answers, so it still runs with no server at all.
 */
export const EARTHY_API_URL = (process.env.EXPO_PUBLIC_EARTHY_API_URL ?? '').replace(/\/+$/, '');

export const earthyIsLive = EARTHY_API_URL.length > 0;

export type EarthyMessage = { role: 'user' | 'assistant'; content: string };

const TIMEOUT_MS = 20000;

/** Sends the conversation so far and returns Earthy's reply. Throws if the server can't be reached. */
export async function askEarthy(messages: readonly EarthyMessage[]): Promise<string> {
  if (!earthyIsLive) throw new Error('Earthy server address is not set');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${EARTHY_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Earthy server answered ${response.status}`);
    const data: unknown = await response.json();
    const reply = typeof data === 'object' && data !== null && 'reply' in data ? (data as { reply: unknown }).reply : null;
    if (typeof reply !== 'string' || reply.trim().length === 0) throw new Error('Earthy sent an empty answer');
    return reply.trim();
  } finally {
    clearTimeout(timer);
  }
}
