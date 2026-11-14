import { StyleSheet, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { useTheme } from '@/hooks/use-theme';

// Figma P2 "QR" (890:12856): 148 px white tile, three rounded finder squares, 5 px modules and the Earthy orb in
// the middle. SAMPLE: a picture of a code, not a scannable one, until friend links exist.
const MODULES: [number, number][] = [
  [26, 68], [26, 74], [32, 68], [38, 68], [44, 74], [50, 68], [56, 74], [62, 74],
  [68, 26], [68, 44], [68, 50], [68, 68], [68, 74], [68, 86], [68, 92], [68, 110], [68, 116],
  [74, 20], [74, 26], [74, 38], [74, 44], [74, 56], [74, 62], [74, 68], [74, 80], [74, 98], [74, 110],
  [80, 68], [80, 74], [80, 86], [80, 92], [80, 98], [80, 122],
  [86, 68], [86, 80], [86, 98], [86, 104], [86, 110], [86, 122],
  [92, 68], [92, 122],
  [98, 68], [98, 74], [98, 80], [98, 86], [98, 104], [98, 116], [98, 122],
  [104, 74], [104, 80], [104, 116],
  [110, 74], [110, 80], [110, 86], [110, 116],
  [116, 68], [116, 74], [116, 80], [116, 86], [116, 110], [116, 122],
  [122, 68], [122, 80], [122, 86], [122, 92], [122, 98], [122, 110], [122, 116], [122, 122],
];
const FINDERS: [number, number][] = [
  [20, 20],
  [86, 20],
  [20, 86],
];

export function FriendCode() {
  const theme = useTheme();
  const ink = theme.textStrong;
  return (
    <View style={[styles.tile, { backgroundColor: theme.card }]}>
      <Svg width={148} height={148}>
        {MODULES.map(([x, y]) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={5} height={5} rx={1.5} fill={ink} />
        ))}
        {FINDERS.map(([x, y]) => (
          <G key={`${x}-${y}`}>
            <Rect x={x} y={y} width={42} height={42} rx={6} fill={ink} />
            <Rect x={x + 6} y={y + 6} width={30} height={30} rx={4} fill={theme.card} />
            <Rect x={x + 12} y={y + 12} width={18} height={18} rx={2} fill={ink} />
          </G>
        ))}
      </Svg>
      <View style={styles.orb}>
        <EarthyOrb size={26} state="still" glow={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 148,
    height: 148,
    overflow: 'hidden',
    borderRadius: 16,
  },
  orb: {
    position: 'absolute',
    left: 61,
    top: 61,
  },
});
