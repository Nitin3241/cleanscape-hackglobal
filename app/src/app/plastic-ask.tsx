import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { PLASTIC_ASK } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

/**
 * F4·2s / F4·2t Ask Earthy about plastic (Figma 818:12775 and 818:12802), from "Ask Earthy" on F4·2.
 * Three ready questions; "Do bottle caps go in?" shows Earthy's answer in the same sheet.
 */
export default function PlasticAskSheet() {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [asked, setAsked] = useState<string | null>(null);

  return (
    <RouteSheet accessibilityLabel="Ask Earthy about plastic" fadeIn bottomPadding={28}>
      {/* Figma F4·2s pads the sheet 20 px each side; RouteSheet gives 16. */}
      <View style={styles.body}>
        <View style={styles.header}>
          <EarthyOrb size={36} state="still" glow={false} />
          <View>
            <ThemedText type="sheetPrompt" accessibilityRole="header" style={styles.title}>
              Ask Earthy
            </ThemedText>
            <ThemedText type="meta13" themeColor="textWeak">
              {PLASTIC_ASK.subtitle}
            </ThemedText>
          </View>
        </View>

        {asked === null ? (
          <View style={styles.questions}>
            {PLASTIC_ASK.questions.map((question, index) => (
              <Tappable
                key={question}
                accessibilityRole="button"
                accessibilityLabel={question}
                // Only the first question has an answer drawn (F4·2t); the others say "Coming soon".
                onPress={index === 0 ? () => setAsked(question) : undefined}
                style={[
                  styles.question,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.strokeWeak,
                  },
                ]}>
                <ThemedText type="bodyMedium14" style={styles.flex}>
                  {question}
                </ThemedText>
                <Icon name="chevron-end" size={16} color="textWeak" />
              </Tappable>
            ))}
          </View>
        ) : (
          <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(300)} style={styles.thread}>
            <View style={[styles.you, { backgroundColor: theme.brand }]}>
              <ThemedText type="bodyMedium14" themeColor="textOnBrand">
                {asked}
              </ThemedText>
            </View>
            <View style={[styles.answer, { backgroundColor: theme.loaderCard }]}>
              <ThemedText type="answer14">{PLASTIC_ASK.answer}</ThemedText>
              <View style={[styles.bin, { backgroundColor: theme.statusSuccessSubtle }]}>
                <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
                <ThemedText type="chipAction" themeColor="statusSuccess" style={styles.line18}>
                  {PLASTIC_ASK.bin}
                </ThemedText>
              </View>
            </View>
            <View style={styles.followUps}>
              {/* "What about bags?" has no answer drawn yet: it says "Coming soon". */}
              <FollowUp label={PLASTIC_ASK.followUps[0]} />
              <FollowUp label={PLASTIC_ASK.followUps[1]} onPress={() => router.replace('/bottle-scan')} />
            </View>
          </Animated.View>
        )}

        {/* Typing to Earthy isn't built yet: the field says "Coming soon". */}
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={PLASTIC_ASK.placeholder}
          style={[styles.ask, { backgroundColor: theme.askField }]}>
          <ThemedText type="hintTight" themeColor="textPlaceholder" style={styles.flex}>
            {PLASTIC_ASK.placeholder}
          </ThemedText>
          <View style={[styles.send, { backgroundColor: theme.brand }]}>
            <Icon name="arrow-up" size={18} color="textOnBrand" strokeWidth={2.25} />
          </View>
        </Tappable>
      </View>
    </RouteSheet>
  );
}

function FollowUp({ label, onPress }: { label: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.followUp, { borderColor: theme.strokeCoHost, backgroundColor: theme.card }]}>
      <ThemedText type="bodyMedium" themeColor="brand">
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    marginHorizontal: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  // Figma: SemiBold 18 / 26.
  title: {
    lineHeight: 26,
  },
  line18: {
    lineHeight: 18,
  },
  questions: {
    gap: Spacing.two,
  },
  // Figma question rows: white, 1 px stroke, 14 radius, 16 / 14 padding.
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  thread: {
    gap: Spacing.three,
  },
  // Figma "You asked": brand bubble, 16 radius with a 4 px bottom-end corner, 14 / 10 padding.
  you: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoHalf,
    borderRadius: 16,
    borderBottomEndRadius: 4,
  },
  // Figma Earthy answer: #F4F7F8, 16 radius with a 4 px top-start corner, 16 / 14 padding, 10 gap.
  answer: {
    alignSelf: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: 16,
    borderTopStartRadius: 4,
  },
  bin: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  followUps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  // Figma follow-ups: 1 px #C9D4D8 inside stroke, 18 radius, 14 / 8 padding (7 high here, as RN adds the border outside).
  followUp: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 18,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Spacing.four,
  },
  send: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
});
