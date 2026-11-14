import { useEffect, useState } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { rvmNextXml } from '@/constants/plastic-art';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { RVM } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

// Figma RVM step: smart animate 300 ms, bezier 0.22,1,0.36,1 between the steps.
const EASE = Easing.bezier(...Motion.transition.state.easing);
const DURATION = Motion.transition.state.duration;

// Figma marigold card (#FFF4D6, no token) and its inactive dots (#E5C98A, no token). Step 2 uses secondaryContainer.
const CARD = '#FFF4D6';
const DOT = '#E5C98A';

/**
 * Figma "RVM step" (835:12805): one How it works step at a time. Tapping the card goes 1 → 2 → 3 → 1, with progress
 * dots and Next / Start again. Step 2 ("Different from home") is a deeper marigold.
 */
export function RvmStep() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Only a tap fades the new step in; the first step is simply there.
  const [tapped, setTapped] = useState(false);
  const step = RVM.steps[index];
  const last = index === RVM.steps.length - 1;

  // The card's tint eases between the light and deep marigold.
  const deep = useSharedValue(step.flag ? 1 : 0);
  useEffect(() => {
    const target = step.flag ? 1 : 0;
    deep.set(reducedMotion ? target : withTiming(target, { duration: DURATION, easing: EASE }));
  }, [deep, reducedMotion, step.flag]);
  const deepColor = theme.secondaryContainer;
  const tintStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(deep.get(), [0, 1], [CARD, deepColor]),
  }));

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`Step ${index + 1} of ${RVM.steps.length}. ${step.flag ? `${step.flag}. ` : ''}${step.title}. ${step.body}`}
      accessibilityHint={last ? 'Starts again from step 1' : 'Shows the next step'}
      onPress={() => {
        setTapped(true);
        setIndex(last ? 0 : index + 1);
      }}>
      <Animated.View style={[styles.card, tintStyle]}>
        <View style={[styles.number, { backgroundColor: theme.card }]}>
          <ThemedText type="stepTitle" themeColor="textSecondary">{`${index + 1}`}</ThemedText>
        </View>
        <Animated.View
          key={index}
          entering={reducedMotion || !tapped ? undefined : FadeIn.duration(DURATION).easing(EASE)}
          style={styles.text}>
          {step.flag && (
            <View style={[styles.flag, { backgroundColor: theme.card }]}>
              <ThemedText type="tag" themeColor="textSecondary">
                {step.flag}
              </ThemedText>
            </View>
          )}
          <ThemedText type="rowTitle">{step.title}</ThemedText>
          <ThemedText type="meta13" themeColor="textWeak">
            {step.body}
          </ThemedText>
          <View style={styles.footer}>
            <View style={styles.dots}>
              {RVM.steps.map((_, dot) => (
                <View
                  key={dot}
                  style={[
                    styles.dot,
                    dot === index ? [styles.dotActive, { backgroundColor: theme.textSecondary }] : { backgroundColor: DOT },
                  ]}
                />
              ))}
            </View>
            <View style={styles.spacer} />
            <ThemedText type="chipAction" themeColor="textSecondary">
              {last ? 'Start again' : 'Next'}
            </ThemedText>
            <SvgXml xml={rvmNextXml} width={5.6} height={9.6} style={styles.chevron} />
          </View>
        </Animated.View>
      </Animated.View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  // Figma: 16 / 14 padding, 14 gap, 18 radius.
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.large,
  },
  number: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  // Figma Flag: white, 8 / 2 padding, 8 radius, SemiBold 11.
  flag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.oneHalf,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
  },
  spacer: {
    flex: 1,
  },
  // Figma draws a 4 × 8 chevron box; the stroked SVG overhangs it by 0.8 px each way. Flips in RTL.
  chevron: {
    margin: -0.8,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
