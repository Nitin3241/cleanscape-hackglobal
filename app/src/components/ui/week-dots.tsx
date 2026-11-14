import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';

import { standardTiming } from '@/constants/motion';
import { Motion, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WEEKS_IN_YEAR = 52;
const WEEKS_PER_ROW = 26;

type WeekDotsProps = {
  cleanupWeeks: readonly number[];
  thisWeek: number;
  eventWeek: number;
  accessibilityLabel: string;
  /** Starts filling cleanup dots once true. */
  play: boolean;
  /** Milliseconds to wait after `play` turns true. */
  delay: number;
};

/**
 * The year as 52 dots: past weeks, cleanups attended, this week, future weeks and
 * the next event. Cleanup dots fill in from the start of the year to this week.
 */
export function WeekDots({
  cleanupWeeks,
  thisWeek,
  eventWeek,
  accessibilityLabel,
  play,
  delay,
}: WeekDotsProps) {
  const theme = useTheme();

  function dotStyle(week: number) {
    if (week === thisWeek) return { backgroundColor: theme.card, borderColor: theme.brand, borderWidth: 1.5 };
    if (week === eventWeek) return { backgroundColor: theme.secondarySubtle, borderColor: theme.secondary, borderWidth: 1.5 };
    return { backgroundColor: week < thisWeek ? theme.fill : theme.strokeWeak };
  }

  const weeks = Array.from({ length: WEEKS_IN_YEAR }, (_, index) => index + 1);
  const rows = [weeks.slice(0, WEEKS_PER_ROW), weeks.slice(WEEKS_PER_ROW)];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={styles.rows}>
      {rows.map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map((week) => (
            <View key={week} style={[styles.dot, dotStyle(week)]}>
              {cleanupWeeks.includes(week) && (
                <CleanupFill play={play} delay={delay + (week / thisWeek) * Motion.duration.slow} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function CleanupFill({ play, delay }: { play: boolean; delay: number }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const fill = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (!play || reducedMotion) return;
    fill.set(withDelay(delay, standardTiming(1, Motion.duration.fast)));
  }, [delay, fill, play, reducedMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: fill.get(),
    transform: [{ scale: fill.get() }],
  }));

  return <Animated.View style={[styles.fill, { backgroundColor: theme.brand }, fillStyle]} />;
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.oneHalf,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: 4,
  },
});
