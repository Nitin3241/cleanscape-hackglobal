import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Line, RadialGradient, Stop, SvgXml } from 'react-native-svg';

import { FlipDigit } from '@/components/home/flip-digit';
import { HomeTimeline } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { DirectionView } from '@/components/ui/direction-view';
import { Shimmer } from '@/components/ui/reveal-block';
import { ticketArtXml } from '@/constants/illustrations';
import { standardTiming } from '@/constants/motion';
import { Gradients, Motion, Radius, Shadows, Spacing, ThemeColor } from '@/constants/theme';
import { useHomeCopy } from '@/data/home-copy';
import { useDailyFlip } from '@/hooks/use-daily-flip';
import { useTheme } from '@/hooks/use-theme';

const ART_HEIGHT = 176;
const ILLUSTRATION_HEIGHT = 180;
const ILLUSTRATION_TOP = -4;
const ILLUSTRATION_SETTLE = 14;
const TAG_SLIDE = 8;
const NOTCH_SIZE = 24;

// Figma's skeleton bars, positioned over the title, fields and countdown.
const SKELETON_BARS = [
  { top: 192, width: 64, height: 8 },
  { top: 210, width: 170, height: 16 },
  { top: 252, width: 260, height: 10 },
  { top: 270, width: 200, height: 10 },
  { top: 348, width: 120, height: 24 },
];

// How each layer's entrance sits inside the 600 ms reveal, as fractions of it.
const STAGES = {
  skeleton: [0, 0.25],
  tag: [0.1, 0.5],
  copy: [0.2, 0.7],
  tear: [0.5, 0.8],
  crew: [0.7, 1],
} as const;

function stage(progress: number, range: readonly [number, number]) {
  'worklet';
  return interpolate(progress, range, [0, 1], Extrapolation.CLAMP);
}

type TicketCardProps = {
  organiser: string;
  name: string;
  status: string;
  fields: readonly { label: string; value: string }[];
  daysToGo: string;
  crew: readonly { id: string; label: string; tone: ThemeColor }[];
  crewSummary: string;
  loading: boolean;
  /** Flip the countdown even if it already flipped today, for example after pull to refresh. */
  replayFlip?: boolean;
};

/** Boarding-pass style card for the campaign, with a countdown stub. */
export function TicketCard({
  organiser,
  name,
  status,
  fields,
  daysToGo,
  crew,
  crewSummary,
  loading,
  replayFlip = false,
}: TicketCardProps) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const reducedMotion = useReducedMotion();
  const window = useWindowDimensions();
  const progress = useSharedValue(loading ? 0 : 1);
  const flipToday = useDailyFlip();
  // Yesterday's count, so the changing digit can flip. Skipped if the digit count changes.
  const yesterday = String(Number(daysToGo) + 1);
  const flips = (flipToday || replayFlip) && yesterday.length === daysToGo.length;
  const flipFrom = flips ? yesterday : daysToGo;
  // "All 7 emirates" runs past its equal column in Figma. That only has room at full size.
  const valuesCanOverhang = window.width >= 360 && window.fontScale <= 1;

  useEffect(() => {
    if (loading) return;
    progress.set(
      reducedMotion
        ? withTiming(1, { duration: Motion.duration.fast })
        : standardTiming(1, Motion.duration.celebrate),
    );
  }, [loading, progress, reducedMotion]);

  const cardStyle = useAnimatedStyle(() => ({ opacity: reducedMotion ? progress.get() : 1 }));
  const skeletonStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 1 - progress.get() : 1 - stage(progress.get(), STAGES.skeleton),
  }));
  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reducedMotion ? 0 : (progress.get() - 1) * ILLUSTRATION_SETTLE }],
  }));
  // With Reduce Motion these layers are already in place, and only the crossfade runs.
  // Each style reads `progress` itself: that's how Reanimated knows to re-run it.
  const tagStyle = useAnimatedStyle(() => {
    const amount = reducedMotion ? 1 : stage(progress.get(), STAGES.tag);
    return { opacity: amount, transform: [{ translateX: (amount - 1) * TAG_SLIDE }] };
  });
  const copyStyle = useAnimatedStyle(() => {
    const amount = reducedMotion ? 1 : stage(progress.get(), STAGES.copy);
    return { opacity: amount, transform: [{ translateY: (1 - amount) * Motion.rise }] };
  });
  const tearStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 1 : stage(progress.get(), STAGES.tear),
  }));
  const crewStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 1 : stage(progress.get(), STAGES.crew),
  }));

  return (
    <View>
      <Animated.View
        pointerEvents={loading ? 'none' : 'auto'}
        accessibilityElementsHidden={loading}
        importantForAccessibility={loading ? 'no-hide-descendants' : 'auto'}
        style={[styles.shadow, { boxShadow: Shadows.ticket }, cardStyle]}>
        <LinearGradient {...Gradients.ticket} style={styles.ticket}>
          <TicketGlow />
          <View style={styles.art}>
            <Animated.View style={[styles.illustration, illustrationStyle]}>
              <SvgXml xml={ticketArtXml} width="100%" height={ILLUSTRATION_HEIGHT} preserveAspectRatio="xMidYMid slice" />
            </Animated.View>
            <Animated.View style={[styles.tag, { backgroundColor: theme.ticketGlass }, tagStyle]}>
              <View style={[styles.tagDot, { backgroundColor: theme.unreadDot }]} />
              <ThemedText type="ticketTag" themeColor="textOnBrand">
                {status}
              </ThemedText>
            </Animated.View>
          </View>

          <View style={styles.body}>
            <Animated.View style={[styles.heading, copyStyle]}>
              <ThemedText type="ticketEyebrow" themeColor="ticketMuted">
                {organiser}
              </ThemedText>
              <ThemedText type="etaTitle" themeColor="textOnBrand" accessibilityRole="header">
                {name}
              </ThemedText>
            </Animated.View>
            <Animated.View style={[styles.fields, copyStyle]}>
              {fields.map(({ label, value }) => (
                <View key={label} accessible accessibilityLabel={`${label}: ${value}`} style={styles.field}>
                  <ThemedText type="ticketFieldLabel" themeColor="ticketLabel">
                    {label}
                  </ThemedText>
                  <ThemedText type="link" themeColor="textOnBrand" style={valuesCanOverhang && styles.overhangingValue}>
                    {value}
                  </ThemedText>
                </View>
              ))}
            </Animated.View>
          </View>

          <View style={styles.perforation}>
            <Animated.View style={[styles.tear, tearStyle]}>
              <Svg width="100%" height={1.5}>
                <Line
                  x1={0.75}
                  x2="100%"
                  y1={0.75}
                  y2={0.75}
                  stroke={theme.ticketTear}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={[6, 6]}
                />
              </Svg>
            </Animated.View>
            <View style={[styles.notch, styles.notchStart, { backgroundColor: theme.background }]} />
            <View style={[styles.notch, styles.notchEnd, { backgroundColor: theme.background }]} />
          </View>

          <View style={styles.stub}>
            <View accessible accessibilityLabel={`${daysToGo} days to go`} style={styles.countdown}>
              {/* Numbers always read left to right, even in Arabic. */}
              <DirectionView direction="ltr" style={styles.digits}>
                {daysToGo.split('').map((digit, index) => (
                  <FlipDigit
                    key={index}
                    from={flipFrom[index]}
                    to={digit}
                    play={!loading}
                    delay={HomeTimeline.flipClock}
                  />
                ))}
              </DirectionView>
              <View>
                <ThemedText type="labelSmall" themeColor="textOnBrand">
                  {copy.days}
                </ThemedText>
                <ThemedText type="meta13" themeColor="ticketMuted">
                  {copy.toGo}
                </ThemedText>
              </View>
            </View>

            <Animated.View accessible accessibilityLabel={crewSummary} style={[styles.crew, crewStyle]}>
              <View style={styles.avatars}>
                {crew.map((member, index) => (
                  <View
                    key={member.id}
                    style={[
                      styles.avatar,
                      { backgroundColor: theme[member.tone], borderColor: theme.brandPressed },
                      index < crew.length - 1 && styles.avatarOverlap,
                    ]}>
                    <ThemedText type="avatar" maxFontSizeMultiplier={1}>
                      {member.label}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <ThemedText type="ticketCaption" themeColor="ticketMuted">
                {crewSummary}
              </ThemedText>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.skeleton, { backgroundColor: theme.skeleton }, skeletonStyle]}>
        {loading && !reducedMotion && <Shimmer />}
        {SKELETON_BARS.map(({ top, width, height }) => (
          <View
            key={top}
            style={[
              styles.skeletonBar,
              { top, width, height, borderRadius: height / 2, backgroundColor: theme.card },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

/** The two soft glows over the ticket gradient (Figma CampaignBanner radial fills). */
function TicketGlow() {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="ticketGlowTeal" cx="25%" cy="68%" r="60%">
          <Stop offset="0" stopColor="#4FB3B4" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#4FB3B4" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="ticketGlowLavender" cx="88%" cy="96%" r="55%">
          <Stop offset="0" stopColor="#7484CF" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#7484CF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx="25%" cy="68%" r="60%" fill="url(#ticketGlowTeal)" />
      <Circle cx="88%" cy="96%" r="55%" fill="url(#ticketGlowLavender)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.card,
  },
  ticket: {
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  art: {
    height: ART_HEIGHT,
    overflow: 'hidden',
  },
  illustration: {
    position: 'absolute',
    top: ILLUSTRATION_TOP,
    start: 0,
    end: 0,
    height: ILLUSTRATION_HEIGHT,
  },
  tag: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    start: Spacing.twoThreeQuarters,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    gap: Spacing.threeLess,
    paddingHorizontal: Spacing.threeHalf,
    paddingVertical: 18,
  },
  heading: {
    gap: Spacing.one,
  },
  fields: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  field: {
    flex: 1,
    gap: Spacing.half,
  },
  overhangingValue: {
    width: 120,
  },
  perforation: {
    height: NOTCH_SIZE,
  },
  tear: {
    position: 'absolute',
    top: 11,
    start: Spacing.threeHalf,
    end: Spacing.threeHalf,
  },
  notch: {
    position: 'absolute',
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
  },
  notchStart: {
    start: -NOTCH_SIZE / 2,
  },
  notchEnd: {
    end: -NOTCH_SIZE / 2,
  },
  stub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoHalf,
    paddingBottom: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  // Numbers always read left to right, even when the layout is RTL.
  digits: {
    flexDirection: 'row',
    gap: 3.72,
  },
  crew: {
    flexShrink: 1,
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 14,
  },
  avatarOverlap: {
    marginEnd: -8,
  },
  skeleton: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  skeletonBar: {
    position: 'absolute',
    start: Spacing.threeHalf,
    opacity: 0.7,
  },
});
