import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { calloutCaretXml } from '@/constants/plastic-art';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Figma Map/Pin callout size: a 184 × 82 card with an 8 px caret, its point 92 px above the pin's top. */
export const CALLOUT = { width: 184, height: 82, abovePin: 92 };

/**
 * Figma Map/Pin (Expanded) card, F4·3 and F4·6g: a white 184 × 82 card with a coloured accent bar, the place, what
 * it takes and how far, and a caret pointing down at the pin. Position it with `style`.
 */
export function MapCallout({
  title,
  takes,
  distance,
  accent,
  distanceColor,
  below = false,
}: {
  title: string;
  takes: string;
  distance: string;
  accent: string;
  distanceColor: string;
  /** Sits under the pin with the caret on top, for a pin too near the top of the map to fit the card above it. */
  below?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={below && styles.below}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <View style={styles.text}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.takes} themeColor="textWeak">
            {takes}
          </ThemedText>
          <ThemedText style={[styles.distance, { color: distanceColor }]}>{distance}</ThemedText>
        </View>
      </View>
      <SvgXml xml={calloutCaretXml} width={16} height={8} style={[styles.caret, below && styles.caretBelow]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CALLOUT.width,
    height: CALLOUT.height,
    borderRadius: 16,
    boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.18)',
  },
  accent: {
    position: 'absolute',
    left: 14,
    top: 14,
    width: 4,
    height: 54,
    borderRadius: 2,
  },
  text: {
    position: 'absolute',
    left: 28,
    top: 10,
  },
  // Figma: 14 / 12 / 11 with "normal" line heights (21, 18, 17), at y 10, 32, 54.
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 1,
  },
  takes: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.one,
  },
  distance: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    lineHeight: 17,
  },
  caret: {
    position: 'absolute',
    left: (CALLOUT.width - 16) / 2,
    top: CALLOUT.height - 2,
  },
  // Under the pin: 6 px of room above the card for the caret, which points up.
  below: {
    paddingTop: 6,
  },
  caretBelow: {
    top: 0,
    transform: [{ rotate: '180deg' }],
  },
});
