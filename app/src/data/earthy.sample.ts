/**
 * SAMPLE: scripted Earthy voice turn for the investor demo (handoff section 5.2 and Story A step 1).
 * No audio is recorded and no model is called. Replace with the real voice service later.
 */

export const LIVE_TURN = {
  question: 'Find a beach clean-up this weekend with my friends',
  steps: ['Looking at clean-ups near Al Karama', 'Checking who in Grade 9B is going', 'Checking Saturday’s heat'],
  answer: 'Kite Beach clean-up is on Saturday, 7 to 10 AM. Omar and 11 friends are going. Want me to book you a spot?',
  result: { eventId: 'kite-beach', title: 'Kite Beach clean-up', when: 'Sat 5 Dec · 7–10 AM' },
} as const;

/** Timings for the scripted turn, in ms. */
export const LIVE_TIMING = {
  heardWord: 260,
  afterHeard: 700,
  step: 900, // handoff: thinking steps 900 ms apart
  afterSteps: 500,
  spokenWord: 70, // handoff: about 70 ms per spoken word
  cardAfterAnswer: 150,
} as const;
