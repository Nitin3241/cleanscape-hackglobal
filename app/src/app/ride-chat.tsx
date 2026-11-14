import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { FigmaLines } from '@/constants/figma-lines';
import { lockXml, sendXml } from '@/constants/rides-art';
import { Fonts, Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { QUICK_REPLIES, SAMPLE_CHAT, SAMPLE_RIDES } from '@/data/events.sample';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

type Message = { from: 'system' | 'them' | 'me'; text: string; time?: string };

/**
 * T6: chat with the driver, inside CleanScape so phone numbers stay private.
 * SAMPLE: messages are kept on this screen only, and no one replies.
 */
export default function RideChatRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const ride = SAMPLE_RIDES.find((item) => item.id === registration.rideId) ?? SAMPLE_RIDES[0];
  const firstName = ride.driver.name.split(' ')[0];
  const [messages, setMessages] = useState<readonly Message[]>(SAMPLE_CHAT);
  const [draft, setDraft] = useState('');
  const loading = useSampleLoading();
  const keyboardOpen = useKeyboardOpen();

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { from: 'me', text: trimmed, time: 'Now' }]);
    setDraft('');
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={ride.driver.name} subtitle={`Accepted · leaves ${ride.pickupTime} AM`} />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.threadScroll} contentContainerStyle={styles.thread} showsVerticalScrollIndicator={false}>
          {/* Figma T6 "Privacy banner". */}
          <View style={[styles.privacy, { backgroundColor: theme.fill }]}>
            <SvgXml xml={lockXml(theme.brand)} width={18} height={18} />
            <ThemedText type="chip" themeColor="brand" style={[styles.flex, FigmaLines.l17]}>
              Chat stays in CleanScape. Phone numbers are never shared.
            </ThemedText>
          </View>
          <View style={styles.messages}>
            {messages.map((message, index) =>
              message.from === 'system' ? (
                <View key={index} style={[styles.system, { backgroundColor: theme.surface }]}>
                  <Icon name="check" size={14} color="textWeak" strokeWidth={0.875} />
                  <ThemedText type="smallMedium" themeColor="textWeak" style={FigmaLines.l17}>
                    {message.text}
                  </ThemedText>
                </View>
              ) : (
                <Skeleton
                  key={index}
                  loading={loading}
                  order={index}
                  radius={Radius.option}
                  style={message.from === 'me' ? styles.mine : styles.theirs}>
                  <View
                    accessible
                    accessibilityLabel={`${message.from === 'me' ? 'You' : firstName}: ${message.text}`}
                    style={[
                      styles.bubble,
                      message.from === 'me'
                        ? [styles.mineCorner, { backgroundColor: theme.brand }]
                        : [styles.theirsCorner, { backgroundColor: theme.surface }],
                    ]}>
                    <ThemedText type="hint" themeColor={message.from === 'me' ? 'textOnBrand' : 'textStrong'}>
                      {message.text}
                    </ThemedText>
                    {message.time && (
                      <ThemedText
                        type="micro"
                        themeColor={message.from === 'me' ? 'textOnBrandWeak' : 'textWeak'}
                        style={styles.time}>
                        {message.time}
                      </ThemedText>
                    )}
                  </View>
                </Skeleton>
              ),
            )}
          </View>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRow}
          contentContainerStyle={styles.quick}>
          {QUICK_REPLIES.map((reply) => (
            <Tappable
              key={reply}
              accessibilityRole="button"
              accessibilityLabel={`Send: ${reply}`}
              onPress={() => send(reply)}
              style={[styles.quickChip, { backgroundColor: theme.card, borderColor: theme.strokeControl }]}>
              <ThemedText type="body">{reply}</ThemedText>
            </Tappable>
          ))}
        </ScrollView>

        {/* With the keyboard up, the tab bar is hidden under it, so the composer sits just above the keys. */}
        <View
          style={[styles.composer, { paddingBottom: keyboardOpen ? Spacing.two : TabBarHeight + insets.bottom + Spacing.two }]}>
          <View style={[styles.inputShadow, { boxShadow: Shadows.glassPill }]}>
            <Glass fill="glassComposer" style={[styles.inputGlass, { borderColor: theme.glassStroke }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={`Message ${firstName}`}
                placeholderTextColor={theme.textWeak}
                accessibilityLabel={`Message ${firstName}`}
                returnKeyType="send"
                onSubmitEditing={() => send(draft)}
                style={[styles.input, { color: theme.textStrong }]}
              />
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="Send"
                disabled={!draft.trim()}
                onPress={() => send(draft)}
                style={[styles.send, { backgroundColor: theme.brand }]}>
                <SvgXml xml={sendXml(theme.textOnBrand)} width={18} height={18} />
              </Tappable>
            </Glass>
          </View>
        </View>
      </KeyboardAvoidingView>
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma T6: the banner 12 under the header, messages 16 under it and 10 apart.
  thread: {
    gap: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
  flex: {
    flex: 1,
  },
  messages: {
    gap: Spacing.twoHalf,
  },
  system: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  // Figma bubbles: 14 / 10 padding, 18 corners with 6 on the tail, 230 px text.
  bubble: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoHalf,
    borderRadius: 18,
  },
  time: {
    lineHeight: 15,
  },
  // Alignment sits on the skeleton slot so the placeholder matches the bubble.
  mine: {
    alignSelf: 'flex-end',
    maxWidth: 258,
  },
  theirs: {
    alignSelf: 'flex-start',
    maxWidth: 258,
  },
  mineCorner: {
    borderBottomEndRadius: Spacing.oneHalf,
  },
  theirsCorner: {
    borderBottomStartRadius: Spacing.oneHalf,
  },
  // The thread gives up space when the keyboard opens; the reply chips never shrink (they were clipped).
  threadScroll: {
    flex: 1,
  },
  quickRow: {
    flexGrow: 0,
    flexShrink: 0,
  },
  // Figma T6: the replies sit 42 above the composer.
  quick: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: 42,
  },
  quickChip: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  // Figma "Composer": 12 from the screen edges, 8 above the tab bar.
  composer: {
    paddingHorizontal: Spacing.twoThreeQuarters,
  },
  inputShadow: {
    borderRadius: Radius.pill,
  },
  inputGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingStart: 18,
    paddingEnd: Spacing.two,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: 32,
  },
  input: {
    flex: 1,
    // On web a bare text input sits under Glass's absolutely placed blur and tint, which hid the
    // placeholder and blocked taps. Its own stacking keeps it on top (no change on phones).
    position: 'relative',
    height: 38,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  send: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
});

/** True while the on-screen keyboard is showing. iOS reports it before it animates in. */
function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setOpen(true));
    const hide = Keyboard.addListener(hideEvent, () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return open;
}
