import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, type ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { GradientText } from '@/components/ui/gradient-text';
import { Icon } from '@/components/ui/icon';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { earthyHomeGlowXml } from '@/constants/illustrations';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { EARTHY_HOME } from '@/data/earthy-chat.sample';
import { useTheme } from '@/hooks/use-theme';
import { askEarthy, type EarthyMessage } from '@/services/earthy-api';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;
const TILE_ICON_COLOR = { fill: 'brand', secondarySubtle: 'iconMarigold', statusSuccessSubtle: 'statusSuccess' } as const;
const SERVER_DOWN = 'I can’t reach Earthy’s server right now, so I won’t guess. Check your connection and ask again.';

type Turn = { question: string; answer?: string; failed?: boolean };

/** Opens the voice window with a question already asked, so Earthy answers it out loud. */
const hear = (ask: string) => router.push({ pathname: '/earthy-voice', params: { ask } });

/**
 * Earthy, live (built for HackGlobal 2026). ONE screen, laid out as Figma F9v2·1 Earthy home:
 * - Start: the greeting, three facts about Saturday's clean-up and four questions. Tapping a fact or a
 *   question opens the voice window, where Earthy answers it out loud.
 * - Type: the text box is a real text box. Typing never leaves this screen; the greeting gives way to
 *   the conversation and the answer appears here.
 * - Talk: the round button opens the voice window to ask out loud. Once something is typed, the same
 *   button sends it.
 * Answers come from the Earthy server on Vultr (`src/services/earthy-api.ts`). If it can't be reached the
 * screen says so plainly and never invents an answer. Controls that aren't live (plus, camera, history)
 * are left out so nothing on this screen is a dead end.
 */
export default function EarthyLiveRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { ask } = useLocalSearchParams<{ ask?: string }>();
  const scroll = useRef<ScrollViewInstance>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const asked = useRef(false);
  const home = EARTHY_HOME;
  const started = turns.length > 0;

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setDraft('');
    setBusy(true);
    const history: EarthyMessage[] = turns
      .filter((turn) => turn.answer && !turn.failed)
      .flatMap((turn) => [
        { role: 'user' as const, content: turn.question },
        { role: 'assistant' as const, content: turn.answer ?? '' },
      ]);
    setTurns((current) => [...current, { question }]);
    try {
      const answer = await askEarthy([...history, { role: 'user', content: question }]);
      setTurns((current) => current.map((turn, index) => (index === current.length - 1 ? { ...turn, answer } : turn)));
    } catch {
      setTurns((current) =>
        current.map((turn, index) => (index === current.length - 1 ? { ...turn, failed: true } : turn)),
      );
    } finally {
      setBusy(false);
    }
  }

  // Opened with a question already chosen elsewhere: ask it once.
  useEffect(() => {
    if (ask && !asked.current) {
      asked.current = true;
      send(ask);
    }
    // Runs once on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(timer);
  }, [turns, busy, started]);

  const typed = draft.trim().length > 0;

  // The text box rides on the keyboard frame by frame, so the two rise together. A layout that waits for
  // the keyboard event (KeyboardAvoidingView) arrives a beat late: keyboard first, then the box.
  const keyboard = useAnimatedKeyboard();
  const restPadding = Math.max(insets.bottom, Spacing.four);
  const composerStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.get() + Spacing.two, restPadding),
  }));

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      {/* Figma "Earthy glow": 560 × 360 at x −100, y 600 (the SVG adds 40 of blur on each side). */}
      <View style={styles.glow} pointerEvents="none" aria-hidden>
        <SvgXml xml={earthyHomeGlowXml} width={640} height={440} />
      </View>
      <ScrollView
        ref={scroll}
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + (started ? 64 : 80) }]}
        showsVerticalScrollIndicator={false}>
        {!started && (
          <>
            <EarthyOrb size={56} state="idle" glow={false} />
            <View style={styles.hello}>
              <GradientText text={home.greeting} size={30} lineHeight={44} />
              <ThemedText type="welcomeTitle" themeColor="strokeStrong" style={styles.prompt}>
                {home.prompt}
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="tag" themeColor="textWeak">
                {home.todayLabel}
              </ThemedText>
              <View style={styles.today}>
                {home.today.map((item) => (
                  <Tappable
                    key={item.title}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title}, ${item.note}. Hear more from Earthy`}
                    onPress={() => hear(item.ask)}
                    style={[styles.tile, { backgroundColor: theme[item.tone] }]}>
                    <Icon name={item.icon} size={20} color={TILE_ICON_COLOR[item.tone]} strokeWidth={2} />
                    <ThemedText type="labelSmall" style={styles.tileTitle}>
                      {item.title}
                    </ThemedText>
                    <ThemedText type="micro11" themeColor="textWeak" style={styles.tileNote}>
                      {item.note}
                    </ThemedText>
                  </Tappable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="tag" themeColor="textWeak">
                HEAR THE ANSWER
              </ThemedText>
              {/* The questions sit in one card, each with its own arrow button, so they read as things to tap. */}
              <View style={[styles.questions, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
                {home.suggestions.map((suggestion, index) => (
                  <Tappable
                    key={suggestion.label}
                    accessibilityRole="button"
                    accessibilityLabel={`${suggestion.label} Earthy answers out loud`}
                    onPress={() => hear(suggestion.label)}
                    style={[styles.question, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
                    <ThemedText type="reasonTitleRegular" style={styles.flex}>
                      {suggestion.label}
                    </ThemedText>
                    <View style={[styles.arrow, { backgroundColor: theme.brand }]}>
                      <Icon name="arrow-end" size={16} color="textOnBrand" strokeWidth={2} />
                    </View>
                  </Tappable>
                ))}
              </View>
            </View>
          </>
        )}

        {turns.map((turn, index) => {
          const thinking = !turn.answer && !turn.failed;
          return (
            <View key={index} style={styles.turn}>
              <View style={styles.bubbleRow}>
                <View
                  style={[styles.bubble, { backgroundColor: theme.tileNeutral }]}
                  accessibilityLabel={`You asked: ${turn.question}`}>
                  <ThemedText type="lead">{turn.question}</ThemedText>
                </View>
              </View>
              <View style={styles.label}>
                <EarthyOrb size={24} state={thinking ? 'thinking' : 'still'} glow={false} />
                <ThemedText type="fieldLabel" themeColor="textWeak">
                  {thinking ? 'Earthy is thinking' : 'Earthy'}
                </ThemedText>
              </View>
              {turn.answer && (
                <ThemedText type="answer" accessibilityLiveRegion="polite" style={styles.answer}>
                  {turn.answer}
                </ThemedText>
              )}
              {turn.failed && (
                <View style={[styles.failed, { backgroundColor: theme.tileNeutral }]} accessibilityLiveRegion="polite">
                  <ThemedText type="hint" themeColor="textWeak">
                    {SERVER_DOWN}
                  </ThemedText>
                  <Tappable
                    accessibilityRole="button"
                    accessibilityLabel="Ask again"
                    hitSlop={8}
                    onPress={() => {
                      setTurns((current) => current.slice(0, -1));
                      send(turn.question);
                    }}>
                    <ThemedText type="fieldLabel" themeColor="brand">
                      Ask again
                    </ThemedText>
                  </Tappable>
                </View>
              )}
            </View>
          );
        })}
        {started && (
          <ThemedText type="caption" themeColor="textWeak" style={styles.disclaimer}>
            Earthy can make mistakes. Check event details with the organiser.
          </ThemedText>
        )}
      </ScrollView>

      <View style={styles.headerWrap} pointerEvents="box-none">
        <LinearGradient
          colors={[theme.card, theme.card, `${theme.card}00`]}
          locations={[0, 0.82, 1]}
          style={[styles.backdrop, { height: insets.top + 68 }]}
          pointerEvents="none"
        />
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <RoundButton
            icon="chevron-down"
            label="Close Earthy"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
            outlined
            iconSize={24}
          />
          {started && (
            <View style={styles.title}>
              <EarthyOrb size={20} state="still" glow={false} />
              <ThemedText type="splashLine" accessibilityRole="header" style={styles.titleText}>
                Earthy
              </ThemedText>
            </View>
          )}
          {/* Balances the close button, so the title stays centred. */}
          <View style={styles.headerSpace} />
        </View>
      </View>

      {/* Figma composer row: 16 from the sides, 10 apart, 56 tall. */}
      <Animated.View style={[styles.composerRow, composerStyle]}>
        <View style={[styles.composer, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a question"
            placeholderTextColor={theme.textPlaceholder}
            accessibilityLabel="Type a question for Earthy"
            returnKeyType="send"
            maxLength={500}
            onSubmitEditing={() => send(draft)}
            style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>
        {/* One round button: it talks until something is typed, then it sends. */}
        {typed ? (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Send"
            accessibilityState={{ disabled: busy }}
            disabled={busy}
            onPress={() => send(draft)}
            style={[styles.action, { backgroundColor: theme.brand, opacity: busy ? 0.45 : 1 }]}>
            <Icon name="arrow-up" size={22} color="textOnBrand" strokeWidth={2} />
          </Tappable>
        ) : (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Talk to Earthy"
            onPress={() => router.push('/earthy-voice')}
            style={styles.action}>
            <EarthyOrb size={56} state="still" glow={false} />
            <View style={styles.actionIcon} pointerEvents="none">
              <Icon name="audio-lines" size={22} color="textOnBrand" strokeWidth={2} />
            </View>
          </Tappable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    start: -140,
    bottom: -200,
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  // Same metrics as the F9 v2 chat header.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  headerSpace: {
    width: 40,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 23,
  },
  // Figma F9v2·1: one column 20 from the sides, 4 apart.
  content: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.threeHalf,
    paddingBottom: Spacing.three,
  },
  hello: {
    gap: Spacing.half,
    paddingTop: Spacing.threeLess,
  },
  // "What can I sort for you?": 28 regular at 1.45 (Figma rounds each line to 41).
  prompt: {
    fontFamily: Fonts.regular,
    fontSize: 28,
    lineHeight: 41,
  },
  section: {
    gap: Spacing.twoHalf,
    paddingTop: 22,
  },
  // Figma (14 Nov): the three tiles share the row, 10 apart.
  today: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.twoHalf,
  },
  // Figma tile: 12 × 14 padding, 4 gap, 20 corners.
  tile: {
    flex: 1,
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  tileTitle: {
    lineHeight: 19,
  },
  tileNote: {
    lineHeight: 16,
  },
  // One card for the questions: 1 px edge, 20 corners like the tiles, rows 16 in from the edge.
  questions: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    minHeight: 56,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  turn: {
    gap: 14,
    paddingTop: 10,
  },
  answer: {
    fontFamily: Fonts.medium,
    lineHeight: 25,
  },
  bubbleRow: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 11,
    borderRadius: 22,
    borderBottomEndRadius: 6,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  failed: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    alignItems: 'flex-start',
  },
  disclaimer: {
    textAlign: 'center',
    paddingTop: Spacing.three,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  composer: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: Spacing.threeHalf,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    height: '100%',
  },
  action: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  actionIcon: {
    position: 'absolute',
  },
});
