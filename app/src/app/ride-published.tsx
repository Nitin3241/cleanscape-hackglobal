import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteTimeline, SeatDots } from '@/components/ui/parts';
import { Smiley } from '@/components/ui/smiley';
import { TabBar } from '@/components/ui/tab-bar';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useTheme } from '@/hooks/use-theme';

const SEATS = 3;

/** T10: the ride is live, and what happens next. */
export default function RidePublishedRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const fadeUp = useFadeUp();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.five, paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}>
        <Animated.View style={[styles.heading, fadeUp]}>
          <View style={styles.badge}>
            <View style={[styles.badgeIcon, { backgroundColor: theme.statusSuccess }]}>
              <Icon name="tick" size={14} color="textOnBrand" strokeWidth={2.5} />
            </View>
            <ThemedText type="labelSmall" themeColor="statusSuccess">
              Ride published
            </ThemedText>
          </View>
          <ThemedText type="heading" accessibilityRole="header">
            Your ride is live
          </ThemedText>
          <ThemedText type="hint" themeColor="textWeak">
            Volunteers near Al Karama can now ask for a seat.
          </ThemedText>
        </Animated.View>

        <View style={[styles.well, { backgroundColor: theme.wellCool }]}>
          <View style={styles.route}>
            <RouteTimeline
              from={{ time: '6:05', place: 'Al Karama Metro, exit 2', note: 'Your pickup point' }}
              to={{ time: '6:30', place: 'Kite Beach · Gate 2', note: 'Drop-off for the briefing' }}
            />
          </View>
          <View style={[styles.seats, { borderTopColor: theme.divider }]}>
            <SeatDots seats={SEATS} open={SEATS} />
            <ThemedText type="small" themeColor="textWeak">
              {`${SEATS} seats open · no requests yet`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.next}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            What happens next
          </ThemedText>
          <Item icon={<Icon name="check" size={18} color="brand" />} text="You approve every request before anyone joins" />
          <Item icon={<Icon name="chat" size={18} color="brand" strokeWidth={1.5} />} text="Chat opens once you accept a rider" />
          <Item icon={<Smiley size={18} />} text="+10 Smileys for each rider, on the day" />
        </View>

        <View style={styles.actions}>
          <Button label="View ride" size="large" onPress={() => router.navigate('/pass')} />
          <TextButton label="Share ride" onPress={shareRide} />
        </View>
      </ScrollView>
      <TabBar active="events" />
    </View>
  );
}

function Item({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemIcon}>{icon}</View>
      <ThemedText type="hint" style={styles.itemText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.threeHalf,
  },
  heading: {
    gap: Spacing.oneHalf,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  badgeIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  well: {
    borderRadius: Radius.option,
  },
  route: {
    padding: Spacing.three,
    paddingBottom: 0,
  },
  seats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  next: {
    gap: Spacing.twoThreeQuarters,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
  },
  itemIcon: {
    width: 22,
    alignItems: 'center',
    paddingTop: 1,
  },
  itemText: {
    flex: 1,
  },
  // Figma pins the actions to the bottom, above the tab bar.
  actions: {
    marginTop: 'auto',
    gap: Spacing.three,
  },
});

/** Opens the phone's share sheet so the driver can tell friends there are seats. */
function shareRide() {
  Share.share({
    message: "I'm driving to the Kite Beach cleanup on Sat 5 Dec, leaving Al Karama Metro (exit 2) at 6:05. Ask for a seat in CleanScape.",
  }).catch(() => {
    // The user closed the share sheet or sharing isn't available; nothing to do.
  });
}
