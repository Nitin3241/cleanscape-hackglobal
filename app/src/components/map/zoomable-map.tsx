import { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Glass } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MIN = 1;
const MAX = 3;
const STEP = 1.5;
// Same ease-out as the Figma prototype transitions.
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
// Must be a worklet: gestures call it on the UI thread. A plain function here crashes the app.
const timing = (to: number) => {
  'worklet';
  return withTiming(to, { duration: 250, easing: EASE });
};

type ZoomableMapProps = {
  /** The map art plus anything pinned to it (pins, routes, markers). It all zooms together. */
  children: ReactNode;
  /** Where the + / − buttons sit inside the map. Pass `false` to hide them (pinch still works). */
  controls?: Pick<ViewStyle, 'top' | 'bottom' | 'start' | 'end'> | false;
  style?: ViewStyle;
  /**
   * Makes a tap on the map do something (e.g. open the full map). Use this instead of wrapping the
   * map in a Tappable: the + / − controls are buttons, and a button inside a button breaks the web
   * page (the browser splits the server HTML and the page renders blank on a direct load).
   */
  onPress?: () => void;
  /** Screen reader label for `onPress`, e.g. "Open the map". */
  accessibilityLabel?: string;
};

/**
 * Makes a map interactive: pinch or the + / − buttons to zoom (1×–3×), drag to move once zoomed,
 * double tap to zoom in or back out. At 1× a drag passes through, so maps inside a scroll view
 * still let the page scroll.
 */
export function ZoomableMap({
  children,
  controls = { bottom: 16, end: 16 },
  style,
  onPress,
  accessibilityLabel,
}: ZoomableMapProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const w = useSharedValue(0);
  const h = useSharedValue(0);
  const start = useSharedValue({ s: 1, x: 0, y: 0 });

  const clampXY = (s: number, x: number, y: number) => {
    'worklet';
    const mx = ((s - 1) * w.value) / 2;
    const my = ((s - 1) * h.value) / 2;
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  };

  const zoomTo = (s: number) => {
    'worklet';
    const next = Math.min(MAX, Math.max(MIN, s));
    const ratio = next / scale.value;
    const c = clampXY(next, tx.value * ratio, ty.value * ratio);
    scale.value = timing(next);
    tx.value = timing(c.x);
    ty.value = timing(c.y);
  };

  const pinch = Gesture.Pinch()
    .onStart(() => {
      start.value = { s: scale.value, x: tx.value, y: ty.value };
    })
    .onUpdate((e) => {
      const s = Math.min(MAX + 0.5, Math.max(MIN * 0.8, start.value.s * e.scale));
      // Keep the point between the fingers still while zooming.
      const fx = e.focalX - w.value / 2;
      const fy = e.focalY - h.value / 2;
      const r = s / start.value.s;
      scale.value = s;
      tx.value = fx - (fx - start.value.x) * r;
      ty.value = fy - (fy - start.value.y) * r;
    })
    .onEnd(() => {
      const s = Math.min(MAX, Math.max(MIN, scale.value));
      const c = clampXY(s, tx.value, ty.value);
      scale.value = timing(s);
      tx.value = timing(c.x);
      ty.value = timing(c.y);
    });

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_e, state) => {
      // Only take the drag when zoomed in; at 1× let the page scroll.
      if (scale.value > 1.01) state.activate();
      else state.fail();
    })
    .onStart(() => {
      start.value = { s: scale.value, x: tx.value, y: ty.value };
    })
    .onUpdate((e) => {
      const c = clampXY(scale.value, start.value.x + e.translationX, start.value.y + e.translationY);
      tx.value = c.x;
      ty.value = c.y;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      zoomTo(scale.value > 1.01 ? 1 : 2);
    });

  const gesture = Gesture.Simultaneous(pinch, pan, doubleTap);

  const mapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const map = (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[StyleSheet.absoluteFill, mapStyle]}>{children}</Animated.View>
    </GestureDetector>
  );

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.clip, style]}
      onLayout={(e) => {
        w.value = e.nativeEvent.layout.width;
        h.value = e.nativeEvent.layout.height;
      }}>
      {onPress ? (
        // A sibling of the controls, never their parent, so no button ends up inside another.
        <Tappable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={StyleSheet.absoluteFill}>
          {map}
        </Tappable>
      ) : (
        map
      )}
      {controls ? (
        <View style={[styles.controls, controls, { boxShadow: Shadows.mapControl }]}>
          <Glass fill="glass" intensity={40} style={styles.pill}>
            <Tappable accessibilityRole="button" accessibilityLabel="Zoom in" hitSlop={4} onPress={() => zoomTo(scale.value * STEP)} style={styles.btn}>
              <Icon name="plus" size={20} color="textStrong" />
            </Tappable>
            <View style={[styles.divider, { backgroundColor: theme.glassStroke }]} />
            <Tappable accessibilityRole="button" accessibilityLabel="Zoom out" hitSlop={4} onPress={() => zoomTo(scale.value / STEP)} style={styles.btn}>
              <Icon name="minus" size={20} color="textStrong" />
            </Tappable>
          </Glass>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    borderRadius: 20,
  },
  pill: {
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  btn: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 8,
  },
});
