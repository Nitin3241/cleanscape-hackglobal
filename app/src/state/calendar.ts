import { useEffect, useState } from 'react';

/**
 * Add to calendar (Figma row "Add to calendar", 13 Nov: CAL1 → CAL6). The Home "next clean-up" button shows
 * where the clean-up stands in the person's calendar.
 * SAMPLE: CAL2 (iOS new event) and CAL4 (iOS subscribe alert) are system screens, so the demo skips straight
 * to the result and nothing is written to the phone's calendar.
 */
export type CalendarApp = 'Apple' | 'Google' | 'Outlook';
export type CalendarStatus = 'none' | 'added' | 'syncing' | 'synced' | 'site-shared';

type CalendarState = {
  status: CalendarStatus;
  app: CalendarApp | null;
  /** The snackbar above the tab bar (CAL3, CAL5), or null. */
  toast: string | null;
};

// Figma CAL4s → CAL5: auto 1.2 s.
const SYNCING_MS = 1200;
export const CALENDAR_TOAST_MS = 5000;

let state: CalendarState = { status: 'none', app: null, toast: null };
const listeners = new Set<(next: CalendarState) => void>();
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function set(next: Partial<CalendarState>) {
  state = { ...state, ...next };
  listeners.forEach((listen) => listen(state));
}

function toast(text: string) {
  if (toastTimer) clearTimeout(toastTimer);
  set({ toast: text });
  toastTimer = setTimeout(() => set({ toast: null }), CALENDAR_TOAST_MS);
}

/** CAL2 → CAL3: just this clean-up, in one app. */
export function addOnce(app: CalendarApp) {
  set({ status: 'added', app });
  toast(`Added to ${app === 'Outlook' ? 'Outlook' : `${app} Calendar`}`);
}

/** CAL4 → CAL4s → CAL5: subscribe, so every clean-up and change syncs. */
export function subscribe(app: CalendarApp) {
  set({ status: 'syncing', app });
  setTimeout(() => {
    set({ status: 'synced' });
    toast('Clean-ups now sync');
  }, SYNCING_MS);
}

/** CAL6 (Demo branches): the exact site was shared, so a one-off calendar entry is out of date. */
export function shareSite() {
  set({ status: 'site-shared', app: state.app ?? 'Apple' });
}

/** CAL6 "Update calendar": the entry now has the exact site. */
export function updateSite() {
  set({ status: 'added' });
  toast('Calendar updated with the exact site');
}

export function hideCalendarToast() {
  if (toastTimer) clearTimeout(toastTimer);
  set({ toast: null });
}

export function useCalendar() {
  const [value, setValue] = useState(state);
  useEffect(() => {
    listeners.add(setValue);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
}
