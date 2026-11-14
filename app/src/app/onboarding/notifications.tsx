import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { bellBodyXml, bellRestXml } from '@/constants/onboarding-art';
import { Motion, Spacing } from '@/constants/theme';

const WIDTH = 200;
const HEIGHT = 190;
const WOBBLE = 12;
const SWING = Motion.duration.base / 2;

export default function NotificationsRoute() {
  const reducedMotion = useReducedMotion();
  const angle = useSharedValue(0);

  // The bell rings twice, swinging from its top, once the screen has arrived.
  useEffect(() => {
    if (reducedMotion) return;
    const swing = (to: number) => withTiming(to, { duration: SWING });
    angle.set(
      withDelay(
        Motion.duration.base,
        withSequence(swing(WOBBLE), swing(-WOBBLE), swing(WOBBLE), swing(-WOBBLE), swing(0)),
      ),
    );
  }, [angle, reducedMotion]);

  const bellStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.get()}deg` }] }));

  // SAMPLE: the notification permission isn't requested yet, so both actions just move on.
  const next = () => router.push('/onboarding/good-to-go');

  return (
    <OnboardingScreen
      top={140}
      footer={
        <View>
          <Button label="Turn on" size="large" onPress={next} />
          <View style={styles.other}>
            <TextButton label="Not now" color="textWeak" onPress={next} />
          </View>
        </View>
      }>
      <View style={styles.artwork}>
        <SvgXml xml={bellRestXml} width={WIDTH} height={HEIGHT} />
        <Animated.View style={[styles.bell, bellStyle]}>
          <SvgXml xml={bellBodyXml} width={WIDTH} height={HEIGHT} />
        </Animated.View>
      </View>
      <ThemedText type="heading" accessibilityRole="header" style={[styles.centred, styles.title]}>
        Never miss a cleanup
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        Reminders before your events and when spots open near you. No spam.
      </ThemedText>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  artwork: {
    width: WIDTH,
    height: HEIGHT,
    alignSelf: 'center',
  },
  bell: {
    ...StyleSheet.absoluteFill,
    // The bell hangs from y = 18 of the 190 px artwork.
    transformOrigin: '50% 9.5%',
  },
  centred: {
    textAlign: 'center',
  },
  title: {
    marginTop: 30,
  },
  body: {
    marginTop: Spacing.two,
    maxWidth: 296,
    alignSelf: 'center',
  },
  other: {
    marginTop: Spacing.threeHalf,
    marginBottom: Spacing.half,
  },
});
