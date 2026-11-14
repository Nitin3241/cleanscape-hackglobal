import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Avatar, RouteTimeline, SeatDots } from '@/components/ui/parts';
import { Smiley } from '@/components/ui/smiley';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { type Ride } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';

type RideCardProps = {
  ride: Ride;
  best?: boolean;
  /** Show the "Best match" badge with the highlight. Figma drops it on T12 and T13. */
  badge?: boolean;
  onPress?: () => void;
};

/** A ride offer: the route with times, then the driver, their tier and the seats left. */
export function RideCard({ ride, best = false, badge = best, onPress }: RideCardProps) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${best && badge ? 'Best match. ' : ''}${ride.driver.name}, ${ride.driver.tier}. Pickup ${ride.pickupTime} at ${ride.pickup}. ${ride.seatsLeft} ${ride.seatsLeft === 1 ? 'seat' : 'seats'} left`}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.card, boxShadow: Shadows.rideCard },
        best ? { borderColor: theme.brand, borderWidth: 1.5 } : { borderColor: theme.divider },
      ]}>
      <View style={styles.route}>
        <RouteTimeline
          from={{ time: ride.pickupTime, place: ride.pickup, note: ride.pickupNote }}
          to={{ time: ride.arriveTime, place: ride.dropoff, note: ride.rideNote }}
        />
      </View>
      <View style={[styles.driver, { backgroundColor: theme.cardTint, borderTopColor: theme.divider }]}>
        <DriverSummary ride={ride} best={best && badge} />
        <View style={styles.seats}>
          <SeatDots seats={ride.seats} open={ride.seatsLeft} />
          <ThemedText type="tag" themeColor={ride.seatsLeft === 1 ? 'textAccent' : 'brand'} style={FigmaLines.l17}>
            {`${ride.seatsLeft} ${ride.seatsLeft === 1 ? 'seat' : 'seats'} left`}
          </ThemedText>
        </View>
      </View>
    </Tappable>
  );
}

/** Avatar, name with the verified tick, and the Smileys tier. */
export function DriverSummary({ ride, best = false }: { ride: Ride; best?: boolean }) {
  const theme = useTheme();

  return (
    <View style={styles.who}>
      <Avatar initials={ride.driver.initials} tone={ride.driver.tone} />
      <View style={styles.whoText}>
        <View style={styles.name}>
          <ThemedText type="label" style={FigmaLines.l21}>
            {ride.driver.name}
          </ThemedText>
          <Icon name="check" size={13} color="statusSuccess" strokeWidth={2} />
          {best && (
            <View style={[styles.bestPill, { backgroundColor: theme.brand }]}>
              <ThemedText type="avatarSmall" themeColor="textOnBrand" style={styles.bestText}>
                Best match
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.tier}>
          <Smiley size={14} />
          <ThemedText type="tabLabel" themeColor="textPaper" style={FigmaLines.l17}>
            {`${ride.driver.tier} · ${ride.driver.smileys} Smileys`}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  route: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
  },
  driver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderTopWidth: 1,
  },
  who: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  whoText: {
    flex: 1,
    gap: Spacing.half,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  // Figma "Best": 10 semibold at normal height (15), 8 / 3 padding, 10 radius.
  bestPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  bestText: {
    lineHeight: 15,
  },
  tier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  seats: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
});
