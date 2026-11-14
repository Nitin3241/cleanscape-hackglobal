import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeTimeline } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { Tappable } from '@/components/ui/tappable';
import { joySpring, standardTiming } from '@/constants/motion';
import { Gradients, MaxContentWidth, Motion, Radius, Shadows, Spacing } from '@/constants/theme';
import { DEMO_MODE } from '@/data/demo';
import { useTheme } from '@/hooks/use-theme';
import { resetHostOnboarded } from '@/state/host';
import { resetInsights } from '@/state/insights';
import { setOnboarded } from '@/state/onboarded';
import { useHomeCopy } from '@/data/home-copy';

// Top padding, greeting block and bottom padding of the header, without the safe area.
const CONTENT_HEIGHT = 85;

type HomeHeaderProps = {
  firstName: string;
  location: string;
  smileys: string;
  hasUnreadNotifications: boolean;
  loading: boolean;
};

export function HomeHeader({
  firstName,
  location,
  smileys,
  hasUnreadNotifications,
  loading,
}: HomeHeaderProps) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const count = useSharedValue(0);

  useEffect(() => {
    if (loading) return;
    count.set(
      reducedMotion
        ? withTiming(1, { duration: Motion.duration.fast })
        : standardTiming(1, Motion.duration.base),
    );
  }, [count, loading, reducedMotion]);

  const countStyle = useAnimatedStyle(() => ({ opacity: count.get() }));
  // On the blue header a blur washes out, so the glass is a white tint with a bright edge.
  const glass = { backgroundColor: theme.glassOnMap, borderColor: theme.glassStroke, boxShadow: Shadows.chip };

  return (
    <LinearGradient {...Gradients.header} style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <View style={styles.row}>
        {/* DEMO: a long press on the greeting replays splash and onboarding, for recordings. */}
        <Pressable
          accessible={false}
          disabled={!DEMO_MODE}
          delayLongPress={800}
          onLongPress={() => {
            Promise.all([setOnboarded(false), resetInsights(), resetHostOnboarded()]).then(() => router.replace('/'));
          }}
          style={styles.greeting}>
          <View style={styles.location}>
            <Icon name="pin" size={14} color="textOnBrandWeak" />
            <ThemedText type="location" themeColor="textOnBrandWeak" numberOfLines={1} style={styles.shrink}>
              {location}
            </ThemedText>
          </View>
          <ThemedText type="heading" themeColor="textOnBrand" accessibilityRole="header" numberOfLines={1}>
            {copy.greeting(firstName)}
          </ThemedText>
        </Pressable>

        {/* Figma (13 Nov): three 36 px Liquid Glass controls on one line, each with a 44 px tap area. */}
        <View style={styles.actions}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Map"
            hitSlop={4}
            // Figma: MapChip → R2 Cleanups — map.
            onPress={() => router.push({ pathname: '/events', params: { view: 'map' } })}
            style={[styles.round, glass]}>
            <Icon name="map" size={18} color="textStrong" />
          </Tappable>

          <Tappable
            accessibilityRole="button"
            accessibilityLabel={loading ? 'Smileys' : `${smileys} Smileys`}
            hitSlop={4}
            onPress={() => router.push('/smileys')}
            style={[styles.smileys, glass]}>
            <Smiley />
            <Animated.View style={countStyle}>
              {/* Figma "1,240": 13 semibold at 20. */}
              <ThemedText type="labelSmall" style={FigmaLines.l20}>
                {smileys}
              </ThemedText>
            </Animated.View>
          </Tappable>

          <Tappable
            accessibilityRole="button"
            accessibilityLabel={hasUnreadNotifications ? 'Notifications, unread' : 'Notifications'}
            hitSlop={4}
            onPress={() => router.push('/notifications')}
            style={[styles.round, glass]}>
            <Icon name="bell" size={18} color="textStrong" />
            {hasUnreadNotifications && <UnreadDot play={!loading} />}
          </Tappable>
        </View>
      </View>
    </LinearGradient>
  );
}

/** Pops in once everything else has settled. */
function UnreadDot({ play }: { play: boolean }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const pop = useSharedValue(0);

  useEffect(() => {
    if (!play) return;
    pop.set(
      reducedMotion
        ? withTiming(1, { duration: Motion.duration.fast })
        : withDelay(HomeTimeline.unreadDot, joySpring(1, Motion.duration.fast)),
    );
  }, [play, pop, reducedMotion]);

  const popStyle = useAnimatedStyle(() =>
    reducedMotion
      ? { opacity: pop.get() }
      : { opacity: pop.get() > 0 ? 1 : 0, transform: [{ scale: pop.get() }] },
  );

  return (
    <Animated.View
      style={[styles.unread, { backgroundColor: theme.unreadDot, borderColor: theme.card }, popStyle]}
    />
  );
}

/**
 * Sits behind the status bar so its white text stays readable once the header
 * has scrolled away. It shows the top slice of the same gradient, so it's invisible at rest.
 */
export function StatusBarBackdrop() {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="none" style={[styles.backdrop, { height: insets.top }]}>
      <LinearGradient {...Gradients.header} style={{ height: insets.top + CONTENT_HEIGHT }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderBottomStartRadius: Radius.header,
    borderBottomEndRadius: Radius.header,
  },
  row: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  greeting: {
    flex: 1,
    gap: Spacing.half,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  shrink: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  smileys: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    height: 36,
    paddingStart: Spacing.oneHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  round: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
  },
  unread: {
    position: 'absolute',
    top: 8,
    start: 21,
    width: 6.7,
    height: 6.7,
    borderRadius: 3.35,
    borderWidth: 0.7,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    overflow: 'hidden',
  },
});
