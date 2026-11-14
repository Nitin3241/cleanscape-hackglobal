import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Stat } from '@/components/host/host-spot-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { GlassButton } from '@/components/ui/glass-button';
import { Icon } from '@/components/ui/icon';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { HOST_SPOTS, LEVEL_COLORS, LEVEL_LABEL, SPOT_IT } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { isHostOnboarded } from '@/state/host';

const PHOTO = require('@/assets/images/host/kite-beach-report.jpg');
const PHOTO_HEIGHT = 500;
const FRAME = 360;
// Figma "Area outline" (330 × 148 at x 15, y 240): a dashed polygon round the litter.
const AREA = '30,38.6 150,12.9 300,32.2 320,122.3 170,141.6 10,115.8';

/**
 * F10·9 Spot it — Earthy sizes the job, for the spot picked on the radar (Kite Beach end to end). The photo is
 * the latest resident report, so there is no retake. "Host here" opens F10·15 the first time, then F10·10a.
 * SAMPLE: always Figma's photo and counts.
 */
export default function SpotItRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = width / FRAME;
  const spot = HOST_SPOTS.find((item) => item.id === SPOT_IT.spotId) ?? HOST_SPOTS[0];
  const level = LEVEL_COLORS[spot.level];

  const host = async () => {
    feedback.play('button.primary');
    router.push((await isHostOnboarded()) ? '/host-drafting' : '/become-host');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <StatusBar style="light" />
      <View style={[styles.photo, { height: PHOTO_HEIGHT }]}>
        <Image source={PHOTO} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        <LinearGradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']} style={styles.topScrim} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.65)']}
          locations={[0, 0.55, 1]}
          style={styles.bottomScrim}
        />

        <Animated.View entering={FadeIn.duration(400).delay(200)} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={330 * scale} height={148} viewBox="0 0 330 148" preserveAspectRatio="none" style={[styles.area, { left: 15 * scale }]} aria-hidden>
            <Polygon points={AREA} fill="rgba(255,255,255,0.08)" stroke={theme.textOnBrand} strokeWidth={2} strokeDasharray="7.8 5.8" strokeLinejoin="round" />
          </Svg>
          <View style={[styles.areaTag, { left: 149 * scale, backgroundColor: theme.areaTag }]}>
            <ThemedText type="pinLabel" themeColor="textOnBrand">
              {SPOT_IT.area}
            </ThemedText>
          </View>
          {SPOT_IT.tags.map((tag) => (
            <View
              key={tag.label}
              style={[styles.tag, { left: tag.left * scale, top: tag.top, backgroundColor: theme.coverTag, boxShadow: Shadows.chip }]}>
              <View style={[styles.tagDot, { backgroundColor: theme[tag.dot], borderColor: theme.textOnBrand }]} />
              <ThemedText type="filterLabel">{tag.label}</ThemedText>
            </View>
          ))}
        </Animated.View>

        <View style={styles.credit} accessible accessibilityLabel={SPOT_IT.credit}>
          <Icon name="camera" size={16} color="textOnBrand" strokeWidth={1.7} />
          <ThemedText type="creditLabel" themeColor="textOnBrand" style={styles.creditText}>
            {SPOT_IT.credit}
          </ThemedText>
        </View>

        <View style={[styles.top, { top: insets.top + Spacing.two }]}>
          <GlassButton icon="close" label="Close" onPress={() => router.back()} surface="brand" />
          <View style={[styles.status, { backgroundColor: theme.glassOnBrand, borderColor: theme.glassStroke }]}>
            <EarthyOrb size={22} state="still" glow={false} />
            <ThemedText type="fieldLabel" themeColor="textOnBrand">
              Earthy sized this spot
            </ThemedText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.card, boxShadow: Shadows.sheetUpStrong, paddingBottom: Math.max(insets.bottom, Spacing.four) },
        ]}>
        <View style={styles.grabberRow}>
          <View style={[styles.grabber, { backgroundColor: theme.strokeChip }]} />
        </View>

        <View style={styles.titleRow}>
          <View style={[styles.flex, styles.titleText]}>
            <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.titleLine}>
              {spot.name}
            </ThemedText>
            <ThemedText type="meta13" themeColor="textWeak" style={styles.subLine}>
              {SPOT_IT.sub}
            </ThemedText>
          </View>
          <View style={[styles.level, { backgroundColor: theme[level.fill] }]}>
            <View style={[styles.levelDot, { backgroundColor: theme[level.text] }]} />
            <ThemedText type="tag" themeColor={level.text}>
              {LEVEL_LABEL[spot.level]}
            </ThemedText>
          </View>
        </View>

        <View style={styles.stats}>
          <Stat icon="users" value={`${spot.people}`} label="people" />
          <Stat icon="clock" value={spot.hours} label="time" />
          <Stat icon="rubbish-bag" value={spot.bags} label="bags" />
        </View>

        <View style={styles.mix} accessible accessibilityLabel={`What’s there: ${SPOT_IT.mix.map((item) => item.label).join(', ')}`}>
          <View style={styles.bar}>
            {SPOT_IT.mix.map((item) => (
              <View key={item.label} style={[styles.segment, { flex: item.width, backgroundColor: theme[item.tone] }]} />
            ))}
          </View>
          <View style={styles.legend}>
            {SPOT_IT.mix.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme[item.tone] }]} />
                <ThemedText type="caption" themeColor="textWeak" style={styles.smallLine}>
                  {item.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.facts}>
          <View style={[styles.fact, { backgroundColor: theme.statusSuccessSubtle }]}>
            <Icon name="shield-check" size={16} color="statusSuccess" strokeWidth={1.7} />
            <ThemedText type="filterLabel" themeColor="statusSuccess" style={styles.smallLine}>
              {SPOT_IT.hazards}
            </ThemedText>
          </View>
          <View style={[styles.fact, { backgroundColor: theme.fill }]}>
            <Icon name="clock" size={16} color="brand" strokeWidth={1.7} />
            <ThemedText type="filterLabel" themeColor="brand" style={styles.smallLine}>
              {SPOT_IT.best}
            </ThemedText>
          </View>
        </View>

        <Button label="Host here" flat onPress={host} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  photo: {
    overflow: 'hidden',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    height: 160,
  },
  // Runs to the photo's bottom edge, so the shade fades all the way down and doesn't stop in a hard line.
  bottomScrim: {
    position: 'absolute',
    top: 252,
    bottom: 0,
    start: 0,
    end: 0,
  },
  area: {
    position: 'absolute',
    top: 240,
  },
  areaTag: {
    position: 'absolute',
    top: 250,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  tag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.oneHalf,
    paddingEnd: Spacing.twoHalf,
    paddingVertical: 5,
    borderRadius: Radius.medium,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  credit: {
    position: 'absolute',
    start: Spacing.three,
    top: 396,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  creditText: {
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  top: {
    position: 'absolute',
    start: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters + Spacing.three,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  // Figma "Result sheet": fixed 372 tall, 8 above the bottom; content sits at the top.
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    bottom: Spacing.two,
    height: 372,
    gap: Spacing.three,
    paddingTop: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: 32,
  },
  grabberRow: {
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  // Figma "normal" line heights: 20 → 30, 13 → 20, 12 → 18.
  titleText: {
    gap: 2,
  },
  titleLine: {
    lineHeight: 30,
  },
  subLine: {
    lineHeight: 20,
  },
  smallLine: {
    lineHeight: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.one,
    paddingStart: Spacing.two,
    paddingEnd: 9,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  mix: {
    gap: Spacing.two,
  },
  bar: {
    flexDirection: 'row',
    gap: 3,
    overflow: 'hidden',
    borderRadius: Spacing.oneHalf,
  },
  segment: {
    height: 8,
  },
  // Figma gap 14; Poppins renders each label ~1 px narrower here, so 15 keeps the items on Figma's x.
  legend: {
    flexDirection: 'row',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  facts: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  fact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
  },
});
