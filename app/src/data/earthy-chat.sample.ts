/**
 * SAMPLE: Earthy's scripted chat for the demo (Figma F9 v2 and Stories A and B). No model is
 * called; every question, answer and card is copied from Figma. Replace with the assistant service.
 *
 * One step per Figma frame (F9v2·4–16, A1–A4, B1–B4). A step is the end of a thread: earlier
 * turns show only the question and Earthy's short reply, the last one shows its card, buttons and
 * follow-ups. Taps go to another step (a new screen, as in Figma's prototype), Earthy home
 * ('home', F9v2·1) or back.
 */

export type StepId =
  | 'didYouMean'
  | 'next'
  | 'bring'
  | 'hours'
  | 'joinCode'
  | 'consent'
  | 'gloves'
  | 'heat'
  | 'match'
  | 'organiser'
  | 'water'
  | 'caption'
  | 'locked'
  | 'planMatch'
  | 'planBring'
  | 'planJoin'
  | 'planConsent'
  | 'dayGloves'
  | 'dayWater'
  | 'dayUnwell'
  | 'dayImpact';

/** Where a tap goes: another step, Earthy home (F9v2·1), back, or an app screen. */
export type ChatLink = StepId | 'home' | 'back' | '/smileys';

export type ChatCard =
  | { kind: 'event'; tag: string; title: string; meta: string; actions?: readonly [string, string] }
  | { kind: 'match'; tag: string; title: string; meta: string; ride: { title: string; meta: string } }
  | { kind: 'checklist'; items: readonly string[] }
  | { kind: 'volunteering' }
  | { kind: 'classCode'; school: string; title: string; meta: string }
  | { kind: 'consent'; status: string; meta: string }
  | { kind: 'tally'; rows: readonly (readonly [string, string])[]; notice: string }
  | { kind: 'safety' }
  | { kind: 'timer'; label: string; value: string; options: readonly string[] }
  | { kind: 'headcount'; here: number; total: number; message: string }
  | { kind: 'captions'; options: readonly string[] }
  | { kind: 'locked'; text: string }
  | { kind: 'didYouMean'; options: readonly { label: string; to: ChatLink }[] };

/** A follow-up row. Without `to` or `share` it leads nowhere in Figma yet and is shown inactive. */
export type Suggestion = { label: string; to?: ChatLink; share?: string };

export type ChatAction = { label: string; tone: 'primary' | 'secondary' | 'danger'; to?: ChatLink; call?: string };

export type ChatTurn = {
  user?: string;
  /** Arabic messages read right to left. */
  userRtl?: boolean;
  answer: string;
  card?: ChatCard;
  actions?: readonly ChatAction[];
  /** Follow-up rows, in groups (Figma B1 puts "Remind me to drink water" in a group of its own). */
  suggestions?: readonly (readonly Suggestion[])[];
};

const Q = {
  next: 'When’s my next clean-up?',
  bring: 'What should I bring?',
  join: 'Join with code K7F2',
  mum: 'Did my mum approve?',
  gloves: 'Add two bags of plastic',
  water: 'Remind me to drink water',
  dizzy: 'It’s really hot, I feel dizzy',
  friends: 'Find something near me with my friends',
  hours: 'كم ساعة تطوعت؟',
};

const NEXT_CARD: ChatCard = {
  kind: 'event',
  tag: 'SAT 5 DEC · 7–9 AM',
  title: 'Kite Beach clean-up',
  meta: 'Umm Suqeim · 22 spots left',
  actions: ['Open Waze', 'My QR'],
};
const CHECKLIST: ChatCard = {
  kind: 'checklist',
  items: ['Water bottle, 1 L', 'Hat and sunscreen', 'Closed shoes', 'Gloves and bags are provided'],
};
const CLASS_CODE: ChatCard = {
  kind: 'classCode',
  school: 'Grade 9B · Al Barsha School',
  title: 'Kite Beach clean-up · Sat 5 Dec',
  meta: 'Mum gets a WhatsApp to approve.',
};
const CONSENT: ChatCard = { kind: 'consent', status: 'Waiting', meta: 'Sent to Mum · yesterday 7:40 PM' };
const TALLY: ChatCard = {
  kind: 'tally',
  notice: 'Gloves mode on · say “add” or “undo”',
  rows: [
    ['Plastic', '3 bags'],
    ['Mixed waste', '2 bags'],
    ['Cans', '12 items'],
  ],
};
const TIMER: ChatCard = {
  kind: 'timer',
  label: 'Next water break',
  value: 'in 12 min',
  options: ['Every 15 min', 'Every 30 min', 'Stop'],
};
const MATCH: ChatCard = {
  kind: 'match',
  tag: 'BEST MATCH · SAT 5 DEC · 7 AM',
  title: 'Kite Beach clean-up',
  meta: 'Maya and Omar are going · 4.2 km',
  ride: { title: 'Carpool with Omar · leaves JLT 6:30', meta: '2 seats · verified driver' },
};

const A = {
  next: 'Saturday 5 Dec, 7 AM at Kite Beach. Your bus leaves Al Barsha School at 6:15.',
  bring: 'Here’s the organiser’s list for Kite Beach.',
  hours: 'You’ve volunteered 14 hours across 6 clean-ups. Nice work!',
  join: 'Found it. Check this before I join you.',
  mum: 'Not yet. She hasn’t opened the WhatsApp link.',
  gloves: 'Added 2 bags. You’re on 5 bags today.',
  water: 'Done. I’ll remind you every 20 minutes until 9 AM.',
  dizzy: 'Stop and sit in the shade now. Sip water slowly. Tell your team lead.',
  friends: '2 friends are going to Kite Beach, and there’s a seat in Omar’s car.',
};

const CALL_999: ChatAction = { label: 'Call 999', tone: 'secondary', call: 'tel:999' };
const GLOVES_FOLLOW_UPS: readonly Suggestion[] = [{ label: 'Undo last' }, { label: 'Add a photo' }];

export const STEPS = {
  // F9v2·4 Did you mean?
  didYouMean: [
    {
      user: 'وين الكلين أب الجاي؟',
      userRtl: true,
      answer: 'I think you asked about your next clean-up. Did you mean…',
      card: {
        kind: 'didYouMean',
        options: [
          { label: 'Where is my next clean-up?', to: 'next' },
          { label: 'Find clean-ups near me', to: 'match' },
        ],
      },
      // Not linked in Figma; it closes the thread so you can type again.
      suggestions: [[{ label: 'None of these, let me type', to: 'back' }]],
    },
  ],
  // F9v2·5 Answer — Next clean-up
  next: [
    {
      user: Q.next,
      answer: A.next,
      card: NEXT_CARD,
      suggestions: [
        [
          { label: Q.bring, to: 'bring' },
          { label: 'Remind me tonight', to: 'water' },
        ],
      ],
    },
  ],
  // F9v2·6 Answer — What to bring
  bring: [
    {
      user: Q.bring,
      answer: A.bring,
      card: CHECKLIST,
      suggestions: [
        [
          { label: 'Add these to my reminders', to: 'water' },
          {
            label: 'Share the list with Mum',
            share:
              'Kite Beach clean-up, Sat 5 Dec: water bottle (1 L), hat and sunscreen, closed shoes. Gloves and bags are provided.',
          },
        ],
      ],
    },
  ],
  // F9v2·7 Answer — Hours + Smileys (the follow-ups aren't linked in Figma; they open Smileys).
  hours: [
    {
      user: Q.hours,
      userRtl: true,
      answer: A.hours,
      card: { kind: 'volunteering' },
      suggestions: [
        [
          { label: 'Show my certificates', to: '/smileys' },
          { label: 'What can I spend Smileys on?', to: '/smileys' },
        ],
      ],
    },
  ],
  // F9v2·8 Action — Join with class code
  joinCode: [
    {
      user: Q.join,
      answer: A.join,
      card: CLASS_CODE,
      actions: [
        { label: 'Confirm', tone: 'primary', to: 'consent' },
        { label: 'Cancel', tone: 'secondary', to: 'home' },
      ],
    },
  ],
  // F9v2·9 Action — Resend parent consent
  consent: [
    {
      user: Q.mum,
      answer: A.mum,
      card: CONSENT,
      actions: [
        { label: 'Resend', tone: 'primary', to: 'home' },
        { label: 'Not now', tone: 'secondary', to: 'home' },
      ],
    },
  ],
  // F9v2·10 Hands-free logging (gloves mode)
  gloves: [{ user: Q.gloves, answer: A.gloves, card: TALLY, suggestions: [GLOVES_FOLLOW_UPS] }],
  // F9v2·11 Safety — Heat. Alert organiser isn't linked on this frame; it leads to the same reply as Story B (B4).
  heat: [
    {
      user: Q.dizzy,
      answer: A.dizzy,
      card: { kind: 'safety' },
      actions: [{ label: 'Alert organiser', tone: 'danger', to: 'dayImpact' }, CALL_999],
    },
  ],
  // F9v2·12 Smart match + ride grouping
  match: [{ user: Q.friends, answer: A.friends, card: MATCH, actions: [{ label: 'Book seat', tone: 'primary', to: 'next' }] }],
  // F9v2·13 Organiser — Headcount + broadcast
  organiser: [
    {
      user: 'How many checked in?',
      answer: '212 of 240 checked in. 28 still to arrive.',
      card: { kind: 'headcount', here: 212, total: 240, message: '“We’ve started at the north gate. See you soon!”' },
      actions: [{ label: 'Send message', tone: 'primary', to: 'home' }],
    },
  ],
  // F9v2·14 Water break timer
  water: [{ user: Q.water, answer: A.water, card: TIMER }],
  // F9v2·15 Caption writer (18+)
  caption: [
    {
      user: 'Write a caption for my post',
      answer: 'Two options. Tap one to copy.',
      card: {
        kind: 'captions',
        options: [
          'Spent my Saturday at Kite Beach with 240 people. 86 kg gone. #CleanUAE',
          '2 hours, 5 bags, zero regrets. Who’s in next time? #CleanScape',
        ],
      },
      suggestions: [[{ label: 'Make it shorter' }, { label: 'Write it in Arabic' }]],
    },
  ],
  // F9v2·16 Locked — under 13
  locked: [
    {
      answer: 'The helper is off for now.',
      card: { kind: 'locked', text: 'Ask a parent to turn it on in Family settings. Every button in the app still works.' },
      actions: [{ label: 'Ask parent', tone: 'primary', to: 'home' }],
    },
  ],
  // F9v2·A1 Plan — find with friends
  planMatch: [
    {
      user: Q.friends,
      answer: A.friends,
      card: MATCH,
      actions: [{ label: 'Book seat', tone: 'primary', to: 'planBring' }],
      suggestions: [[{ label: Q.bring, to: 'planBring' }]],
    },
  ],
  // F9v2·A2 Plan — what to bring
  planBring: [
    { user: Q.friends, answer: 'Booked your seat with Omar. Kite Beach, Sat 5 Dec at 7 AM.' },
    {
      user: Q.bring,
      answer: A.bring,
      card: CHECKLIST,
      suggestions: [
        [
          { label: 'Add these to my reminders', to: 'planJoin' },
          { label: 'Join with class code', to: 'planJoin' },
        ],
      ],
    },
  ],
  // F9v2·A3 Plan — join with class code
  planJoin: [
    { user: Q.bring, answer: 'Water 1 L, a hat and closed shoes. Saved to your reminders for Friday night.' },
    {
      user: Q.join,
      answer: A.join,
      card: CLASS_CODE,
      actions: [
        { label: 'Confirm', tone: 'primary', to: 'planConsent' },
        { label: 'Cancel', tone: 'secondary', to: 'back' },
      ],
    },
  ],
  // F9v2·A4 Plan — waiting for Mum
  planConsent: [
    { user: Q.join, answer: 'You’re in Grade 9B’s clean-up. I sent Mum a WhatsApp to approve.' },
    {
      user: Q.mum,
      answer: A.mum,
      card: CONSENT,
      actions: [
        { label: 'Resend', tone: 'primary', to: 'home' },
        { label: 'Not now', tone: 'secondary', to: 'home' },
      ],
    },
  ],
  // F9v2·B1 On the day — log bags hands-free
  dayGloves: [
    { user: Q.gloves, answer: A.gloves, card: TALLY, suggestions: [GLOVES_FOLLOW_UPS, [{ label: Q.water, to: 'dayWater' }]] },
  ],
  // F9v2·B2 On the day — water breaks
  dayWater: [
    { user: Q.gloves, answer: A.gloves },
    { user: Q.water, answer: A.water, card: TIMER, suggestions: [[{ label: 'I don’t feel well', to: 'dayUnwell' }]] },
  ],
  // F9v2·B3 On the day — feeling unwell
  dayUnwell: [
    { user: Q.water, answer: 'Done. Next water break in 12 min.' },
    {
      user: Q.dizzy,
      answer: A.dizzy,
      card: { kind: 'safety' },
      actions: [{ label: 'Alert organiser', tone: 'danger', to: 'dayImpact' }, CALL_999],
    },
  ],
  // F9v2·B4 On the day — today’s impact
  dayImpact: [
    { user: Q.dizzy, answer: 'Your crew head is on the way. Stay in the shade and sip water.' },
    {
      user: Q.hours,
      userRtl: true,
      answer: A.hours,
      card: { kind: 'volunteering' },
      suggestions: [
        [
          { label: 'Show my certificates', to: 'home' },
          { label: 'What can I spend Smileys on?', to: 'home' },
        ],
      ],
    },
  ],
} satisfies Record<StepId, readonly ChatTurn[]>;

export const VOLUNTEERING = {
  hours: 14,
  goal: 20,
  year: '2026',
  toGoal: '6 h to your school goal',
  note: 'Grade 9B needs 20 h each this term',
  smileys: '1,240',
  cleanUps: 6,
  /** Bar heights in px, from Figma's "last 6" (the newest is highlighted). */
  lastSix: [10, 16, 12, 22, 18, 28],
};

/** Earthy home (F9v2·1): today at a glance and the starting suggestions, each opening a step. */
export const EARTHY_HOME = {
  greeting: 'Hello, Sara',
  prompt: 'What can I sort for you?',
  today: [
    {
      icon: 'calendar' as const,
      title: 'Kite Beach',
      note: 'in 3 days · bus 6:15',
      tone: 'fill' as const,
      start: 'next' as StepId,
    },
    {
      icon: 'sun' as const,
      title: '38°C Saturday',
      note: 'bring 1 L water',
      tone: 'secondarySubtle' as const,
      start: 'water' as StepId,
    },
    { icon: 'smile' as const, title: '1,240', note: 'Smileys', tone: 'statusSuccessSubtle' as const, start: 'hours' as StepId },
  ],
  suggestions: [
    { label: 'What should I bring on Saturday?', start: 'bring' as StepId },
    { label: 'Join my class with a code', start: 'joinCode' as StepId },
    // Story B (F9v2·B1) and Story A (F9v2·A1).
    { label: 'Start hands-free mode', start: 'dayGloves' as StepId },
    { label: 'Find a clean-up with my friends', start: 'planMatch' as StepId },
  ],
};
