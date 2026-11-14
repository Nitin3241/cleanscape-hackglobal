import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';

// Figma glow colour on scan result parts (F4·9, F4·9p, F9v2·3): orange #F28C28.
const ORANGE = '#F28C28';
const SWEEP_WIDTH = 106;
const SWEEP_HEIGHT = 171;
const SWEEP_MS = 1100;
const SWEEP_EASE = Easing.bezier(0.65, 0, 0.35, 1);

/**
 * The light on a scan result part card (changelog 12 Nov, glow v3 + motion v4): a static orange wash from the
 * top-left corner, and once, as the result appears, a soft tilted band of light sweeping left to right over 1.1 s,
 * fading in over its first 0.25 s and out over its last 0.3 s. Reduce Motion keeps the wash and skips the sweep.
 * Place it first inside a card that clips (overflow hidden).
 */
export function PartGlow({ delay }: { delay: number }) {
  const reducedMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion || width === 0) return;
    progress.set(withDelay(delay, withTiming(1, { duration: SWEEP_MS, easing: SWEEP_EASE })));
  }, [delay, progress, reducedMotion, width]);

  const sweepStyle = useAnimatedStyle(() => {
    const p = progress.get();
    const t = p * SWEEP_MS;
    // Fade in over the first 250 ms and out over the last 300 ms of the sweep.
    const opacity = p === 0 ? 0 : Math.min(1, t / 250, (SWEEP_MS - t) / 300);
    return {
      opacity: Math.max(opacity, 0),
      transform: [{ translateX: -SWEEP_WIDTH + p * (width + SWEEP_WIDTH * 2) }, { rotate: '-14deg' }],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {/* Static wash: a radial gradient centred off the top-left corner, orange fading out by ~70% of the width (tuned to
          match the frame's blurred ellipses, which read stronger than the note's 18%). */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="partWash" cx="-10%" cy="30%" rx="80%" ry="260%" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={ORANGE} stopOpacity={0.38} />
            <Stop offset="0.5" stopColor={ORANGE} stopOpacity={0.14} />
            <Stop offset="1" stopColor={ORANGE} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#partWash)" />
      </Svg>
      {!reducedMotion && (
        <Animated.View style={[styles.sweep, sweepStyle]}>
          <Svg width={SWEEP_WIDTH} height={SWEEP_HEIGHT}>
            <Defs>
              <RadialGradient id="partSweep" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor={ORANGE} stopOpacity={0.22} />
                <Stop offset="1" stopColor={ORANGE} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse
              cx={SWEEP_WIDTH / 2}
              cy={SWEEP_HEIGHT / 2}
              rx={SWEEP_WIDTH / 2}
              ry={SWEEP_HEIGHT / 2}
              fill="url(#partSweep)"
            />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // The band is taller than the 72 px card and centred on it, so its tilted ends stay outside the clip.
  sweep: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -SWEEP_HEIGHT / 2,
    width: SWEEP_WIDTH,
    height: SWEEP_HEIGHT,
  },
});
