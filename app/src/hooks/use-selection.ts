import { useEffect } from 'react';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { joySpring, standardTiming } from '@/constants/motion';
import { Motion } from '@/constants/theme';

/** 0 to 1 as something is selected, for ticks and dots: a fast spring, or a fade with Reduce Motion. */
export function useSelection(selected: boolean) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(selected ? 1 : 0);
  const target = selected ? 1 : 0;

  useEffect(() => {
    progress.set(
      reducedMotion
        ? withTiming(target, { duration: Motion.duration.fast })
        : joySpring(target, Motion.duration.fast),
    );
  }, [progress, reducedMotion, target]);

  return progress;
}

/** 0 to 1 as something is selected, for borders and fills: a 150 ms tween. */
export function useSelectionTween(selected: boolean) {
  const progress = useSharedValue(selected ? 1 : 0);
  const target = selected ? 1 : 0;

  useEffect(() => {
    progress.set(standardTiming(target, Motion.duration.fast));
  }, [progress, target]);

  return progress;
}
