import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyChip, EarthyNote, TileRows } from '@/components/host/earthy-note';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { type SkeletonBlock, SkeletonBlocks } from '@/components/ui/skeleton-blocks';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import {
  CLEANUP_WEEKS,
  IMPACT_EMPTY,
  IMPACT_YEAR,
  MEMORY_WEEK,
  MONTH_LETTERS,
  MONTH_WEEKS,
  THIS_WEEK,
} from '@/data/impact.sample';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';

/** Figma I0 (939:13387): hero, insight, stats, your year, pace coach, more, host nudge. */
const SKELETON: readonly SkeletonBlock[] = [
  { height: 142, bar: true },
  { height: 76, lines: 2 },
  { height: 102 },
  { height: 237, bar: true },
  { height: 76, lines: 2 },
  { height: 241, bar: true },
  { height: 76, lines: 2 },
];

const SHARE_MESSAGE = `My ${IMPACT_YEAR.year} on CleanScape: ${IMPACT_YEAR.collectedKg} kg collected, ${IMPACT_YEAR.summary}.`;

/**
 * I1 My impact — the year so far. Opens on the I0 skeleton for 1.2 s. From Home's impact card "Details".
 * SAMPLE: the numbers are Figma's.
 */
export default function ImpactRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const loading = useSampleLoading();
  // I6: the empty state before the first clean-up, opened from Demo branches (/impact?empty=1).
  const empty = useLocalSearchParams<{ empty?: string }>().empty === '1';
  const collected = empty ? 0 : IMPACT_YEAR.collectedKg;
  const insight = empty ? IMPACT_EMPTY.insight : IMPACT_YEAR.insight;
  const pace = empty ? IMPACT_EMPTY.pace : IMPACT_YEAR.pace;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader
        title="My impact"
        subtitle={`${IMPACT_YEAR.year} · Jan to Dec`}
        centred
        action={{
          icon: 'share',
          label: 'Share my year',
          onPress: () => Share.share({ message: SHARE_MESSAGE }).catch(() => {}),
        }}
      />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}>
        {loading ? (
          <SkeletonBlocks blocks={SKELETON} />
        ) : (
          <>
            <Skeleton loading={loading} order={0} radius={24}>
              <View style={[styles.card, styles.hero, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
                <View style={styles.numbers}>
                  <View style={styles.amount} accessible accessibilityLabel={`${collected} of ${IMPACT_YEAR.goalKg} kilograms`}>
                    <ThemedText type="numeral">{collected}</ThemedText>
                    <ThemedText type="unit" themeColor="textWeak">{`/${IMPACT_YEAR.goalKg} kg`}</ThemedText>
                  </View>
                  <ThemedText type="fieldLabel" style={styles.tight}>
                    Collected this year
                  </ThemedText>
                  <ThemedText type="meta" themeColor="textWeak">
                    {empty ? IMPACT_EMPTY.summary : IMPACT_YEAR.summary}
                  </ThemedText>
                </View>
                <View style={styles.ringWrap}>
                  <ProgressRing progress={collected / IMPACT_YEAR.goalKg} play={!loading} delay={200} />
                  <ThemedText type="micro11" themeColor="textWeak" style={styles.ringNote}>
                    {empty ? IMPACT_EMPTY.badgeNote : IMPACT_YEAR.badgeNote}
                  </ThemedText>
                </View>
              </View>
            </Skeleton>

            <Skeleton loading={loading} order={1} radius={Radius.large} lines="card">
              <EarthyNote title={insight.title} body={insight.body}>
                <View style={styles.chips}>
                  {empty ? (
                    // Earthy's answers for a first-timer aren't designed yet: both chips say "Coming soon".
                    IMPACT_EMPTY.chips.map((chip) => <EarthyChip key={chip} label={chip} />)
                  ) : (
                    <>
                      <EarthyChip label="Why March?" onPress={() => router.push('/impact-why')} />
                      <EarthyChip label="Most picked item?" onPress={() => router.push('/impact-item')} />
                    </>
                  )}
                </View>
              </EarthyNote>
            </Skeleton>

            {!empty && (
              <Skeleton loading={loading} order={2} radius={24} lines="tile">
                <View style={[styles.card, styles.stats, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
                  {IMPACT_YEAR.stats.map((stat, index) => (
                    <View
                      key={stat.label}
                      style={[
                        styles.stat,
                        index < IMPACT_YEAR.stats.length - 1 && { borderEndWidth: 1, borderEndColor: theme.strokeWeak },
                      ]}
                      accessible
                      accessibilityLabel={`${stat.value} ${stat.label}`}>
                      <Icon name={stat.icon as IconName} size={stat.icon === 'pin' ? 14 : 16} color="brand" strokeWidth={1.8} />
                      <ThemedText type="cardTitle" style={styles.statValue}>
                        {stat.value}
                      </ThemedText>
                      <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
                        {stat.label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </Skeleton>
            )}

            <View>
              <ThemedText type="sectionTitle" accessibilityRole="header">
                {`Your ${IMPACT_YEAR.year}`}
              </ThemedText>
              <Skeleton loading={loading} order={3} radius={24} lines="card">
                <YearCard empty={empty} />
              </Skeleton>
            </View>

            <EarthyNote title={pace.title} body={pace.body}>
              <View style={[styles.events, { backgroundColor: theme.card }]}>
                {IMPACT_YEAR.pace.events.map((event, index) => (
                  <Tappable
                    key={event.place}
                    accessibilityRole="button"
                    accessibilityLabel={`${event.place}, ${event.day} ${event.month}, ${event.when}`}
                    onPress={() => router.push('/event-detail')}
                    style={[styles.event, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
                    <View style={[styles.dateTile, { backgroundColor: theme.tileNeutral }]}>
                      <ThemedText type="micro10Medium" themeColor="brand">
                        {event.month}
                      </ThemedText>
                      <ThemedText type="rankNumber">{event.day}</ThemedText>
                    </View>
                    <View style={styles.flex}>
                      <ThemedText type="bodyMedium14">{event.place}</ThemedText>
                      <ThemedText type="caption" themeColor="textWeak">
                        {event.when}
                      </ThemedText>
                    </View>
                    <Icon name="chevron-end" size={16} color="brand" strokeWidth={2} />
                  </Tappable>
                ))}
              </View>
            </EarthyNote>

            {!empty && (
              <>
                <View>
                  <ThemedText type="sectionTitle" accessibilityRole="header">
                    More from your year
                  </ThemedText>
                  <TileRows
                    rows={[
                      { ...IMPACT_YEAR.more.hours, icon: 'badge-check', onPress: () => router.push('/impact-hours') },
                      { ...IMPACT_YEAR.more.goal, icon: 'map', onPress: () => router.push('/neighbourhood-goal') },
                      { ...IMPACT_YEAR.more.story, icon: 'play', onPress: () => router.push('/impact-story') },
                    ]}
                  />
                </View>

                <Tappable
                  accessibilityRole="button"
                  accessibilityLabel={`${IMPACT_YEAR.hostNudge.title}. ${IMPACT_YEAR.hostNudge.body}`}
                  onPress={() => router.push('/litter-radar')}
                  style={[styles.nudge, { backgroundColor: theme.fill }]}>
                  <EarthyOrb size={36} state="still" glow={false} />
                  <View style={styles.flex}>
                    <ThemedText type="rowTitle">{IMPACT_YEAR.hostNudge.title}</ThemedText>
                    <ThemedText type="caption" themeColor="textWeak">
                      {IMPACT_YEAR.hostNudge.body}
                    </ThemedText>
                  </View>
                  <Icon name="chevron-end" size={20} color="brand" strokeWidth={2} />
                </Tappable>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

/** The 52-week dot grid: filled = a clean-up, ringed marigold = this week, outlined = still to come. */
function YearCard({ empty }: { empty: boolean }) {
  const theme = useTheme();
  // First week number of each month (1-based), so each dot knows its week without counting during render.
  const firsts = MONTH_WEEKS.map((_, month) => 1 + MONTH_WEEKS.slice(0, month).reduce((sum, n) => sum + n, 0));
  return (
    <View style={[styles.card, styles.year, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
      <View style={styles.grid}>
        {MONTH_WEEKS.map((weeks, month) => (
          <View key={month} style={styles.column}>
            <View style={styles.dots}>
              {Array.from({ length: weeks }, (_, row) => {
                const n = firsts[month] + row;
                const filled = !empty && CLEANUP_WEEKS.includes(n);
                const current = n === THIS_WEEK;
                const future = n > THIS_WEEK;
                const style = [
                  styles.dot,
                  filled && { backgroundColor: theme.brand },
                  !filled && !current && !future && { backgroundColor: theme.tileNeutral },
                  current && { borderWidth: 2.5, borderColor: theme.heatMedium, backgroundColor: theme.card },
                  future && { borderWidth: 1.5, borderColor: theme.strokeWeak, backgroundColor: theme.card },
                ];
                return filled && n === MEMORY_WEEK ? (
                  <Tappable
                    key={n}
                    accessibilityRole="button"
                    accessibilityLabel={`Week ${n}: clean-up. See that day`}
                    hitSlop={5}
                    onPress={() => router.push('/impact-week')}
                    style={style}
                  />
                ) : (
                  <View key={n} style={style} />
                );
              })}
            </View>
            <ThemedText type="micro10Medium" themeColor="textWeak" style={styles.letter}>
              {MONTH_LETTERS[month]}
            </ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.brand }]} />
          <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
            Clean-up
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { borderWidth: 2, borderColor: theme.heatMedium, backgroundColor: theme.card }]} />
          <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
            This week
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
        {empty ? IMPACT_EMPTY.gridNote : 'Tap a filled dot to see that day.'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  numbers: {
    gap: Spacing.half,
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  tight: {
    lineHeight: 18,
  },
  ringWrap: {
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  ringNote: {
    lineHeight: 14,
  },
  // Figma "Follow-ups" is centred and may run wider than the card's padding (I6: 309 in a 296 column).
  chips: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginHorizontal: -Spacing.three,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
  },
  // Figma "normal" line heights: 18 → 27, 11 → 17, 12 → 18.
  statValue: {
    lineHeight: 27,
  },
  line17: {
    lineHeight: 17,
  },
  line18: {
    lineHeight: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  year: {
    gap: Spacing.threeLess,
    padding: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5.25,
  },
  column: {
    width: 14,
    alignItems: 'center',
  },
  dots: {
    height: 94,
    gap: Spacing.oneHalf,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  letter: {
    marginTop: 7,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  events: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    borderRadius: Radius.medium,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
  },
  dateTile: {
    width: 44,
    alignItems: 'center',
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  nudge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.large,
  },
});
