import { router } from 'expo-router';
import { ReactNode, useEffect } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { sheetTiming } from '@/constants/motion';
import { Motion, Shadows, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Floating sheet (Figma, 13 Nov, iOS 26 rule): 8 px gap on the sides and bottom, 32 px corners all round.
const SHEET_RADIUS = 32;
const SHEET_GAP = 8;
// On a phone with rounded screen corners the sheet's bottom corners follow the screen's curve: about 55 px
// on current iPhones, less the 8 px gap. With 32 they looked pinched against the glass. A screenshot is
// square, so this only shows on the device. Phones with square screens keep 32.
const SHEET_BOTTOM_RADIUS = 47;
const OFFSCREEN = 600;
const DISMISS_DISTANCE = 80;

type RouteSheetProps = {
  children: ReactNode;
  /** Shown when the sheet closes by drag, scrim tap or the back gesture. Defaults to going back. */
  onClose?: () => void;
  accessibilityLabel: string;
  /** Space under the content (Figma: 32 on most sheets, 34 on F10·11w). */
  bottomPadding?: number;
  /**
   * Tall Earthy sheets (Figma IE1, IE2): edge to edge, square at the bottom, 28 px top corners, starting this far
   * from the top of the screen and scrolling inside.
   */
  fullFromTop?: number;
  /** Open with a quick fade and no slide (Figma's Know your waste sheets, F4·1s and F4·2s). */
  fadeIn?: boolean;
  /** Scrim colour; Figma F4·1s and F4·9c use ink at 50% (`scrimInk`) instead of the navy default. */
  scrim?: ThemeColor;
};

/**
 * A bottom sheet that is its own route, shown over the previous screen. The screen
 * stays visible under a navy scrim, and the sheet can be dragged down to close.
 */
export function RouteSheet({
  children,
  onClose = () => router.back(),
  accessibilityLabel,
  bottomPadding = Spacing.five,
  fullFromTop,
  fadeIn = false,
  scrim = 'scrim',
}: RouteSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Reduce Motion and fade-in sheets share the same path: a short fade, no slide.
  const reducedMotion = useReducedMotion() || fadeIn;
  const appear = useSharedValue(0);
  const drag = useSharedValue(0);

  useEffect(() => {
    appear.set(reducedMotion ? withTiming(1, { duration: Motion.duration.fast }) : sheetTiming(1));
  }, [appear, reducedMotion]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose]);

  const dragToClose = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((event) => {
      drag.set(Math.max(event.translationY, 0));
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE) scheduleOnRN(onClose);
      else drag.set(withTiming(0, { duration: Motion.duration.fast }));
    });

  const scrimStyle = useAnimatedStyle(() => ({ opacity: appear.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? appear.get() : 1,
    transform: [{ translateY: drag.get() + (reducedMotion ? 0 : (1 - appear.get()) * OFFSCREEN) }],
  }));

  return (
    <View style={styles.screen} accessibilityViewIsModal>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme[scrim] }, scrimStyle]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.sheet,
          fullFromTop === undefined &&
            insets.bottom > 0 && { borderBottomStartRadius: SHEET_BOTTOM_RADIUS, borderBottomEndRadius: SHEET_BOTTOM_RADIUS },
          fullFromTop !== undefined && [styles.full, { height: windowHeight - fullFromTop }],
          { backgroundColor: theme.card, boxShadow: Shadows.sheet },
          sheetStyle,
        ]}>
        <GestureDetector gesture={dragToClose}>
          <View collapsable={false} style={styles.handleArea}>
            <View style={[styles.grabber, { backgroundColor: theme.seatEmpty }]} />
          </View>
        </GestureDetector>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(bottomPadding, insets.bottom) }]}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    marginHorizontal: SHEET_GAP,
    marginBottom: SHEET_GAP,
    borderRadius: SHEET_RADIUS,
    overflow: 'hidden',
  },
  full: {
    maxHeight: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
    borderTopStartRadius: 28,
    borderTopEndRadius: 28,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: Spacing.twoHalf,
    paddingBottom: Spacing.three,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  // Inside the 8 px inset the sheet pads 16, so content keeps its 24 px from the screen edge.
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
});
