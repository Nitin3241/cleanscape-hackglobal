import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RouteTimeline, SeatDots } from '@/components/ui/parts';
import { Smiley } from '@/components/ui/smiley';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { nextChatXml, nextTickXml, publishedBadgeXml } from '@/constants/rides-art';
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
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.four, paddingBottom: TabBarHeight + insets.bottom + Spacing.two },
        ]}>
        <Animated.View style={[styles.heading, fadeUp]}>
          <View style={styles.badge}>
            <SvgXml xml={publishedBadgeXml(theme.checkedIn, theme.textOnBrand)} width={20} height={20} />
            <ThemedText type="labelSmall" themeColor="statusSuccess" style={FigmaLines.l20}>
              Ride published
            </ThemedText>
          </View>
          <ThemedText type="pageTitle" accessibilityRole="header" style={styles.title}>
            Your ride is live
          </ThemedText>
          <ThemedText type="body14" themeColor="textWeak">
            Volunteers near Al Karama can now ask for a seat.
          </ThemedText>
        </Animated.View>

        <View style={[styles.well, { backgroundColor: theme.tileNeutral }]}>
          <View style={styles.route}>
            <RouteTimeline
              from={{ time: '6:05', place: 'Al Karama Metro, exit 2', note: 'Your pickup point' }}
              to={{ time: '6:30', place: 'Kite Beach · Gate 2', note: 'Drop-off for the briefing' }}
            />
          </View>
          <View style={[styles.seats, { borderTopColor: theme.strokeWeak }]}>
            <SeatDots seats={SEATS} open={SEATS} />
            <ThemedText type="chip">{`${SEATS} seats open · no requests yet`}</ThemedText>
          </View>
        </View>

        <View style={styles.next}>
          <ThemedText type="labelLarge" accessibilityRole="header" style={FigmaLines.l23}>
            What happens next
          </ThemedText>
          <Item
            icon={<SvgXml xml={nextTickXml(theme.fill, theme.brand)} width={24} height={24} />}
            text="You approve every request before anyone joins"
          />
          <Item
            icon={<SvgXml xml={nextChatXml(theme.fill, theme.brand)} width={24} height={24} />}
            text="Chat opens once you accept a rider"
          />
          <Item icon={<Smiley size={20} />} text="+10 Smileys for each rider, on the day" />
        </View>

        <View style={styles.actions}>
          <Button label="View ride" flat onPress={() => router.navigate('/pass')} />
          {/* Figma "Button / Tertiary": 48 tall, 15 semibold brand. */}
          <Tappable accessibilityRole="button" accessibilityLabel="Share ride" onPress={shareRide} style={styles.tertiary}>
            <ThemedText type="buttonPrimary" themeColor="brand">
              Share ride
            </ThemedText>
          </Tappable>
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
      <ThemedText type="body" style={styles.itemText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma T10 "Content": 24 under the status bar, 20 sides, 20 between blocks.
  content: {
    flexGrow: 1,
    gap: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  heading: {
    gap: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  title: {
    lineHeight: 39,
  },
  well: {
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  route: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
  },
  seats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderTopWidth: 1,
  },
  next: {
    gap: Spacing.twoThreeQuarters,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  itemIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  // Figma pins the actions to the bottom, 8 above the tab bar.
  actions: {
    marginTop: 'auto',
    gap: Spacing.one,
  },
  tertiary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/** Opens the phone's share sheet so the driver can tell friends there are seats. */
function shareRide() {
  Share.share({
    message:
      "I'm driving to the Kite Beach cleanup on Sat 5 Dec, leaving Al Karama Metro (exit 2) at 6:05. Ask for a seat in CleanScape.",
  }).catch(() => {
    // The user closed the share sheet or sharing isn't available; nothing to do.
  });
}
