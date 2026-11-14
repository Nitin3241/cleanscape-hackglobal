import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Logomark } from '@/components/ui/logomark';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useRegistration } from '@/state/registration';

const SHOW_FOR = 6000;

/** E6: the in-app banner when a waitlisted spot opens and the user is booked in automatically. */
export function SpotOpenedBanner() {
  const registration = useRegistration();

  useEffect(() => {
    if (!registration.spotOpened) return;
    feedback.play('notification.banner');
    const timer = setTimeout(registration.clearSpotOpened, SHOW_FOR);
    return () => clearTimeout(timer);
  }, [registration.clearSpotOpened, registration.spotOpened]);

  if (!registration.spotOpened) return null;
  return <Banner onPress={() => {
    registration.clearSpotOpened();
    router.push('/pass');
  }} />;
}

function Banner({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();
  const fadeIn = useFadeUp({ distance: -12 });

  return (
    <Animated.View style={[styles.wrap, { top: insets.top + Spacing.one }, fadeIn]}>
      <View style={[styles.shadow, { boxShadow: Shadows.tabBar }]}>
        <Glass fill="glassOnArt" intensity={50} style={styles.glass}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="A spot opened. You're in. Tap to see the pass"
            accessibilityLiveRegion="assertive"
            onPress={onPress}
            style={styles.row}>
            <Logomark size={38} />
            <View style={styles.text}>
              <ThemedText type="small" themeColor="textWeak">
                CleanScape
              </ThemedText>
              <ThemedText type="label">{"A spot opened. You're in!"}</ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                Tap to see the pass
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textWeak">
              now
            </ThemedText>
          </Tappable>
        </Glass>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    start: Spacing.twoHalf,
    end: Spacing.twoHalf,
  },
  shadow: {
    borderRadius: Radius.card,
  },
  glass: {
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    padding: Spacing.twoThreeQuarters,
  },
  text: {
    flex: 1,
  },
});
