import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
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
          <Notice icon="lock" text="Chat stays in CleanScape. Phone numbers are never shared." />
          {messages.map((message, index) =>
            message.from === 'system' ? (
              <View key={index} style={[styles.system, { backgroundColor: theme.secondarySubtle }]}>
                <Icon name="check" size={12} color="textWeak" />
                <ThemedText type="small" themeColor="textWeak">
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
                    <ThemedText type="ringCaption" themeColor={message.from === 'me' ? 'textOnBrandWeak' : 'textWeak'}>
                      {message.time}
                    </ThemedText>
                  )}
                </View>
              </Skeleton>
            ),
          )}
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
          style={[
            styles.composer,
            { paddingBottom: keyboardOpen ? Spacing.two : TabBarHeight + insets.bottom + Spacing.two },
          ]}>
          <View style={[styles.inputShadow, { boxShadow: Shadows.tabBar }]}>
            <Glass style={styles.inputGlass}>
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
                <Icon name="send" size={18} color="textOnBrand" strokeWidth={1.75} />
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
  thread: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
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
  bubble: {
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
  // Alignment sits on the skeleton slot so the placeholder matches the bubble.
  mine: {
    alignSelf: 'flex-end',
    maxWidth: '78%',
  },
  theirs: {
    alignSelf: 'flex-start',
    maxWidth: '78%',
  },
  mineCorner: {
    borderBottomEndRadius: Spacing.one,
  },
  theirsCorner: {
    borderBottomStartRadius: Spacing.one,
  },
  // The thread gives up space when the keyboard opens; the reply chips never shrink (they were clipped).
  threadScroll: {
    flex: 1,
  },
  quickRow: {
    flexGrow: 0,
    flexShrink: 0,
  },
  quick: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.twoThreeQuarters,
  },
  quickChip: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  composer: {
    paddingHorizontal: Spacing.three,
  },
  inputShadow: {
    borderRadius: Radius.pill,
  },
  inputGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: Spacing.threeHalf,
    paddingEnd: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  input: {
    flex: 1,
    // On web a bare text input sits under Glass's absolutely placed blur and tint, which hid the
    // placeholder and blocked taps. Its own stacking keeps it on top (no change on phones).
    position: 'relative',
    height: 40,
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
  send: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
