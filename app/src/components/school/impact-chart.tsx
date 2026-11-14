import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { type ThemeColor } from '@/constants/theme';

/** Figma F3·8c "Radial chart": 296 × 290, centred 147, 139. */
const WIDTH = 296;
const HEIGHT = 290;
const CX = 147;
const CY = 139;
/** Ring k (0–4) runs from 20 + 14k to 32 + 14k px, as in Figma. */
const RING_INNER = 20;
const RING_STEP = 14;
const RING_THICKNESS = 12;
const SECTOR = 72;
const GAP = 6;
const EMPTY = '#EEF3F5';

type Material = {
  key: string;
  label: string;
  kg: number;
  share: number;
  color: string;
  text: ThemeColor;
  /** Opacity of each filled ring, innermost first; the rest are drawn grey. Copied from Figma. */
  rings: readonly number[];
};

/** Where each label sits, relative to the chart (Figma positions, minus the chart's offset). */
const LABELS: Record<string, { left: number; top: number; width: number; align: 'center' | 'left' | 'right' }> = {
  plastic: { left: 104, top: 4, width: 88, align: 'center' },
  paper: { left: 222, top: 88, width: 74, align: 'right' },
  metal: { left: 188, top: 224, width: 80, align: 'left' },
  glass: { left: 40, top: 224, width: 80, align: 'left' },
  other: { left: 0, top: 88, width: 74, align: 'left' },
};

/**
 * "What you picked up": one wedge per material, five rings deep. More filled rings mean a
 * bigger share. Plastic points up and the rest follow clockwise, as in Figma.
 */
type LabelPlace = { left: number; top: number; width: number; align: 'center' | 'left' | 'right' };

/** IE2 Most picked item (948:13671) centres its labels and sets them at Figma's "normal" line height (23 / 18). */
export const IE2_LABELS: Record<string, LabelPlace> = {
  plastic: { left: 105, top: 4, width: 88, align: 'center' },
  paper: { left: 228, top: 88, width: 74, align: 'center' },
  metal: { left: 178, top: 224, width: 80, align: 'center' },
  glass: { left: 38, top: 224, width: 80, align: 'center' },
  other: { left: -4, top: 88, width: 74, align: 'center' },
};

export function ImpactChart({
  materials,
  labels = LABELS,
  normalLines = false,
}: {
  materials: readonly Material[];
  labels?: Record<string, LabelPlace>;
  normalLines?: boolean;
}) {
  const summary = materials.map((m) => `${m.label} ${m.kg} kg, ${m.share}%`).join('; ');

  return (
    <View style={styles.chart} accessible accessibilityRole="image" accessibilityLabel={`What you picked up: ${summary}`}>
      <Svg width={WIDTH} height={HEIGHT}>
        {materials.map((material, index) => {
          const middle = -90 + index * SECTOR;
          const start = middle - (SECTOR - GAP) / 2;
          const end = middle + (SECTOR - GAP) / 2;
          return Array.from({ length: 5 }, (_, ring) => {
            const opacity = material.rings[ring];
            const inner = RING_INNER + ring * RING_STEP;
            return (
              <Path
                key={`${material.key}-${ring}`}
                d={annularSector(CX, CY, inner, inner + RING_THICKNESS, start, end)}
                fill={opacity === undefined ? EMPTY : material.color}
                fillOpacity={opacity ?? 1}
              />
            );
          });
        })}
      </Svg>
      {materials.map((material) => {
        const place = labels[material.key];
        if (!place) return null;
        return (
          <View key={material.key} style={[styles.label, { left: place.left, top: place.top, width: place.width }]}>
            <ThemedText
              type="labelLarge"
              themeColor={material.text}
              style={[{ textAlign: place.align }, normalLines && { lineHeight: 23 }]}>
              {`${material.kg} kg`}
            </ThemedText>
            <ThemedText
              type="caption"
              themeColor="textWeak"
              numberOfLines={1}
              style={[{ textAlign: place.align }, normalLines && { lineHeight: 18 }]}>
              {`${material.label} · ${material.share}%`}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

/** An SVG path for a ring segment between two radii and two angles (degrees, 0 = 3 o'clock). */
function annularSector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const point = (r: number, a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
  };
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${point(r1, a0)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${point(r1, a1)}`,
    `L ${point(r0, a1)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${point(r0, a0)}`,
    'Z',
  ].join(' ');
}

const styles = StyleSheet.create({
  chart: {
    width: WIDTH,
    height: HEIGHT,
    alignSelf: 'center',
  },
  label: {
    position: 'absolute',
  },
});
