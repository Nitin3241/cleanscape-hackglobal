import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { QuizButton } from '@/components/waste/quiz-button';
import { quizCoinXml, quizRecapCheckXml } from '@/constants/plastic-art';
import { Fonts, Spacing } from '@/constants/theme';
import { PLASTIC_QUIZ } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

const FIGMA_STATUS_BAR = 44;

/** F4·2q4 Plastic quiz — score (Figma 794:12837): the result, the Smileys earned and what to remember. */
export default function PlasticQuizScoreRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { score } = useLocalSearchParams<{ score?: string }>();
  const total = PLASTIC_QUIZ.questions.length;
  const right = Math.min(Number(score ?? total), total);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      {/* Figma: the score starts at y 140, 96 px under the status bar. */}
      <ScrollView contentContainerStyle={[styles.score, { paddingTop: insets.top + 140 - FIGMA_STATUS_BAR }]}>
        <Animated.View entering={reduceMotion ? undefined : ZoomIn.duration(400)}>
          <SvgXml xml={quizCoinXml} width={120} height={120} aria-hidden />
        </Animated.View>
        <ThemedText style={styles.title} accessibilityRole="header">{`${right} of ${total} right`}</ThemedText>
        <ThemedText style={styles.earned} themeColor="textWeak">
          {`+${PLASTIC_QUIZ.smileys} Smileys for learning how to sort plastic`}
        </ThemedText>
        <View style={[styles.recap, { borderColor: theme.strokeWeak }]}>
          {PLASTIC_QUIZ.recap.map((line, index) => (
            <View
              key={line}
              style={[
                styles.recapItem,
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: theme.strokeWeak,
                },
              ]}>
              <View style={[styles.mark, { backgroundColor: theme.statusSuccessSubtle }]}>
                <SvgXml xml={quizRecapCheckXml} width={14} height={14} />
              </View>
              <ThemedText type="hintTight" style={styles.flex}>
                {line}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Figma StickyFooter: 12 top, 28 bottom, 16 sides, 12 gap. */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.card,
            paddingBottom: Math.max(insets.bottom, 28),
          },
        ]}>
        <View style={styles.flex}>
          <QuizButton label="Back to plastic" outlined onPress={() => router.dismissTo('/waste-plastic')} />
        </View>
        <View style={styles.flex}>
          <QuizButton label="Find drop-off" onPress={() => router.push('/waste-dropoff')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  score: {
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.four,
    paddingBottom: 120,
  },
  // Figma: SemiBold 26 / 34.
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 26,
    lineHeight: 34,
  },
  // Figma: Regular 15 / 22, centred.
  earned: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  // Figma Recap: 1 px stroke, 18 radius, 16 / 4 padding; items 12 tall padding with 1 px dividers.
  recap: {
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: 18,
  },
  recapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  mark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  footer: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
});
