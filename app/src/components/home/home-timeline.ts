import { Motion } from '@/constants/theme';

/** The order blocks enter in, from the Figma motion spec. */
export const RevealOrder = {
  ticket: 0,
  sortTiles: 1,
  nextCleanup: 2,
  impact: 3,
  nearYou: 4,
} as const;

function revealEnd(order: number) {
  return order * Motion.stagger + Motion.duration.base;
}

/** When each later step starts, counted from the moment loading finishes. */
export const HomeTimeline = {
  flipClock: Motion.duration.celebrate,
  impactRing: revealEnd(RevealOrder.impact),
  unreadDot: revealEnd(RevealOrder.impact) + Motion.duration.slow + Motion.duration.fast,
} as const;
