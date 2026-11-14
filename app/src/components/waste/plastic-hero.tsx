import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { baseCodeXml, checkCircleXml, flipArrowHeadXml, flipArrowXml, heroBottleXml, heroShadowXml, hintIconXml } from '@/constants/plastic-art';
import { Spacing } from '@/constants/theme';
import { PLASTIC_LESSON } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

// Figma "Hero bottle" (796:12645): tap flips the bottle to show the code on its base (Smart Animate 400 ms,
// cubic-bezier(0.77, 0, 0.175, 1)). Positions are the bottle group's centre and angle in each state.
const FLIP = { duration: 400, easing: Easing.bezier(0.77, 0, 0.175, 1) };
const BOTTLE = { width: 38.5, height: 123.52 };
const UPRIGHT = { cx: 95.4, cy: 148.91, angle: -4.85 };
const FLIPPED = { cx: 96.65, cy: 152.04, angle: 170 };

export function PlasticHero() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    feedback.play('toggle.on');
    progress.set(reducedMotion ? (next ? 1 : 0) : withTiming(next ? 1 : 0, FLIP));
  };

  const bottleStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      left: interpolate(p, [0, 1], [UPRIGHT.cx, FLIPPED.cx]) - BOTTLE.width / 2,
      top: interpolate(p, [0, 1], [UPRIGHT.cy, FLIPPED.cy]) - BOTTLE.height / 2,
      transform: [{ rotate: `${interpolate(p, [0, 1], [UPRIGHT.angle, FLIPPED.angle])}deg` }],
    };
  });
  // The shadow narrows from 70.6 × 14.8 to 46 × 10.4 as the bottle stands on its neck.
  const shadowStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      left: interpolate(p, [0, 1], [64, 84]),
      top: interpolate(p, [0, 1], [205, 210.5]),
      transform: [{ scaleX: interpolate(p, [0, 1], [1, 46 / 70.58]) }, { scaleY: interpolate(p, [0, 1], [1, 10.35 / 14.76]) }],
    };
  });
  const uprightStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.get() }));
  const flippedStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));

  const info = PLASTIC_LESSON.flipped;
  const glow = { boxShadow: '0px 4px 12px 0px rgba(18, 36, 46, 0.12)' };

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={flipped ? `${info.eyebrow}, ${info.title}. ${info.bin}. Flip it back` : 'Plastic bottle. Tap to see its number'}
      onPress={toggle}
      pressedScale={1}
      style={styles.hero}>
      <Animated.View style={[styles.shadow, shadowStyle]} aria-hidden>
        <SvgXml xml={heroShadowXml} width={70.58} height={14.76} />
      </Animated.View>
      <Animated.View style={[styles.bottle, bottleStyle]} aria-hidden>
        <SvgXml xml={heroBottleXml} width={BOTTLE.width} height={BOTTLE.height} />
      </Animated.View>

      {/* Upright: the hint chip, centred 52 px right of the hero's middle. */}
      <Animated.View style={[styles.hint, styles.hintUpright, { backgroundColor: theme.card }, glow, uprightStyle]} pointerEvents="none">
        <SvgXml xml={hintIconXml} width={16} height={16} />
        <ThemedText type="filterLabelTight">Tap to see its number</ThemedText>
      </Animated.View>

      {/* Flipped: code badge with a dashed arrow from the base, the info callout, and "Flip it back". */}
      <Animated.View style={[StyleSheet.absoluteFill, flippedStyle]} pointerEvents="none">
        <View style={styles.arrow}>
          <SvgXml xml={flipArrowXml} width={58.5} height={64.38} />
        </View>
        <View style={styles.arrowHead}>
          <SvgXml xml={flipArrowHeadXml} width={9} height={6} />
        </View>
        <View style={[styles.code, { backgroundColor: theme.card }, glow]}>
          <View style={styles.codeMark}>
            <SvgXml xml={baseCodeXml} width={34} height={30} />
          </View>
          <ThemedText type="labelSmall" themeColor="optionStroke" style={styles.codeText}>
            1
          </ThemedText>
        </View>
        <View style={[styles.info, { backgroundColor: theme.card, boxShadow: '0px 6px 16px 0px rgba(18, 37, 46, 0.12)' }]}>
          <View style={[styles.pointer, { backgroundColor: theme.card }]} />
          <ThemedText type="tag" themeColor="textSecondary" style={styles.eyebrow}>
            {info.eyebrow}
          </ThemedText>
          <ThemedText type="headerTitle" style={styles.infoTitle}>
            {info.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {info.body}
          </ThemedText>
          <View style={[styles.divider, { backgroundColor: theme.skeleton }]} />
          <View style={styles.bin}>
            <SvgXml xml={checkCircleXml} width={20} height={20} />
            <ThemedText type="labelSmall" themeColor="statusSuccess">
              {info.bin}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.hint, styles.hintFlipped, { backgroundColor: theme.card }, glow]}>
          <SvgXml xml={hintIconXml} width={16} height={16} />
          <ThemedText type="filterLabelTight">Flip it back</ThemedText>
        </View>
      </Animated.View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: 360,
    height: 260,
  },
  shadow: {
    position: 'absolute',
  },
  bottle: {
    position: 'absolute',
  },
  // Figma "Hint": white capsule, 10 / 12 × 6 padding, 6 gap, 16 px icon, 12 medium.
  hint: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: 999,
  },
  // Figma: text at x 176, so the chip starts at 144 (10 padding + 16 icon + 6 gap before it).
  hintUpright: {
    top: 139,
    start: 144,
  },
  hintFlipped: {
    top: 211,
    start: 144,
  },
  arrow: {
    position: 'absolute',
    left: 27.5,
    top: 86,
  },
  arrowHead: {
    position: 'absolute',
    left: 30,
    top: 149,
  },
  // Figma "Base code": 44 px white circle at (16, 163), triangle 34 × 30 at (5, 6), "1" in tint blue.
  code: {
    position: 'absolute',
    left: 16,
    top: 163,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  codeMark: {
    position: 'absolute',
    left: 5,
    top: 6,
  },
  codeText: {
    position: 'absolute',
    top: 15,
    width: 44,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Figma "Info card": 196 wide at (144, 64), 14 × 12 padding, 16 radius, left pointer.
  info: {
    position: 'absolute',
    left: 144,
    top: 64,
    width: 196,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: 16,
  },
  pointer: {
    position: 'absolute',
    left: -6,
    top: 75,
    width: 12,
    height: 12,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  eyebrow: {
    letterSpacing: 0.66,
    lineHeight: 14,
    marginBottom: 2,
  },
  infoTitle: {
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.twoHalf,
  },
  bin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
