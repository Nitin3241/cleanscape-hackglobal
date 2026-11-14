import { StyleSheet } from 'react-native';

/**
 * Figma text set to "normal" line height renders at round(1.5 × size): 11 → 17, 12 → 18, 13 → 20, 14 → 21,
 * 15 → 23, 16 → 24, 18 → 27, 20 → 30. Several type tokens are a pixel or two tighter (they match older frames),
 * so new frames add one of these to the text instead of changing the token.
 */
export const FigmaLines = StyleSheet.create({
  l17: { lineHeight: 17 },
  l18: { lineHeight: 18 },
  l20: { lineHeight: 20 },
  l21: { lineHeight: 21 },
  l23: { lineHeight: 23 },
  l24: { lineHeight: 24 },
  l27: { lineHeight: 27 },
  l30: { lineHeight: 30 },
});
