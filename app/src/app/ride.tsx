import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DriverSummary } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconTile, RouteTimeline } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { SAMPLE_RIDES } from '@/data/events.sample';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** T4: one ride in full, with the driver's record and a seat request. */
export default function RideRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const ride = SAMPLE_RIDES.find((item) => item.id === (id ?? registration.rideId)) ?? SAMPLE_RIDES[0];
  const firstName = ride.driver.name.split(' ')[0];
  const requested = registration.rideId === ride.id && registration.ride !== 'none';
  const loading = useSampleLoading();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={`${firstName}'s ride`} subtitle={`Sat 5 Dec · leaves ${ride.pickupTime} AM`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 120 }]}>
        <View>
          <ThemedText type="heading" accessibilityRole="header">
            {`Pickup at ${ride.pickupTime} AM`}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            {`Sat 5 Dec · ${ride.rideNote}`}
          </ThemedText>
        </View>

        <Skeleton loading={loading} radius={Radius.option}>
          <View style={[styles.well, { backgroundColor: theme.wellCool }]}>
            <RouteTimeline
              from={{ time: ride.pickupTime, place: ride.pickup, note: ride.pickupNote }}
              to={{ time: ride.arriveTime, place: ride.dropoff, note: ride.dropoffNote }}
            />
          </View>
        </Skeleton>

        <Skeleton loading={loading} order={1} lines="card">
          <View style={[styles.driverCard, { backgroundColor: theme.card, borderColor: theme.divider }]}>
            <View style={styles.driverRow}>
              <DriverSummary ride={ride} />
              <Icon name="chevron-end" size={18} color="textStrong" />
            </View>
            <View style={[styles.stats, { borderColor: theme.divider }]}>
              <Stat value={String(ride.stats.cleanups)} label="clean-ups" />
              <Stat value={String(ride.stats.riders)} label="riders" />
              <Stat value={ride.stats.co2} label="CO₂ saved" />
            </View>
            <View style={styles.car}>
              <IconTile icon="car-front" size={36} iconSize={20} tone="wellCool" color="textStrong" />
              <View style={styles.carText}>
                <ThemedText type="label">{ride.car}</ThemedText>
                <ThemedText type="meta" themeColor="textWeak">
                  {ride.carNote}
                </ThemedText>
              </View>
            </View>
          </View>
        </Skeleton>

        <Skeleton loading={loading} order={2} radius={Radius.small} lines="tile">
          <View style={styles.checks}>
            <Check text="Licence verified by CleanScape" />
            <Check text="Never cancelled a ride" />
          </View>
        </Skeleton>

        {requested && registration.ride === 'accepted' && (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Message ${firstName}`}
            onPress={() => router.push('/ride-chat')}
            style={[styles.message, { borderColor: theme.brand }]}>
            <Icon name="chat" size={18} color="brand" strokeWidth={1.5} />
            <ThemedText type="labelLarge" themeColor="brand">
              {`Message ${firstName}`}
            </ThemedText>
          </Tappable>
        )}
      </ScrollView>

      <StickyFooter>
        <View>
          <ThemedText type="label">{`${ride.seatsLeft} of ${ride.seats} seats left`}</ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {`Free · pickup ${ride.pickupTime} AM`}
          </ThemedText>
        </View>
        <View style={styles.footerButton}>
          <Button
            label={requested ? (registration.ride === 'accepted' ? 'Seat booked' : 'Requested') : 'Request seat'}
            flat
            disabled={requested}
            onPress={() => {
              registration.requestRide(ride.id);
              router.push('/ride-requested');
            }}
          />
        </View>
      </StickyFooter>
      <TabBar active="events" />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <ThemedText type="eventTitle">{value}</ThemedText>
      <ThemedText type="meta" themeColor="textWeak">
        {label}
      </ThemedText>
    </View>
  );
}

function Check({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.check}>
      <View style={[styles.checkIcon, { backgroundColor: theme.statusSuccessSubtle }]}>
        <Icon name="check" size={14} color="statusSuccess" />
      </View>
      <ThemedText type="hint">{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  well: {
    padding: Spacing.three,
    paddingBottom: 0,
    borderRadius: Radius.option,
  },
  driverCard: {
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
  },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.twoThreeQuarters,
  },
  car: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  carText: {
    flex: 1,
  },
  checks: {
    gap: Spacing.twoHalf,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 48,
    borderWidth: 1.5,
    borderRadius: Radius.small,
  },
  footerButton: {
    minWidth: 150,
  },
});
