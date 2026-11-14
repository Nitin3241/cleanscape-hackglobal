import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { CELEBRATE, CELEBRATE_EASING } from '@/components/motion/celebrate';
import { joySpring } from '@/constants/motion';
import { Motion, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ConfettiPiece = {
  /** Where the piece lands, in pixels from the centre of the burst. */
  x: number;
  y: number;
  rotate: number;
  color: ThemeColor;
};

/**
 * A burst from a single point, centred in the parent. Reduce Motion skips it.
 * With `fall`, the pieces sit at their spots and drop into place instead (Figma celebration
 * entrances, 9 Nov: confetti falls 80 px during beat 2).
 */
export function Confetti({ pieces, fall = false }: { pieces: readonly ConfettiPiece[]; fall?: boolean }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <View pointerEvents="none" style={styles.burst}>
      {pieces.map((piece) => (
        <Piece key={`${piece.x},${piece.y}`} {...piece} fall={fall} />
      ))}
    </View>
  );
}

function Piece({ x, y, rotate, color, fall }: ConfettiPiece & { fall: boolean }) {
  const theme = useTheme();
  const burst = useSharedValue(0);

  useEffect(() => {
    burst.set(
      fall
        ? withDelay(CELEBRATE.beatOne.duration, withTiming(1, { duration: CELEBRATE.beatTwo.duration, easing: CELEBRATE_EASING }))
        : joySpring(1, Motion.duration.celebrate),
    );
  }, [burst, fall]);

  const pieceStyle = useAnimatedStyle(() =>
    fall
      ? {
          opacity: interpolate(burst.get(), [0, 0.3], [0, 1], 'clamp'),
          transform: [
            { translateX: x },
            { translateY: y - (1 - burst.get()) * CELEBRATE.confettiFall },
            { rotate: `${rotate}deg` },
          ],
        }
      : {
          opacity: interpolate(burst.get(), [0, 0.15], [0, 1], 'clamp'),
          transform: [{ translateX: burst.get() * x }, { translateY: burst.get() * y }, { rotate: `${rotate}deg` }],
        },
  );

  return <Animated.View style={[styles.piece, { backgroundColor: theme[color] }, pieceStyle]} />;
}

const styles = StyleSheet.create({
  burst: {
    position: 'absolute',
    top: '50%',
    start: '50%',
  },
  piece: {
    position: 'absolute',
    width: 10,
    height: 5,
    marginStart: -5,
    marginTop: -2.5,
    borderRadius: 2,
  },
});
