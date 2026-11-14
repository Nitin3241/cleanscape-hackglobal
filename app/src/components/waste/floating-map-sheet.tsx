import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Figma "Sheet" on the Know your waste maps (F4·3, F4·6g): floating 8 px from the edges, 32 radius, grabber, a
 * 17 px title and 13 px subtitle, then the place rows.
 */
export function FloatingMapSheet({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.sheet, { backgroundColor: theme.card, bottom: Math.max(insets.bottom, Spacing.two) }]}>
      <View style={[styles.grabber, { backgroundColor: theme.strokeControl }]} />
      <ThemedText style={styles.title} accessibilityRole="header">
        {title}
      </ThemedText>
      <ThemedText style={styles.subtitle} themeColor="textWeak">
        {subtitle}
      </ThemedText>
      <View style={styles.rows}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    paddingTop: 26,
    paddingHorizontal: Spacing.three,
    paddingBottom: 20,
    borderRadius: 32,
    boxShadow: '0px -4px 20px 0px rgba(0, 0, 0, 0.1)',
  },
  grabber: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  // Figma: SemiBold 17 (26) and Regular 13 (20), 24 apart.
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: -2,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  rows: {
    marginTop: 14,
    gap: Spacing.two,
  },
});
