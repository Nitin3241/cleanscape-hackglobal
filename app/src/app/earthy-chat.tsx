import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Linking, ScrollView, type ScrollViewInstance, Share, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatCardView } from '@/components/earthy-chat/chat-cards';
import { ChatComposer, ChatHeader, composerClearance, FeedbackRow, SuggestionRow } from '@/components/earthy-chat/chat-chrome';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Tappable } from '@/components/ui/tappable';
import { speakerIconXml } from '@/constants/earthy-icons';
import { STATE_EASING } from '@/constants/motion';
import { Fonts, Motion, Radius, Spacing } from '@/constants/theme';
import { type ChatAction, type ChatLink, type ChatTurn, STEPS, type StepId, type Suggestion } from '@/data/earthy-chat.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { earthyIsLive } from '@/services/earthy-api';

const isStepId = (value: unknown): value is StepId => typeof value === 'string' && value in STEPS;

/**
 * Where a tap in the chat goes. Like Figma's prototype, each answer is its own screen: another step
 * is pushed (so Close goes back to the one before), and "Earthy home" returns to F9v2·1.
 */
function goTo(link: ChatLink) {
  switch (link) {
    case 'back':
      router.back();
      return;
    case 'home':
      router.dismissTo('/earthy');
      return;
    case '/smileys':
      router.push(link);
      return;
    default:
      router.push({ pathname: '/earthy-chat', params: { start: link } });
  }
}

/**
 * F9 v2 chat screens (F9v2·4–16, Story A F9v2·A1–A4 and Story B F9v2·B1–B4), one per step:
 * `/earthy-chat?start=<step>`. Each shows the end of a scripted thread as Figma draws it.
 * SAMPLE: no model is called.
 */
export default function EarthyChatRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { start } = useLocalSearchParams<{ start?: string }>();
  const turns: readonly ChatTurn[] = STEPS[isStepId(start) ? start : 'didYouMean'];
  const scroll = useRef<ScrollViewInstance>(null);

  // Longer threads open scrolled to their newest turn, as Figma's frames show them.
  useEffect(() => {
    const timer = setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScrollView
        ref={scroll}
        style={StyleSheet.absoluteFill}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 64, paddingBottom: composerClearance(insets.bottom) }]}
        showsVerticalScrollIndicator={false}>
        {turns.map((turn, index) => (
          <TurnView key={index} turn={turn} latest={index === turns.length - 1} />
        ))}
      </ScrollView>
      {/* Figma "Header backdrop": white, solid to 82%, then fading out, so the thread slides under the header. */}
      <View style={styles.header} pointerEvents="box-none">
        <LinearGradient
          colors={[theme.card, theme.card, `${theme.card}00`]}
          locations={[0, 0.82, 1]}
          style={[styles.backdrop, { height: insets.top + 68 }]}
          pointerEvents="none"
        />
        <ChatHeader />
      </View>
      <ChatComposer onAsk={() => (earthyIsLive ? router.push('/earthy-live') : goTo('didYouMean'))} />
    </View>
  );
}

function TurnView({ turn, latest }: { turn: ChatTurn; latest: boolean }) {
  const copy = () => Clipboard.setStringAsync(turn.answer).catch(() => {});
  const share = () => Share.share({ message: turn.answer }).catch(() => {});

  return (
    <Animated.View
      entering={latest ? FadeInDown.duration(Motion.transition.state.duration).easing(STATE_EASING) : undefined}
      style={styles.turn}>
      {turn.user && <UserBubble text={turn.user} rtl={turn.userRtl === true} />}
      <EarthyLabel speaker={latest} />
      <ThemedText type="answer" accessibilityLiveRegion={latest ? 'polite' : 'none'} style={styles.answer}>
        {turn.answer}
      </ThemedText>
      {latest && turn.card && <ChatCardView card={turn.card} onPick={goTo} />}
      {latest && turn.actions && <ActionRow actions={turn.actions} />}
      {latest && <FeedbackRow onCopy={copy} onShare={share} />}
      {latest &&
        turn.suggestions?.map((group, index) => (
          <View key={index}>
            {group.map((suggestion) => (
              <SuggestionRow
                key={suggestion.label}
                label={suggestion.label}
                // Some follow-ups lead nowhere in Figma yet: drawn as in Figma, and a tap says "coming soon".
                onPress={suggestion.to || suggestion.share ? () => follow(suggestion) : undefined}
              />
            ))}
          </View>
        ))}
    </Animated.View>
  );
}

function follow(suggestion: Suggestion) {
  if (suggestion.to) goTo(suggestion.to);
  else if (suggestion.share) Share.share({ message: suggestion.share }).catch(() => {});
}

function UserBubble({ text, rtl }: { text: string; rtl: boolean }) {
  const theme = useTheme();
  return (
    // Figma lets a long one-line question run past the 20 px margin (F9v2·12: the bubble starts at x 8).
    <View style={styles.bubbleRow}>
      <View style={[styles.bubble, { backgroundColor: theme.tileNeutral }]} accessibilityLabel={`You said: ${text}`}>
        <ThemedText type={rtl ? 'arabicLead' : 'lead'} style={rtl && styles.rtl}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

function EarthyLabel({ speaker }: { speaker: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.label}>
      <EarthyOrb size={24} state="still" glow={false} />
      <ThemedText type="fieldLabel" themeColor="textWeak" style={styles.flex}>
        Earthy
      </ThemedText>
      {/* Read aloud isn't wired to a voice yet; the speaker is shown on the newest answer, as in Figma. */}
      {speaker && (
        <View aria-hidden>
          <SvgXml xml={speakerIconXml(theme.textWeak)} width={18} height={18} />
        </View>
      )}
    </View>
  );
}

function runAction(action: ChatAction) {
  if (action.call) {
    Linking.openURL(action.call).catch(() => {});
    return;
  }
  // Button plays its own press feedback; the danger button is drawn here, so it plays it itself.
  if (action.tone === 'danger') feedback.play('button.primary');
  if (action.to) goTo(action.to);
}

function ActionRow({ actions }: { actions: readonly ChatAction[] }) {
  const theme = useTheme();
  // Heat safety (F9v2·11, B3) stacks its two buttons full width, 14 apart; the rest sit side by side.
  const stacked = actions.some((action) => action.tone === 'danger');
  return (
    <View style={[styles.actions, stacked && styles.stacked]}>
      {actions.map((action) =>
        action.tone === 'danger' ? (
          <Tappable
            key={action.label}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={() => runAction(action)}
            style={[styles.danger, { backgroundColor: theme.earthyDanger }]}>
            <ThemedText type="buttonPrimary" themeColor="textOnBrand">
              {action.label}
            </ThemedText>
          </Tappable>
        ) : (
          <View key={action.label} style={stacked ? styles.full : styles.flex}>
            <Button
              label={action.label}
              variant={action.tone === 'primary' ? 'primary' : 'secondary'}
              pill
              flat
              onPress={() => runAction(action)}
            />
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
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
  // Figma F9v2 thread: 20 px sides, everything 14 apart, starting at y 108.
  content: {
    gap: 14,
    paddingHorizontal: Spacing.threeHalf,
  },
  turn: {
    gap: 14,
  },
  // Figma answer: 17 medium at 1.45 (Figma draws two lines 50 tall).
  answer: {
    fontFamily: Fonts.medium,
    lineHeight: 25,
  },
  bubbleRow: {
    marginStart: -Spacing.threeHalf,
    alignItems: 'flex-end',
  },
  // Figma user bubble: #F2F5F7, 16 × 11 padding, 22 corners with a 6 px tail corner.
  bubble: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 11,
    borderRadius: 22,
    borderBottomEndRadius: 6,
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  full: {
    alignSelf: 'stretch',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  stacked: {
    flexDirection: 'column',
    gap: 14,
  },
  danger: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
});
