import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackgroundProps,
  BottomSheetView,
  useBottomSheetTimingConfigs,
  type BottomSheetBackdropProps,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, ReactNode, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Floating sheet (Figma, 13 Nov, iOS 26 rule): at a partial snap point it floats with an 8 px gap on the
// sides and bottom and 32 px corners all round; at the top snap point it runs edge to edge.
const SHEET_RADIUS = 32;
const SHEET_GAP = 8;
// On a phone with rounded screen corners the sheet's bottom corners follow the screen's curve: about 55 px
// on current iPhones, less the 8 px gap. With 32 they looked pinched against the glass. A screenshot is
// square, so this only shows on the device. Phones with square screens keep 32.
const SHEET_BOTTOM_RADIUS = 47;

type SheetProps = Omit<BottomSheetProps, 'children' | 'backgroundStyle' | 'handleIndicatorStyle' | 'backdropComponent'> & {
  children: ReactNode;
  /** Dims the page behind while open. */
  scrim?: boolean;
  /** Index of the snap point where the sheet is full height (edge to edge). Defaults to the last one. */
  fullIndex?: number;
};

/**
 * Handoff bottom sheet (@gorhom/bottom-sheet): white, 28 px top corners, 36 × 4 grabber.
 * Use snap points, not a new screen, when a sheet needs to grow to full height.
 */
export const Sheet = forwardRef<BottomSheet, SheetProps>(function Sheet(
  { children, scrim = true, enablePanDownToClose = true, enableDynamicSizing = false, fullIndex, ...rest },
  ref,
) {
  const theme = useTheme();
  // Figma (9 Nov): sheets slide in over 400 ms on bezier(0.32, 0.72, 0, 1). A caller can still pass its own.
  const animationConfigs = useBottomSheetTimingConfigs({ duration: Motion.transition.sheet.duration, easing: SHEET_EASING });
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.3} />
    ),
    [],
  );

  const snapCount = Array.isArray(rest.snapPoints) ? rest.snapPoints.length : 1;
  const full = fullIndex ?? Math.max(snapCount - 1, 1);
  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => <FloatingBackground {...props} full={full} color={theme.card} />,
    [full, theme.card],
  );

  return (
    <BottomSheet
      ref={ref}
      enablePanDownToClose={enablePanDownToClose}
      enableDynamicSizing={enableDynamicSizing}
      backdropComponent={scrim ? renderBackdrop : undefined}
      backgroundComponent={renderBackground}
      handleIndicatorStyle={[styles.grabber, { backgroundColor: theme.seatEmpty }]}
      animationConfigs={animationConfigs}
      {...rest}>
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </BottomSheet>
  );
});

/** White sheet surface that floats at partial height and goes edge to edge as it reaches `full`. */
function FloatingBackground({ animatedIndex, style, full, color }: BottomSheetBackgroundProps & { full: number; color: string }) {
  const bottomRadius = useSafeAreaInsets().bottom > 0 ? SHEET_BOTTOM_RADIUS : SHEET_RADIUS;
  const floatStyle = useAnimatedStyle(() => {
    const t = interpolate(animatedIndex.get(), [full - 1, full], [1, 0], Extrapolation.CLAMP);
    return {
      left: SHEET_GAP * t,
      right: SHEET_GAP * t,
      bottom: SHEET_GAP * t,
      borderTopLeftRadius: SHEET_RADIUS * t,
      borderTopRightRadius: SHEET_RADIUS * t,
      borderBottomLeftRadius: bottomRadius * t,
      borderBottomRightRadius: bottomRadius * t,
    };
  });
  return <Animated.View pointerEvents="none" style={[style, styles.background, { backgroundColor: color }, floatStyle]} />;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: Radius.check / 2,
  },
  content: {
    flex: 1,
  },
});
