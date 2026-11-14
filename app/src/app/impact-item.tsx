import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  EarthyActions,
  EarthyAnswer,
  EarthyAskField,
  EarthyChoices,
  EarthySheetHeader,
} from '@/components/earthy/earthy-sheet-parts';
import { IE2_LABELS, ImpactChart } from '@/components/school/impact-chart';
import { ThemedText } from '@/components/themed-text';
import { RouteSheet } from '@/components/ui/route-sheet';
import { type ThemeColor, Radius, Shadows, Spacing } from '@/constants/theme';
import { MOST_PICKED } from '@/data/impact.sample';
import { useTheme } from '@/hooks/use-theme';

/** IE2 Earthy — Most picked item (sheet), from the "Most picked item?" chip on I1. */
export default function ImpactItemSheet() {
  const theme = useTheme();
  const materials = MOST_PICKED.materials.map((m) => ({ ...m, text: m.text as ThemeColor }));

  return (
    <RouteSheet accessibilityLabel="Earthy: most picked item" fullFromTop={54}>
      <EarthySheetHeader subtitle={MOST_PICKED.subtitle} />
      <EarthyAnswer asked={MOST_PICKED.asked}>
        <ThemedText type="answer14">{MOST_PICKED.answer}</ThemedText>
        {/* The "where do they go" answer and quicker logging aren't designed yet: both say "Coming soon". */}
        <EarthyChoices primary={{ label: MOST_PICKED.choices[0] }} secondary={{ label: MOST_PICKED.choices[1] }} />
      </EarthyAnswer>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.chip }]}>
        <View style={styles.cardHead}>
          <ThemedText type="rowTitle" accessibilityRole="header" style={styles.line23}>
            What you picked up
          </ThemedText>
          <ThemedText type="filterLabel" themeColor="textWeak" style={styles.line18}>
            {MOST_PICKED.total}
          </ThemedText>
        </View>
        <ImpactChart materials={materials} labels={IE2_LABELS} normalLines />
        <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
          {MOST_PICKED.note}
        </ThemedText>
      </View>

      <EarthyActions
        items={[
          { ...MOST_PICKED.more[0] },
          { ...MOST_PICKED.more[1], onPress: () => router.replace('/waste-rvm') },
          { ...MOST_PICKED.more[2] },
        ]}
      />
      <EarthyAskField placeholder="Ask about your year" />
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma "normal" line heights: 15 → 23, 12 → 18.
  line23: {
    lineHeight: 23,
  },
  line18: {
    lineHeight: 18,
  },
  card: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
