/**
 * SAMPLE DATA for Smileys (Figma flow F7 · Smileys). Non-cash points: earn, level up, spend
 * at sponsor shops. Copied from Figma; nothing here is real.
 * Note: Figma has two different hours figures (F7·1: 46 of 60 h; F9 v2·7: 14 of 20 h). This
 * flow uses F7's 46 h until the design settles on one set.
 */

import { type IconName } from '@/components/ui/icon';
import { type ThemeColor } from '@/constants/theme';

export const SMILEYS = {
  balance: 1240,
  level: 3,
  levelName: 'Ghaf sapling',
  nextLevelAt: 1500,
  streak: '4 clean-ups in a row',
  perk: '1 free pass',
};

export const HOURS = {
  verified: 46,
  school: { label: 'School goal', goal: 60 },
  goldenVisa: { label: 'Golden Visa path', goal: 500 },
  note: 'Hours count when your crew head checks you in',
};

export const CLASS_SMILEYS = { name: 'Grade 9B', total: '12,400', rank: '#2 of 12', fromYou: 240, goal: '15,000', percent: 83 };

export const LEVELS = ['Seed', 'Sprout', 'Ghaf', 'Palm', 'Mangrove'];
export const CURRENT_LEVEL_INDEX = 2;

export type Badge = { name: string; note: string; icon: IconName; tone: ThemeColor; color: ThemeColor; earned: boolean };

export const BADGES: readonly Badge[] = [
  { name: 'First clean-up', note: 'Kite Beach', icon: 'leaf', tone: 'statusSuccessSubtle', color: 'statusSuccess', earned: true },
  { name: 'Team player', note: 'Grade 9B', icon: 'users', tone: 'secondarySubtle', color: 'textPaper', earned: true },
  { name: 'Tree planter', note: '1 tree', icon: 'tree', tone: 'statusSuccessSubtle', color: 'statusSuccess', earned: true },
  { name: 'Early bird', note: '7 AM start', icon: 'alarm', tone: 'accentSubtle', color: 'textAccent', earned: true },
  { name: 'Safe hands', note: 'Hazard reported', icon: 'shield-check', tone: 'fill', color: 'brand', earned: true },
  { name: 'Emirate explorer', note: '2 of 3 emirates', icon: 'map', tone: 'wellCool', color: 'strokeStrong', earned: false },
  { name: '5 in a row', note: '4 of 5', icon: 'clock', tone: 'wellCool', color: 'strokeStrong', earned: false },
  { name: 'Bag hero', note: '8 of 10 bags', icon: 'trash', tone: 'wellCool', color: 'strokeStrong', earned: false },
  { name: 'Hours hero', note: '46 of 60 h', icon: 'file', tone: 'wellCool', color: 'strokeStrong', earned: false },
];

export const OFFER_FILTERS = ['All', 'Food', 'Clothes', 'Fun'] as const;

export const OFFERS = [
  { key: 'juice', title: 'Fresh juice', shop: 'Kite Beach Café', category: 'Food', cost: 300, icon: 'cup' as IconName, tone: 'secondarySubtle' as ThemeColor },
  { key: 'tees', title: '15% off tees', shop: 'Desert Threads', category: 'Clothes', cost: 600, icon: 'shirt' as IconName, tone: 'textilesSubtle' as ThemeColor },
];

export const JUICE = {
  title: 'Any fresh juice',
  shop: 'Kite Beach Café · Jumeirah 3',
  shopShort: 'Kite Beach Café',
  category: 'Food',
  cost: 300,
  steps: [
    { title: 'Tap Redeem', note: 'We hold 300 Smileys for you' },
    { title: 'Show the code at the counter', note: 'The café scans it' },
    { title: 'Use it within 15 minutes', note: 'Not used? Smileys come back' },
  ],
  where: '600 m from you · open till 11 PM',
  rule: "Non-cash · can't be swapped for money",
  code: 'SMILE-4821',
  validMinutes: 15,
};
