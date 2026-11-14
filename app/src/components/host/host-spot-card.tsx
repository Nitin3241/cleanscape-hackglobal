import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { HOST_SPOTS, type HostSpot, LEVEL_COLORS, LEVEL_LABEL } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

const SINE = 300; // Figma: the card switches spots in 300 ms, sine ease.

type HostSpotCardProps = {
  spot: HostSpot;
  /** Tap on the card: move to the next spot. */
  onNext: () => void;
  onWhy: () => void;
};

/** Figma "Host spot card" (F10·11): one hotspot at a time with Earthy's job estimate. */
export function HostSpotCard({ spot, onNext, onWhy }: HostSpotCardProps) {
  const theme = useTheme();
  const level = LEVEL_COLORS[spot.level];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeCard, boxShadow: Shadows.optionCard }]}>
      <Animated.View key={spot.id} entering={FadeIn.duration(SINE)} style={styles.inner}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`Spot ${spot.rank} of ${HOST_SPOTS.length}: ${spot.name}, ${spot.where}, ${LEVEL_LABEL[spot.level]}. ${spot.reason} Show the next spot`}
          onPress={onNext}
          style={styles.top}>
          <View style={[styles.rank, { backgroundColor: theme[level.fill] }]}>
            <ThemedText type="rankNumber" themeColor={level.text}>
              {spot.rank}
            </ThemedText>
          </View>
          <View style={styles.place}>
            <ThemedText type="placeTitle" numberOfLines={1}>
              {spot.name}
            </ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {spot.where}
            </ThemedText>
          </View>
          <View style={[styles.level, { backgroundColor: theme[level.fill] }]}>
            <View style={[styles.levelDot, { backgroundColor: theme[level.text] }]} />
            <ThemedText type="tag" themeColor={level.text}>
              {LEVEL_LABEL[spot.level]}
            </ThemedText>
          </View>
        </Tappable>

        <View>
          <ThemedText type="note">{spot.reason}</ThemedText>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Why it’s ranked ${spot.rank}`}
            hitSlop={8}
            onPress={onWhy}
            style={styles.why}>
            <ThemedText type="fieldLabel" themeColor="brand">
              {`Why it’s ranked ${spot.rank}`}
            </ThemedText>
            <Icon name="chevron-end" size={16} color="brand" strokeWidth={2} />
          </Tappable>
        </View>

        <View style={styles.estimate}>
          <View style={styles.label}>
            <EarthyOrb size={16} state="still" glow={false} />
            <ThemedText type="filterLabelTight" themeColor="textWeak" style={styles.flex}>
              Earthy’s estimate for this job
            </ThemedText>
            <View style={styles.dots} accessible accessibilityLabel={`Spot ${spot.rank} of ${HOST_SPOTS.length}`}>
              {HOST_SPOTS.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.dot,
                    item.id === spot.id ? { width: 16, backgroundColor: theme.brand } : { backgroundColor: theme.strokeCoHost },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.stats}>
            <Stat icon="users" value={`${spot.people}`} label="people" />
            <Stat icon="clock" value={spot.hours} label="time" />
            <Stat icon="rubbish-bag" value={spot.bags} label="bags" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

/** Figma "bags" icon: a tied rubbish bag (no matching Lucide icon), 16 px, 1.6 stroke. */
function RubbishBag() {
  const theme = useTheme();
  const line = { stroke: theme.brand, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path d="M3.3 7.475C2.3 9.975 2.8 13.475 4.8 14.475H10.8C12.8 13.475 13.3 9.975 12.3 7.475C10.8 6.575 4.8 6.575 3.3 7.475Z" {...line} />
      <Path d="M6 3.2L8 6.6L10 3.2" {...line} />
    </Svg>
  );
}

export function Stat({ icon, value, label }: { icon: IconName | 'rubbish-bag'; value: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: theme.loaderCard }]} accessible accessibilityLabel={`${value} ${label}`}>
      <View style={[styles.statIcon, { backgroundColor: theme.card }]}>
        {icon === 'rubbish-bag' ? <RubbishBag /> : <Icon name={icon} size={16} color="brand" strokeWidth={1.6} />}
      </View>
      <View>
        <ThemedText type="eventTitle">{value}</ThemedText>
        <ThemedText type="micro11" themeColor="textWeak">
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  inner: {
    gap: Spacing.threeLess,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  rank: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  place: {
    flex: 1,
    gap: 1,
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
  why: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    paddingTop: Spacing.half,
  },
  estimate: {
    gap: Spacing.two,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  flex: {
    flex: 1,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.oneHalf,
    borderRadius: Radius.small,
  },
  statIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
