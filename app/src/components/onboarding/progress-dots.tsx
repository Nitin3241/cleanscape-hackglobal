import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { joySpring, standardTiming } from '@/constants/motion';
import { Motion, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DOT = 6;
const ACTIVE_WIDTH = 20;

type ProgressDotsProps = {
  count: number;
  active: number;
  /** Used by the welcome carousel, whose pill moves on the joy spring. */
  spring?: boolean;
  accessibilityLabel: string;
};

/** A row of dots with a stretched pill on the current one. Earlier steps stay filled, except on the carousel. */
export function ProgressDots({ count, active, spring = false, accessibilityLabel }: ProgressDotsProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} isActive={index === active} isPast={!spring && index < active} spring={spring} />
      ))}
    </View>
  );
}

function Dot({ isActive, isPast, spring }: { isActive: boolean; isPast: boolean; spring: boolean }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const width = useSharedValue(isActive ? 1 : 0);
  const fill = useSharedValue(isActive || isPast ? 1 : 0);

  useEffect(() => {
    const target = isActive ? 1 : 0;
    const filled = isActive || isPast ? 1 : 0;
    if (reducedMotion) {
      width.set(withTiming(target, { duration: Motion.duration.fast }));
    } else if (spring) {
      width.set(joySpring(target, Motion.duration.slow));
    } else {
      width.set(standardTiming(target, Motion.duration.base));
    }
    fill.set(withTiming(filled, { duration: Motion.duration.fast }));
  }, [fill, isActive, isPast, reducedMotion, spring, width]);

  const dotStyle = useAnimatedStyle(() => ({
    width: DOT + Math.max(width.get(), 0) * (ACTIVE_WIDTH - DOT),
    backgroundColor: interpolateColor(fill.get(), [0, 1], [theme.strokeWeak, theme.brand]),
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  dot: {
    height: DOT,
    borderRadius: DOT / 2,
  },
});
