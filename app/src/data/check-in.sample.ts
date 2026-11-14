/**
 * SAMPLE DATA for QR check-in (Figma flow F4 · QR check-in, hours & certificate).
 * Names, crews and times are copied from Figma; nothing here is real.
 * Note: Figma's F4 volunteer is "Sara Ahmed, Grade 9B · Crew Green", a different person from
 * the demo profile (Sara Al Mansoori). Followed Figma.
 */

import { type ThemeColor } from '@/constants/theme';

export const CHECK_IN = {
  volunteer: { name: 'Sara Ahmed', detail: 'Grade 9B · Crew Green' },
  event: 'Kite Beach clean-up · Sat 5 Dec',
  place: 'Kite Beach · Sat 5 Dec',
  rosterTitle: 'Grade 9B',
  checkedIn: 18,
  total: 24,
  crewHead: 'Ms. Huda',
  time: '7:04 AM',
  crew: { letter: 'B', name: 'Crew Green · Zone B', note: 'Near lifeguard tower 3 · 6 people' },
};

export const BEFORE_YOU_START = [
  { icon: 'hand' as const, tone: 'fill' as ThemeColor, title: 'Gloves on, always', note: 'Grab a pair at the tent' },
  { icon: 'alert' as const, tone: 'accentSubtle' as ThemeColor, title: "See glass or sharp? Don't touch", note: 'Tell your leader or tap Report' },
  { icon: 'droplet' as const, tone: 'fill' as ThemeColor, title: 'Water every 20 minutes', note: 'Shade breaks at 8:30 and 9:30' },
];

export type RosterStatus = 'in' | 'checkIn' | 'noConsent' | 'absent';

export type RosterPerson = {
  initials: string;
  name: string;
  crew: string;
  tone: ThemeColor;
  status: RosterStatus;
  time?: string;
};

export const ROSTER: readonly RosterPerson[] = [
  { initials: 'SA', name: 'Sara Ahmed', crew: 'Crew Green', tone: 'avatarBlue', status: 'in', time: '7:04' },
  { initials: 'OK', name: 'Omar Khan', crew: 'Crew Blue', tone: 'avatarCoral', status: 'in', time: '7:03' },
  { initials: 'LH', name: 'Layla Hassan', crew: 'Crew Green', tone: 'secondary', status: 'checkIn' },
  { initials: 'YA', name: 'Yousef Ali', crew: 'Crew Blue', tone: 'avatarTeal', status: 'noConsent' },
  { initials: 'MD', name: 'Mira Das', crew: 'Crew Green', tone: 'statusSuccess', status: 'checkIn' },
  { initials: 'ZN', name: 'Zaid Noor', crew: 'Crew Blue', tone: 'strokeStrong', status: 'absent' },
];

/** What each demo scan finds, in the order Figma's prototype steps through them (F4·2a → 2b → 2c). */
export const SCAN_ISSUES = [
  {
    kind: 'notOnRoster' as const,
    title: 'Not on this roster',
    body: 'Omar Khan is booked for Mushrif Park, Sun 6 Dec.',
    person: { initials: 'OK', name: 'Omar Khan', detail: 'Grade 9A', tone: 'avatarCoral' as ThemeColor },
    primary: 'Scan next',
    secondary: 'Add guest',
  },
  {
    kind: 'alreadyIn' as const,
    title: 'Already checked in',
    body: 'Sara checked in at 7:04 AM. We won’t count her twice.',
    person: { initials: 'SA', name: 'Sara Ahmed', detail: 'Crew Green', tone: 'avatarSea' as ThemeColor },
    primary: 'Scan next',
  },
  {
    kind: 'noApproval' as const,
    title: 'Parent approval missing',
    body: 'Yousef can’t join until a parent approves. It takes one tap.',
    person: { initials: 'YA', name: 'Yousef Ali', detail: 'Crew Blue', tone: 'avatarSky' as ThemeColor },
    primary: 'Send link',
    secondary: 'Call parent',
  },
];

export type ScanIssue = (typeof SCAN_ISSUES)[number];
