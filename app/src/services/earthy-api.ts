import * as FileSystem from 'expo-file-system/legacy';

/**
 * Earthy's live answers. The server is the FastAPI app in /server, hosted on Vultr; it adds
 * CleanScape's context and calls Vultr Serverless Inference.
 *
 * Set EXPO_PUBLIC_EARTHY_API_URL (see .env.example) to the server's address. With no address the app
 * keeps its scripted demo answers, so it still runs with no server at all.
 */
export const EARTHY_API_URL = (process.env.EXPO_PUBLIC_EARTHY_API_URL ?? '').replace(/\/+$/, '');

export const earthyIsLive = EARTHY_API_URL.length > 0;

/**
 * Sends one file from the phone (a voice recording or a photo) to the server and returns its JSON answer.
 * It uses the phone's own uploader. The usual web-style upload (a form with the file's address in it) left
 * the phone silently on this build, so spoken questions never reached the server.
 */
async function uploadFile(
  path: string,
  uri: string,
  field: string,
  mimeType: string,
  timeoutMs: number,
  parameters?: Record<string, string>,
): Promise<unknown> {
  if (!earthyIsLive) throw new Error('Earthy server address is not set');
  const fileUri = uri.startsWith('file://') || uri.startsWith('content://') ? uri : `file://${uri}`;
  const upload = FileSystem.uploadAsync(`${EARTHY_API_URL}${path}`, fileUri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: field,
    mimeType,
    parameters,
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('The upload took too long')), timeoutMs);
  });
  try {
    const result = await Promise.race([upload, timeout]);
    if (result.status < 200 || result.status >= 300) throw new Error(`Earthy server answered ${result.status}: ${result.body.slice(0, 200)}`);
    return JSON.parse(result.body) as unknown;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type EarthyMessage = { role: 'user' | 'assistant'; content: string };

const TIMEOUT_MS = 20000;

/**
 * Sends the conversation so far and returns Earthy's reply. Throws if the server can't be reached.
 * `spoken` tells the server the reply will be read aloud, so it keeps it short.
 */
export async function askEarthy(messages: readonly EarthyMessage[], spoken = false): Promise<string> {
  if (!earthyIsLive) throw new Error('Earthy server address is not set');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${EARTHY_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, spoken }),
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

export type HeardVoice = { text: string; language: 'en' | 'ar' };

const VOICE_TIMEOUT_MS = 45000;

/**
 * Sends a voice recording to the server, which turns it into text (Whisper on Vultr Cloud Compute).
 * An empty text means nothing was heard. Throws if the server can't be reached.
 */
export async function transcribeVoice(uri: string): Promise<HeardVoice> {
  const data = (await uploadFile('/api/transcribe', uri, 'audio', 'audio/m4a', VOICE_TIMEOUT_MS)) as { text?: unknown; language?: unknown };
  return {
    text: typeof data.text === 'string' ? data.text.trim() : '',
    language: data.language === 'ar' ? 'ar' : 'en',
  };
}

/**
 * Asks the server to read a line aloud in Earthy's own voice (text to speech on Vultr Serverless
 * Inference) and returns the address of the sound to play. Throws if that voice isn't available,
 * so the caller can fall back to the phone's built-in voice.
 */
export async function earthyVoiceUrl(text: string, preparedOnly = false): Promise<string> {
  if (!earthyIsLive) throw new Error('Earthy server address is not set');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VOICE_TIMEOUT_MS);
  try {
    const response = await fetch(`${EARTHY_API_URL}/api/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `preparedOnly`: answer only if the server voiced this exact line ahead of time (a built-in question).
      body: JSON.stringify({ text, prepared_only: preparedOnly }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Earthy server answered ${response.status}`);
    const data = (await response.json()) as { url?: unknown };
    if (typeof data.url !== 'string' || !data.url.startsWith('/')) throw new Error('No voice was returned');
    return `${EARTHY_API_URL}${data.url}`;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Show: sends a photo of an item to the server, where a model that can see says what it is and where it
 * goes. The photo is used for this one answer and is not kept. Throws if the server can't be reached.
 */
export async function lookEarthy(uri: string, question: string): Promise<string> {
  const data = (await uploadFile('/api/look', uri, 'photo', 'image/jpeg', 60000, { question })) as { reply?: unknown };
  if (typeof data.reply !== 'string' || data.reply.trim().length === 0) throw new Error('Earthy sent an empty answer');
  return data.reply.trim();
}

export type SeenItem = {
  /** One or two sentences to show and read aloud. */
  reply: string;
  /** The item in two or three words. Empty if Earthy couldn't tell. */
  item: string;
  bin: 'green' | 'black' | 'drop-off' | 'unknown';
  /** One short tip. Empty if none. */
  tip: string;
};

/**
 * Show, in full: sends a photo of an item and returns what it is, which bin it goes in and a tip, as separate
 * fields for the scan screen. The photo is used for this one answer and is not kept. Throws if the server
 * can't be reached.
 */
export async function scanItem(uri: string): Promise<SeenItem> {
  const data = (await uploadFile('/api/look', uri, 'photo', 'image/jpeg', 60000)) as Partial<Record<keyof SeenItem, unknown>>;
  let reply = clean(data.reply);
  let item = clean(data.item);
  let tip = clean(data.tip);
  let named = clean(data.bin).toLowerCase();
  // Sometimes the model's answer arrives as its raw JSON text. Pull the parts out of it here.
  if (reply.includes('"say"')) {
    const part = (key: string) => clean(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(reply)?.[1]);
    item = item || part('item');
    tip = tip || part('tip');
    named = named && named !== 'unknown' ? named : part('bin').toLowerCase();
    reply = part('say') || reply;
  }
  if (!reply) throw new Error('Earthy sent an empty answer');
  // The bin can come back worded differently ("green bin", "Drop-off point"). If it is missing, the spoken
  // line itself says where the item goes, so read it from there.
  const where = (text: string): SeenItem['bin'] =>
    /drop[\s-]?off/.test(text) ? 'drop-off' : /green/.test(text) ? 'green' : /black/.test(text) ? 'black' : 'unknown';
  let bin = where(named);
  if (bin === 'unknown') bin = where(reply.toLowerCase());
  return { reply, item, bin, tip };
}

/** A text field from the server, without stray quote marks or spaces around it. */
function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, '').trim() : '';
}
