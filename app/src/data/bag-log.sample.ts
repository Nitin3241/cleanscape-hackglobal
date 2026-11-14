/**
 * SAMPLE DATA for logging a full bag (Figma flow F5 · Bag log). Copied from Figma; nothing real.
 * Earthy's "peek" at what's inside is scripted for the demo; no image is analysed.
 */

export const BAG = {
  number: 14,
  crew: 'Crew Green · Kite Beach',
  volunteer: { name: 'Sara Ahmed', firstName: 'Sara', initials: 'SA' },
  crewHead: 'Ms. Huda',
  contents: ['Plastic bottles', 'Cans', 'Mixed'],
  earthyFound: ['Plastic bottles', 'Cans'],
};

export const FULLNESS = [
  { key: 'half', label: 'Half', note: 'Under 3 kg' },
  { key: 'full', label: 'Full', note: '3–6 kg' },
  { key: 'heavy', label: 'Heavy', note: 'Needs 2 people' },
] as const;

export type Fullness = (typeof FULLNESS)[number]['key'];

/** Expected weight for each fullness, used to say whether the scale reading looks normal (F5·3). */
export const EXPECTED_KG: Record<Fullness, { min: number; max: number }> = {
  half: { min: 0.5, max: 3 },
  full: { min: 3, max: 6 },
  heavy: { min: 6, max: 15 },
};

export const BAG_RESULT = {
  kg: 4.2,
  smileys: 24,
  estimate: 20,
  bagsToday: 3,
  removed: '12.6 kg',
  balance: '1,266',
  classGoal: 200,
  classNow: 190,
  className: 'Grade 9B',
};
