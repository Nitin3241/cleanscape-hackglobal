import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { standardTiming } from '@/constants/motion';
import { Motion } from '@/constants/theme';

type FadeUpOptions = {
  delay?: number;
  distance?: number;
  duration?: number;
};

/** Fades content up when it appears. With Reduce Motion it's a plain 150 ms fade. */
export function useFadeUp({
  delay = 0,
  distance = Motion.rise,
  duration = Motion.duration.base,
}: FadeUpOptions = {}) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      reducedMotion
        ? withTiming(1, { duration: Motion.duration.fast })
        : withDelay(delay, standardTiming(1, duration)),
    );
  }, [delay, duration, progress, reducedMotion]);

  return useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: reducedMotion ? 0 : (1 - progress.get()) * distance }],
  }));
}
