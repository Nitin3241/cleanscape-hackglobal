import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * Which Earthy tips were already seen (Figma, 13 Nov: shows once per screen, tipSeen flag).
 * Saved on the phone, so a tip never comes back after Action, "Not now" or a tap on the scrim.
 * The demo long-press on the Home greeting (replay onboarding) clears them too.
 */
const STORAGE_KEY = 'earthy-tips-seen';
const seen = new Set<string>();
let loading: Promise<void> | null = null;

function load() {
  loading ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((value) => {
      for (const key of JSON.parse(value ?? '[]') as string[]) seen.add(key);
    })
    .catch(() => {
      // Without storage the tips simply show once per app session.
    });
  return loading;
}

export type InsightKey = 'home' | 'events' | 'getting-there' | 'class' | 'class-impact' | 'smileys' | 'organiser';

export function useInsight(key: InsightKey) {
  // Closed until storage says whether this tip was seen, so it never flashes up and away.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    load().then(() => {
      if (active) setOpen(!seen.has(key));
    });
    return () => {
      active = false;
    };
  }, [key]);

  const dismiss = () => {
    seen.add(key);
    setOpen(false);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...seen])).catch(() => {});
  };
  return [open, dismiss] as const;
}

/** Forget every seen tip, so the demo can show them again. */
export async function resetInsights() {
  seen.clear();
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** Forget one seen tip, so a Demo branches row can show it again. */
export async function resetInsight(key: InsightKey) {
  await load();
  seen.delete(key);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch {
    // Without storage the tip simply shows again this session.
  }
}
