import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

const EMIRATE_KEY = 'waste-emirate';
let current = 'Dubai';
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Saves the emirate whose bin rules the "Know your waste" guide shows (Figma F4·5). */
export function setEmirate(name: string) {
  current = name;
  emit();
  AsyncStorage.setItem(EMIRATE_KEY, name).catch(() => {
    // Without storage the choice lasts until the app closes.
  });
}

/** The chosen emirate, Dubai until the person picks another. */
export function useEmirate() {
  const value = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    // Web renders on the server first, before anything is saved; start from Dubai there.
    () => 'Dubai',
  );

  useEffect(() => {
    if (loaded) return;
    loaded = true;
    AsyncStorage.getItem(EMIRATE_KEY)
      .then((saved) => {
        if (saved && saved !== current) {
          current = saved;
          emit();
        }
      })
      .catch(() => {});
  }, []);

  return value;
}
