/**
 * DEMO_MODE: the investor demo runs on this mock profile and scripted Earthy replies,
 * so a recording never depends on the network or a live model.
 * Every screen's sample data should read the person and their next clean-up from here.
 */
export const DEMO_MODE = true;

export const DEMO_PROFILE = {
  firstName: 'Sara',
  fullName: 'Sara Al Mansoori',
  area: 'Al Karama, Dubai',
  school: 'Al Barsha School',
  className: 'Grade 9B',
  // Under 18: no open friend search; new friends come by QR or class, and a parent approves them first.
  isUnder18: true,
  smileys: 1240,
  friends: ['Omar', 'Lina'],
  nextCleanup: { eventId: 'kite-beach', title: 'Kite Beach', day: 'Sat 5 Dec', time: '7–10 AM' },
} as const;
