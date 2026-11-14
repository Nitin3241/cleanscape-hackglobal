import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HomeTimeline, RevealOrder } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RevealBlock } from '@/components/ui/reveal-block';
import { SectionTitle } from '@/components/ui/section-title';
import { WeekDots } from '@/components/ui/week-dots';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHomeCopy } from '@/data/home-copy';

type ImpactSectionProps = {
  collectedKg: number;
  goalKg: number;
  summary: string;
  toBadge: string;
  year: string;
  cleanupWeeks: readonly number[];
  thisWeek: number;
  eventWeek: number;
  loading: boolean;
  /** Figma "01 Home — event day" (786:12402): Details opens F7·1 Smileys instead of the impact page. */
  eventDay?: boolean;
};

export function ImpactSection({
  collectedKg,
  goalKg,
  summary,
  toBadge,
  year,
  cleanupWeeks,
  thisWeek,
  eventWeek,
  loading,
  eventDay = false,
}: ImpactSectionProps) {
  const theme = useTheme();
  const copy = useHomeCopy();

  return (
    <View style={styles.section}>
      <SectionTitle
        title={copy.impactTitle}
        actionLabel={copy.details}
        actionAccessibilityLabel="Your impact details"
        onAction={() => router.push(eventDay ? '/smileys' : '/impact')}
      />
      <RevealBlock loading={loading} order={RevealOrder.impact} radius={Radius.panel} lines="wide">
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <View style={styles.hero}>
            <View style={styles.numbers}>
              <View accessible accessibilityLabel={`${collectedKg} of ${goalKg} kilograms`} style={styles.amount}>
                <ThemedText type="numeral">{collectedKg}</ThemedText>
                <ThemedText type="unit" themeColor="textWeak">
                  {copy.kgUnit(goalKg)}
                </ThemedText>
              </View>
              <ThemedText type="bodyMedium">{copy.collected}</ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                {summary}
              </ThemedText>
            </View>
            <View style={styles.ring}>
              <ProgressRing progress={collectedKg / goalKg} play={!loading} delay={HomeTimeline.impactRing} />
              <ThemedText type="ringCaption" themeColor="textWeak">
                {toBadge}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />

          <View style={styles.year}>
            <ThemedText type="labelSmall">{copy.yourYear(year)}</ThemedText>
            <WeekDots
              cleanupWeeks={cleanupWeeks}
              thisWeek={thisWeek}
              eventWeek={eventWeek}
              play={!loading}
              delay={HomeTimeline.impactRing}
              accessibilityLabel={`${cleanupWeeks.length} cleanups so far this year. This is week ${thisWeek} of 52, and your next event is in week ${eventWeek}.`}
            />
            <ThemedText type="micro" themeColor="textWeak">
              {copy.dotsKey}
            </ThemedText>
          </View>
        </View>
      </RevealBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  card: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: 18,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  numbers: {
    flexShrink: 1,
    gap: Spacing.half,
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  ring: {
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  divider: {
    height: 1,
  },
  year: {
    gap: Spacing.twoHalf,
  },
});
