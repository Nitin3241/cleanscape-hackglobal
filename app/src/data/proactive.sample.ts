/**
 * SAMPLE: Earthy's proactive screens (Figma F10·9–14), copied from the frames. Nothing is
 * measured or predicted in the demo; replace with the assistant and reports services.
 */

/** F10·9: Earthy sizes a litter spot from one photo. */
export const SPOT = {
  checks: ['Area measured', 'Items counted', 'Hazards checked'],
  tags: [
    { label: '~40 m²', top: 258, left: 150 },
    { label: 'Bottles × 14', top: 330, left: 40, dot: 'brand' as const },
    { label: 'Cans × 9', top: 372, left: 210, dot: 'secondary' as const },
  ],
  size: 'Medium',
  title: 'Medium litter spot',
  where: 'Al Sufouh beach · 600 m · just now',
  stats: [
    { icon: 'map' as const, value: '~40 m²', label: 'area' },
    { icon: 'trash' as const, value: '6 bags', label: 'to fill' },
    { icon: 'users' as const, value: '8 people', label: 'about 1.5 h' },
  ],
  mix: [
    { label: 'Plastic', share: 0.6, tone: 'brand' as const },
    { label: 'Cans', share: 0.25, tone: 'secondary' as const },
    { label: 'Other', share: 0.15, tone: 'accent' as const },
  ],
  hazards: 'No hazards seen',
  best: 'Best: Sat 7 AM',
};

/** F10·10: the clean-up Earthy drafted from the spot. */
export const DRAFT = {
  spot: 'Medium spot · ~40 m² · 6 bags',
  day: 'Sat 12 Dec',
  dayNote: 'Earthy picked the coolest slot',
  slots: [
    { time: '7:00 AM', note: '29°C · low tide' },
    { time: '8:30 AM', note: '33°C' },
    { time: '4:30 PM', note: '31°C' },
  ],
  where: 'Al Sufouh beach · north car park',
  crew: 8,
  crewNote: '1.5 h',
  kit: '6 bags, 8 grabbers, gloves, water',
  roles: 'You lead · Omar safety · Maya sorts',
  roleInitials: ['S', 'O', 'M'],
  invite: '23 neighbours nearby',
  steps: ['Drafted', 'Co-host OK', 'Live'],
};

/** F10·11: where litter is building up this weekend. */
export const RADAR = {
  filters: ['This weekend', 'Beaches', 'Near me'],
  note: 'Friday’s shamal pushed litter onto west-facing beaches. Kite Beach has 3× its usual reports.',
  spots: [
    { rank: 1, name: 'Kite Beach', note: 'After the shamal · 4 km', going: 12, action: 'Host', level: 'high' as const, pin: { top: 238, left: 116 } },
    { rank: 2, name: 'Umm Suqeim 2', note: 'Weekend picnics · 6 km', going: 5, action: 'Join', level: 'medium' as const, pin: { top: 320, left: 64 } },
    { rank: 3, name: 'JLT Park', note: 'Cleaned last week · 2 km', going: 20, action: 'Join', level: 'low' as const, pin: { top: 252, left: 256 } },
  ],
};

/** F10·12: today's 5-minute mission. */
export const MISSION = {
  date: 'Tue 8 Dec · 5 minutes',
  title: 'Pick up 3 items on your walk to school',
  target: 3,
  found: [
    { name: 'Bottle', time: '7:42' },
    { name: 'Can', time: '7:48' },
  ],
  reward: 15,
  route: 'Walk to Al Barsha School · 12 min',
  streak: { days: ['W', 'T', 'F', 'S', 'S', 'M', 'T'], done: 6, goal: 7, bonus: 50 },
  tomorrow: 'Tomorrow is a school holiday. I’ll switch you to a 10-minute park walk.',
};

/** F10·13: the impact story Earthy made from the day's check-ins. */
export const STORY = {
  place: 'KITE BEACH · SAT 5 DEC',
  headline: 'You + 211 neighbours cleared',
  kg: 86,
  time: 'in 2 hours',
  chips: ['3,400 bottles', '42 bags', '0 hazards'],
  yours: { initial: 'S', label: 'Your part', value: '5 bags · 2 h · +40 Smileys', added: '2 h added' },
  share: 'You + 211 neighbours cleared 86 kg from Kite Beach in 2 hours. #CleanUAE',
  slides: 4,
};

/** F10·14: the neighbourhood goal. */
export const GOAL = {
  title: 'Al Barsha goal',
  subtitle: 'December · 148 neighbours',
  label: '500 KG BEFORE THE NEW YEAR',
  kg: 312,
  target: 500,
  daysLeft: 23,
  milestones: [250, 400, 500],
  pace: { projected: 470, short: 30 },
  // Kilograms per week so far (solid) and Earthy's projection (dashed), for the small chart.
  history: [60, 95, 140, 170, 215, 250, 312],
  suggestion: 'Two weekend clean-ups at Al Barsha Pond Park would close the gap. Pick a date to co-host.',
  dates: [
    { day: 'Sat 19 Dec', note: '7 AM · 24°C' },
    { day: 'Sat 26 Dec', note: '7 AM · 23°C' },
  ],
  streets: [
    { rank: 1, name: 'Street 23 · you', kg: 96, mine: true },
    { rank: 2, name: 'Al Barsha South', kg: 71, mine: false },
  ],
};
