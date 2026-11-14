import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OptionCard } from '@/components/events/option-card';
import { RideCard } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { TextButton } from '@/components/ui/text-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spacing, TabBarHeight } from '@/constants/theme';
import { RIDE_FILTERS, SAMPLE_RIDES } from '@/data/events.sample';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useSampleLoading } from '@/hooks/use-sample-loading';
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
          <View style={styles.empty}>
            <EmptyState
              art={
                <View style={[styles.emptyIcon, { backgroundColor: theme.fill }]}>
                  <Icon name="seat" size={40} color="brand" strokeWidth={1.5} />
                </View>
              }
              title={filters.includes('women') ? 'No women-only seats yet' : 'No seats like that yet'}
              body="Most rides from Al Karama are posted 2–3 days before. We'll ping you the moment one opens.">
              <View style={styles.emptyActions}>
                <Button
                  label={notify ? "We'll ping you" : 'Notify me about seats'}
                  icon={notify ? 'check' : 'bell'}
                  flat
                  disabled={notify}
                  // Figma T11: Notify me sets the alert and returns to T1 Getting there.
                  onPress={() => {
                    setNotify(true);
                    router.navigate('/getting-there');
                  }}
                />
                <ThemedText type="small" themeColor="textWeak" style={styles.centred}>
                  Meanwhile
                </ThemedText>
                <OptionCard
                  icon="bus-front"
                  title="Metro + bus · 52 min"
                  detail="Gets you there by 6:40"
                  onPress={() => router.push('/transit')}
                />
                <TextButton label="Offer seats" onPress={() => router.push('/offer-seats')} />
              </View>
            </EmptyState>
          </View>
        ) : (
          <Animated.View style={[styles.list, fadeUp]}>
            <View style={styles.hero}>
              <ThemedText type="screenTitle" accessibilityRole="header">
                {under18 ? `${rides.length} trusted drivers near you` : `${rides.length} rides near you`}
              </ThemedText>
              <View style={styles.trust}>
                <Icon name="shield-check" size={14} color="textWeak" strokeWidth={1.5} />
                <ThemedText type="meta" themeColor="textWeak">
                  {under18 ? 'Under 18: only Trusted drivers show up.' : 'Every driver is licence-verified'}
                </ThemedText>
              </View>
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
              <View style={styles.trust}>
                <Icon name="eye-off" size={14} color="textWeak" strokeWidth={1.5} />
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
  list: {
    gap: Spacing.threeLess,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  hero: {
    gap: Spacing.half,
    marginBottom: Spacing.half,
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  empty: {
    paddingTop: Spacing.five,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  emptyActions: {
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  centred: {
    textAlign: 'center',
  },
});
