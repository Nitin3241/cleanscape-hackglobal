import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GradientBarProps = {
  /** From 0 to 1. */
  progress: number;
  /** Left to right, as in Figma. */
  colors: readonly [string, string, ...string[]];
  label: string;
  height?: number;
  /** Colour of the empty part (Figma F9v2·13 uses white). */
  track?: ThemeColor;
  /** Run the gradient top to bottom across the bar's height. */
  vertical?: boolean;
  /**
   * Figma's 135° linear gradient on the fill's own box (F9v2·13 headcount): the line runs corner to corner,
   * from 14% to 86% of the way, so it changes both along and across the bar.
   */
  diagonal?: boolean;
  /** Where each colour sits, from 0 to 1 (defaults to evenly spaced). */
  locations?: readonly [number, number, ...number[]];
};

const DIRECTIONS = {
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  vertical: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  diagonal: { start: { x: 1 / 7, y: 1 / 7 }, end: { x: 6 / 7, y: 6 / 7 } },
} as const;

/** A progress bar with a gradient fill on the pale brand track (Figma F3·7 and F3·8c). */
export function GradientBar({
  progress,
  colors,
  label,
  height = 8,
  track = 'fill',
  vertical = false,
  diagonal = false,
  locations,
}: GradientBarProps) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: theme[track] }]}>
      <LinearGradient
        colors={colors}
        locations={locations}
        {...DIRECTIONS[diagonal ? 'diagonal' : vertical ? 'vertical' : 'horizontal']}
        style={[styles.fill, { width: `${clamped * 100}%`, borderRadius: height / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
