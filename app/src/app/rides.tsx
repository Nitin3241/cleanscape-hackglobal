import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { RideCard } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { FigmaLines } from '@/constants/figma-lines';
import { bellXml, carSeatXml, trainXml } from '@/constants/rides-art';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { RIDE_FILTERS, SAMPLE_RIDES } from '@/data/events.sample';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

type RideFilter = (typeof RIDE_FILTERS)[number]['key'];

/** T3: rides near you. T11 when a filter leaves none, T12 for under-18s (trusted drivers only). */
export default function RidesRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const fadeUp = useFadeUp();
  const loading = useSampleLoading();
  const [filters, setFilters] = useState<readonly RideFilter[]>(['near']);
  const [notify, setNotify] = useState(false);
  const under18 = registration.under18;

  const rides = SAMPLE_RIDES.filter(
    (ride) =>
      (!filters.includes('women') || ride.driver.womenOnly) &&
      (!filters.includes('champion') || ride.driver.tier === 'Champion') &&
      (!under18 || ride.driver.tier !== 'New'),
  );

  function toggle(filter: RideFilter) {
    setNotify(false);
    setFilters((current) => (current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter]));
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Find a seat" subtitle="To Kite Beach · Sat 5 Dec" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom + Spacing.four }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {RIDE_FILTERS.map((filter) => (
            <ChoiceChip
              key={filter.key}
              label={filter.label}
              selected={filters.includes(filter.key)}
              onPress={() => toggle(filter.key)}
            />
          ))}
        </ScrollView>

        {rides.length === 0 ? (
          // Figma T11 "Empty": 24 px sides, 14 between everything, centred.
          <Animated.View style={[styles.empty, fadeUp]}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.fill }]}>
              <SvgXml xml={carSeatXml(theme.brand)} width={50} height={50} />
            </View>
            <ThemedText type="screenTitle" accessibilityRole="header" style={[styles.centred, FigmaLines.l30]}>
              {filters.includes('women') ? 'No women-only seats yet' : 'No seats like that yet'}
            </ThemedText>
            <ThemedText type="body14" themeColor="textWeak" style={styles.centred}>
              Most rides from Al Karama are posted 2–3 days before. We&apos;ll ping you the moment one opens.
            </ThemedText>
            {/* Figma T11 "Btn: Notify me": the bell and label sit at the start, not centred (as drawn). */}
            <Tappable
              accessibilityRole="button"
              accessibilityLabel={notify ? "We'll ping you" : 'Notify me about seats'}
              accessibilityState={{ disabled: notify }}
              disabled={notify}
              // Figma T11: Notify me sets the alert and returns to T1 Getting there.
              onPress={() => {
                feedback.play('button.primary');
                setNotify(true);
                router.navigate('/getting-there');
              }}
              style={[styles.notify, { backgroundColor: theme.brand }]}>
              {notify ? (
                <Icon name="check" size={18} color="textOnBrand" />
              ) : (
                <SvgXml xml={bellXml(theme.textOnBrand)} width={18} height={18} />
              )}
              <ThemedText type="buttonPrimary" themeColor="textOnBrand" style={FigmaLines.l23}>
                {notify ? "We'll ping you" : 'Notify me about seats'}
              </ThemedText>
            </Tappable>
            <View style={styles.meanwhile}>
              <View style={[styles.rule, { backgroundColor: theme.strokeWeak }]} />
              <ThemedText type="chip" themeColor="textWeak">
                Meanwhile
              </ThemedText>
              <View style={[styles.rule, { backgroundColor: theme.strokeWeak }]} />
            </View>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Metro + bus, 52 min. Gets you there by 6:40"
              onPress={() => router.push('/transit')}
              style={[
                styles.fallback,
                { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.optionCard },
              ]}>
              <View style={[styles.fallbackTile, { backgroundColor: theme.fill }]}>
                <SvgXml xml={trainXml(theme.brand)} width={20} height={20} />
              </View>
              <View style={styles.flex}>
                <ThemedText type="label" style={FigmaLines.l21}>
                  Metro + bus · 52 min
                </ThemedText>
                <ThemedText type="meta" themeColor="textWeak">
                  Gets you there by 6:40
                </ThemedText>
              </View>
              <Icon name="chevron-end" size={18} color="strokeStrong" strokeWidth={1.125} />
            </Tappable>
            {/* Figma "Button / Tertiary": 48 tall, 15 semibold brand. */}
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Offer seats"
              onPress={() => router.push('/offer-seats')}
              style={styles.tertiary}>
              <ThemedText type="buttonPrimary" themeColor="brand">
                Offer seats
              </ThemedText>
            </Tappable>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.list, fadeUp]}>
            <View style={[styles.hero, under18 && styles.heroUnder18]}>
              <ThemedText type="screenTitle" accessibilityRole="header" style={FigmaLines.l30}>
                {under18 ? `${rides.length} trusted drivers near you` : `${rides.length} rides near you`}
              </ThemedText>
              {under18 ? (
                // Figma T12 "Rule" opens T14. SAMPLE: the tap stands in for the guardian choosing public transport.
                <Tappable
                  accessibilityRole="button"
                  accessibilityLabel="Under 18: only Trusted drivers show up. See what your guardian chose"
                  onPress={() => {
                    registration.answerAsGuardian('transit');
                    router.navigate('/getting-there');
                  }}
                  style={styles.trust}>
                  <Icon name="shield-check" size={14} color="textWeak" strokeWidth={1.5} />
                  {/* Copy as drawn in Figma T12 ("driver", singular). */}
                  <ThemedText type="meta" themeColor="textWeak">
                    Under 18: only Trusted driver show up.
                  </ThemedText>
                </Tappable>
              ) : (
                <View style={styles.trust}>
                  <Icon name="shield-check" size={14} color="textWeak" strokeWidth={1.5} />
                  <ThemedText type="meta" themeColor="textWeak">
                    Every driver is licence-verified
                  </ThemedText>
                </View>
              )}
            </View>
            {rides.map((ride, index) => (
              <Skeleton key={ride.id} loading={loading} order={index} lines="card">
                <RideCard
                  ride={ride}
                  best={index === 0}
                  badge={!under18}
                  onPress={() => router.push({ pathname: '/ride', params: { id: ride.id } })}
                />
              </Skeleton>
            ))}
            {under18 && (
              // Figma T12 "Hidden note": 16 px icon, 8 gap.
              <View style={styles.hidden}>
                <Icon name="eye-off" size={16} color="textWeak" strokeWidth={1.5} />
                <ThemedText type="meta" themeColor="textWeak">
                  1 newer driver hidden for your safety
                </ThemedText>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.one,
  },
  // Figma T3: hero at y 170 (14 under the chips), rides at y 230 (10 under the hero), 14 between rides.
  list: {
    gap: Spacing.threeLess,
    paddingTop: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
  },
  hero: {
    gap: Spacing.half,
    marginBottom: -Spacing.one,
  },
  // Figma T12: 4 between the title and the rule; the rides still start at y 230.
  heroUnder18: {
    gap: Spacing.one,
    marginBottom: -Spacing.oneHalf,
  },
  hidden: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  // Figma T11: the empty state starts at y 176 (the shared chips are 2 px shorter than Figma's, hence 20).
  empty: {
    alignItems: 'center',
    gap: Spacing.threeLess,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.four,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  centred: {
    textAlign: 'center',
  },
  notify: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.threeHalf,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  meanwhile: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  rule: {
    flex: 1,
    height: 1,
  },
  // Figma "Fallback: Metro": 14 padding, 20 radius, 34 px icon tile.
  fallback: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  fallbackTile: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  flex: {
    flex: 1,
  },
  tertiary: {
    alignSelf: 'stretch',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
