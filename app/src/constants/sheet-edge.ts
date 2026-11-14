/**
 * Where a floating bottom sheet sits (Figma 13 Nov, iOS 26 rule): 8 px above the screen's bottom edge, on
 * every phone. On a phone with rounded screen corners and a home bar, the sheet's bottom corners follow the
 * screen's curve (about 55 px, less the 8 px gap) and its content stays clear of the home bar.
 *
 * Before 14 Nov these sheets sat above the home bar instead, which left a strip of the page showing under them.
 */
export function floatingSheetEdge(bottomInset: number) {
  if (bottomInset <= 0) return { bottom: 8 };
  return { bottom: 8, paddingBottom: bottomInset, borderBottomStartRadius: 47, borderBottomEndRadius: 47 };
}
