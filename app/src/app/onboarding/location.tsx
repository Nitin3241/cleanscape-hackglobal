import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { standardTiming } from '@/constants/motion';
import { locationRestXml, locationRingsXml } from '@/constants/onboarding-art';
import { Motion, Spacing } from '@/constants/theme';

const WIDTH = 240;
const HEIGHT = 200;
const PULSE_SCALE = 1.08;

export default function LocationRoute() {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    pulse.set(
      withSequence(
        standardTiming(PULSE_SCALE, Motion.duration.base),
        standardTiming(1, Motion.duration.base),
      ),
    );
  }, [pulse, reducedMotion]);

  const ringsStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  // SAMPLE: the location permission isn't requested yet, so both actions just move on.
  const next = () => router.push('/onboarding/interests');

  return (
    <OnboardingScreen
      top={120}
      footer={
        <View>
          <Button label="Allow location" size="large" onPress={next} />
          <View style={styles.other}>
            <TextButton label="Pick my emirate instead" onPress={next} />
          </View>
        </View>
      }>
      <View style={styles.artwork}>
        <Animated.View style={[styles.rings, ringsStyle]}>
          <SvgXml xml={locationRingsXml} width={WIDTH} height={HEIGHT} />
        </Animated.View>
        <View style={StyleSheet.absoluteFill}>
          <SvgXml xml={locationRestXml} width={WIDTH} height={HEIGHT} />
        </View>
      </View>
      <ThemedText type="heading" accessibilityRole="header" style={[styles.centred, styles.title]}>
        Find cleanups near you
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        {"We use your location only to show nearby events. It's never shared."}
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
  rings: {
    ...StyleSheet.absoluteFill,
    // The rings are centred at y = 104 of the 200 px artwork.
    transformOrigin: '50% 52%',
  },
  centred: {
    textAlign: 'center',
  },
  title: {
    marginTop: Spacing.four,
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
