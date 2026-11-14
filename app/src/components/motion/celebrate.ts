import { Easing, FadeInDown } from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

/**
 * Celebration entrances (Figma MOTION STATE frames "· enter A" → "· enter B" → final, 9 Nov 2026):
 * beat 1, the hero and headline fade in and rise 16 px over 350 ms; beat 2, the text, cards and
 * buttons rise 12 px over 450 ms while the confetti falls 80 px. Both use the same ease-out curve.
 * Reanimated skips these when the phone's Reduce Motion is on.
 */
export const CELEBRATE = {
  beatOne: { duration: 350, rise: 16 },
  beatTwo: { duration: 450, rise: 12 },
  confettiFall: 80,
} as const;

const [x1, y1, x2, y2] = Motion.transition.push.easing;
export const CELEBRATE_EASING = Easing.bezier(x1, y1, x2, y2);

/** Beat 1: hero and headline. */
export const beatOne = () =>
  FadeInDown.duration(CELEBRATE.beatOne.duration)
    .easing(CELEBRATE_EASING)
    .withInitialValues({ opacity: 0, transform: [{ translateY: CELEBRATE.beatOne.rise }] });

/** Beat 2: everything else, together, starting once beat 1 has landed. */
export const beatTwo = () =>
  FadeInDown.delay(CELEBRATE.beatOne.duration)
    .duration(CELEBRATE.beatTwo.duration)
    .easing(CELEBRATE_EASING)
    .withInitialValues({ opacity: 0, transform: [{ translateY: CELEBRATE.beatTwo.rise }] });
