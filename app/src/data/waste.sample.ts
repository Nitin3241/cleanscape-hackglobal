/**
 * SAMPLE DATA for "Know your waste" and Earthy's scan (Figma F4·1–F4·11).
 * Bin rules, places and the pizza-box answer are copied from Figma. Nothing here is live:
 * real rules would come per emirate from the municipality, and places from a map service.
 */

import {
  batteriesXml,
  eWasteXml,
  foodXml,
  glassXml,
  metalXml,
  paperXml,
  plasticXml,
  textilesXml,
} from '@/constants/illustrations';
import { type ThemeColor } from '@/constants/theme';

export type Bin = 'green' | 'black' | 'dropOff' | 'donate';

export const BIN_LABEL: Record<Bin, string> = {
  green: 'Green bin',
  black: 'Black bin',
  dropOff: 'Drop-off',
  donate: 'Donate bin',
};

/** Dot colour for each bin, on the tile's own colour. */
export const BIN_DOT: Record<Bin, ThemeColor> = {
  green: 'statusSuccess',
  black: 'textStrong',
  dropOff: 'secondary',
  donate: 'donateText',
};

export const WASTE_MATERIALS: readonly {
  key: string;
  label: string;
  art: string;
  bin: Bin;
  background: ThemeColor;
}[] = [
  { key: 'plastic', label: 'Plastic', art: plasticXml, bin: 'green', background: 'fill' },
  { key: 'paper', label: 'Paper', art: paperXml, bin: 'green', background: 'secondarySubtle' },
  { key: 'metal', label: 'Metal', art: metalXml, bin: 'green', background: 'accentSubtle' },
  { key: 'glass', label: 'Glass', art: glassXml, bin: 'green', background: 'statusSuccessSubtle' },
  { key: 'food', label: 'Food', art: foodXml, bin: 'black', background: 'foodSubtle' },
  { key: 'eWaste', label: 'E-waste', art: eWasteXml, bin: 'dropOff', background: 'eWasteSubtle' },
  { key: 'batteries', label: 'Batteries', art: batteriesXml, bin: 'dropOff', background: 'statusSuccessSubtle' },
  { key: 'textiles', label: 'Textiles', art: textilesXml, bin: 'donate', background: 'textilesSubtle' },
];

/** F4·2 Plastic — how to sort (Figma 446:10139, 12–13 Nov): steps, the resin-code explorer and the bin lists. */
export const PLASTIC_LESSON = {
  chip: 'Most go in the green bin',
  steps: [
    { key: 'empty', title: 'Empty it', body: 'Nothing left inside' },
    { key: 'rinse', title: 'Rinse it', body: 'Just a quick splash' },
    { key: 'squash', title: 'Squash it', body: 'Flat bottles fit better' },
  ],
  codes: [
    { code: 1, name: 'PET', bin: 'green', uses: 'Water and juice bottles, soft drink bottles', tip: 'Empty it and put the cap back on.' },
    { code: 2, name: 'HDPE', bin: 'green', uses: 'Milk, shampoo and detergent bottles', tip: 'Rinse out any soap or milk first.' },
    { code: 3, name: 'PVC', bin: 'black', uses: 'Pipes, some clear food wrap and blister packs', tip: 'Not recycled from home bins.' },
    { code: 4, name: 'LDPE', bin: 'black', uses: 'Shopping bags, cling film, bread bags', tip: 'Soft plastic jams the sorting machines. Reuse bags when you can.' },
    { code: 5, name: 'PP', bin: 'green', uses: 'Yoghurt and takeaway tubs, bottle caps', tip: 'Rinse off food. Greasy tubs go in the black bin.' },
    { code: 6, name: 'PS', bin: 'black', uses: 'Foam cups, foam boxes, plastic cutlery', tip: 'Foam breaks into tiny bits and can’t be sorted.' },
    { code: 7, name: 'Other', bin: 'black', uses: 'Mixed plastics, some cups and toys', tip: 'Too many plastics mixed together to recycle.' },
  ],
  goesIn: [
    { item: 'Water and juice bottles', code: '#1' },
    { item: 'Milk and shampoo bottles', code: '#2' },
    { item: 'Yoghurt and food tubs, rinsed', code: '#5' },
    { item: 'Bottle caps, left on the bottle', code: '#5' },
  ],
  keepOut: [
    { item: 'Foam cups and boxes', code: '#6' },
    { item: 'Plastic bags and cling film', code: '#4' },
    { item: 'Greasy takeaway boxes', code: '' },
    { item: 'Toys, pipes and mixed plastic', code: '#3, 7' },
  ],
  flipped: { eyebrow: 'CODE 1', title: 'PET plastic', body: 'Used for most water and soda bottles', bin: 'Goes in the green bin' },
} as const;


export const EMIRATES = [
  { name: 'Dubai', rules: 'Green: recyclables · Black: general' },
  { name: 'Abu Dhabi', rules: 'Green: recyclables · general bin' },
  { name: 'Sharjah', rules: 'Recyclables bin · general bin' },
  { name: 'Ajman' },
  { name: 'Ras Al Khaimah' },
  { name: 'Fujairah' },
  { name: 'Umm Al Quwain' },
];

export type PlaceKind = 'vending' | 'oasis' | 'centre';

/**
 * F4·3 place kinds (Figma 447:10048, copy rewrite 12 Nov): filter label, what it takes, and Figma's colours for the
 * pin, callout accent and tags.
 */
export const PLACE_KINDS: Record<
  PlaceKind,
  { label: string; takes: string; icon: 'vending' | 'leaf' | 'home'; color: ThemeColor; dot: string; accent: string; ink: string }
> = {
  vending: { label: 'Machine', takes: 'Bottles and cans', icon: 'vending', color: 'brand', dot: '#1E6280', accent: '#1E6280', ink: '#1E6280' },
  oasis: { label: 'Oasis', takes: 'All recyclables', icon: 'leaf', color: 'statusSuccess', dot: '#2E9E5B', accent: '#2E9E5B', ink: '#1E7A46' },
  centre: { label: 'Centre', takes: 'Bulky items', icon: 'home', color: 'secondary', dot: '#E08E00', accent: '#D98E04', ink: '#D98E04' },
};

/** F4·3 places. `pin` is the 40 px pin's top-left in the Figma frame (360 × 800, 44 px status bar). */
export const PLACES = [
  {
    kind: 'vending' as PlaceKind,
    name: 'Reverse vending machine',
    pinName: 'Reverse vending',
    pinTakes: 'Earn points for bottles',
    distance: '1.2 km',
    hours: 'Open now',
    pinHours: 'Open now',
    tag: { label: 'Earn points · Bottles, cans', background: '#E6F3F8', color: '#1E6280' },
    nearest: true,
    pin: { x: 130, y: 280 },
  },
  {
    kind: 'oasis' as PlaceKind,
    name: 'Smart recycling oasis',
    pinName: 'Recycling oasis',
    pinTakes: 'All recyclables',
    distance: '2.4 km',
    hours: 'Open 24 hours',
    pinHours: 'Open 24/7',
    tag: { label: 'All recyclables', background: '#E3F5EA', color: '#1E7A46' },
    nearest: false,
    pin: { x: 280, y: 390 },
  },
  {
    kind: 'centre' as PlaceKind,
    name: 'Recycling centre',
    pinName: 'Recycling centre',
    pinTakes: 'Bulky items',
    distance: '5.8 km',
    hours: 'Opens 8 AM',
    pinHours: 'Opens 8 AM',
    tag: { label: 'Big items, like crates', background: '#FFF6E0', color: '#E08E00' },
    nearest: false,
    pin: { x: 298, y: 176 },
  },
];

/** F4·3 sheet and search copy. */
export const DROP_OFF = {
  search: 'More ways to recycle plastic',
  title: 'Beyond the green bin',
  subtitle: 'Earn points for bottles, or drop off big items',
};

export const RVM = {
  name: 'Reverse vending machine',
  where: 'Al Barsha supermarket · 1.2 km',
  open: 'Open now · until 11 PM',
  /** Figma RVM accepts (835:12760): Bring and Leave at home tiles. */
  bring: [
    { id: 'bottles', label: 'Plastic bottles' },
    { id: 'cans', label: 'Drink cans' },
  ],
  leave: [
    { id: 'glass', label: 'Glass' },
    { id: 'cartons', label: 'Cartons' },
    { id: 'squashed', label: 'Squashed bottles' },
  ],
  /** Figma RVM step (835:12805): one card at a time; step 2 is flagged and deeper marigold. */
  steps: [
    { title: 'Feed bottles in one by one', body: 'Empty them first, caps can stay on' },
    { title: 'Don’t squash them here', body: 'Unlike the green bin, it needs to read the barcode', flag: 'Different from home' },
    { title: 'Scan your CleanScape QR', body: 'Your points land in Smileys' },
  ] as { title: string; body: string; flag?: string }[],
  /** Pin tops-left in the F4·4 frame (360 × 800, 44 px status bar); the map sits 152 px higher than on F4·3. */
  pins: { vending: { x: 130, y: 128 }, oasis: { x: 242, y: 94 } },
  walk: '15 min · 1.2 km',
  drive: '4 min drive',
};

export const PIZZA = {
  query: 'pizza box',
  answer: 'Split it. The greasy base goes in the black bin. The clean lid goes in the green bin.',
  tip: 'Tip: tear along the fold. No need to wash cardboard.',
  parts: [
    { name: 'Greasy base', bin: 'black' as Bin, note: 'Oil stops it recycling', confidence: 91 },
    { name: 'Clean lid', bin: 'green' as Bin, note: 'Fold it flat', confidence: 95 },
  ],
  followUps: ['Scan it instead', 'What about coffee cups?', 'Find a green bin near me'],
};

export const SORT_REWARD = {
  smileys: 2,
  sortedToday: 3,
  streak: '6 days',
  total: '1,242',
  badge: 'Sorting Pro',
  progress: 7,
  goal: 10,
};

/** F4·9u Scan — Earthy isn't sure, and F4·9c Change this (sheet). */
export const SCAN_UNSURE = {
  earthy: { title: 'I’m not sure about this one', body: 'It’s crushed and stained, so I can’t tell what was in it. I’d rather ask than guess.' },
  candidates: [
    { id: 'pet', title: 'Plastic drink bottle', body: 'Green bin or a bottle machine' },
    { id: 'oil', title: 'Oil or chemical bottle', body: 'Hazardous: crew lead only' },
    { id: 'else', title: 'Something else', body: 'Tell Earthy what it is' },
  ],
  safety: 'If it smells of oil or chemicals, don’t open it. Hand it to your crew lead.',
} as const;

export const SCAN_FIX = {
  earthySaid: 'Earthy said: plastic bottle (PET)',
  options: [
    { id: 'pet', title: 'Plastic drink bottle', body: 'Earthy’s guess' },
    { id: 'other', title: 'Other plastic', body: 'Tubs, trays, wrap' },
    { id: 'glass', title: 'Glass', body: 'Bottles and jars' },
    { id: 'metal', title: 'Metal can', body: 'Drinks and food tins' },
    { id: 'paper', title: 'Paper or card', body: 'Clean and dry' },
    { id: 'else', title: 'Something else', body: 'Type or say it' },
  ],
  note: 'Your fix updates this result and helps Earthy learn Dubai’s rules.',
} as const;

/** F9·S1 Earthy — source (sheet), from the "Source: EEG guide" pill on F4·6. */
export const ANSWER_SOURCE = {
  guide: { title: 'EEG sorting guide · Dubai', body: 'Reviewed by EEG · updated 2 Nov 2026' },
  quote: '“Greasy or food-soiled cardboard goes in general waste. Clean lids and flaps can be recycled.”',
  earthy: { title: 'Earthy only answers from approved text', body: 'For sorting and safety. If the guide doesn’t cover it, Earthy says so.' },
} as const;

/** F9·S2 Ask the organiser and F9·S3 Question sent (sheet), from the ask field on F4·6. */
export const ASK_ORGANISER = {
  asked: 'Can my 6-year-old join?',
  earthy: { title: 'I don’t have an approved answer', body: 'I’d rather not guess on safety. Fatima organises this clean-up for EEG.' },
  organiser: { initials: 'FA', name: 'Fatima Al Ali', role: 'EEG organiser · replies within a day' },
  draft: 'Hi Fatima, can my 6-year-old join the mangrove clean-up on Sat 21 Nov?',
  drafted: 'Earthy drafted this. Edit it before you send.',
  sent: { title: 'Sent to Fatima', body: 'You’ll get a notification when she replies. Her answer is added to the event page for everyone.' },
} as const;

/** F4·7p / F4·9p Scan — plastic bottle. */
export const BOTTLE = {
  name: 'Plastic bottle',
  confidence: 96,
  found: 'Earthy · 2 parts found',
  parts: [
    { name: 'Bottle · 1 PET', note: 'Empty, rinse, squash', bin: 'green' },
    { name: 'Cap', note: 'Screw it back on', bin: 'green' },
  ],
  tip: 'Tip: the number on the base tells you the plastic.',
} as const;

/** F4·2s / F4·2t: the Ask Earthy sheet on the plastic lesson (Figma 818:12775, 818:12802). */
export const PLASTIC_ASK = {
  subtitle: 'Plastic · Dubai rules',
  questions: ['Do bottle caps go in?', 'What about plastic bags?', 'Is a #5 yoghurt cup okay?'],
  answer: 'Yes. Screw the cap back on the empty bottle and put them in together. Loose caps are too small to sort.',
  bin: 'Green bin',
  followUps: ['What about bags?', 'Scan it instead'],
  placeholder: 'Ask about any plastic item',
};

/** F4·2q1–q4: the plastic quiz (Figma 794:12737, 794:12771, 794:12804, 794:12837). `right` is the correct option. */
export const PLASTIC_QUIZ = {
  questions: [
    {
      item: 'tub' as const,
      question: 'A yoghurt tub with some yoghurt left in it',
      options: ['Green bin', 'Rinse it, then green bin', 'Black bin'],
      right: 1,
      why: 'Food left inside can spoil a whole bag of recycling. A quick rinse is enough.',
    },
    {
      item: 'box' as const,
      question: 'A foam takeaway box',
      options: ['Green bin', 'Rinse it, then green bin', 'Black bin'],
      right: 2,
      why: 'Foam is number 6. It isn’t recycled from home bins, so it goes in the black bin.',
    },
    {
      item: 'shampoo' as const,
      question: 'An empty shampoo bottle with the cap on',
      options: ['Green bin', 'Black bin', 'Take the cap off and throw it away'],
      right: 0,
      why: 'Shampoo bottles are number 2 and recycle well. Leave the cap on so it isn’t lost.',
    },
  ],
  smileys: 3,
  recap: ['Rinse food tubs first', 'Foam goes in the black bin', 'Leave caps on bottles'],
};

/** F4·6g: green bins near you (Figma 829:12645). Pins are in Figma's 360 × 800 frame coordinates. */
export const GREEN_BINS = {
  search: 'Green bins near you',
  title: '3 green bins nearby',
  subtitle: 'Clean paper, card, plastic and cans',
  callout: { title: 'Green bin', takes: 'Paper, card, plastic, cans', distance: '120 m · 2-min walk' },
  bins: [
    { name: 'Al Wasl Rd · bus stop', distance: '120 m · 2-min walk', nearest: true, pin: { x: 130, y: 280 } },
    { name: 'Safa Park, gate 2', distance: '300 m · 4-min walk', nearest: false, pin: { x: 277, y: 235 } },
    { name: 'Union Coop car park', distance: '450 m · 6-min walk', nearest: false, pin: { x: 61, y: 405 } },
  ],
};
