import { useRef } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { OptionCard } from '@/components/events/option-card';
import { TransitChips } from '@/components/events/transit-chips';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ScreenInsight } from '@/components/earthy/insight';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { FigmaLines } from '@/constants/figma-lines';
import { guardianLockXml } from '@/constants/rides-art';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { CARPOOL_DRIVERS, SAMPLE_GUARDIAN, SAMPLE_USER } from '@/data/events.sample';
import { feedback } from '@/feedback';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const MAP_HEIGHT = 150;
const SHEET_OVERLAP = 26;

/** T1: the ways to get there, best first. T14 when a guardian chose public transport only. */
export default function GettingThereRoute() {
  const tipTarget = useRef<ViewInstance>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const fadeUp = useFadeUp();
  const loading = useSampleLoading();
  const transitOnly = registration.under18 && registration.guardian === 'transit';

  const carpool = (
    <OptionCard
      key="carpool"
      icon="car-front"
      title="Carpool"
      detail={transitOnly ? 'Off for this cleanup' : 'Leave 6:20 · 18 min · free'}
      best={transitOnly ? undefined : '· free · 18 min'}
      off={transitOnly}
      tight
      trailing={
        transitOnly ? undefined : (
          <View style={styles.drivers} accessible={false}>
            {CARPOOL_DRIVERS.map((driver, index) => (
              <View key={driver.initials} style={index > 0 && styles.overlap}>
                <Avatar initials={driver.initials} tone={driver.tone} size={28} ring="card" />
              </View>
            ))}
          </View>
        )
      }
      footer={
        transitOnly ? undefined : (
          <>
            <View style={[styles.purpose, { backgroundColor: theme.fill }]}>
              <Icon name="leaf" size={16} color="brand" strokeWidth={1.5} />
              <ThemedText type="avatar" themeColor="brand" style={styles.purposeText}>
                {"One shared car keeps ~4 kg of CO₂ off the beach you're cleaning"}
              </ThemedText>
            </View>
            <View style={styles.buttons}>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="Find rides"
                onPress={() => {
                  feedback.play('button.primary');
                  router.push('/rides');
                }}
                style={[styles.button, { backgroundColor: theme.brand }]}>
                <ThemedText type="labelLarge" themeColor="textOnBrand">
                  Find rides
                </ThemedText>
              </Tappable>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="Offer seats"
                onPress={() => router.push('/offer-seats')}
                style={[styles.button, { backgroundColor: theme.card }]}>
                <ThemedText type="labelLarge" themeColor="brand">
                  Offer seats
                </ThemedText>
                <Icon name="arrow-end" size={16} color="brand" />
              </Tappable>
            </View>
          </>
        )
      }
    />
  );

  const transit = (
    <OptionCard
      key="transit"
      icon="bus-front"
      title="Metro + bus · 52 min"
      detail="Leave 5:50 · AED 7.5 with Nol"
      best={transitOnly ? '· quickest without a car' : undefined}
      inline={<TransitChips />}
      onPress={() => router.push('/transit')}
    />
  );

  const drive = (
    <OptionCard
      key="drive"
      icon="parking"
      title="Drive and park · 18 min"
      detail="Leave 6:25 · Lot B free, fills by 6:45"
      onPress={() => router.push('/event-map')}
    />
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Getting there" subtitle="Kite Beach · Sat 5 Dec · meet 6:45 AM" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom + Spacing.four }}>
        <View style={styles.map}>
          <ZoomableMap
            controls={{ top: Spacing.two, end: Spacing.three }}
            accessibilityLabel="Open the map"
            onPress={() => {
              feedback.play('map.expand');
              router.push('/event-map');
            }}>
            <MapArt left={-140} top={-230} zoom={600 / 510} />
          </ZoomableMap>
        </View>
        <Animated.View style={[styles.sheet, { backgroundColor: theme.card }, fadeUp]}>
          <View style={[styles.grabber, { backgroundColor: theme.seatEmpty }]} />
          <View style={styles.hero}>
            <View style={styles.heroRow}>
              <ThemedText type="heading" accessibilityRole="header" style={styles.heroTitle}>
                Be there by 6:45 AM
              </ThemedText>
              <View style={[styles.traffic, { backgroundColor: theme.trafficFill }]}>
                <View style={[styles.trafficDot, { backgroundColor: theme.statusSuccess }]} />
                <ThemedText type="tag" themeColor="trafficText">
                  Light traffic
                </ThemedText>
              </View>
            </View>
            <ThemedText type="note" themeColor="textWeak" style={FigmaLines.l20}>
              {transitOnly ? 'Leave 5:50 by Metro + bus' : '3 ways to get there · latest you can leave is 6:25'}
            </ThemedText>
          </View>

          {transitOnly && (
            // Figma T14 "Guardian line": opens T12, the trusted drivers an under-18 can ride with.
            <Tappable
              accessibilityRole="button"
              accessibilityLabel={`${SAMPLE_GUARDIAN.name} chose public transport for this one. See trusted drivers`}
              onPress={() => router.push('/rides')}
              style={[styles.guardian, { backgroundColor: theme.secondarySubtle }]}>
              <View style={styles.guardianIcon}>
                <SvgXml xml={guardianLockXml(theme.textSecondary)} width={11.6} height={11.85} />
              </View>
              <ThemedText type="chip" themeColor="textSecondary" style={styles.flex}>
                {`${SAMPLE_GUARDIAN.name} chose public transport for this one`}
              </ThemedText>
            </Tappable>
          )}

          <View style={styles.from}>
            <ThemedText type="labelSmall" themeColor="textWeak" style={FigmaLines.l20}>
              {`From ${SAMPLE_USER.home} · your home`}
            </ThemedText>
            {/* Choosing another starting point isn't designed yet. */}
            <ThemedText type="bodyMedium" themeColor="brand" style={FigmaLines.l20}>
              Change
            </ThemedText>
          </View>

          <View style={styles.options}>
            {(transitOnly ? [transit, carpool, drive] : [carpool, transit, drive]).map((option, index) => (
              <Skeleton key={option.key} loading={loading} order={index} lines="wide">
                {option.key === 'carpool' ? (
                  <View ref={tipTarget} collapsable={false}>
                    {option}
                  </View>
                ) : (
                  option
                )}
              </Skeleton>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <TabBar active="events" />
      {!transitOnly && !loading && (
        <ScreenInsight id="getting-there" target={tipTarget} targetRadius={22} onAction={() => router.push('/rides')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    height: MAP_HEIGHT,
    overflow: 'hidden',
  },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    alignItems: 'stretch',
    gap: Spacing.threeLess,
    paddingTop: Spacing.twoHalf,
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
  // Figma lets the pill run into the sheet's right padding so it sits beside the title on a
  // 360 px phone; on narrower phones the row still wraps.
  traffic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginEnd: -16,
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
  // Figma T1 and T14 use "normal" line heights in the hero (24 → 36, 13 → 20).
  heroTitle: {
    lineHeight: 36,
  },
  guardian: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
  },
  // The 10 px lock is drawn with its 1.6 stroke outside the box, so the slot stays 10 wide.
  guardianIcon: {
    width: 10,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  from: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    gap: Spacing.threeLess,
  },
  drivers: {
    flexDirection: 'row',
  },
  overlap: {
    marginStart: -8,
  },
  purpose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.control,
  },
  purposeText: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
    height: 48,
    borderRadius: Radius.small,
  },
});
