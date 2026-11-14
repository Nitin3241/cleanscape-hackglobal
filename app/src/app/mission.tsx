import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PlainHeader } from '@/components/ui/plain-header';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { MISSION } from '@/data/proactive.sample';
import { useTheme } from '@/hooks/use-theme';

const ROUTE = require('@/assets/images/mission-route.png');

/**
 * F10·12 Daily 5-minute mission: a tiny task that fits the day (3 items on the walk to school),
 * a streak, and Earthy adjusting tomorrow's mission. "Log manually" adds the last item here;
 * "Scan item" uses the waste scanner.
 */
export default function MissionRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [found, setFound] = useState<readonly { name: string; time: string }[]>(MISSION.found);
  const done = found.length >= MISSION.target;
  const left = MISSION.target - found.length;

  const logOne = () => {
    if (done) return;
    const now = new Date();
    setFound((items) => [...items, { name: 'Item', time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` }]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <PlainHeader
        title="Today’s mission"
        subtitle={MISSION.date}
        // Swapping the mission isn't designed yet.
        end={<RoundButton icon="swap" label="Swap mission" />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.card }]}>
          <View style={styles.missionTop}>
            <Ring value={found.length} of={MISSION.target} />
            <View style={styles.flex}>
              <ThemedText type="eventTitle" accessibilityRole="header">
                {MISSION.title}
              </ThemedText>
              <ThemedText type="note" themeColor="brand" accessibilityLiveRegion="polite">
                {done ? `Done · +${MISSION.reward} Smileys` : `${left} more to finish · +${MISSION.reward} Smileys`}
              </ThemedText>
            </View>
          </View>
          <View style={styles.items}>
            {Array.from({ length: MISSION.target }, (_, index) => {
              const item = found[index];
              return item ? (
                <Animated.View
                  key={index}
                  entering={index >= MISSION.found.length ? ZoomIn.springify().damping(14) : undefined}
                  style={[styles.item, { backgroundColor: theme.statusSuccessSubtle }]}
                  accessible
                  accessibilityLabel={`${item.name} at ${item.time}`}>
                  <View style={[styles.itemTick, { backgroundColor: theme.statusSuccess }]}>
                    <Icon name="check" size={14} color="textOnBrand" strokeWidth={3} />
                  </View>
                  <ThemedText type="label" themeColor="statusSuccess">
                    {item.name}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textWeak">
                    {item.time}
                  </ThemedText>
                </Animated.View>
              ) : (
                <Tappable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel="Log 1 more item"
                  onPress={logOne}
                  style={[styles.item, styles.empty, { borderColor: theme.strokeControl }]}>
                  <View style={[styles.itemTick, { backgroundColor: theme.wellCool }]}>
                    <Icon name="plus" size={14} color="textWeak" />
                  </View>
                  <ThemedText type="note" themeColor="textWeak">
                    1 more
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>

        <View style={styles.route}>
          {/* Too short for the +/- buttons; pinch and double tap still zoom. */}
          <ZoomableMap controls={false}>
            <Image
              source={ROUTE}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessible
              accessibilityLabel={`Map: ${MISSION.route}`}
            />
          </ZoomableMap>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <View style={styles.streakTop}>
            <ThemedText type="labelLarge">{`${MISSION.streak.done}-day streak`}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              This week
            </ThemedText>
          </View>
          <View style={styles.days} accessible accessibilityLabel={`${MISSION.streak.done} of ${MISSION.streak.goal} days done this week`}>
            {MISSION.streak.days.map((day, index) => {
              const ticked = index < MISSION.streak.done;
              return (
                <View key={index} style={styles.day}>
                  <View
                    style={[
                      styles.dayDot,
                      ticked ? { backgroundColor: theme.alertBadge } : [styles.dayToday, { borderColor: theme.brand }],
                    ]}>
                    {ticked && <Icon name="check" size={14} color="textOnBrand" strokeWidth={3} />}
                  </View>
                  <ThemedText type="caption" themeColor={ticked ? 'textWeak' : 'brand'}>
                    {day}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          <View style={styles.streakBar}>
            <View style={styles.flex}>
              <ProgressBar progress={MISSION.streak.done / MISSION.streak.goal} tone="secondary" trackTone="fill" label="Streak progress" />
            </View>
            <ThemedText type="caption" themeColor="textSecondary">{`1 day to +${MISSION.streak.bonus} bonus`}</ThemedText>
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: theme.fill }]}>
          <EarthyOrb size={22} state="still" glow={false} />
          <ThemedText type="note" style={styles.flex}>
            {MISSION.tomorrow}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.card, boxShadow: Shadows.stickyFooter, paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <View style={styles.flex}>
          <Button label="Log manually" variant="outline" pill flat disabled={done} onPress={logOne} />
        </View>
        <View style={styles.flex}>
          <Button label="Scan item" pill flat disabled={done} onPress={() => router.push('/waste-scan')} />
        </View>
      </View>
    </View>
  );
}

function Ring({ value, of }: { value: number; of: number }) {
  const theme = useTheme();
  const size = 72;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }} accessible accessibilityLabel={`${value} of ${of} items`}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.fill} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.brand}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[length * (value / of), length]}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringText}>
        <ThemedText type="screenTitle">{`${value}/${of}`}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.four,
  },
  card: {
    gap: Spacing.threeLess,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  missionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
  },
  flex: {
    flex: 1,
  },
  ringText: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  items: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    minHeight: 86,
    gap: Spacing.half,
    padding: Spacing.twoHalf,
    borderRadius: Radius.option,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  itemTick: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  route: {
    height: 96,
    overflow: 'hidden',
    borderRadius: Radius.option,
  },
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  dayDot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  dayToday: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  streakBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  note: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    paddingTop: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
  },
});
