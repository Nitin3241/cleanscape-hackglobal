import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

/**
 * A plain city-block map, drawn like Figma's drop-off map (grey blocks, green parks, white
 * streets). Decorative: it stands in for a real map until a map service is connected.
 */
export function StreetMap({ height }: { height: number }) {
  const blocks = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 5; col++) {
      const park = (row === 1 && col === 4) || (row === 4 && col === 0) || (row === 3 && col === 1);
      blocks.push(
        <Rect
          key={`${row}-${col}`}
          x={col * 80 - 20}
          y={row * 76 - 30}
          width={64}
          height={62}
          rx={6}
          fill={park ? '#DCEFD6' : '#E4E7E5'}
        />,
      );
    }
  }

  return (
    <View style={[styles.map, { height }]} aria-hidden>
      <Svg width="100%" height={height}>
        <Rect x={0} y={0} width="100%" height={height} fill="#F1F2EF" />
        {blocks}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    overflow: 'hidden',
  },
});
