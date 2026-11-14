// A real spinning arc (not a dashed border). Runs entirely on the UI thread.
import { useEffect } from 'react';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { linear } from '@/components/earthy/motion';
import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TURN = 800;

export function StepSpinner({
  size = 18,
  stroke = 2,
  color = 'secondary',
  track = 'spinnerTrack',
  arc = 0.28,
}: {
  size?: number;
  stroke?: number;
  color?: ThemeColor;
  track?: ThemeColor;
  /** Share of the ring the arc covers. */
  arc?: number;
}) {
  const theme = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.set(withRepeat(withTiming(360, { duration: TURN, easing: linear }), -1, false));
    return () => cancelAnimation(spin);
  }, [spin]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.get()}deg` }] }));

  return (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme[track]} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme[color]}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * arc} ${c}`}
        />
      </Svg>
    </Animated.View>
  );
}
