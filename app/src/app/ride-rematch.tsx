import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { RideCard } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { crossBadgeXml } from '@/constants/rides-art';
import { Spacing } from '@/constants/theme';
import { SAMPLE_RIDES } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/**
 * T13: the driver cancelled. The place at the cleanup is safe, and the next seat is offered.
 * Figma draws an edge-to-edge sheet; it floats here (8 px from the edges, 32 px corners) as today's sheet rule asks,
 * and the content keeps Figma's 20 px from the screen edge.
 */
export default function RideRematchSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const cancelled = SAMPLE_RIDES.find((ride) => ride.id === registration.rideId) ?? SAMPLE_RIDES[0];
  const next = SAMPLE_RIDES.find((ride) => ride.id !== cancelled.id) ?? SAMPLE_RIDES[1];
  const firstName = cancelled.driver.name.split(' ')[0];
  const nextName = next.driver.name.split(' ')[0];

  // Take seat goes back to T7 with the new ride on the pass; the scrim just closes back to T7, as in Figma.
  const takeSeat = () => {
    registration.takeRide(next.id);
    router.back();
  };

  return (
    <RouteSheet accessibilityLabel={`${firstName} can't drive`} bottomPadding={28}>
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <View style={styles.faded}>
              <Avatar initials={cancelled.driver.initials} tone={cancelled.driver.tone} size={44} />
            </View>
            <View style={styles.cross}>
              <SvgXml xml={crossBadgeXml(theme.textAccent, theme.card)} width={20} height={20} />
            </View>
          </View>
          <View style={styles.headerText}>
            <ThemedText type="sheetPrompt" accessibilityRole="header" style={FigmaLines.l27}>
              {`${firstName} can't drive on Saturday`}
            </ThemedText>
            <ThemedText type="meta" themeColor="textWeak" style={styles.subtitle}>
              Her plans changed. Your spot at Kite Beach is safe.
            </ThemedText>
          </View>
        </View>

        <View style={styles.found}>
          <View style={[styles.dot, { backgroundColor: theme.checkedIn }]} />
          <ThemedText type="labelSmall" themeColor="statusSuccess" style={FigmaLines.l20}>
            We found you another seat
          </ThemedText>
        </View>
        <RideCard ride={{ ...next, rideNote: next.dropoffNote }} best badge={false} />

        <View style={styles.actions}>
          <Button label="Take seat" accessibilityLabel={`Take ${nextName}'s seat`} flat onPress={takeSeat} />
          {/* Figma "Button / Tertiary": 48 tall, 15 semibold brand. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Take Metro"
            onPress={() => {
              registration.cancelRide();
              router.replace('/transit');
            }}
            style={styles.tertiary}>
            <ThemedText type="buttonPrimary" themeColor="brand">
              Take Metro
            </ThemedText>
          </Tappable>
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma T13 "Sheet": 20 px sides (the shared sheet pads 24 from the screen), 16 between blocks.
  body: {
    gap: Spacing.three,
    marginHorizontal: -Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  // Figma: the cancelled driver's avatar at 45%.
  faded: {
    marginTop: Spacing.half,
    opacity: 0.45,
  },
  cross: {
    position: 'absolute',
    start: 28,
    top: 28,
  },
  // Figma's title is 269 wide in a 258 text column (it runs into the sheet padding); 12 more keeps it on one line.
  headerText: {
    flex: 1,
    gap: Spacing.half,
    marginEnd: -Spacing.twoThreeQuarters,
  },
  subtitle: {
    marginEnd: Spacing.twoThreeQuarters,
  },
  found: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    gap: Spacing.two,
  },
  tertiary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
