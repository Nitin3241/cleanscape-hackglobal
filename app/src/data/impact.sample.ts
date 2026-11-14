/**
 * SAMPLE: the "Your impact this year" row (Figma, 13 Nov: I0 → I9), copied from the frames.
 * Nothing here is real. Replace with the person's bag logs, EEG hours and the events service.
 */

export const IMPACT_YEAR = {
  year: 2026,
  collectedKg: 18,
  goalKg: 25,
  badgeNote: '7 kg to badge',
  summary: '6 h volunteered · 3-cleanup streak',
  insight: {
    title: 'March was your best month',
    body: '6 kg across two clean-ups at Kite Beach. 18 kg this year in total.',
  },
  stats: [
    { icon: 'clock', value: '6 h', label: 'Hours' },
    { icon: 'calendar', value: '5', label: 'Clean-ups' },
    { icon: 'flame', value: '3 wk', label: 'Streak' },
    { icon: 'pin', value: '4', label: 'Places' },
  ],
  pace: {
    title: 'On track for 25 kg by 14 Dec',
    body: 'Join these two near you and you get there by 30 Nov.',
    events: [
      { month: 'NOV', day: '21', place: 'Kite Beach', when: 'Sat · 7 AM · 2.1 km' },
      { month: 'NOV', day: '28', place: 'Al Barsha Pond', when: 'Sat · 7 AM · 1.4 km' },
    ],
  },
  more: {
    hours: { title: 'Hours & certificate', body: '6 h verified by EEG' },
    goal: { title: 'Al Barsha goal', body: '312 of 500 kg · you gave 11 kg' },
    story: { title: 'Your 2026 story', body: '5 slides by Earthy · EN or AR' },
  },
  hostNudge: { title: 'Host a clean-up', body: 'Your street is Al Barsha’s top litter spot this month' },
} as const;

/** Weeks per month on the year grid (52 in all), Jan → Dec. */
export const MONTH_WEEKS = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5] as const;
export const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const;

/** Weeks with a clean-up (week numbers, 1-based). Week 11 opens the I2 week memory. */
export const CLEANUP_WEEKS: readonly number[] = [6, 11, 12, 22, 37];
export const MEMORY_WEEK = 11;
export const THIS_WEEK = 46;

/** I2 Week memory (sheet), week 11. */
export const WEEK_MEMORY = {
  place: 'Kite Beach',
  when: 'Sat 14 Mar · Clean UAE with EEG',
  stats: [
    { value: '3.2 kg', label: 'Collected' },
    { value: '2 h', label: 'Verified' },
    { value: '3', label: 'Friends' },
  ],
  recap: {
    title: 'Mostly bottles and caps',
    body: 'About 6 in 10 items, near lifeguard tower 3. You went with Omar, Lina and Sara.',
  },
  share: 'Sat 14 Mar at Kite Beach with Clean UAE and EEG: 3.2 kg collected in 2 h. Shared from CleanScape.',
} as const;

/** IE1 Earthy — Why March? (sheet). */
export const WHY_MARCH = {
  subtitle: 'Looking at your March clean-ups',
  asked: 'Why March?',
  answer: 'Two weekend clean-ups a week apart, on cool mornings around 24°C. You went with friends both times, so you covered more ground.',
  days: [
    { month: 'MAR', day: '14', place: 'Kite Beach', detail: '3.2 kg · 2 h · with Omar, Lina, Sara' },
    { month: 'MAR', day: '21', place: 'Al Barsha Pond', detail: '2.8 kg · 1 h · with Omar' },
  ],
  choices: ['Plan December', 'Who came most?'],
  more: [
    { title: 'Find two clean-ups in December', body: 'Same pattern: weekends, mornings' },
    { title: 'Invite Omar, Lina and Sara', body: 'They came in March' },
    { title: 'Remind me on cool mornings', body: 'Under 26°C at 7 AM' },
  ],
} as const;

/** IE2 Earthy — Most picked item (sheet). Rings: about 20% of the total each (Figma changelog, 13 Nov). */
export const MOST_PICKED = {
  subtitle: 'From your 5 bag logs this year',
  asked: 'Most picked item?',
  answer: 'Plastic, mostly bottles and caps: 46% of what you logged, mostly near lifeguard towers and car parks.',
  choices: ['Where do they go?', 'Log faster'],
  total: '18 kg this year',
  note: 'Each ring is about 20% of your total. Most of “Other” is cigarette butts.',
  materials: [
    { key: 'plastic', label: 'Plastic', kg: 8.3, share: 46, color: '#2A8FA8', text: 'brand', rings: [0.42, 0.57, 0.71, 0.86, 1] },
    { key: 'paper', label: 'Paper', kg: 2.5, share: 14, color: '#FFB020', text: 'textPaper', rings: [0.64, 1] },
    { key: 'metal', label: 'Metal', kg: 1.6, share: 9, color: '#FF7A70', text: 'textAccent', rings: [1] },
    { key: 'glass', label: 'Glass', kg: 2.3, share: 13, color: '#4CC38A', text: 'statusSuccess', rings: [0.64, 1] },
    { key: 'other', label: 'Other', kg: 3.3, share: 18, color: '#9AABB2', text: 'textWeak', rings: [0.52, 0.76, 1] },
  ],
  more: [
    { title: 'Bring a bottle bag next time', body: 'Earthy adds it to your checklist' },
    { title: 'Show recycling machines', body: 'Return bottles near Kite Beach' },
    { title: 'Share this with my class', body: 'A one-slide summary' },
  ],
} as const;

/** I3 Hours & certificate — set up. */
export const CERTIFICATE_SETUP = {
  subtitle: '6 h verified by EEG',
  earthy: { title: 'Earthy lays it out for you', body: 'Tell me where it’s going and I’ll include what they ask for.' },
  uses: [
    { id: 'school', title: 'School', body: 'Community service hours, signed' },
    { id: 'university', title: 'University', body: 'Application or scholarship' },
    { id: 'job', title: 'Job or CV', body: 'What you did, in one line' },
    { id: 'me', title: 'Just for me', body: 'A keepsake' },
  ],
  languages: ['English', 'Arabic', 'Both'],
  include: [
    { id: 'sessions', title: 'Hours by session', body: '5 sessions, Feb to Sep' },
    { id: 'kg', title: 'Kg collected', body: '18 kg' },
    { id: 'stamp', title: 'EEG stamp and signature', body: 'Schools need this' },
  ],
  sessions: { title: '5 verified sessions', body: 'Checked in by EEG crew leaders' },
} as const;

/** I3s Certificate — Earthy preparing (loader) and I4 Certificate ready. */
export const CERTIFICATE = {
  preparing: 'Preparing your school certificate',
  steps: ['Pulled your 5 verified sessions', 'Matched them with EEG records', 'Laying it out for school'],
  readySubtitle: 'Ready · for school',
  name: 'Aisha Rahman',
  line: 'Grade 9 · completed community clean-up service in Dubai, Feb to Sep 2026',
  figures: [
    { value: '6', label: 'hours' },
    { value: '5', label: 'sessions' },
    { value: '18 kg', label: 'collected' },
  ],
  signed: '13 Nov 2026',
  id: 'ID CS-26-0418',
  earthy: { title: 'Your school can check it in seconds', body: 'The QR opens EEG’s record of your 5 sessions.' },
  share: 'My CleanScape volunteer certificate, verified by Emirates Environmental Group: https://cleanscape.app/c/CS-26-0418',
} as const;

/** I7 Clean-up receipt. */
export const RECEIPT = {
  subtitle: 'Kite Beach · Sat 14 Nov',
  org: 'Clean UAE with EEG',
  number: 'No. CS-1114-KB',
  total: '32 kg',
  totalNote: 'off Kite Beach, by 48 volunteers',
  lines: [
    { label: 'Bags weighed', value: '14', strong: false },
    { label: 'Your share', value: '3.2 kg', strong: true },
    { label: 'Your hours', value: '2 h, verified', strong: false },
    { label: 'Top item', value: 'Plastic bottles, 46%', strong: false },
  ],
  earthy: { title: 'Built from your check-in and bag weights', body: 'Nothing here is estimated. Spot a mistake?' },
  share: 'Kite Beach, Sat 14 Nov: 32 kg off the beach by 48 volunteers with Clean UAE and EEG. My share: 3.2 kg in 2 h. Shared from CleanScape.',
} as const;

/** I8 Vote — where next? and I9 Vote result. */
export const VOTE = {
  subtitle: 'Your crew decides · closes in 2 days',
  earthy: { title: 'Earthy shortlisted 3 spots', body: 'The three places that need help most within 8 km of your crew.' },
  options: [
    { id: 'al-sufouh', name: 'Al Sufouh Beach', note: '9 reports · not cleaned in 5 weeks', distance: '3.4 km', share: 52, votes: 25 },
    { id: 'kite-south', name: 'Kite Beach, south end', note: '6 reports · cleaned 3 weeks ago', distance: '0.6 km', share: 29, votes: 14 },
    { id: 'barsha-pond', name: 'Al Barsha Pond Park', note: '5 reports · never cleaned by a crew', distance: '7.1 km', share: 19, votes: 9 },
  ],
  turnout: '31 of 48 volunteers have voted. You can change your vote until it closes.',
  resultSubtitle: '48 volunteers voted',
  result: { title: 'Al Sufouh Beach it is', body: 'Someone needs to host it. EEG usually answers within 2 days.' },
} as const;

/** I6 My impact — empty (before the first clean-up). */
export const IMPACT_EMPTY = {
  summary: 'Your first clean-up starts the count',
  badgeNote: '25 kg to badge',
  insight: { title: 'Start with one clean-up', body: 'Three are on near you this week. Kite Beach is the closest, 2.1 km away.' },
  chips: ['What happens there?', 'What to bring?'],
  gridNote: 'Each clean-up you join fills its week.',
  pace: { title: 'Pick your first clean-up', body: 'About 2 hours and 3 kg each. Earthy reminds you the day before.' },
} as const;
