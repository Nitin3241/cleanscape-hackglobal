// Green tick that pops in and draws its stroke. Used when a thinking step completes.
import { useEffect } from 'react';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { dur, ease, pop } from '@/components/earthy/motion';
import { useTheme } from '@/hooks/use-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const TICK_LENGTH = 12;

export function StepCheck({ size = 18 }: { size?: number }) {
  const theme = useTheme();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const draw = useSharedValue(TICK_LENGTH);

  useEffect(() => {
    opacity.set(withTiming(1, { duration: dur.fast, easing: ease }));
    scale.set(withTiming(1, { duration: 320, easing: pop }));
    draw.set(withDelay(80, withTiming(0, { duration: 220, easing: ease })));
  }, [draw, opacity, scale]);

  const wrap = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: scale.get() }] }));
  const tick = useAnimatedProps(() => ({ strokeDashoffset: draw.get() }));

  return (
    <Animated.View style={[{ width: size, height: size }, wrap]}>
      <Svg width={size} height={size} viewBox="0 0 18 18">
        <Circle cx={9} cy={9} r={9} fill={theme.statusSuccessSubtle} />
        <AnimatedPath
          d="M5.4 9.3l2.4 2.4 4.8-5.2"
          stroke={theme.statusSuccess}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={TICK_LENGTH}
          animatedProps={tick}
        />
      </Svg>
    </Animated.View>
  );
}
