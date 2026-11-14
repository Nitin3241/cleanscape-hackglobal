import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { QuizButton } from '@/components/waste/quiz-button';
import { quizBoxXml, quizRightMarkXml, quizShampooXml, quizTubXml, quizWrongMarkXml } from '@/constants/plastic-art';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { PLASTIC_QUIZ } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

const ITEM_ART = { tub: quizTubXml, box: quizBoxXml, shampoo: quizShampooXml };

/**
 * F4·2q1–q3 Plastic quiz (Figma 794:12737, 794:12771, 794:12804): one question per screen. Tapping an option
 * marks it right or wrong, shows the correct one and slides up the reason with Next (or See score).
 */
export default function PlasticQuizRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const params = useLocalSearchParams<{ q?: string; score?: string }>();
  const index = Math.min(Math.max(Number(params.q ?? 1) - 1, 0), PLASTIC_QUIZ.questions.length - 1);
  const score = Number(params.score ?? 0);
  const question = PLASTIC_QUIZ.questions[index];
  const last = index === PLASTIC_QUIZ.questions.length - 1;
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const right = picked === question.right;

  const next = () => {
    const total = score + (right ? 1 : 0);
    if (last)
      router.push({
        pathname: '/plastic-quiz-score',
        params: { score: String(total) },
      });
    else
      router.push({
        pathname: '/plastic-quiz',
        params: { q: String(index + 2), score: String(total) },
      });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <View style={[styles.top, { paddingTop: insets.top + Spacing.two }]}>
        {/* Figma: the back button goes to F4·2 from every question. */}
        <RoundButton icon="chevron-start" label="Back to plastic" onPress={() => router.dismissTo('/waste-plastic')} outlined />
        <View style={styles.progress} accessible accessibilityLabel={`Question ${index + 1} of ${PLASTIC_QUIZ.questions.length}`}>
          {PLASTIC_QUIZ.questions.map((_, step) => (
            <View
              key={step}
              style={[
                styles.bar,
                {
                  backgroundColor: step <= index ? theme.brand : theme.strokeWeak,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: answered ? 200 : Spacing.four }]}>
        <ThemedText type="bodyMedium" themeColor="brand">
          {`Question ${index + 1} of ${PLASTIC_QUIZ.questions.length}`}
        </ThemedText>
        <ThemedText style={styles.question} accessibilityRole="header">
          {question.question}
        </ThemedText>
        <View style={[styles.item, { backgroundColor: theme.fill }]}>
          <SvgXml xml={ITEM_ART[question.item]} width={64} height={64} aria-hidden />
        </View>
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            const isPicked = picked === optionIndex;
            const isRight = optionIndex === question.right;
            // Figma Right / Wrong states: the pick turns green or red, the right answer is always outlined in
            // green with a tick, and the other options fade to grey.
            const state = !answered ? 'ask' : isRight ? (isPicked ? 'rightPicked' : 'rightShown') : isPicked ? 'wrong' : 'muted';
            return (
              <Tappable
                key={option}
                accessibilityRole="button"
                accessibilityLabel={option}
                accessibilityState={{ selected: isPicked }}
                // Once answered the options stay put (Figma has no change back), without the disabled fade.
                onPress={() => {
                  if (!answered) setPicked(optionIndex);
                }}
                style={[
                  styles.option,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.strokeWeak,
                  },
                  state === 'rightPicked' && {
                    backgroundColor: theme.statusSuccessSubtle,
                    borderColor: theme.statusSuccess,
                    borderWidth: 2,
                  },
                  state === 'rightShown' && {
                    borderColor: theme.statusSuccess,
                    borderWidth: 2,
                  },
                  state === 'wrong' && {
                    backgroundColor: theme.issueRedFill,
                    borderColor: theme.issueRed,
                    borderWidth: 2,
                  },
                ]}>
                <ThemedText style={styles.optionText} themeColor={state === 'muted' ? 'strokeStrong' : 'textStrong'}>
                  {option}
                </ThemedText>
                {(state === 'rightPicked' || state === 'rightShown') && <SvgXml xml={quizRightMarkXml} width={18} height={18} />}
                {state === 'wrong' && <SvgXml xml={quizWrongMarkXml} width={18} height={18} />}
              </Tappable>
            );
          })}
        </View>
      </ScrollView>

      {answered && (
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(300)}
          accessibilityLiveRegion="polite"
          // Figma draws the panel 174 tall, ending 40 px above the frame's bottom edge; on a phone it ends
          // at the home indicator instead.
          style={[
            styles.feedback,
            {
              backgroundColor: right ? theme.statusSuccessSubtle : theme.issueRedFill,
              bottom: insets.bottom || 40,
            },
          ]}>
          <View style={styles.feedbackTitle}>
            <SvgXml xml={right ? quizRightMarkXml : quizWrongMarkXml} width={20} height={20} />
            <ThemedText
              type="sheetPrompt"
              themeColor={right ? 'statusSuccess' : 'issueRed'}
              style={styles.line26}
              accessibilityRole="header">
              {right ? 'That’s right' : 'Not quite'}
            </ThemedText>
          </View>
          <ThemedText type="hintTight">{question.why}</ThemedText>
          <QuizButton label={last ? 'See score' : 'Next'} onPress={next} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma: back button at x 16, progress bars from x 72, centred on it.
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  progress: {
    flexDirection: 'row',
    gap: Spacing.oneHalf,
  },
  bar: {
    width: 80,
    height: 6,
    borderRadius: 3,
  },
  // Figma Body: 48 px under the back button (y 140), 24 px sides, 20 gap.
  body: {
    gap: Spacing.threeHalf,
    paddingTop: 48,
    paddingHorizontal: Spacing.four,
  },
  // Figma: SemiBold 22 / 30.
  question: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    lineHeight: 30,
  },
  item: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.card,
  },
  options: {
    gap: Spacing.twoHalf,
  },
  // Figma options: 1 px stroke (2 px when marked), 14 radius, 16 / 14 padding, 10 gap before the mark.
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.threeLess,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  // Figma: Medium 15 / 22.
  optionText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  // Figma Feedback: 24 px top corners, 20 / 24 / 24 padding, 8 gap, title row 26 tall.
  feedback: {
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    position: 'absolute',
    start: 0,
    end: 0,
    gap: Spacing.two,
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  feedbackTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  line26: {
    lineHeight: 26,
  },
});
