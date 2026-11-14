import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatHeader } from '@/components/earthy-chat/chat-chrome';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { askEarthy, type EarthyMessage } from '@/services/earthy-api';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;

const STARTERS = ['When is my next clean-up?', 'What should I bring?', 'Which bin for a pizza box?'] as const;

type Turn = { question: string; answer?: string; failed?: boolean };

/**
 * Ask Earthy, live (built for HackGlobal 2026). A typed question goes to the Earthy server on Vultr
 * (`src/services/earthy-api.ts`) and the answer comes back from a model. It reuses the F9 v2 chat look:
 * user bubble, Earthy label, answer text. If the server can't be reached it says so plainly and never
 * invents an answer. The scripted prototype screens (`/earthy-chat`) are unchanged.
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

  // Opened with a question already typed elsewhere: ask it once.
  useEffect(() => {
    if (ask && !asked.current) {
      asked.current = true;
      send(ask);
    }
    // Runs once on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(timer);
  }, [turns, busy]);

  const canSend = draft.trim().length > 0 && !busy;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.card }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scroll}
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 64 }]}
        showsVerticalScrollIndicator={false}>
        {turns.length === 0 && (
          <View style={styles.empty}>
            <EarthyOrb size={56} state="idle" glow={false} />
            <ThemedText type="answer" style={styles.answer}>
              Ask me about your clean-up, sorting waste or staying safe in the heat.
            </ThemedText>
            <View>
              {STARTERS.map((starter) => (
                <Tappable
                  key={starter}
                  accessibilityRole="button"
                  accessibilityLabel={starter}
                  onPress={() => send(starter)}
                  style={styles.starter}>
                  <ThemedText type="hint" style={styles.flex}>
                    {starter}
                  </ThemedText>
                  <Icon name="arrow-end" size={16} color="textWeak" />
                </Tappable>
              ))}
            </View>
          </View>
        )}
        {turns.map((turn, index) => (
          <View key={index} style={styles.turn}>
            <View style={styles.bubbleRow}>
              <View
                style={[styles.bubble, { backgroundColor: theme.tileNeutral }]}
                accessibilityLabel={`You said: ${turn.question}`}>
                <ThemedText type="lead">{turn.question}</ThemedText>
              </View>
            </View>
            <View style={styles.label}>
              <EarthyOrb size={24} state={!turn.answer && !turn.failed ? 'thinking' : 'still'} glow={false} />
              <ThemedText type="fieldLabel" themeColor="textWeak">
                {!turn.answer && !turn.failed ? 'Earthy is thinking' : 'Earthy'}
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
                  I can’t reach Earthy’s server right now, so I won’t guess. Check your connection and ask again.
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
        ))}
        <ThemedText type="caption" themeColor="textWeak" style={styles.disclaimer}>
          Earthy can make mistakes. Check event details with the organiser.
        </ThemedText>
      </ScrollView>

      <View style={styles.header} pointerEvents="box-none">
        <LinearGradient
          colors={[theme.card, theme.card, `${theme.card}00`]}
          locations={[0, 0.82, 1]}
          style={[styles.backdrop, { height: insets.top + 68 }]}
          pointerEvents="none"
        />
        <ChatHeader />
      </View>

      <View style={[styles.composerRow, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <View style={[styles.composer, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask Earthy"
            placeholderTextColor={theme.textPlaceholder}
            accessibilityLabel="Ask Earthy"
            returnKeyType="send"
            maxLength={500}
            onSubmitEditing={() => send(draft)}
            style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={() => send(draft)}
          style={[styles.send, { backgroundColor: theme.brand, opacity: canSend ? 1 : 0.45 }]}>
          <Icon name="arrow-up" size={22} color="textOnBrand" strokeWidth={2} />
        </Tappable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
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
  // Same thread metrics as the F9 v2 chat: 20 px sides, everything 14 apart.
  content: {
    gap: 14,
    paddingHorizontal: Spacing.threeHalf,
    paddingBottom: Spacing.three,
  },
  empty: {
    gap: 14,
    paddingTop: Spacing.three,
  },
  starter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.twoHalf,
  },
  turn: {
    gap: 14,
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
    paddingTop: Spacing.two,
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
  send: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
});
