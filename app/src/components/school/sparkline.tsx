import { View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

const WIDTH = 100;
const HEIGHT = 40;
const PAD = 6;

/** A small trend line ending in a dot for "now" (Figma F3·8c "Sparkline", 100 × 40). Decorative. */
export function Sparkline({ points }: { points: readonly number[] }) {
  const theme = useTheme();
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((value, index) => ({
    x: PAD + (index / Math.max(points.length - 1, 1)) * (WIDTH - PAD * 2),
    y: HEIGHT - PAD - ((value - min) / span) * (HEIGHT - PAD * 2),
  }));
  const last = coords[coords.length - 1];

  return (
    <View aria-hidden>
      <Svg width={WIDTH} height={HEIGHT}>
        <Polyline
          points={coords.map((c) => `${c.x},${c.y}`).join(' ')}
          fill="none"
          stroke={theme.avatarTeal}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={last.x} cy={last.y} r={5} fill={theme.brand} stroke={theme.card} strokeWidth={2} />
      </Svg>
    </View>
  );
}
