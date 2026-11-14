import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { goalChartXml } from '@/constants/illustrations';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { GOAL } from '@/data/proactive.sample';
import { useTheme } from '@/hooks/use-theme';

const SHARE_TEXT = `Al Barsha is at ${GOAL.kg} of ${GOAL.target} kg before the New Year. Join a clean-up on CleanScape.`;
/** Figma "Milestone track" geometry: 288 wide, fill 180, dots and labels at fixed x. */
const TRACK = 288;
const TRACK_FILL = 180;
const MILESTONES = [
  { dot: 137, label: 135 },
  { dot: 223, label: 220 },
  { dot: 274, label: 253 },
];

const share = () => Share.share({ message: SHARE_TEXT }).catch(() => {});

/**
 * F10·14 Neighbourhood goal: the area's shared target, whether this pace gets there, and Earthy's
 * suggestion to close the gap. Co-host drafts a clean-up (F10·10).
 */
export default function NeighbourhoodGoalRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState(0);
  const topKg = GOAL.streets[0].kg;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader
        title={GOAL.title}
        subtitle={GOAL.subtitle}
        centred
        action={{ icon: 'share', label: 'Share the goal', onPress: share }}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 88 + insets.bottom + Spacing.three }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.goal, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.card }]}>
          <ThemedText type="tag" themeColor="brand" style={[styles.caps, styles.line17]}>
            {GOAL.label}
          </ThemedText>
          <View style={styles.kgRow}>
            <View style={styles.kgLeft} accessible accessibilityLabel={`${GOAL.kg} of ${GOAL.target} kilograms`}>
              <ThemedText type="busTime" style={styles.kg}>{`${GOAL.kg} kg`}</ThemedText>
              <ThemedText type="hint" themeColor="textWeak" style={styles.line21}>{`of ${GOAL.target}`}</ThemedText>
            </View>
            <View style={[styles.days, { backgroundColor: theme.secondarySubtle }]}>
              <ThemedText type="dateline" themeColor="textPaper">{`${GOAL.daysLeft} days left`}</ThemedText>
            </View>
          </View>
          {/* Figma "Milestone track": 288 × 34; dots at 137 / 223 / 274, labels under them. */}
          <View
            style={styles.track}
            accessible
            accessibilityLabel={`Milestones: ${GOAL.milestones.join(', ')} kg. ${GOAL.milestones[0]} reached.`}>
            <View style={[styles.trackBar, { width: TRACK, backgroundColor: theme.fill }]} />
            <View style={[styles.trackBar, { width: TRACK_FILL, backgroundColor: theme.brand }]} />
            {GOAL.milestones.map((kg, index) => {
              const reached = GOAL.kg >= kg;
              return (
                <View key={kg}>
                  <View
                    style={[
                      styles.milestoneDot,
                      { left: MILESTONES[index].dot },
                      reached
                        ? { backgroundColor: theme.statusSuccess, borderColor: theme.card }
                        : { backgroundColor: theme.card, borderColor: theme.strokeStrong },
                    ]}
                  />
                  <ThemedText
                    type="micro10Medium"
                    themeColor={reached ? 'statusSuccess' : 'textWeak'}
                    style={[styles.milestoneLabel, { left: MILESTONES[index].label }]}>
                    {index === GOAL.milestones.length - 1 ? `${kg} kg` : `${kg}`}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.forecast, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <View style={styles.between}>
            <ThemedText type="labelMedium14" style={styles.line21}>
              At this pace
            </ThemedText>
            <ThemedText
              type="dateline"
              themeColor="textAccent">{`${GOAL.pace.projected} kg · ${GOAL.pace.short} kg short`}</ThemedText>
          </View>
          <View
            accessible
            accessibilityLabel={`So far ${GOAL.kg} kg. At this pace ${GOAL.pace.projected} kg, ${GOAL.pace.short} short of ${GOAL.target}.`}>
            <SvgXml xml={goalChartXml} width={290} height={80} />
          </View>
        </View>

        <View style={[styles.plan, { backgroundColor: theme.fill }]}>
          <View style={styles.planText}>
            <EarthyOrb size={22} state="still" glow={false} />
            <ThemedText type="meta" style={styles.planCopy}>
              {GOAL.suggestion}
            </ThemedText>
          </View>
          <View style={styles.dates} accessibilityRole="radiogroup">
            {GOAL.dates.map((option, index) => {
              const on = date === index;
              return (
                <Tappable
                  key={option.day}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${option.day}, ${option.note}`}
                  onPress={() => setDate(index)}
                  style={[
                    styles.date,
                    on
                      ? { backgroundColor: theme.brand, borderColor: theme.brand }
                      : { backgroundColor: theme.card, borderColor: theme.strokeChip },
                  ]}>
                  <ThemedText type="labelSmall" themeColor={on ? 'textOnBrand' : 'textStrong'} style={styles.line20}>
                    {option.day}
                  </ThemedText>
                  <ThemedText type="micro11" themeColor={on ? 'timeNoteOnBrand' : 'textWeak'} style={styles.line17}>
                    {option.note}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>

        <View style={styles.streets}>
          <View style={[styles.between, styles.top]}>
            <ThemedText type="labelMedium14" accessibilityRole="header" style={styles.line21}>
              Top streets
            </ThemedText>
            {/* The full street table isn't designed yet. */}
            <ThemedText type="chip" themeColor="brand">
              See all
            </ThemedText>
          </View>
          {GOAL.streets.map((street) => (
            <View
              key={street.name}
              style={[styles.street, street.mine && { backgroundColor: theme.secondarySubtle }]}
              accessible
              accessibilityLabel={`${street.rank}. ${street.name}, ${street.kg} kilograms`}>
              <ThemedText
                type="labelSmall"
                themeColor={street.mine ? 'textPaper' : 'textWeak'}
                style={styles.line20}>{`${street.rank}`}</ThemedText>
              <View style={[styles.flex, styles.streetText]}>
                <ThemedText type="fieldLabel" style={styles.line20}>
                  {street.name}
                </ThemedText>
                {/* Figma bars: 180 px for the top street, the rest in proportion. */}
                <View
                  style={[
                    styles.streetBar,
                    { width: (street.kg / topKg) * 180, backgroundColor: street.mine ? theme.secondary : theme.timeNoteOnBrand },
                  ]}
                />
              </View>
              <ThemedText type="labelSmall" style={styles.line20}>{`${street.kg} kg`}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bar,
          { backgroundColor: theme.card, borderTopColor: theme.dividerSoft, paddingBottom: Math.max(insets.bottom, 28) },
        ]}>
        <View style={styles.flex}>
          <Button label="Invite" variant="secondary" flat onPress={share} />
        </View>
        <View style={styles.flex}>
          <Button label="Co-host" flat onPress={() => router.replace('/cleanup-draft')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma "Body": from y 104, 16 px sides, 10 gap.
  content: {
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  top: {
    alignItems: 'flex-start',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Figma "normal" line heights: 14 → 21, 13 → 20, 11 → 17; 32 → 48.
  line21: {
    lineHeight: 21,
  },
  line20: {
    lineHeight: 20,
  },
  line17: {
    lineHeight: 17,
  },
  // Figma "312 kg": 32 semibold (no 32 px token).
  kg: {
    fontSize: 32,
    lineHeight: 48,
  },
  caps: {
    letterSpacing: 0.66,
  },
  // Figma "Goal card": 22 radius, 16 × 14 padding, 8 gap.
  goal: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: 22,
  },
  kgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  kgLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.oneHalf,
  },
  days: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  track: {
    width: TRACK,
    height: 34,
  },
  trackBar: {
    position: 'absolute',
    top: 6,
    height: 8,
    borderRadius: 4,
  },
  milestoneDot: {
    position: 'absolute',
    top: 3,
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 7,
  },
  milestoneLabel: {
    position: 'absolute',
    top: 20,
    lineHeight: 15,
  },
  // Figma "Forecast": 20 radius, 14 × 12 padding, 8 gap.
  forecast: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  // Figma "Earthy plan": 18 radius, 14 × 12 padding, 10 gap.
  plan: {
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: 18,
  },
  // Figma sets the suggestion 254 px wide, so it breaks after "Al Barsha".
  planCopy: {
    width: 254,
  },
  planText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
  },
  dates: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  date: {
    flex: 1,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  streets: {
    gap: Spacing.oneHalf,
  },
  street: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  streetText: {
    gap: Spacing.one,
  },
  streetBar: {
    height: 5,
    borderRadius: 3,
  },
  // Figma "Bottom bar": 88 tall, 12 / 28 padding, 1 px top edge.
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
});
