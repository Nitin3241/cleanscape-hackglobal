/**
 * SAMPLE: resident litter reports (Figma R1·1–R1·3c), copied from the frames. Earthy's detection
 * is scripted; a real build would send the photo to the reports service and get these back.
 */

export type ReportScene = 'normal' | 'hazard' | 'already';

export const SPOT_PLACE = { name: 'Kite Beach, Jumeirah 3', accuracy: 'From your photo · ±10 m' };

/** Item tags Earthy draws on the photo (positions in the 360 × 800 frame). */
export const DETECTED = [
  { label: 'Bottle', top: 330, left: 52, tone: 'avatarTeal' as const },
  { label: 'Cup', top: 388, left: 250, tone: 'alertBadge' as const },
  { label: 'Can', top: 442, left: 98, tone: 'metroRed' as const },
  { label: 'Wrapper', top: 457, left: 232, tone: 'alertBadge' as const },
];

export const SCAN_MESSAGES = {
  coach: { title: 'Step back a little', note: 'Some litter is cut off at the bottom' },
  normal: { title: '11 items · about 2 bags', note: SPOT_PLACE.name },
  hazard: { title: 'Broken glass · don’t touch it', note: 'We’ll also alert Dubai Municipality' },
};

export const VOICE_NOTE = '“Pile of bottles and cans near lifeguard tower 3”';

export const REVIEW = {
  normal: {
    title: 'Medium litter spot',
    note: '11 items spotted · tap anything to change',
    items: [
      { label: 'Plastic ×6', on: true },
      { label: 'Cans ×2', on: true },
      { label: 'Paper ×3', on: true },
    ],
  },
  hazard: {
    title: 'Hazard spotted',
    note: 'Broken glass + 11 items · tap to change',
    items: [
      { label: 'Broken glass', on: true, hazard: true },
      { label: 'Plastic ×6', on: true },
      { label: 'Cans ×2', on: true },
    ],
    warning: { title: 'Don’t touch the glass', body: 'Keep others away. A trained crew will clear it.', sentTo: 'Also sent to · Dubai 24/7' },
  },
  sizes: [
    { label: '1 bag', note: 'Quick pick' },
    { label: '2–5 bags', note: 'Small crew' },
    { label: 'Crew job', note: '6+ bags' },
  ],
};

export const ALREADY = {
  title: 'Already reported nearby',
  body: '3 people flagged this spot 2 h ago. Add your +1 instead of a new report.',
  spot: 'Medium litter spot',
  meta: 'Kite Beach · 40 m from you',
  tags: ['Seen by a crew', '3 reports'],
  reward: '+5 Smileys once it’s confirmed',
  people: [
    { initials: 'MK', tone: 'avatarCoral' as const },
    { initials: 'SA', tone: 'avatarTeal' as const },
    { initials: 'RJ', tone: 'secondary' as const },
  ],
};

export const SENT = {
  new: {
    title: 'Report sent',
    body: 'Thanks, Sara. We’ll tell you when it’s cleaned.',
    badge: '✓',
    steps: [
      { title: 'Sent', note: 'Just now', state: 'done' as const },
      { title: 'Seen', note: 'A crew or Dubai Municipality checks it', state: 'current' as const },
      { title: 'Clean-up planned', note: 'We’ll invite you first', state: 'todo' as const },
      { title: 'Cleaned', note: 'You’ll get a before/after photo', state: 'todo' as const },
    ],
    reward: { title: '+15 Smileys once it’s confirmed', note: '+30 more when it’s cleaned' },
  },
  plusOne: {
    title: '+1 added',
    // Figma uses Layla here (another resident persona); kept as designed.
    body: 'Thanks, Layla. 4 people have now flagged this spot.',
    badge: '+1',
    steps: [
      { title: 'Reported by 4 people', note: 'Your +1 just now', state: 'done' as const },
      { title: 'Seen', note: 'A crew has already checked it', state: 'current' as const },
      { title: 'Clean-up planned', note: 'We’ll invite you first', state: 'todo' as const },
      { title: 'Cleaned', note: 'You’ll get a before/after photo', state: 'todo' as const },
    ],
    reward: { title: '+5 Smileys once it’s confirmed', note: '+30 more if you help clean it' },
  },
};

/** R1·2p Check your photo: what Earthy blurred before the report is sent (positions on the 328 × 260 preview). */
export const PHOTO_CHECK = {
  subtitle: 'Before it’s sent',
  blurs: [
    { label: 'Face', left: 40, top: 60, width: 54, height: 60 },
    { label: 'Face', left: 118, top: 48, width: 50, height: 56 },
    { label: 'Plate', left: 214, top: 150, width: 84, height: 34 },
  ],
  earthy: { title: '2 faces and 1 number plate blurred', body: 'Reports are about places, never people. The original photo isn’t kept.' },
  missed: { title: 'Missed something?', body: 'Tap the photo to blur it' },
  place: { title: 'Shown as Al Sufouh Rd', body: 'Not your exact position' },
} as const;

/** R1·4 Your report — status. */
export const REPORT_STATUS = {
  subtitle: 'Al Sufouh Rd · today, 7:42 AM',
  summary: { title: 'Plastic and bottles, medium pile', body: 'About 2 bags · suggested by Earthy' },
  steps: [
    { title: 'Sent', body: '7:42 AM', state: 'done' },
    { title: 'Earthy filled in type and size', body: 'From your photo', state: 'done' },
    { title: 'Neighbours confirm it', body: '2 of 3 said “I see it too”', state: 'now' },
    { title: 'Sent to EEG', body: 'After 3 confirmations', state: 'todo' },
    { title: 'Cleaned', body: 'You’ll get a photo', state: 'todo' },
  ],
  earthy: { title: 'One more neighbour to go', body: 'Three confirmations keep the radar honest. Then it goes to EEG.' },
  share: 'I reported litter on Al Sufouh Rd with CleanScape. 2 of 3 neighbours have confirmed it. Seen it too? Confirm it in the app.',
} as const;
