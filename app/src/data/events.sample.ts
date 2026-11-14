/**
 * SAMPLE DATA for finding, registering for and getting to cleanups (Figma flows F1 and F2).
 * Nothing here is real: events, people, rides, routes and messages are placeholders
 * copied from Figma. Replace this file when the events and rides services exist.
 */

import { listBeachXml, listParkXml, parkBenchThumbXml } from '@/constants/events-art';
import { DEMO_PROFILE } from '@/data/demo';
import { ThemeColor } from '@/constants/theme';

export type EventFilter = 'nearMe' | 'beach' | 'kids' | 'parks' | 'mangroves';

export type CleanupEvent = {
  id: string;
  title: string;
  /** Caps dateline on cards, such as "SAT, 5 DEC · 7 AM". */
  when: string;
  /** Dateline in the detail chip. */
  whenLong: string;
  /** Short date and time for footers, such as "Sat 5 Dec · 7–10 AM". */
  slot: string;
  day: string;
  place: string;
  distanceKm: number;
  driveMinutes: number;
  capacity: number;
  spotsLeft: number;
  going: number;
  waiting: number;
  ages: string;
  agesDetail: string;
  artwork: string;
  /** A 52 px thumbnail drawn for small rows, when Figma has one (else the artwork is cropped). */
  thumb?: string;
  tags: readonly EventFilter[];
  /** Why Earthy picked it, shown on the best match. */
  matches?: string;
};

export const SAMPLE_USER = {
  firstName: DEMO_PROFILE.firstName,
  fullName: DEMO_PROFILE.fullName,
  age: 26,
  home: 'Al Karama',
  passCode: 'CS-5D-0412',
  // Shown on the mock Google Wallet sheet (Figma W6). Not a real address.
  googleAccount: 'sara.m@gmail.com',
  smileys: DEMO_PROFILE.smileys,
};

export const SAMPLE_FRIEND = { name: 'Omar', phone: '+971 50 ••• 4821' };
export const SAMPLE_GUARDIAN = { name: 'Mum', phone: '+971 50 ••• 4567' };
/** Who takes a cancelled spot, from the waitlist. */
export const SAMPLE_NEXT_ON_WAITLIST = 'Aisha';

export const CAMPAIGN = {
  title: 'Clean UAE cleanups',
  subtitle: '5 – 15 Dec · 62 cleanups · 1,240 joined so far',
  date: 'Sat, 5 Dec',
};

export const SAMPLE_EVENTS: readonly CleanupEvent[] = [
  {
    id: 'kite-beach',
    title: 'Kite Beach cleanup',
    when: 'SAT, 5 DEC · 7 AM',
    whenLong: 'SAT, 5 DEC · 7:00–10:00 AM',
    slot: 'Sat 5 Dec · 7–10 AM',
    day: 'Sat, 5 Dec',
    place: 'Umm Suqeim',
    distanceKm: 4.2,
    driveMinutes: 12,
    capacity: 150,
    spotsLeft: 22,
    going: 128,
    waiting: 0,
    ages: 'Ages 8+',
    agesDetail: 'with adult',
    artwork: listBeachXml,
    tags: ['nearMe', 'beach', 'kids'],
    matches: 'Matches: this weekend · beach · 4 km',
  },
  {
    id: 'ras-al-khor',
    title: 'Ras Al Khor mangrove sweep',
    when: 'SAT, 5 DEC · 4 PM',
    whenLong: 'SAT, 5 DEC · 4:00–6:00 PM',
    slot: 'Sat 5 Dec · 4–6 PM',
    day: 'Sat, 5 Dec',
    place: 'Ras Al Khor',
    distanceKm: 9,
    driveMinutes: 18,
    capacity: 100,
    spotsLeft: 70,
    going: 30,
    waiting: 0,
    ages: 'Ages 12+',
    agesDetail: 'with adult',
    artwork: listParkXml,
    tags: ['mangroves'],
  },
  {
    id: 'mushrif-park',
    title: 'Mushrif Park litter walk',
    when: 'SAT, 5 DEC · 8 AM',
    whenLong: 'SAT, 5 DEC · 8:00–10:00 AM',
    slot: 'Sat 5 Dec · 8–10 AM',
    day: 'Sat, 5 Dec',
    place: 'Mushrif',
    distanceKm: 14,
    driveMinutes: 22,
    capacity: 120,
    spotsLeft: 40,
    going: 80,
    waiting: 0,
    ages: 'All ages',
    agesDetail: 'family friendly',
    artwork: listParkXml,
    thumb: parkBenchThumbXml,
    tags: ['parks', 'kids'],
  },
  {
    id: 'jumeirah-beach',
    title: 'Jumeirah Beach sweep',
    when: 'SAT, 5 DEC · 4 PM',
    whenLong: 'SAT, 5 DEC · 4:00–6:00 PM',
    slot: 'Sat 5 Dec · 4–6 PM',
    day: 'Sat, 5 Dec',
    place: 'Jumeirah 3',
    distanceKm: 7.8,
    driveMinutes: 15,
    capacity: 128,
    spotsLeft: 0,
    going: 128,
    waiting: 4,
    ages: 'Ages 8+',
    agesDetail: 'with adult',
    artwork: listParkXml,
    tags: ['beach', 'kids'],
  },
];

export const BEST_MATCH_ID = 'kite-beach';

/** When to arrive: 15 minutes before the start, from a slot like "Sat 5 Dec · 7–10 AM" (gives "6:45 AM"). */
export function meetTime(event: CleanupEvent) {
  const match = event.slot.match(/(\d+)–\d+ (AM|PM)$/);
  if (!match) return '';
  const start = Number(match[1]);
  const hour = start === 1 ? 12 : start - 1;
  return `${hour}:45 ${match[2]}`;
}

export function findEvent(id: string | undefined) {
  return SAMPLE_EVENTS.find((event) => event.id === id) ?? SAMPLE_EVENTS[0];
}

export const EVENT_FILTERS: readonly { key: EventFilter; label: string }[] = [
  { key: 'nearMe', label: 'Near me' },
  { key: 'beach', label: 'Beach' },
  { key: 'kids', label: 'Kids OK' },
  { key: 'parks', label: 'Parks' },
  { key: 'mangroves', label: 'Mangroves' },
];

/** Map markers, placed in the Figma frame's 360 px layout. */
export const MAP_MARKERS = [
  { eventId: 'mushrif-park', time: '8 AM', x: 88, y: 255, size: 'small' },
  { eventId: 'kite-beach', time: '7 AM', x: 150, y: 325, size: 'large' },
  { eventId: 'ras-al-khor', time: '4 PM', x: 290, y: 250, size: 'small' },
  { eventId: 'jumeirah-beach', time: 'Full', x: 96, y: 430, size: 'small' },
] as const;

export type Person = { initials: string; name: string; tone: ThemeColor };

export type Ride = {
  id: string;
  driver: Person & { tier: 'Champion' | 'Trusted' | 'New'; smileys: string; womenOnly: boolean };
  pickupTime: string;
  pickup: string;
  pickupNote: string;
  arriveTime: string;
  dropoff: string;
  dropoffNote: string;
  rideNote: string;
  seats: number;
  seatsLeft: number;
  car: string;
  carNote: string;
  stats: { cleanups: number; riders: number; co2: string };
};

export const SAMPLE_RIDES: readonly Ride[] = [
  {
    id: 'aisha',
    driver: { initials: 'AK', name: 'Aisha K.', tone: 'avatarCoral', tier: 'Champion', smileys: '1,420', womenOnly: false },
    pickupTime: '6:05',
    pickup: 'Al Karama Metro, exit 2',
    pickupNote: '4 min walk from you',
    arriveTime: '6:30',
    dropoff: 'Kite Beach · Gate 2',
    dropoffNote: '15 min before the briefing',
    rideNote: '25 min ride · free',
    seats: 3,
    seatsLeft: 2,
    car: 'White Nissan Patrol',
    carNote: 'Gloves and bags in the boot',
    stats: { cleanups: 12, riders: 31, co2: '46 kg' },
  },
  {
    id: 'rohan',
    driver: { initials: 'RM', name: 'Rohan M.', tone: 'avatarTeal', tier: 'Trusted', smileys: '640', womenOnly: false },
    pickupTime: '6:10',
    pickup: 'Karama Park, north gate',
    pickupNote: '7 min walk from you',
    arriveTime: '6:30',
    dropoff: 'Kite Beach · Gate 2',
    dropoffNote: 'Still there before the briefing',
    rideNote: '20 min ride · free',
    seats: 4,
    seatsLeft: 1,
    car: 'Grey Toyota Camry',
    carNote: 'Room for one bag of kit',
    stats: { cleanups: 5, riders: 9, co2: '14 kg' },
  },
];

export const RIDE_FILTERS = [
  { key: 'near', label: 'Near Al Karama' },
  { key: 'women', label: 'Women only' },
  { key: 'champion', label: 'Champion drivers' },
] as const;

export const CARPOOL_DRIVERS: readonly Person[] = [
  { initials: 'AK', name: 'Aisha K.', tone: 'avatarCoral' },
  { initials: 'RM', name: 'Rohan M.', tone: 'avatarBlue' },
  { initials: 'FA', name: 'Fatima A.', tone: 'avatarPlum' },
];

export const TRANSIT = {
  summary: '52 min · leave by 5:50 AM',
  steps: [
    { kind: 'walk', title: 'Walk to ADCB Metro', detail: '7 min · exit 2', time: '5:50' },
    { kind: 'metro', title: 'Red Line to Mall of the Emirates', detail: '6 stops · every 4 min', time: '5:58' },
    { kind: 'bus', title: 'Bus F16 to Umm Suqeim', detail: '9 stops · Platform B', time: '6:21' },
    { kind: 'walk', title: 'Walk to Gate 2', detail: '6 min along the beach path', time: '6:40' },
  ],
  home: 'Bus F16 every 15 min from 10:00 · Metro until midnight',
} as const;

export const SAMPLE_CHAT = [
  { from: 'system', text: 'Aisha accepted · seat added to your pass' },
  { from: 'them', text: "Hi Sara! I'll wait at exit 2 in a white Patrol. Bring a cap, it gets bright by 7.", time: 'Fri 8:12 PM' },
  { from: 'me', text: 'Perfect, see you at 6:05. Thanks for the ride!', time: 'Fri 8:14 PM' },
] as const;

export const QUICK_REPLIES = ["I'm at exit 2", 'Running 5 min late', 'Where are you?'];

export const DRIVER_TIERS = [
  { label: 'New', from: '0' },
  { label: 'Trusted', from: '200+' },
  { label: 'Champion', from: '1,000+' },
];

export const LEAVE_TIMES = ['5:55 AM', '6:05 AM', '6:15 AM'];
