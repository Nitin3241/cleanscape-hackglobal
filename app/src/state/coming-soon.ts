import { useEffect, useState } from 'react';

/**
 * "Coming soon" for taps whose screen isn't built yet (docs/NAVIGATION_MAP.md: never a dead tap).
 * Any button with no action calls this, so the person always gets an answer to their tap.
 */
export const COMING_SOON_MS = 2500;

type Listener = (text: string | null) => void;
const listeners = new Set<Listener>();
let timer: ReturnType<typeof setTimeout> | null = null;

export function showComingSoon(text = 'Coming soon') {
  if (timer) clearTimeout(timer);
  listeners.forEach((listen) => listen(text));
  timer = setTimeout(() => {
    timer = null;
    listeners.forEach((listen) => listen(null));
  }, COMING_SOON_MS);
}

/** The text to show right now, or null. Used by the one toast host in the root layout. */
export function useComingSoon() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    listeners.add(setText);
    return () => {
      listeners.delete(setText);
    };
  }, []);

  return text;
}

/** A short notice in the same toast, for a result that has no screen of its own (such as "Request sent"). */
export const showNotice = (text: string) => showComingSoon(text);
