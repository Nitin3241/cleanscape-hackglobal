/**
 * SAMPLE: hosting a clean-up (Figma "Host a clean-up" row, 13 Nov: F10·11 → F10·19), copied from the frames.
 * Nothing here is real. Replace with the hosting service and EEG's review queue when they exist.
 */
import { type ThemeColor } from '@/constants/theme';

export type SpotLevel = 'high' | 'medium' | 'low';

export type HostSpot = {
  id: string;
  rank: number;
  name: string;
  level: SpotLevel;
  where: string;
  reason: string;
  people: number;
  hours: string;
  bags: string;
  /** Where the pin's pill sits on the 360 px radar map (Figma F10·11 "Radar picker", map coordinates). */
  pin: { left: number; top: number };
};

/** The three spots Earthy picked on the litter radar (F10·11, "Host spot card" Spot=1/2/3). */
export const HOST_SPOTS: readonly HostSpot[] = [
  { id: 'kite-beach', rank: 1, name: 'Kite Beach', level: 'high', where: '4 km · Jumeirah 3', reason: 'Wind blew litter here: 3× usual reports.', people: 15, hours: '2 h', bags: '40', pin: { left: 110, top: 236 } },
  { id: 'umm-suqeim-2', rank: 2, name: 'Umm Suqeim 2', level: 'medium', where: '6 km · Umm Suqeim', reason: 'Picnic litter around the barbecue area.', people: 8, hours: '1.5 h', bags: '~20', pin: { left: 216, top: 300 } },
  { id: 'jlt-park', rank: 3, name: 'JLT Park', level: 'low', where: '2 km · JLT', reason: 'Cleaned last week. Needs a short top-up.', people: 4, hours: '1 h', bags: '~8', pin: { left: 263, top: 169 } },
];

export const LEVEL_LABEL: Record<SpotLevel, string> = { high: 'High litter', medium: 'Some litter', low: 'Light litter' };
export const LEVEL_SHORT: Record<SpotLevel, string> = { high: 'High', medium: 'Medium', low: 'Low' };
export const LEVEL_COLORS: Record<SpotLevel, { fill: ThemeColor; text: ThemeColor }> = {
  high: { fill: 'levelHighFill', text: 'levelHighText' },
  medium: { fill: 'levelMediumFill', text: 'levelMediumText' },
  low: { fill: 'levelLowFill', text: 'levelLowText' },
};

/**
 * F10·11w "Why this spot", per spot. Figma draws only Kite Beach (rank 1); the reasons for spots 2 and 3 are
 * SAMPLE copy written to the same pattern, to be replaced by the radar service.
 */
export const WHY_SPOT: Record<string, {
  place: string;
  title: string;
  body: string;
  reasons: readonly { title: string; body: string; icon: 'pin' | 'clock' | 'waves' }[];
}> = {
  'kite-beach': {
    place: 'Kite Beach, north end',
    title: 'Why Earthy ranks this first',
    body: 'It needs the most help right now, and a crew can finish it in about 2 hours.',
    reasons: [
      { title: '14 reports in 3 weeks', body: '11 confirmed by neighbours', icon: 'pin' },
      { title: 'Not cleaned since 21 Oct', body: 'Other two spots were cleaned this month', icon: 'clock' },
      { title: 'Strong wind on Friday', body: 'Litter spreads to the water if left', icon: 'waves' },
    ],
  },
  'umm-suqeim-2': {
    place: 'Umm Suqeim 2, barbecue area',
    title: 'Why Earthy ranks this second',
    body: 'Litter is building up after weekend picnics, but less than at Kite Beach.',
    reasons: [
      { title: '6 reports in 3 weeks', body: '4 confirmed by neighbours', icon: 'pin' },
      { title: 'Cleaned on 2 Nov', body: 'Picnics have added litter since', icon: 'clock' },
      { title: 'Calm weekend ahead', body: 'Litter is unlikely to spread', icon: 'waves' },
    ],
  },
  'jlt-park': {
    place: 'JLT Park, lakeside',
    title: 'Why Earthy ranks this third',
    body: 'It was cleaned last week, so a small crew can top it up in about an hour.',
    reasons: [
      { title: '2 reports this week', body: 'Both confirmed by neighbours', icon: 'pin' },
      { title: 'Cleaned on 6 Nov', body: 'Only a short top-up is needed', icon: 'clock' },
      { title: 'Sheltered from the wind', body: 'Litter stays around the lake', icon: 'waves' },
    ],
  },
};

export const WHY_FAIRNESS = 'Based on 212 active residents here. Areas with few reports show “Not enough data”, never “clean”.';

/** F10·9 Spot it: what Earthy counted in the resident's photo of Kite Beach (positions in the 360 px frame). */
export const SPOT_IT = {
  spotId: 'kite-beach',
  credit: 'From a resident’s report · 7:40 AM',
  area: '~40 m²',
  tags: [
    { label: 'Bottles × 14', dot: 'brand', left: 40, top: 330 },
    { label: 'Cans × 9', dot: 'pinMedium', left: 210, top: 360 },
    { label: 'Bags × 5', dot: 'pinHigh', left: 236, top: 296 },
  ],
  sub: '4 km · Jumeirah 3 · 9 reports',
  // Bar widths from Figma (188 / 79 / the rest of 312 px less two 3 px gaps).
  mix: [
    { label: 'Plastic 60%', tone: 'brand', width: 188 },
    { label: 'Cans 25%', tone: 'heatMedium', width: 79 },
    { label: 'Other 15%', tone: 'mixOther', width: 39 },
  ],
  hazards: 'No hazards seen',
  best: 'Best: Sat 7 AM',
} as const satisfies {
  spotId: string;
  credit: string;
  area: string;
  tags: readonly { label: string; dot: ThemeColor; left: number; top: number }[];
  sub: string;
  mix: readonly { label: string; tone: ThemeColor; width: number }[];
  hazards: string;
  best: string;
};

/** F10·15 Become a host — one time. */
export const HOST_STEPS = [
  { title: 'Verify with UAE Pass', body: 'Confirms who you are. Takes about a minute.', action: 'Verify' },
  {
    title: 'Join a volunteer team',
    body: 'Pick a team registered with Dubai’s Community Development Authority (CDA), or register yours.',
    action: 'Choose',
  },
  { title: 'Agree to the host guide', body: 'Heat, tides, first aid and under-18 consent, in 6 short cards.', action: 'Read' },
] as const;

/** F10·10a Earthy drafting. */
export const HOST_DRAFT_STEPS = [
  'Checked heat and tide for Sat 12 Dec',
  'Sized the crew: 15 people',
  'Packing the kit',
  'Writing the invite',
] as const;

/** F10·10 Your clean-up: the draft Earthy made. */
export const HOST_DRAFT = {
  title: 'Kite Beach clean-up',
  when: 'Sat 12 Dec · 7:00 AM · 2 h',
  whenShort: 'Sat 12 Dec · 7:00 AM',
  place: 'Kite Beach · north car park',
  times: [
    { time: '7:00 AM', note: '29°C · low tide' },
    { time: '8:30 AM', note: '33°C' },
    { time: '4:30 PM', note: '31°C' },
  ],
  crewSize: 15,
  crew: [
    { initials: 'S', tone: 'brand' },
    { initials: 'O', tone: 'avatarMarigold' },
    { initials: 'M', tone: 'avatarLavender' },
  ] as { initials: string; tone: ThemeColor }[],
  roles: 'You lead · Omar on safety · Maya sorts',
  neighbours: '23 neighbours live within 2 km',
  kit: ['40 bags', '15 grabbers', 'Gloves', 'Water'],
  review: 'Emirates Environmental Group (EEG) reviews every clean-up, usually within 2 working days. Then neighbours can join.',
} as const;

/** F10·10e Earthy · your clean-up. */
export const HOST_EARTHY = {
  subtitle: 'Helping with Kite Beach clean-up',
  insight: 'Omar and Lina have joined 3 beach clean-ups with you. Omar co-hosted before. Ask him to co-host?',
  more: [
    { title: 'Write the invite for me', body: 'Ready to share on WhatsApp' },
    { title: 'Who else should I invite?', body: 'Friends who like beach clean-ups' },
    { title: 'What if it’s windy on Saturday?', body: 'A plan B for strong wind' },
  ],
} as const;

/** F10·10c Add a co-host. */
export const CO_HOSTS = [
  { id: 'omar', name: 'Omar H.', initials: 'O', tone: 'avatarMarigold', note: 'Co-hosted with you once · 5 clean-ups' },
  { id: 'lina', name: 'Lina T.', initials: 'L', tone: 'avatarTeal', note: '3 beach clean-ups together' },
  { id: 'maya', name: 'Maya R.', initials: 'M', tone: 'avatarLavender', note: 'Already on your crew · sorts' },
  { id: 'yusuf', name: 'Yusuf A.', initials: 'Y', tone: 'avatarGold', note: '2 clean-ups together' },
] as const satisfies readonly { id: string; name: string; initials: string; tone: ThemeColor; note: string }[];

/** F10·16 Sent to EEG. */
export const HOST_REVIEW = {
  body: 'Emirates Environmental Group checks every clean-up for safety, insurance and beach permits. You’ll hear back by Tue 17 Nov.',
  steps: [
    { title: 'Sent', body: 'Today, 10:56 AM', state: 'done' },
    { title: 'EEG review', body: 'Usually within 2 working days', state: 'current' },
    { title: 'Live', body: 'Neighbours can join and hours count', state: 'todo' },
  ],
} as const;

/** F10·16b EEG asked for changes. */
export const HOST_CHANGES = {
  title: 'EEG asked for one change',
  body: 'Everything else looks good. Fix this and send it back. It usually takes them less than a day to re-check.',
  issueTitle: 'Meeting point',
  issue: 'The north car park gate is closed on Saturdays before 8 AM. Please meet at the public beach entrance instead.',
  from: 'From EEG Volunteer team · Today 4:12 PM',
} as const;

/** F10·17 You're live. */
export const HOST_LIVE = {
  body: 'Neighbours can now join Kite Beach clean-up. EEG covers insurance, and everyone’s hours count.',
} as const;

/** F10·17i / F10·17j Invite neighbours. */
export const HOST_INVITE = {
  body: '12 spots left. Earthy sends it to people who like beach clean-ups first.',
  option: '23 neighbours nearby',
  optionSub: 'Within 2 km of Kite Beach',
  faces: ['A', 'O', 'S', 'M'],
  sent: '23 neighbours got your invite. We’ll tell you as spots fill up.',
  shareMessage: 'Join my Kite Beach clean-up on Sat 12 Dec at 7 AM. Sign up in CleanScape.',
} as const;

/** C1 Clean-up details. */
export const CLEANUP_DETAILS = {
  name: 'Kite Beach clean-up',
  date: 'Sat 12 Dec',
  start: '7:00 AM',
  end: '9:00 AM',
  heat: '29°C at 7 AM. After 10 AM it’s over 33°C, so EEG may ask you to move it.',
  place: 'Kite Beach · north car park',
  placeNote: 'Volunteers see the exact pin 2 days before',
  crewSize: 15,
  crewNote: 'Kite Beach fits up to 25 people',
  smileys: 50,
} as const;

/** F10·18 Check the spot and F10·19 Before / after. */
export const SPOT_CHECK = {
  place: 'Kite Beach · cleaned 14 Nov',
  title: 'Did it stay clean?',
  body: 'One photo from the same place shows if the clean-up lasted. It takes 10 seconds.',
  tips: [
    { title: 'Stand by lifeguard tower 3', body: 'Same place as the first photo', icon: 'pin' },
    { title: 'Faces and plates are blurred', body: 'Before anyone else sees the photo', icon: 'users' },
  ],
  before: 'Before · 14 Nov',
  after: 'After · 28 Nov',
  afterSub: '2 weeks after the clean-up',
  compareTitle: 'Earthy compared the two photos',
  share: 'Kite Beach stayed clean 2 weeks after our clean-up: 2 items now, 46 on 14 Nov. Shared from CleanScape.',
  verdict: 'Stayed clean',
  counts: '2 items now, 46 on 14 Nov',
  earthyNote: 'Counts are a best guess from the photos. Fix them if they look wrong.',
  next: [
    { title: 'Radar updated', body: 'Kite Beach north moves to “Clean for 2 weeks”', icon: 'map' },
    { title: 'Next check in 2 weeks', body: 'Earthy reminds you on 12 Dec', icon: 'clock' },
  ],
} as const;
