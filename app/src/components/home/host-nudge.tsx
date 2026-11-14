import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { RevealOrder } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { RevealBlock } from '@/components/ui/reveal-block';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { Spacing } from '@/constants/theme';
import { useHomeCopy } from '@/data/home-copy';
import { useTheme } from '@/hooks/use-theme';

/**
 * Figma Home "HostCleanup" (956:13643): Earthy's nudge to host, between Know your waste and the next clean-up.
 * Opens the Litter radar (F10·11).
 */
export function HostNudge({ loading }: { loading: boolean }) {
  const theme = useTheme();
  const copy = useHomeCopy();
  return (
    <RevealBlock loading={loading} order={RevealOrder.sortTiles} radius={18} lines="tile">
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`${copy.hostTitle}. ${copy.hostBody}`}
        onPress={() => router.push('/litter-radar')}
        style={[styles.card, { backgroundColor: theme.fill }]}>
        <EarthyOrb size={36} state="still" glow={false} />
        <View style={styles.text}>
          <ThemedText type="rowTitle" style={FigmaLines.l23}>
            {copy.hostTitle}
          </ThemedText>
          <ThemedText type="caption" themeColor="textWeak" style={FigmaLines.l18}>
            {copy.hostBody}
          </ThemedText>
        </View>
        <Icon name="chevron-end" size={20} color="brand" />
      </Tappable>
    </RevealBlock>
  );
}

const styles = StyleSheet.create({
  // Figma "HostCleanup": 76 tall, 16 × 14 padding, 12 gap, 18 radius, #E6F3F8.
  card: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: 18,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
