import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScanBracketsProps = {
  /** Square side in px (Figma: 240 on the crew scanner, 100 on the bag sticker). */
  size: number;
  color?: ThemeColor;
  /** Length of each corner arm, from the outer edge. */
  arm?: number;
  stroke?: number;
  /** Corner radius of each bracket (Figma "Scan brackets": 12 on the 240 frame). */
  radius?: number;
  /** Marigold line sweeping top to bottom and back, 1.3 s each way (scanners, not the bag sticker). */
  line?: boolean;
};

/**
 * Figma "Scan brackets" (1003:13789): four rounded corners drawn as the frame's own paths, stroke centred on the
 * box edge, plus an optional scan line inset 16 px (3 px tall, glowing) that sweeps inside the box.
 */
export function ScanBrackets({
  size,
  color = 'scanBracket',
  arm = Math.round(size * 0.142),
  stroke = 4,
  radius = 12,
  line = false,
}: ScanBracketsProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (!line || reducedMotion) return;
    sweep.set(withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.ease) }), -1, true));
    return () => cancelAnimation(sweep);
  }, [line, reducedMotion, sweep]);

  const inset = 16;
  const travel = size - inset * 2 - 3;
  const lineStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (reducedMotion ? 0.5 : sweep.get()) * travel }] }));

  // Paths in a box grown by half the stroke on each side, as Figma exports them (244 × 244 for 240 + 4).
  const h = stroke / 2;
  const s = size + stroke;
  const a = arm + h;
  const c = radius / 3; // cubic control offset that matches Figma's curve (12 → 4)
  const r = radius + h;
  const d = [
    `M${h} ${a}V${r}C${h} ${h + c} ${h + c} ${h} ${r} ${h}H${a}`,
    `M${s - a} ${h}H${s - r}C${s - h - c} ${h} ${s - h} ${h + c} ${s - h} ${r}V${a}`,
    `M${h} ${s - a}V${s - r}C${h} ${s - h - c} ${h + c} ${s - h} ${r} ${s - h}H${a}`,
    `M${s - h} ${s - a}V${s - r}C${s - h} ${s - h - c} ${s - h - c} ${s - h} ${s - r} ${s - h}H${s - a}`,
  ].join('');

  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
      <Svg width={s} height={s} style={{ position: 'absolute', left: -h, top: -h }}>
        <Path d={d} stroke={theme[color]} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
      {line && <Animated.View style={[styles.line, { top: inset, start: inset, end: inset, backgroundColor: theme.scanLine }, lineStyle]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma "Scan line": 3 px, 1.5 radius, glow 0 0 12 marigold 80%.
  line: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
    boxShadow: '0px 0px 12px 0px rgba(233, 162, 59, 0.8)',
  },
});
