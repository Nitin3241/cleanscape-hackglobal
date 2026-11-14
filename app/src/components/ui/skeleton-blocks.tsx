import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Shimmer } from '@/components/ui/reveal-block';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SkeletonBlock = {
  height: number;
  /** Three lines (120, 250, 190) or two (120, 250). */
  lines?: 2 | 3;
  /** A 280 × 24 bar 16 px above the bottom edge (stands in for a strip or a list). */
  bar?: boolean;
};

/**
 * A page skeleton made of grey 24-radius blocks, each with white placeholder lines 24 px in, and a shimmer
 * sweeping every block (Figma I0 "Skeleton · …" pattern).
 */
export function SkeletonBlocks({ blocks, gap = Spacing.four }: { blocks: readonly SkeletonBlock[]; gap?: number }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const line = { backgroundColor: theme.skeletonLine };

  return (
    <View style={{ gap }} accessible accessibilityRole="progressbar" accessibilityLabel="Loading">
      {blocks.map((block, index) => (
        <View key={index} style={[styles.block, { height: block.height, backgroundColor: theme.skeleton }]}>
          <View style={[styles.title, line]} />
          <View style={[styles.long, line]} />
          {(block.lines ?? 3) === 3 && <View style={[styles.short, line]} />}
          {block.bar && <View style={[styles.bar, line]} />}
          {!reducedMotion && <Shimmer />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  // Figma "skeleton/line": 120 × 12 at (24, 20), 250 × 10 at (24, 44), 190 × 10 at (24, 62).
  title: {
    position: 'absolute',
    start: Spacing.four,
    top: 20,
    width: 120,
    height: 12,
    borderRadius: 6,
  },
  long: {
    position: 'absolute',
    start: Spacing.four,
    top: 44,
    width: 250,
    height: 10,
    borderRadius: 5,
  },
  short: {
    position: 'absolute',
    start: Spacing.four,
    top: 62,
    width: 190,
    height: 10,
    borderRadius: 5,
  },
  bar: {
    position: 'absolute',
    start: Spacing.four,
    bottom: Spacing.three,
    width: 280,
    height: 24,
    borderRadius: 12,
  },
});
