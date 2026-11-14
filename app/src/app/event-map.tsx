import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { openInWaze } from '@/components/event/open-waze';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import {
  callXml,
  chatXml,
  minimiseXml,
  parkingXml,
  shareWhiteXml,
} from '@/constants/ask-earthy-art';
import { Gradients, Radius, Shadows, Spacing } from '@/constants/theme';
import { SAMPLE_EVENT } from '@/data/ask-earthy.sample';
import { SAMPLE_USER } from '@/data/events.sample';
import { feedback } from '@/feedback';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useTheme } from '@/hooks/use-theme';

const TOP_BAR_HEIGHT = 60;

export default function EventMapRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const fadeUp = useFadeUp({ distance: 16 });
  const event = SAMPLE_EVENT;
  const close = () => {
    feedback.play('map.minimise');
    // Figma 02b: Minimise returns to R7, the clean-up's detail, even when the map was opened from Getting there.
    router.dismissTo({ pathname: '/event-detail', params: { id: 'kite-beach' } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />

      <LinearGradient {...Gradients.header} style={{ paddingTop: insets.top }}>
        <View style={styles.topBar}>
          <Tappable accessibilityRole="button" accessibilityLabel="Close map" hitSlop={10} onPress={close}>
            <Icon name="chevron-down" size={24} color="textOnBrand" />
          </Tappable>
          <View style={styles.titles}>
            <ThemedText type="eventTitle" themeColor="textOnBrand" accessibilityRole="header" numberOfLines={1}>
              {event.title}
            </ThemedText>
            <ThemedText type="meta" themeColor="textOnBrandWeak" numberOfLines={1}>
              {event.mapSubtitle}
            </ThemedText>
          </View>
          {/* Sharing isn't connected yet. */}
          <Tappable accessibilityRole="button" accessibilityLabel="Share" hitSlop={10}>
            <SvgXml xml={shareWhiteXml} width={22} height={22} />
          </Tappable>
        </View>
      </LinearGradient>

      <View style={styles.mapArea} accessible accessibilityRole="image" accessibilityLabel={`Map of the route to ${event.title}. ${event.route}.`}>
        <ZoomableMap controls={{ top: 64, end: Spacing.twoThreeQuarters }}>
          <MapArt left={-121} top={-123.5} />
        </ZoomableMap>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Close map"
          onPress={close}
          style={[styles.minimise, { backgroundColor: theme.card, boxShadow: Shadows.mapControl }]}>
          <SvgXml xml={minimiseXml} width={16} height={16} />
        </Tappable>
      </View>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.card,
            boxShadow: Shadows.mapSheet,
            paddingBottom: Math.max(insets.bottom + Spacing.two, 28),
          },
          fadeUp,
        ]}>
        <View style={[styles.grabber, { backgroundColor: theme.strokeWeak }]} />

        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <ThemedText type="heading" accessibilityRole="header">
              {`Leave at ${event.leaveAt}`}
            </ThemedText>
            <View style={[styles.traffic, { backgroundColor: theme.trafficFill }]}>
              <View style={[styles.trafficDot, { backgroundColor: theme.statusSuccess }]} />
              <ThemedText type="tag" themeColor="trafficText">
                Light traffic
              </ThemedText>
            </View>
          </View>
          <ThemedText type="note" themeColor="textWeak">
            {`Arrive 6:45 · ${event.driveTime} · ${event.route.split(' · ')[0]}`}
          </ThemedText>
        </View>

        <View style={[styles.fromTo, { backgroundColor: theme.wellCool, borderColor: theme.optionStroke }]}>
          <Stop label="From" value={`${SAMPLE_USER.home} · your home`} />
          <View style={[styles.connector, { backgroundColor: theme.seatEmpty }]} />
          <Stop label="Meeting point" value={event.meetingPoint} filled />
        </View>

        <View style={styles.actions}>
          <View style={styles.startRoute}>
            <Button label="Start route" flat onPress={openInWaze} />
          </View>
          {/* Messaging and calling the crew lead aren't connected yet. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Message ${event.crewLead.name}, crew lead`}
            style={[styles.round, { borderColor: theme.brand }]}>
            <SvgXml xml={chatXml} width={18} height={18} />
          </Tappable>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Call ${event.crewLead.name}, crew lead`}
            style={[styles.round, { borderColor: theme.brand }]}>
            <SvgXml xml={callXml} width={18} height={18} />
          </Tappable>
        </View>

        <View>
          <View style={styles.parking} accessible accessibilityLabel={`Parking: ${event.parking}`}>
            <SvgXml xml={parkingXml} width={18} height={18} />
            <ThemedText type="note">{event.parking}</ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Carpool or Metro instead? See options"
            onPress={() => {
              // Close the map first: anything pushed on top of a modal opens as an iOS page sheet.
              router.dismiss();
              router.navigate('/getting-there');
            }}
            style={styles.otherWays}>
            <ThemedText type="note" themeColor="textSecondary">
              Carpool or Metro instead?
            </ThemedText>
            <ThemedText type="labelSmall" themeColor="brand">
              See options
            </ThemedText>
          </Tappable>
        </View>
      </Animated.View>
    </View>
  );
}

/** One end of the trip: an open ring for where you start, a filled dot for the meeting point. */
function Stop({ label, value, filled = false }: { label: string; value: string; filled?: boolean }) {
  const theme = useTheme();

  return (
    <View style={styles.stop} accessible accessibilityLabel={`${label}: ${value}`}>
      <View
        style={[
          styles.stopDot,
          { borderColor: theme.brand, backgroundColor: filled ? theme.brand : theme.card },
        ]}
      />
      <View style={styles.stopText}>
        <ThemedText type="smallMedium" themeColor="textWeak">
          {label}
        </ThemedText>
        <ThemedText type="label">{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  titles: {
    flex: 1,
    alignItems: 'center',
  },
  mapArea: {
    flex: 1,
    marginBottom: -Spacing.four,
    overflow: 'hidden',
  },
  minimise: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    end: Spacing.twoThreeQuarters,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  sheet: {
    gap: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeHalf,
    borderTopStartRadius: Radius.panel,
    borderTopEndRadius: Radius.panel,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  hero: {
    gap: Spacing.one,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  traffic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingStart: Spacing.oneHalf,
    paddingEnd: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  trafficDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  fromTo: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.one,
  },
  stopDot: {
    width: 14,
    height: 14,
    borderWidth: 3,
    borderRadius: 7,
  },
  stopText: {
    flex: 1,
  },
  connector: {
    width: 2,
    height: 10,
    marginStart: 6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  startRoute: {
    flex: 1,
  },
  round: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 24,
  },
  parking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.twoHalf,
  },
  otherWays: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
