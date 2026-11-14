import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { HostSpotCard } from '@/components/host/host-spot-card';
import { RadarSkeleton } from '@/components/host/radar-skeleton';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Glass } from '@/components/ui/glass';
import { GlassButton } from '@/components/ui/glass-button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { type ThemeColor, Motion, Radius, Shadows, Spacing } from '@/constants/theme';
import { HOST_SPOTS, type SpotLevel } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';

const MAP = require('@/assets/images/host/dubai-map.jpg');
const FRAME = 360;
const MAP_HEIGHT = 480;
const SWIPE = 40;

const PIN_TONE: Record<SpotLevel, ThemeColor> = { high: 'pinHigh', medium: 'pinMedium', low: 'statusSuccess' };
const LEGEND: { level: SpotLevel; label: string }[] = [
  { level: 'high', label: 'High' },
  { level: 'medium', label: 'Medium' },
  { level: 'low', label: 'Low' },
];
// Figma F10·11 heat: red over Kite Beach, amber south of it, a faint green over JLT (x, y, size in the 360 px frame).
const HEAT: { x: number; y: number; size: number; tone: ThemeColor; opacity: number }[] = [
  { x: 55, y: 155, size: 190, tone: 'pinHigh', opacity: 0.5 },
  { x: 48, y: 270, size: 120, tone: 'heatMedium', opacity: 0.45 },
  { x: 257, y: 134, size: 110, tone: 'statusSuccess', opacity: 0.3 },
];

/**
 * F10·11 Litter radar — where it's needed (hosting only). Opens on the F10·11s skeleton for 1.2 s. Pins and the
 * spot card select a spot; "Why it's ranked" opens F10·11w; "Host here" sizes it up on F10·9 Spot it.
 * SAMPLE: the map is Figma's image and the three spots are fixed.
 */
export default function LitterRadarRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const loading = useSampleLoading();
  const [index, setIndex] = useState(0);
  const [beaches, setBeaches] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const spot = HOST_SPOTS[index];
  const scale = width / FRAME;

  const select = (next: number) => {
    feedback.play('toggle.on');
    setIndex((next + HOST_SPOTS.length) % HOST_SPOTS.length);
  };

  // Swiping the card moves between spots, like tapping it.
  const swipe = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onEnd((event) => {
      if (event.translationX < -SWIPE) scheduleOnRN(select, index + 1);
      else if (event.translationX > SWIPE) scheduleOnRN(select, index - 1);
    });

  const top = insets.top + Spacing.two;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <StatusBar style="dark" />
      <View style={[styles.map, { height: MAP_HEIGHT * Math.max(scale, 1) }]}>
        <Image source={MAP} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        {/* Figma F10·11s keeps the "You" dot on the map while the spots load. */}
        <View
          style={[
            styles.you,
            {
              left: 196 * scale,
              top: 372,
              backgroundColor: theme.brand,
              borderColor: theme.card,
              boxShadow: Shadows.youHalo,
            },
          ]}
          accessible
          accessibilityLabel="You are here"
        />
        {!loading && (
          <>
            {HEAT.map((heat) => (
              <Heat key={heat.x} {...heat} scale={scale} />
            ))}

            {HOST_SPOTS.map((item, spotIndex) => (
              <MapPin
                key={item.id}
                rank={item.rank}
                name={item.name}
                level={item.level}
                selected={spotIndex === index}
                left={item.pin.left * scale}
                top={item.pin.top}
                onPress={() => select(spotIndex)}
              />
            ))}
            <Glass fill="glassOnMap" intensity={40} style={styles.legend}>
              {LEGEND.map((item) => (
                <View key={item.level} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme[PIN_TONE[item.level]] }]} />
                  <ThemedText type="smallMedium">{item.label}</ThemedText>
                </View>
              ))}
            </Glass>
          </>
        )}
      </View>

      <View style={[styles.header, { top }]}>
        <GlassButton
          icon="chevron-start"
          label="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
        />
        <Glass fill="glassOnMap" intensity={40} style={[styles.title, { boxShadow: Shadows.chip }]}>
          <ThemedText type="labelMedium14" accessibilityRole="header">
            Litter radar
          </ThemedText>
          <ThemedText type="ticketCaption" themeColor="textWeak">
            Dubai · updated 6 AM
          </ThemedText>
        </Glass>
        {/* Map layers aren't designed yet: says "Coming soon". */}
        <GlassButton icon="layers" label="Map layers" />
      </View>

      <View style={[styles.filters, { top: top + 58 }]}>
        {/* The date picker isn't designed yet: "This weekend" says "Coming soon". */}
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="When: this weekend. Change"
          style={[styles.filter, styles.filterOn, { backgroundColor: theme.brand, boxShadow: Shadows.chip }]}>
          <ThemedText type="filterLabel" themeColor="textOnBrand">
            This weekend
          </ThemedText>
          <Icon name="chevron-down" size={14} color="textOnBrand" strokeWidth={2} />
        </Tappable>
        <FilterChip label="Beaches" on={beaches} onPress={() => setBeaches((on) => !on)} />
        <FilterChip label="Near me" on={nearMe} onPress={() => setNearMe((on) => !on)} />
      </View>

      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.loaderCard, boxShadow: Shadows.sheetUp, paddingBottom: Math.max(insets.bottom, 22) },
        ]}>
        <View style={styles.grabberRow}>
          <View style={[styles.grabber, { backgroundColor: theme.strokeChip }]} />
        </View>

        {loading ? (
          <View style={styles.skeletonGap}>
            <RadarSkeleton />
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(Motion.transition.state.duration)}>
            <View style={styles.headGap}>
              <View style={styles.sheetHead}>
                <View style={[styles.flex, styles.headTitles]}>
                  <ThemedText type="sheetTitle" accessibilityRole="header">
                    Where will you host?
                  </ThemedText>
                  <ThemedText type="meta13" themeColor="textWeak">
                    {`${HOST_SPOTS.length} spots picked by Earthy`}
                  </ThemedText>
                </View>
                {/* Hosting at your own spot starts from Spot it (Figma changelog, 12 Nov). */}
                <Tappable
                  accessibilityRole="button"
                  accessibilityLabel="Host somewhere else"
                  hitSlop={8}
                  onPress={() => router.push('/spot-it')}>
                  <ThemedText type="labelSmall" themeColor="brand">
                    Somewhere else
                  </ThemedText>
                </Tappable>
              </View>
            </View>
            <View style={styles.cardGap}>
              <GestureDetector gesture={swipe}>
                <View>
                  <HostSpotCard
                    spot={spot}
                    onNext={() => select(index + 1)}
                    onWhy={() => router.push({ pathname: '/host-why', params: { spot: spot.id } })}
                  />
                </View>
              </GestureDetector>
            </View>
          </Animated.View>
        )}

        <View style={[styles.action, loading && styles.actionLoading]}>
          <Button
            label="Host here"
            flat
            disabled={loading}
            onPress={() => {
              feedback.play('button.primary');
              router.push('/spot-it');
            }}
          />
        </View>
      </View>
    </View>
  );
}

function Heat({ x, y, size, tone, opacity, scale }: (typeof HEAT)[number] & { scale: number }) {
  const theme = useTheme();
  const id = `heat-${x}`;
  return (
    <Svg width={size} height={size} style={[styles.heat, { left: x * scale, top: y }]} aria-hidden>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={theme[tone]} stopOpacity={opacity} />
          <Stop offset="1" stopColor={theme[tone]} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

function MapPin({
  rank,
  name,
  level,
  selected,
  left,
  top,
  onPress,
}: {
  rank: number;
  name: string;
  level: SpotLevel;
  selected: boolean;
  left: number;
  top: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  const fill = selected ? theme.pinSelected : theme.card;
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${rank}. ${name}`}
      onPress={onPress}
      style={[styles.pin, { left, top, backgroundColor: fill, boxShadow: selected ? Shadows.pinSelected : Shadows.pin }]}>
      <View style={[styles.pinRank, { backgroundColor: theme[PIN_TONE[level]] }]}>
        <ThemedText type="tag" themeColor="textOnBrand">
          {rank}
        </ThemedText>
      </View>
      <ThemedText type="pinLabel" themeColor={selected ? 'textOnBrand' : 'textStrong'}>
        {name}
      </ThemedText>
      {/* Coach-mark pointer centred under the pill (14 × 6.5, rounded tip). */}
      <Svg width={14} height={6.5} viewBox="0 0 14 6.5" style={styles.pointer}>
        <Path d="M0 0H14L8.2 6C7.4 6.667 6.6 6.667 5.8 6L0 0Z" fill={fill} />
      </Svg>
    </Tappable>
  );
}

function FilterChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      onPress={() => {
        feedback.play('toggle.on');
        onPress();
      }}>
      {on ? (
        <View style={[styles.filter, styles.filterOn, { backgroundColor: theme.brand, boxShadow: Shadows.chip }]}>
          <ThemedText type="filterLabel" themeColor="textOnBrand">
            {label}
          </ThemedText>
        </View>
      ) : (
        <Glass fill="glassOnMap" intensity={40} style={[styles.filter, { boxShadow: Shadows.chip }]}>
          <ThemedText type="filterLabel">{label}</ThemedText>
        </Glass>
      )}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  map: {
    overflow: 'hidden',
  },
  heat: {
    position: 'absolute',
  },
  you: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 3,
    borderRadius: 8,
  },
  pin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.one,
    paddingEnd: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.option,
  },
  pinRank: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pointer: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    left: '50%',
    marginStart: -7,
  },
  legend: {
    position: 'absolute',
    start: Spacing.three,
    top: 358,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.medium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  header: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  // Figma "Title" pill: y 50, 2 px above the 40 px glass buttons at y 52.
  title: {
    marginTop: -2,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.card,
  },
  filters: {
    position: 'absolute',
    start: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.threeHalf,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: 7,
    borderRadius: Radius.option,
  },
  filterOn: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    bottom: Spacing.two,
    // Figma "Spots sheet": 402 tall, 10 top padding; header 20 below the grabber, card 12 below the header.
    height: 402,
    paddingTop: Spacing.twoHalf,
    // Figma: the header and spot card run 16 px from the screen edge (8 inside the sheet); the button sits 16 in.
    paddingHorizontal: Spacing.two,
    borderRadius: 32,
  },
  action: {
    marginTop: 'auto',
    paddingHorizontal: Spacing.two,
  },
  headTitles: {
    gap: 2,
  },
  // Figma "Host here" sits 22 above the sheet's bottom edge (the frame pads 20, but its height is fixed).
  // F10·11s: the skeleton starts 16 below the grabber and the dimmed button follows 16 below it.
  skeletonGap: {
    marginTop: Spacing.three,
  },
  actionLoading: {
    marginTop: Spacing.three,
  },
  headGap: {
    marginTop: Spacing.threeHalf,
  },
  cardGap: {
    marginTop: Spacing.twoThreeQuarters,
  },
  grabberRow: {
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // Figma 12; 1 px less, as Poppins measures ~0.3 px wider here than in Figma and the title would wrap.
    gap: Spacing.twoThreeQuarters - 1,
  },
});
