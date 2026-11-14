import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Shimmer } from '@/components/ui/reveal-block';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Figma F10·11s "Skeleton" (887:12953): the spot sheet while Earthy ranks spots. Two title bars, then a card
 * with the rank tile, two name lines, two reason lines and three stat blocks. One shimmer sweeps the lot.
 */
export function RadarSkeleton() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const block = { backgroundColor: theme.skeleton };
  const line = { backgroundColor: theme.skeletonLine };

  return (
    <View style={styles.wrap} accessible accessibilityLabel="Finding spots" accessibilityRole="progressbar">
      <View style={[styles.titleBar, block]} />
      <View style={[styles.subtitleBar, block]} />
      <View style={[styles.card, block]}>
        <View style={styles.top}>
          <View style={[styles.rank, block]} />
          <View style={styles.name}>
            <View style={[styles.nameLine, block]} />
            <View style={[styles.placeLine, block]} />
          </View>
        </View>
        <View style={[styles.reasonLong, line]} />
        <View style={[styles.reasonShort, line]} />
        <View style={styles.stats}>
          <View style={[styles.stat, block]} />
          <View style={[styles.stat, block]} />
          <View style={[styles.stat, block]} />
        </View>
      </View>
      {!reducedMotion && (
        <View style={styles.shimmer} pointerEvents="none">
          <Shimmer />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma "Skeleton": 312 × 240 at x 24, 12 gap; 16 in from the sheet's edge.
  wrap: {
    gap: Spacing.twoThreeQuarters,
    marginHorizontal: Spacing.two,
    overflow: 'hidden',
  },
  titleBar: {
    width: 200,
    height: 22,
    borderRadius: Radius.control - 2,
  },
  subtitleBar: {
    width: 150,
    height: 14,
    borderRadius: Radius.control - 2,
  },
  // Figma "Card skeleton": 180 tall, 20 radius, 16 padding, 12 gap.
  card: {
    height: 180,
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  rank: {
    width: 40,
    height: 40,
    borderRadius: Radius.small,
  },
  name: {
    gap: Spacing.oneHalf,
  },
  nameLine: {
    width: 120,
    height: 16,
    borderRadius: Radius.control - 2,
  },
  placeLine: {
    width: 90,
    height: 12,
    borderRadius: Radius.control - 2,
  },
  reasonLong: {
    width: 280,
    height: 12,
    borderRadius: Radius.control - 2,
  },
  reasonShort: {
    width: 220,
    height: 12,
    borderRadius: Radius.control - 2,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    width: 88,
    height: 48,
    borderRadius: Radius.small,
  },
  shimmer: {
    ...StyleSheet.absoluteFill,
  },
});
