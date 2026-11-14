import type { InsightKey } from '@/state/insights';

/**
 * SAMPLE: what Earthy "noticed" on each screen, copied from the Figma tip frames (13 Nov: plain-language copy).
 * A real build would get these from the assistant service, with the reason it gives.
 */
export const INSIGHTS: Record<InsightKey, { title: string; body: string; why: string; action: string }> = {
  home: {
    title: 'Kite Beach needs a clean-up',
    body: 'Strong wind blew litter onto the beach last night. 12 neighbours are free on Saturday at 7 AM.',
    why: 'you live 3 km away and joined 2 beach clean-ups.',
    action: 'Start clean-up',
  },
  events: {
    title: 'Picked for you',
    body: 'It’s on your usual Saturday morning, and Maya and Omar are going.',
    why: 'you often join on Saturdays, and 2 friends signed up.',
    action: 'Join friends',
  },
  'getting-there': {
    title: 'Leave by 6:20 AM',
    body: 'The drive takes 18 minutes. The bus is almost full, so a seat in Aisha’s carpool is the safer choice.',
    why: 'live traffic and bus bookings for Saturday.',
    action: 'Request seat',
  },
  class: {
    title: '2 classmates haven’t joined',
    body: 'Ali and Noor opened the invite but didn’t sign up. Send them the class link again?',
    why: 'they viewed the invite yesterday.',
    action: 'Send link',
  },
  'class-impact': {
    title: 'Your class story is ready',
    body: '28 of you cleared 41 kg. I made a 15-second story to share.',
    why: 'made from today’s check-ins and photos.',
    action: 'Watch story',
  },
  smileys: {
    title: '60 Smileys to a free juice',
    body: 'One more clean-up gets you there. You can collect it at Kite Beach Café.',
    why: 'it’s the reward closest to your balance.',
    action: 'Find event',
  },
  organiser: {
    title: 'Draft with Earthy',
    body: 'Describe your event in one line. I’ll fill in the kit list, roles and safety brief.',
    why: 'new organisers spend ~20 min on this form.',
    action: 'Draft it',
  },
};
