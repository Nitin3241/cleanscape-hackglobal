import { router } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { I18nManager, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { AiPoweredTag, MeetEarthyArt } from '@/components/onboarding/meet-earthy-art';
import { SkipLink } from '@/components/onboarding/onboarding-header';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ProgressDots } from '@/components/onboarding/progress-dots';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { welcomeCertificateXml, welcomeMapXml, welcomePeopleXml } from '@/constants/onboarding-art';
import { Motion, Spacing } from '@/constants/theme';

const SLIDES = [
  {
    artwork: welcomeMapXml,
    title: 'Find cleanups near you',
    body: 'Beaches, parks and streets across all seven emirates.',
  },
  {
    artwork: welcomePeopleXml,
    title: 'Bring your people',
    body: 'Join with friends, family or your school and clean up together.',
  },
  {
    artwork: welcomeCertificateXml,
    title: 'Every cleanup counts',
    body: 'See what you collect, and earn Smileys and certificates.',
  },
  {
    artwork: 'earthy',
    title: 'Meet Earthy AI',
    body: 'Ask anything, in English or Arabic. Earthy answers, sorts your waste and plans your clean-ups.',
  },
] as const;

const SWIPE_DISTANCE = 40;
const NEXT = '/onboarding/sign-in';

export default function WelcomeRoute() {
  const insets = useSafeAreaInsets();
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;

  function goBy(step: number) {
    setSlide((current) => Math.min(Math.max(current + step, 0), SLIDES.length - 1));
  }

  // Swiping follows reading direction, so "forward" flips in Arabic.
  const forwardSign = I18nManager.isRTL ? 1 : -1;
  const swipe = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onEnd((event) => {
      if (Math.abs(event.translationX) < SWIPE_DISTANCE) return;
      scheduleOnRN(goBy, Math.sign(event.translationX) === forwardSign ? 1 : -1);
    });

  return (
    <View style={styles.root}>
      <GestureDetector gesture={swipe}>
        <View style={styles.root} collapsable={false}>
          <OnboardingScreen
            top={150}
            footer={
              <Button
                label={isLast ? 'Get started' : 'Next'}
                size="large"
                onPress={() => (isLast ? router.push(NEXT) : goBy(1))}
              />
            }>
            <View style={styles.slides}>
              {SLIDES.map((item, index) => (
                <Slide key={item.title} {...item} visible={index === slide} />
              ))}
            </View>
            <EarthyShift isLast={isLast} style={styles.dots}>
              <ProgressDots
                count={SLIDES.length}
                active={slide}
                spring
                allFilled={slide === 0}
                accessibilityLabel={`Slide ${slide + 1} of ${SLIDES.length}`}
              />
            </EarthyShift>
            <View style={styles.copy}>
              {SLIDES.map((item, index) => (
                <SlideCopy
                  key={item.title}
                  {...item}
                  visible={index === slide}
                  shift={index === SLIDES.length - 1 ? EARTHY_COPY_SHIFT : 0}
                />
              ))}
            </View>
          </OnboardingScreen>
        </View>
      </GestureDetector>

      {!isLast && (
        <View style={[styles.skip, { top: insets.top + 18 }]}>
          <SkipLink href={NEXT} />
        </View>
      )}
      {/* Figma 8 Nov (Onb 02.4): the AI tag takes the Skip spot, top right, on the Earthy slide. */}
      <AiTagCorner visible={isLast} top={insets.top + 19} />
    </View>
  );
}

function AiTagCorner({ visible, top }: { visible: boolean; top: number }) {
  const fade = useCrossfade(visible);
  return (
    <Animated.View pointerEvents="none" style={[styles.skip, { top }, fade]}>
      <AiPoweredTag />
    </Animated.View>
  );
}

// Figma Onb 02.4 sits its dots 12 px higher (y 408, not 420) and its copy 2 px lower than slides 02.1–02.3.
const EARTHY_DOTS_SHIFT = -12;
const EARTHY_COPY_SHIFT = 2;

function EarthyShift({ isLast, style, children }: { isLast: boolean; style: StyleProp<ViewStyle>; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const shift = useSharedValue(isLast ? EARTHY_DOTS_SHIFT : 0);

  useEffect(() => {
    shift.set(
      withTiming(isLast ? EARTHY_DOTS_SHIFT : 0, {
        duration: reducedMotion ? 0 : Motion.duration.slow,
      }),
    );
  }, [isLast, reducedMotion, shift]);

  const shiftStyle = useAnimatedStyle(() => ({ transform: [{ translateY: shift.get() }] }));
  return <Animated.View style={[style, shiftStyle]}>{children}</Animated.View>;
}

function useCrossfade(visible: boolean) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.set(
      withTiming(visible ? 1 : 0, {
        duration: reducedMotion ? Motion.duration.fast : Motion.duration.slow,
      }),
    );
  }, [opacity, reducedMotion, visible]);

  return useAnimatedStyle(() => ({ opacity: opacity.get() }));
}

function Slide({ artwork, visible }: { artwork: string; visible: boolean }) {
  const fade = useCrossfade(visible);
  return (
    <Animated.View style={[styles.artwork, fade]}>
      {artwork === 'earthy' ? <MeetEarthyArt /> : <SvgXml xml={artwork} width={300} height={240} />}
    </Animated.View>
  );
}

function SlideCopy({ title, body, visible, shift }: { title: string; body: string; visible: boolean; shift: number }) {
  const fade = useCrossfade(visible);
  return (
    <Animated.View
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[styles.slideCopy, { top: shift }, fade]}>
      <ThemedText type="welcomeTitle" accessibilityRole="header" style={styles.centred}>
        {title}
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        {body}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skip: {
    position: 'absolute',
    end: Spacing.threeHalf,
  },
  slides: {
    height: 240,
  },
  artwork: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
  },
  dots: {
    marginTop: 30,
    alignItems: 'center',
  },
  copy: {
    marginTop: 30,
    minHeight: 110,
  },
  slideCopy: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
  },
  centred: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.two,
    maxWidth: 280,
  },
});
