import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useTheme } from '@/hooks/use-theme';

type ToastProps = {
  text: string;
  icon?: IconName;
  action?: { label: string; onPress: () => void };
  /** Shows a bar that runs down over this many milliseconds, for undo windows. */
  countdown?: number;
};

/**
 * A short dark message, such as "Spot cancelled" with Undo. Figma toast rule (CAL3, 13 Nov): leading check
 * icon, capsule action button, and the screen places it 8 px above the tab bar (the tab bar never moves).
 */
export function Toast({ text, icon = 'check', action, countdown }: ToastProps) {
  const theme = useTheme();
  const fadeUp = useFadeUp({ distance: 8 });

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.toast,
        countdown !== undefined && styles.withTimer,
        { backgroundColor: theme.brand, borderColor: theme.toastStroke, boxShadow: Shadows.toast },
        fadeUp,
      ]}>
      <View style={styles.row}>
        {icon && (
          <View style={[styles.iconCircle, { backgroundColor: theme.glassOnBrand }]}>
            <Icon name={icon} size={16} color="textOnBrand" strokeWidth={2} />
          </View>
        )}
        <ThemedText type="body14" themeColor="textOnBrand" style={styles.text}>
          {text}
        </ThemedText>
        {action && (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={action.label}
            hitSlop={8}
            onPress={action.onPress}
            style={[styles.capsule, { backgroundColor: theme.glassOnBrand, borderColor: theme.passGlassStroke }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand" style={styles.actionText}>
              {action.label}
            </ThemedText>
          </Tappable>
        )}
      </View>
      {countdown !== undefined && <Countdown duration={countdown} />}
    </Animated.View>
  );
}

function Countdown({ duration }: { duration: number }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const left = useSharedValue(1);

  useEffect(() => {
    if (!reducedMotion) left.set(withTiming(0, { duration, easing: Easing.linear }));
  }, [duration, left, reducedMotion]);

  const barStyle = useAnimatedStyle(() => ({ width: `${left.get() * 100}%` }));

  return (
    <View style={[styles.track, { backgroundColor: theme.glassOnBrand }]}>
      <Animated.View style={[styles.bar, { backgroundColor: theme.secondary }, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma CAL3 "Open": 13 semibold at "normal" height (20).
  actionText: {
    lineHeight: 20,
  },
  // Figma CAL3 snackbar: brand, white 35% hairline, 22 px corners, 10 / 8 padding with the timer.
  toast: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: 22,
  },
  withTimer: {
    paddingBottom: Spacing.two,
  },
  iconCircle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  text: {
    flex: 1,
  },
  capsule: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  track: {
    height: 3,
    overflow: 'hidden',
    borderRadius: 2,
  },
  bar: {
    height: 3,
    borderRadius: 2,
  },
});
