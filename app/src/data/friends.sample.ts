/**
 * SAMPLE: Friends (Figma, 13 Nov: P0 Community → P1 Friends → P2 Add friends), copied from the frames.
 * Nothing here is real. Replace with the friends service when it exists.
 */
import { type ThemeColor } from '@/constants/theme';

export type Person = { id: string; name: string; initials: string; tone: ThemeColor; note: string; tag?: string };

export const FRIENDS_SUMMARY = { count: 8, requests: 2, faces: ['O', 'L', 'M'] as const };

export const FRIEND_NUDGE = 'You cleaned Kite Beach with 6 people last month. Add them so you can team up again.';

export const REQUESTS: readonly Person[] = [
  { id: 'aisha', name: 'Aisha K.', initials: 'A', tone: 'avatarCoral', note: 'Cleaned with you at Kite Beach' },
  { id: 'rahul', name: 'Rahul M.', initials: 'R', tone: 'avatarGreenDeep', note: 'Grade 9B · your class' },
];

export const CLEANED_WITH: readonly Person[] = [
  { id: 'fatima', name: 'Fatima S.', initials: 'F', tone: 'avatarPink', note: 'Al Safa Park · 2 clean-ups together' },
  { id: 'karan', name: 'Karan P.', initials: 'K', tone: 'avatarSlate', note: 'Jumeirah Beach · 1 clean-up together' },
];

export const FRIENDS: readonly Person[] = [
  { id: 'omar', name: 'Omar H.', initials: 'O', tone: 'avatarMarigold', note: '5 clean-ups together · co-hosted once', tag: 'Going Sat' },
  { id: 'lina', name: 'Lina T.', initials: 'L', tone: 'avatarTeal', note: '3 clean-ups together', tag: 'Going Sat' },
  { id: 'maya', name: 'Maya R.', initials: 'M', tone: 'avatarLavender', note: '4 clean-ups together' },
  { id: 'yusuf', name: 'Yusuf A.', initials: 'Y', tone: 'avatarGold', note: '2 clean-ups together' },
];

export const MY_CODE = { name: 'Sara Al Mansoori', hint: 'Show this at a clean-up to add each other' };
export const FRIEND_PRIVACY = 'Only friends see which clean-ups you join. Under 18? A parent approves new friends first.';
export const FRIEND_LINK = 'https://cleanscape.app/f/sara-am';
