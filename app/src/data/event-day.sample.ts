/**
 * SAMPLE: Earthy on event day (Figma F11·1–11), copied from the frames. Kite Beach, Sat 5 Dec.
 * A real build would get these from the event, weather, crew and check-in services.
 */

import { type ThemeColor } from '@/constants/theme';

export type DayPhase = 'before' | 'arrival' | 'during' | 'after';

export const DAY_EVENT = { title: 'Kite Beach clean-up', date: 'Sat 5 Dec' };

/** A crew member's initials on a coloured disc (F11·4, F11·5, F11·11). */
export type CrewFace = { initials: string; tone: ThemeColor };

const HA: CrewFace = { initials: 'HA', tone: 'avatarRed' };
const OM: CrewFace = { initials: 'OM', tone: 'statusSuccess' };
const LI: CrewFace = { initials: 'LI', tone: 'avatarAmber' };
const KH: CrewFace = { initials: 'KH', tone: 'brand' };
const SA: CrewFace = { initials: 'SA', tone: 'avatarAmber' };

export const PACKED = {
  title: 'Pack for a hot morning',
  stats: [
    ['6:41 AM', 'Sunrise'],
    ['34°C', 'At 8 AM'],
    ['Light', 'Windy'],
  ] as const,
  items: [
    { label: 'Water, 1.5 L', packed: true },
    { label: 'Hat and SPF 50', packed: true },
    { label: 'Closed shoes', packed: false },
    { label: 'Light long sleeves', packed: false },
    { label: 'Gloves and bags', packed: true, note: 'Provided' },
  ] as { label: string; packed: boolean; note?: string }[],
};

export const BUDDY = {
  initials: 'HA',
  name: 'Hana, 16',
  meta: '5 clean-ups · Al Barsha · English and Arabic',
  says: '“Hi! Bring a cap, it gets bright. See you at 6:50 by the blue flag.”',
  rows: [
    { icon: 'pin' as const, title: 'Blue flag, lifeguard tower 3', note: 'Where you’ll meet' },
    { icon: 'bag' as const, title: 'She’ll show you how sorting works', note: 'Plastic, cans and mixed' },
  ],
};

export const BRIEFING = {
  length: 58,
  /** Waveform bar heights in px (Figma F11·3); the first five are "played". */
  bars: [8, 14, 20, 12, 24, 16, 10, 18, 22, 12, 8, 16, 20, 10, 14, 8],
  rows: [
    { icon: 'pin' as const, title: 'Meet', note: 'Blue flag, lifeguard tower 3' },
    { icon: 'car' as const, title: 'Park', note: 'Car park B, free till 10 AM' },
    { icon: 'user' as const, title: 'Your lead', note: 'Khalid, green cap' },
    { icon: 'info' as const, title: 'Toilets', note: 'Next to the café' },
    { icon: 'moon' as const, title: 'Prayer room', note: 'Umm Suqeim beach mosque' },
  ],
};

export const CREW = {
  distance: '120 m north · about 2 min walk',
  people: [HA, OM, LI],
  names: 'Hana, Omar, Lina and 3 more',
  checkedIn: 'Checked in 2 min ago',
  leadPhone: 'tel:+971500000000',
};

export const ROLE = {
  title: 'You’re the sorter today',
  team: 'Team Shoreline · 6 people · zone B',
  steps: [
    ['Keep three bags open', 'Plastic, cans and mixed'],
    ['Check what others bring back', 'Move anything in the wrong bag'],
    ['Scan anything you’re unsure about', 'Earthy tells you which bag'],
  ] as const,
  team6: [KH, HA, OM, SA, { initials: 'LI', tone: 'avatarSea' }, { initials: 'NO', tone: 'textAccent' }] as CrewFace[],
  lead: 'Khalid leads',
};

/** Zone circles on the F11·6 map: top-left of the 52 px circle and of its chip, in the 328 × 236 map. */
export const ZONES = [
  { id: 'A', label: 'Done', tone: 'statusSuccess', circle: [152, 10], chip: [211, 24] },
  { id: 'B', label: 'Busy', tone: 'avatarAmber', circle: [116, 64], chip: [175, 78] },
  { id: 'C', label: 'Needs help', tone: 'avatarRed', circle: [78, 118], chip: [137, 132], help: true },
  { id: 'D', label: 'OK', tone: 'brand', circle: [42, 172], chip: [101, 186] },
] as const;

export const HELP = {
  lead: 'Khalid, your lead, is 80 m east near zone B.',
  options: [
    { icon: 'locate' as const, title: 'Share my spot', note: 'Khalid sees where you are', does: 'share' as const },
    { icon: 'phone' as const, title: 'Call the organiser', note: 'Usually answers in a minute', does: 'call' as const },
    { icon: 'users' as const, title: 'Find my team', note: 'Team Shoreline · zone B', does: 'team' as const },
  ],
  emergency: { title: 'Call 999', note: 'For a medical emergency or danger' },
  note: 'If you feel dizzy, stop, move into shade and drink water. Earthy can alert Khalid for you.',
  organiserPhone: 'tel:+971400000000',
};

export const BREAK = {
  seconds: 300,
  note: 'It’s 35°C. Your whole team breaks together.',
  places: [
    { icon: 'droplet' as const, title: 'Water truck', note: 'North gate · 60 m', time: '1 min' },
    { icon: 'umbrella' as const, title: 'Shade', note: 'Lifeguard tower 3 · 40 m', time: '1 min' },
  ],
};

export const RECAP = {
  stats: [
    ['2 h', 'Volunteered'],
    ['4', 'Bags'],
    ['63', 'Items'],
  ] as const,
  highlights: ['Top item: bottle caps (21)', '1 more bag than last time', 'Team Shoreline came 2nd'],
  certificate: { icon: 'award' as const, title: 'Certificate ready', note: '2 hours · Kite Beach clean-up' },
  school: { icon: 'school' as const, title: 'Hours sent to your school', note: 'Grade 9B · Al Barsha School' },
};

export const FEEDBACK = {
  moods: [
    { label: 'Meh', icon: 'frown' as const },
    { label: 'OK', icon: 'meh' as const },
    { label: 'Good', icon: 'smile' as const },
    { label: 'Loved it', icon: 'laugh' as const },
  ],
  comment: 'Zone C needed more bags',
};

export const STREAK = { title: '3 clean-ups in a row', note: 'Join one more this month to keep it' };

export const NEXT = [
  { day: 'SAT', date: '12', place: 'Al Sufouh beach', people: [HA, OM], crew: '2 from your crew' },
  { day: 'FRI', date: '18', place: 'Al Qudra Lakes', people: [LI], crew: '1 from your crew' },
  { day: 'SAT', date: '26', place: 'Mushrif Park', people: [HA, KH, SA], crew: '3 from your crew' },
];

/** Each step's phase and the date line under the header title. */
export const DAY_STEPS: readonly { phase: DayPhase; when: string }[] = [
  { phase: 'before', when: 'Tomorrow · Sat 5 Dec · 7 AM' },
  { phase: 'before', when: 'Tomorrow · Sat 5 Dec · 7 AM' },
  { phase: 'before', when: 'Today · Sat 5 Dec · 6:00 AM' },
  { phase: 'arrival', when: 'Today · Sat 5 Dec · 6:52 AM' },
  { phase: 'arrival', when: 'Today · Sat 5 Dec · 7:00 AM' },
  { phase: 'during', when: 'Today · Sat 5 Dec · 7:40 AM' },
  { phase: 'during', when: 'Today · Sat 5 Dec · 7:55 AM' },
  { phase: 'during', when: 'Today · Sat 5 Dec · 8:10 AM' },
  { phase: 'after', when: 'Today · Sat 5 Dec · 9:05 AM' },
  { phase: 'after', when: 'Today · Sat 5 Dec · 9:10 AM' },
  { phase: 'after', when: 'Sun 6 Dec' },
];
