/**
 * SAMPLE DATA for joining a cleanup with your class (Figma flow F3 · School group).
 * Names, school, numbers and the class code are copied from Figma. Nothing here is real.
 * Note: Figma's F3 student is Layla at Al Waha International School, while the demo
 * profile elsewhere is Sara at Al Barsha School. Change STUDENT and CLASS here to switch.
 */

import { type ThemeColor } from '@/constants/theme';

export const STUDENT = { firstName: 'Layla', initials: 'LA' };

export const CLASS = {
  name: 'Grade 9B',
  short: '9B',
  school: 'Al Waha International School',
  schoolShort: 'Al Waha',
  /** Any 6 characters find the class in the demo; this is the code Figma shows. */
  code: 'K7BQ2M',
  size: 24,
  joined: 21,
  inviteLink: 'cleanscape.ae/c/layla-9b',
};

export const TEACHER = {
  name: 'Ms. Hessa Al Mansoori',
  short: 'Ms. Hessa',
  initials: 'HM',
  tone: 'avatarBlue' as ThemeColor,
};

export const GUARDIAN = { name: 'Mum', phone: '+971 50 ••• 6631' };

export const CLASS_EVENT = {
  title: 'Kite Beach clean-up',
  passTitle: 'Kite Beach cleanup',
  when: 'Sat 5 Dec · 7:00–10:00 AM',
  day: 'Sat, 5 Dec',
  daysToGo: 34,
};

export const SCHOOL_BUS = {
  leaves: '6:00 AM',
  arrives: '6:40 AM',
  beAt: 'Be at the gate by 5:50. The bus waits until 6:05 at the latest.',
  riders: 14,
};

export type Classmate = { initials: string; name: string; tone: ThemeColor };

/** Stacked avatars on the class cards, in Figma order. */
export const CLASSMATES: readonly Classmate[] = [
  { initials: 'RA', name: 'Rayan A.', tone: 'avatarCoral' },
  { initials: 'MK', name: 'Maya K.', tone: 'avatarBlue' },
  { initials: 'JS', name: 'Jad S.', tone: 'avatarPlum' },
  { initials: 'NA', name: 'Noor A.', tone: 'avatarGreen' },
  { initials: 'FZ', name: 'Fatima Z.', tone: 'secondary' },
  { initials: 'OB', name: 'Omar B.', tone: 'textAccent' },
];

export const GROUP_LEAD = { initials: 'RA', name: 'Rayan A.', tone: 'avatarCoral' as ThemeColor };

export type ClassPerson = {
  initials: string;
  name: string;
  tone: ThemeColor;
  note: string;
  chip?: { icon: 'bus' | 'clock'; label: string; tone: ThemeColor };
};

/** F3·7: who is still on the way, as in Figma. */
export const ON_THE_WAY: readonly ClassPerson[] = [
  {
    initials: 'MK',
    name: 'Maya K.',
    tone: 'avatarBlue' as ThemeColor,
    note: 'On bus 2 · arriving in 4 min',
    chip: { icon: 'bus', label: '4 min', tone: 'fill' },
  },
  {
    initials: 'JS',
    name: 'Jad S.',
    tone: 'avatarPlum' as ThemeColor,
    note: 'Running late · told Ms. Hessa',
    chip: { icon: 'clock', label: 'Late', tone: 'secondarySubtle' },
  },
  { initials: 'NA', name: 'Noor A.', tone: 'avatarGreen' as ThemeColor, note: 'Not checked in yet' },
];

/** F3·7 "Here" tab. Figma only draws "On the way", so this list is a SAMPLE stand-in. */
export const HERE: readonly ClassPerson[] = [
  { initials: 'HM', name: 'Ms. Hessa', tone: 'avatarBlue' as ThemeColor, note: 'Teacher · checked in 6:30 AM' },
  { initials: 'RA', name: 'Rayan A.', tone: 'avatarCoral' as ThemeColor, note: 'Group lead · at the blue flag' },
  { initials: 'FZ', name: 'Fatima Z.', tone: 'secondary' as ThemeColor, note: 'Checked in 6:41 AM' },
];

/** F3·9: friends from outside the class already in your crew. */
export const CREW_FRIENDS: readonly Classmate[] = [
  { initials: 'MY', name: 'Maya', tone: 'avatarCoral' },
  { initials: 'ZD', name: 'Zaid', tone: 'avatarBlue' },
];

/** F3·8c Class impact. */
export const IMPACT = {
  rank: '#2 of 12 classes at Al Waha',
  kg: 186,
  vsLast: '38 kg vs last time',
  people: 23,
  bottles: '~9,000',
  goal: 200,
  materials: [
    {
      key: 'plastic',
      label: 'Plastic',
      kg: 100,
      share: 54,
      color: '#2A8FA8',
      text: 'brand' as ThemeColor,
      rings: [0.42, 0.57, 0.71, 0.86, 1],
    },
    {
      key: 'paper',
      label: 'Paper',
      kg: 33,
      share: 18,
      color: '#FFB020',
      text: 'textPaper' as ThemeColor,
      rings: [0.52, 0.76, 1],
    },
    { key: 'metal', label: 'Metal', kg: 22, share: 12, color: '#FF7A70', text: 'textAccent' as ThemeColor, rings: [0.64, 1] },
    { key: 'glass', label: 'Glass', kg: 15, share: 8, color: '#4CC38A', text: 'statusSuccess' as ThemeColor, rings: [0.64, 1] },
    { key: 'other', label: 'Other', kg: 15, share: 8, color: '#9AABB2', text: 'textWeak' as ThemeColor, rings: [0.64, 1] },
  ],
  sinceLast: [
    { label: 'Weight removed', detail: '186 kg · +38 kg', points: [92, 120, 148, 186] },
    { label: 'Volunteers', detail: '23 · +4 people', points: [14, 17, 19, 23] },
    { label: 'Bags filled', detail: '62 · +11 bags', points: [38, 44, 51, 62] },
  ],
  smileys: { earned: 120, note: 'You picked up 9 kg and filled 3 bags', progress: 160, nextTier: 200, tierName: 'Trusted' },
  ranking: [
    { rank: 1, name: 'Grade 10A', kg: 214 },
    { rank: 2, name: 'Grade 9B · your class', kg: 186, mine: true },
    { rank: 3, name: 'Grade 8C', kg: 151 },
  ],
};
