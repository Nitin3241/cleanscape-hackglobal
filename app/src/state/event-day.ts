import { useSyncExternalStore } from 'react';

/**
 * Event-day progress for the demo: whether the volunteer has been checked in. Once they have,
 * the tab bar's Scan button logs bags (F5) instead of showing the check-in pass (F4).
 * Kept in memory only; a real build would get this from the check-in service.
 */
let checkedIn = false;
const listeners = new Set<() => void>();

export function setCheckedIn(value: boolean) {
  checkedIn = value;
  listeners.forEach((listener) => listener());
}

export function useCheckedIn() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => checkedIn,
    () => false,
  );
}
