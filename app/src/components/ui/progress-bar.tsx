import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { Motion, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** From 0 to 1. */
  progress: number;
  /** Read out by screen readers, such as "14 of 20 hours". */
  label: string;
  tone?: ThemeColor;
  /** The unfilled part. F3 class cards use the pale brand fill. */
  trackTone?: ThemeColor;
  height?: number;
};

/** Horizontal progress. The fill slides in with a transform rather than a width change. */
export function ProgressBar({ progress, label, tone = 'brand', trackTone = 'track', height = 8 }: ProgressBarProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const value = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    value.set(withTiming(clamped, { duration: reducedMotion ? 0 : Motion.duration.celebrate }));
  }, [clamped, reducedMotion, value]);

  const fillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (value.get() - 1) * width }] }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: theme[trackTone] }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme[tone] }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
});
