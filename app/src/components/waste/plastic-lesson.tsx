import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import {
  resinOffXml,
  resinOnXml,
  stepBottleEmptyXml,
  stepBottleRinseXml,
  stepBottleSquashXml,
  stepDropXml,
  stepGlowXml,
} from '@/constants/plastic-art';
import { Radius, Spacing } from '@/constants/theme';
import { PLASTIC_LESSON } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

// Figma "Bin step" motion (446:10139 timeline): played once when the screen opens, one step after another.
// All keys use cubic-bezier(0.37, 0, 0.63, 1).
const EASE = Easing.bezier(0.37, 0, 0.63, 1);
const t = (to: number, duration: number) => withTiming(to, { duration, easing: EASE });

type StepKey = (typeof PLASTIC_LESSON.steps)[number]['key'];

/** "Before it goes in the bin": three step cards. Tap one once it's done (Figma State=Done). */
export function StepCards() {
  const [done, setDone] = useState<readonly StepKey[]>([]);
  return (
    <View style={styles.steps}>
      {PLASTIC_LESSON.steps.map((step, index) => {
        const isDone = done.includes(step.key);
        return (
          <StepCard
            key={step.key}
            stepKey={step.key}
            number={index + 1}
            title={step.title}
            body={step.body}
            done={isDone}
            onPress={() => {
              feedback.play(isDone ? 'toggle.off' : 'toggle.on');
              setDone((list) => (isDone ? list.filter((k) => k !== step.key) : [...list, step.key]));
            }}
          />
        );
      })}
    </View>
  );
}

function StepCard({
  stepKey,
  number,
  title,
  body,
  done,
  onPress,
}: {
  stepKey: StepKey;
  number: number;
  title: string;
  body: string;
  done: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${number}. ${title}. ${body}`}
      onPress={onPress}
      style={[
        styles.step,
        done ? { borderColor: theme.statusSuccess, borderWidth: 2, padding: 9, paddingBottom: 11 } : { borderColor: theme.strokeWeak },
        { backgroundColor: theme.card },
      ]}>
      <View style={[styles.scene, { backgroundColor: done ? theme.statusSuccess : theme.secondarySubtle }]}>
        <View style={styles.glow} aria-hidden>
          <SvgXml xml={stepGlowXml} width={60} height={60} />
        </View>
        <View style={[styles.sceneArt, done && styles.faded]} aria-hidden>
          {stepKey === 'empty' ? <EmptyScene /> : stepKey === 'rinse' ? <RinseScene /> : <SquashScene />}
        </View>
        <View style={[styles.number, { backgroundColor: done ? 'transparent' : theme.card }]}>
          <ThemedText type="avatar" themeColor={done ? 'textOnBrand' : 'textSecondary'}>{`${number}`}</ThemedText>
        </View>
        {done && (
          <View style={[styles.doneMark, { backgroundColor: theme.statusSuccess, borderColor: theme.textOnBrand }]}>
            <Icon name="check" size={18} color="textOnBrand" strokeWidth={2.5} />
          </View>
        )}
      </View>
      <ThemedText type="stepTitle" style={styles.center}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor={done ? 'statusSuccess' : 'textWeak'} style={styles.center}>
        {done ? 'Done' : body}
      </ThemedText>
    </Tappable>
  );
}

/** Step 1: the bottle tips over, neck down (0.4–1.0 s), then a last drop falls out of the neck (1.05–1.75 s). */
function EmptyScene() {
  const reducedMotion = useReducedMotion();
  const turn = useSharedValue(reducedMotion ? 180 : 0);
  const drop = useSharedValue(0);
  useEffect(() => {
    if (reducedMotion) return;
    turn.set(withDelay(400, t(180, 600)));
    drop.set(withDelay(1050, withSequence(t(1, 300), withDelay(80, t(2, 420)))));
  }, [turn, drop, reducedMotion]);
  const bottleStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get()}deg` }] }));
  // drop 0 → 1: appears (scale 0.35 → 1); 1 → 2: falls 8 px, stretches and fades.
  const dropStyle = useAnimatedStyle(() => {
    const d = drop.get();
    const a = Math.min(d, 1);
    const b = Math.max(d - 1, 0);
    return {
      opacity: d <= 1 ? a : 1 - b,
      transform: [
        { translateY: -2 + 2 * a + 8 * b },
        { scaleX: (0.35 + 0.65 * a) * (1 - 0.08 * b) },
        { scaleY: (0.35 + 0.65 * a) * (1 + 0.08 * b) },
      ],
    };
  });
  return (
    <>
      <Animated.View style={[styles.emptyBottle, bottleStyle]}>
        <SvgXml xml={stepBottleEmptyXml} width={24} height={40} />
      </Animated.View>
      <Animated.View style={[styles.drop, dropStyle]}>
        <SvgXml xml={stepDropXml.replace('opacity="0"', '')} width={8} height={11} viewBox="0 0 8 11" />
      </Animated.View>
    </>
  );
}

/** Step 2: the bottle shakes side to side (1.85–3.2 s). */
function RinseScene() {
  const reducedMotion = useReducedMotion();
  const shake = useSharedValue(0);
  useEffect(() => {
    if (reducedMotion) return;
    // Figma keys every 190 ms: rotate (deg) and x / y nudges.
    shake.set(withDelay(1850, withSequence(...[1, 2, 3, 4, 5, 6, 7].map((k) => t(k, 190)))));
  }, [shake, reducedMotion]);
  const style = useAnimatedStyle(() => {
    const ROT = [0, -16, 15, -14, 12, -8, 4, 0];
    const X = [0, 4, -3.75, 3.5, -3, 2, -1, 0];
    const Y = [0, -1.5, 0, -1.5, 0, -1.5, 0, 0];
    const s = shake.get();
    const i = Math.min(Math.floor(s), 6);
    const f = s - i;
    const lerp = (arr: number[]) => arr[i] + (arr[i + 1] - arr[i]) * f;
    return { transform: [{ translateX: lerp(X) }, { translateY: lerp(Y) }, { rotate: `${lerp(ROT)}deg` }] };
  });
  return (
    <Animated.View style={[styles.rinseBottle, style]}>
      <SvgXml xml={stepBottleRinseXml} width={24} height={40} />
    </Animated.View>
  );
}

/** Step 3: the bottle squashes flat (3.3–3.75 s), holds, then springs back (4.0–4.5 s). */
function SquashScene() {
  const reducedMotion = useReducedMotion();
  const squash = useSharedValue(0);
  useEffect(() => {
    if (reducedMotion) return;
    squash.set(withDelay(3300, withSequence(t(1, 450), withDelay(250, t(0, 500)))));
  }, [squash, reducedMotion]);
  const style = useAnimatedStyle(() => {
    const s = squash.get();
    return { transform: [{ translateY: 9 * s }, { scaleX: 1 + 0.12 * s }, { scaleY: 1 - 0.45 * s }] };
  });
  return (
    <Animated.View style={[styles.squashBottle, style]}>
      <SvgXml xml={stepBottleSquashXml} width={24} height={40} />
    </Animated.View>
  );
}

/** "Which plastic is it?": the seven resin codes and what each one means (Figma Resin explorer). */
export function ResinExplorer() {
  const theme = useTheme();
  const [code, setCode] = useState(1);
  const info = PLASTIC_LESSON.codes[code - 1];
  const green = info.bin === 'green';
  return (
    <View style={styles.explorer}>
      <View style={styles.codes} accessibilityRole="radiogroup">
        {PLASTIC_LESSON.codes.map((item) => {
          const on = item.code === code;
          return (
            <Tappable
              key={item.code}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Code ${item.code}, ${item.name}`}
              onPress={() => setCode(item.code)}
              style={[styles.code, on ? { backgroundColor: theme.optionStroke } : { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.strokeWeak }]}>
              <View style={styles.codeMark}>
                <SvgXml xml={on ? resinOnXml : resinOffXml} width={34} height={30} />
                <ThemedText type="codeNumber" themeColor={on ? 'strokeControl' : 'textStrong'} style={styles.codeText}>{`${item.code}`}</ThemedText>
              </View>
            </Tappable>
          );
        })}
      </View>
      <View style={[styles.info, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]} accessibilityLiveRegion="polite">
        <View style={styles.infoTop}>
          <ThemedText type="sectionTitle" style={styles.flex}>{`${info.code} · ${info.name}`}</ThemedText>
          <View style={[styles.status, { backgroundColor: green ? theme.statusSuccessSubtle : theme.textStrong }]}>
            <Icon name={green ? 'check' : 'close'} size={12} color={green ? 'statusSuccess' : 'textOnBrand'} strokeWidth={2.5} />
            <ThemedText type="chipAction" themeColor={green ? 'statusSuccess' : 'textOnBrand'}>
              {green ? 'Green bin' : 'Black bin'}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="hint">{info.uses}</ThemedText>
        <ThemedText type="meta" themeColor="textWeak">
          {info.tip}
        </ThemedText>
      </View>
    </View>
  );
}

/** "Green bin or black bin?": a two-way toggle over the common items (Figma Bin toggle). */
export function BinToggle() {
  const theme = useTheme();
  const [show, setShow] = useState<'in' | 'out'>('in');
  const items = show === 'in' ? PLASTIC_LESSON.goesIn : PLASTIC_LESSON.keepOut;
  return (
    <View style={styles.toggle}>
      <View style={[styles.segments, { backgroundColor: theme.fill }]} accessibilityRole="tablist">
        {(['in', 'out'] as const).map((side) => {
          const on = show === side;
          const isIn = side === 'in';
          return (
            <Tappable
              key={side}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={isIn ? 'Green bin' : 'Black bin'}
              onPress={() => setShow(side)}
              style={[styles.segment, on && { backgroundColor: theme.card, boxShadow: '0px 1px 4px 0px rgba(18, 36, 46, 0.08)' }]}>
              <Icon
                name={isIn ? 'check' : 'close'}
                size={14}
                color={on ? (isIn ? 'statusSuccess' : 'textStrong') : 'strokeStrong'}
                strokeWidth={2.25}
              />
              <ThemedText type={on ? 'label' : 'link'} themeColor={on ? 'textStrong' : 'textWeak'}>
                {isIn ? 'Green bin' : 'Black bin'}
              </ThemedText>
            </Tappable>
          );
        })}
      </View>
      <View style={[styles.list, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
        {items.map((row, index) => (
          <View key={row.item}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />}
            <View style={styles.item} accessible accessibilityLabel={`${row.item}${row.code ? `, code ${row.code}` : ''}`}>
              <View style={[styles.mark, { backgroundColor: show === 'in' ? theme.statusSuccessSubtle : theme.textStrong }]}>
                <Icon name={show === 'in' ? 'check' : 'close'} size={14} color={show === 'in' ? 'statusSuccess' : 'textOnBrand'} strokeWidth={2.5} />
              </View>
              <ThemedText type="hint" style={styles.flex}>
                {row.item}
              </ThemedText>
              {row.code ? (
                <ThemedText type="filterLabelTight" themeColor="textWeak">
                  {row.code}
                </ThemedText>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  steps: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  // Figma Bin step: white, 1 px #E3E8EB, radius 18, 10 px (12 bottom) padding, 6 gap.
  step: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.twoHalf,
    paddingBottom: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: Radius.large,
  },
  scene: {
    alignSelf: 'stretch',
    height: 84,
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  glow: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
  },
  sceneArt: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
  },
  faded: {
    opacity: 0.35,
  },
  emptyBottle: {
    position: 'absolute',
    top: 25,
    alignSelf: 'center',
  },
  drop: {
    position: 'absolute',
    top: 63,
    alignSelf: 'center',
    width: 8,
    height: 11,
  },
  rinseBottle: {
    position: 'absolute',
    top: 31,
    alignSelf: 'center',
  },
  squashBottle: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
  },
  // Figma Number: 16 px white circle, 5 px from the left, 63 from the top.
  number: {
    position: 'absolute',
    start: 5,
    top: 63,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  // Figma State=Done: 36 px green mark in the middle of the scene.
  doneMark: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 2,
  },
  center: {
    textAlign: 'center',
  },
  explorer: {
    gap: Spacing.twoThreeQuarters,
    alignSelf: 'stretch',
  },
  codes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  code: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  codeMark: {
    width: 34,
    height: 30,
  },
  codeText: {
    position: 'absolute',
    top: 11,
    start: 0,
    end: 0,
    textAlign: 'center',
  },
  info: {
    gap: Spacing.oneHalf,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.twoHalf,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  toggle: {
    gap: Spacing.twoThreeQuarters,
    alignSelf: 'stretch',
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    borderRadius: Radius.pill,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  list: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  divider: {
    height: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  mark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});
