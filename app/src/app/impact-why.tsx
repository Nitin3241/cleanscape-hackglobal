import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  EarthyActions,
  EarthyAnswer,
  EarthyAskField,
  EarthyChoices,
  EarthySheetHeader,
} from '@/components/earthy/earthy-sheet-parts';
import { ThemedText } from '@/components/themed-text';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Radius, Spacing } from '@/constants/theme';
import { WHY_MARCH } from '@/data/impact.sample';
import { useTheme } from '@/hooks/use-theme';

/** IE1 Earthy — Why March? (sheet), from the "Why March?" chip on I1. */
export default function ImpactWhySheet() {
  const theme = useTheme();
  return (
    <RouteSheet accessibilityLabel="Earthy: why March" fullFromTop={60}>
      <EarthySheetHeader subtitle={WHY_MARCH.subtitle} />
      <EarthyAnswer asked={WHY_MARCH.asked}>
        <ThemedText type="answer14">{WHY_MARCH.answer}</ThemedText>
        <View style={styles.days}>
          {WHY_MARCH.days.map((day) => (
            <View
              key={day.day}
              style={[styles.day, { backgroundColor: theme.card }]}
              accessible
              accessibilityLabel={`${day.day} March, ${day.place}: ${day.detail}`}>
              <View style={[styles.date, { backgroundColor: theme.tileNeutral }]}>
                <ThemedText type="dateMonth9" themeColor="brand" style={styles.line14}>
                  {day.month}
                </ThemedText>
                <ThemedText type="rowTitle" style={styles.line23}>
                  {day.day}
                </ThemedText>
              </View>
              <View style={styles.flex}>
                <ThemedText type="fieldLabel" style={styles.line20}>
                  {day.place}
                </ThemedText>
                <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
                  {day.detail}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
        {/* Planning December and the "who came most" answer aren't designed yet: both say "Coming soon". */}
        <EarthyChoices primary={{ label: WHY_MARCH.choices[0] }} secondary={{ label: WHY_MARCH.choices[1] }} />
      </EarthyAnswer>
      <EarthyActions
        items={[
          { ...WHY_MARCH.more[0], onPress: () => router.replace('/events') },
          { ...WHY_MARCH.more[1] },
          { ...WHY_MARCH.more[2] },
        ]}
      />
      <EarthyAskField placeholder="Ask about your year" />
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma "normal" line heights: 15 → 23, 13 → 20, 11 → 17.
  line14: {
    lineHeight: 14,
  },
  line23: {
    lineHeight: 23,
  },
  line20: {
    lineHeight: 20,
  },
  line17: {
    lineHeight: 17,
  },
  flex: {
    flex: 1,
  },
  days: {
    gap: Spacing.two,
  },
  day: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
  },
  date: {
    width: 40,
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
});
