import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { binRouteXml, youDotXml, youHaloXml } from '@/constants/plastic-art';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Figma's map background (#EAF0EE), for the screen behind the map. */
export const WASTE_MAP_BACKGROUND = '#EAF0EE';

// Figma "Map" on F4·3 and F4·6g: parks, water, streets and blocks, in the 360 × 800 frame's coordinates.
const BLOCKS = [
  { x: -20, y: 560, w: 220, h: 300, color: '#CFE6EF', r: 0 },
  { x: 200, y: 90, w: 140, h: 120, color: '#D7EDD3', r: 16 },
  { x: 30, y: 250, w: 110, h: 90, color: '#D7EDD3', r: 16 },
  { x: 0, y: 220, w: 360, h: 14, color: '#FFFFFF', r: 0 },
  { x: 0, y: 470, w: 360, h: 14, color: '#FFFFFF', r: 0 },
  { x: 150, y: 0, w: 14, h: 800, color: '#FFFFFF', r: 0 },
  { x: 290, y: 0, w: 12, h: 800, color: '#FFFFFF', r: 0 },
  { x: 60, y: 0, w: 10, h: 560, color: '#FFFFFF', r: 0 },
  { x: 180, y: 250, w: 90, h: 60, color: '#E0E6E4', r: 8 },
  { x: 180, y: 330, w: 90, h: 110, color: '#E0E6E4', r: 8 },
  { x: 20, y: 360, w: 110, h: 90, color: '#E0E6E4', r: 8 },
  { x: 310, y: 240, w: 60, h: 90, color: '#E0E6E4', r: 8 },
  { x: 310, y: 350, w: 60, h: 100, color: '#E0E6E4', r: 8 },
];

/**
 * The sample map behind Know your waste's place screens (F4·3, F4·6g): blocks, your position and the dotted walk to
 * the nearest place. `shift` moves it with the real status bar (Figma draws a 44 px one). Children are drawn on top.
 */
export function WasteMap({ shift, children }: { shift: number; children?: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, { top: shift }]}>
      <View style={StyleSheet.absoluteFill} aria-hidden>
        {BLOCKS.map((block, index) => (
          <View
            key={index}
            style={[
              styles.abs,
              {
                left: block.x,
                top: block.y,
                width: block.w,
                height: block.h,
                backgroundColor: block.color,
                borderRadius: block.r,
              },
            ]}
          />
        ))}
        <SvgXml xml={binRouteXml} width={45} height={57} style={[styles.abs, { left: 157.5, top: 312.5 }]} />
      </View>
      <View style={[styles.abs, styles.you]} accessible accessibilityLabel="You are here">
        <SvgXml xml={youHaloXml} width={44} height={44} />
        <SvgXml xml={youDotXml} width={16} height={16} style={[styles.abs, { left: 14, top: 14 }]} />
        <View style={[styles.abs, styles.youTag, { backgroundColor: theme.textStrong }]}>
          <ThemedText style={styles.youText} themeColor="textOnBrand">
            You
          </ThemedText>
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
  },
  you: {
    left: 178,
    top: 346,
  },
  youTag: {
    left: 34,
    top: 14,
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: 2,
    borderRadius: 8,
  },
  // Figma: SemiBold 10, line height normal (15).
  youText: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    lineHeight: 15,
  },
});
