import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { DriverSummary } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteTimeline } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { FigmaLines } from '@/constants/figma-lines';
import { carTileXml, lockBadgeXml, tickBadgeXml } from '@/constants/rides-art';
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
        <View style={styles.hero}>
          <ThemedText type="heading" accessibilityRole="header" style={styles.heroTitle}>
            {`Pickup at ${ride.pickupTime} AM`}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak" style={FigmaLines.l20}>
            {`Sat 5 Dec · ${ride.rideNote}`}
          </ThemedText>
        </View>

        <Skeleton loading={loading} radius={Radius.card}>
          <View style={[styles.well, { backgroundColor: theme.tileNeutral }]}>
            <RouteTimeline
              from={{ time: ride.pickupTime, place: ride.pickup, note: ride.pickupNote }}
              to={{ time: ride.arriveTime, place: ride.dropoff, note: ride.dropoffNote }}
            />
          </View>
        </Skeleton>

        <Skeleton loading={loading} order={1} lines="card">
          <View style={[styles.driverCard, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <View style={styles.driverRow}>
              <DriverSummary ride={ride} />
              {/* Figma draws a 5 × 10 chevron; Lucide's sits inside a 20 px box, so trim the box to the stroke. */}
              <View style={styles.chevron}>
                <Icon name="chevron-end" size={20} color="textWeak" strokeWidth={2} />
              </View>
            </View>
            <View style={[styles.stats, { borderColor: theme.strokeWeak }]}>
              <Stat value={String(ride.stats.cleanups)} label="clean-ups" />
              <Stat value={String(ride.stats.riders)} label="riders" />
              <Stat value={ride.stats.co2} label="CO₂ saved" />
            </View>
            <View style={styles.car}>
              <SvgXml xml={carTileXml(theme.tileNeutral, theme.brand)} width={36} height={36} />
              <View style={styles.carText}>
                <ThemedText type="label" style={FigmaLines.l21}>
                  {ride.car}
                </ThemedText>
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
            <Check text={`Chat opens once ${firstName} accepts. Your number stays private.`} lock />
          </View>
        </Skeleton>

        {/* Figma T4 "House notes": what the driver asks of riders. */}
        <View style={styles.notes}>
          <ThemedText type="label" style={FigmaLines.l21}>
            Ride notes
          </ThemedText>
          <View style={styles.noteChips}>
            {RIDE_NOTES.map((note) => (
              <View key={note} style={[styles.noteChip, { backgroundColor: theme.surface }]}>
                <ThemedText type="meta" themeColor="textWeak">
                  {note}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

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

      <StickyFooter tabGap={28} align="start">
        <View>
          <ThemedText type="label" style={FigmaLines.l21}>{`${ride.seatsLeft} of ${ride.seats} seats left`}</ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
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
      <ThemedText type="labelLarge" style={FigmaLines.l23}>
        {value}
      </ThemedText>
      <ThemedText type="ticketCaption" themeColor="textWeak" style={FigmaLines.l17}>
        {label}
      </ThemedText>
    </View>
  );
}

/** Figma T4 "Trust row": a 24 px round badge (green tick, or blue lock for privacy) and 13 px text. */
function Check({ text, lock = false }: { text: string; lock?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.check}>
      <SvgXml
        xml={lock ? lockBadgeXml(theme.fill, theme.brand) : tickBadgeXml(theme.statusSuccessSubtle, theme.statusSuccess)}
        width={24}
        height={24}
      />
      <ThemedText type="body" style={styles.checkText}>
        {text}
      </ThemedText>
    </View>
  );
}

// SAMPLE: the driver's ride notes (Figma T4).
const RIDE_NOTES = ['Quiet ride', 'AC on', 'Gloves in the boot', 'Water for everyone', 'No food in the car'];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma T4 "Detail": 20 padding, 20 between blocks.
  content: {
    gap: Spacing.threeHalf,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  hero: {
    gap: Spacing.half,
  },
  heroTitle: {
    lineHeight: 36,
  },
  well: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card,
  },
  driverCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  chevron: {
    marginHorizontal: -7.5,
  },
  // Figma "Stats": three columns spread apart (space-between), 16 / 12 padding.
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  stat: {
    alignItems: 'center',
  },
  car: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  carText: {
    flex: 1,
  },
  checks: {
    gap: Spacing.twoThreeQuarters,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
  },
  checkText: {
    flex: 1,
  },
  notes: {
    gap: Spacing.two,
    paddingVertical: Spacing.threeLess,
  },
  noteChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.oneHalf,
  },
  noteChip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
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
