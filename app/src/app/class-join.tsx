import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  type TextInputInstance,
  type TextStyle,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CODE_LENGTH = 6;

const WHEN_YOU_JOIN: readonly { icon: IconName; text: string }[] = [
  { icon: 'bus', text: 'Your teacher books the school bus' },
  { icon: 'file', text: 'Your parent gets the permission slip' },
  { icon: 'users', text: 'You see which classmates are going' },
];

/** F3·1: join your class with the 6-character code, or the teacher's QR. */
export default function ClassJoinRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const input = useRef<TextInputInstance>(null);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(true);
  const left = CODE_LENGTH - code.length;
  const complete = left === 0;

  // DEMO: any complete code finds Grade 9B, and the QR row skips the camera.
  const findClass = () => router.push('/class-found');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Join your class" subtitle="Clean UAE · 5–15 Dec" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 120 }]}>
        <View style={styles.codeBlock}>
          <View style={styles.heading}>
            <ThemedText type="heading" accessibilityRole="header">
              Enter your class code
            </ThemedText>
            <ThemedText type="note" themeColor="textWeak">
              Your teacher shares it in class
            </ThemedText>
          </View>

          {/* One hidden field drives the six boxes, so paste and the keyboard's own suggestions work. */}
          <Pressable accessibilityRole="none" accessible={false} onPress={() => input.current?.focus()} style={styles.boxes}>
            {Array.from({ length: CODE_LENGTH }, (_, index) => {
              const active = focused && index === Math.min(code.length, CODE_LENGTH - 1) && !complete;
              return (
                <View
                  key={index}
                  style={[
                    styles.box,
                    active
                      ? { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 2 }
                      : { backgroundColor: theme.card, borderColor: theme.strokeControl, borderWidth: 1 },
                  ]}>
                  {code[index] ? (
                    <ThemedText type="heading">{code[index]}</ThemedText>
                  ) : (
                    active && <View style={[styles.caret, { backgroundColor: theme.brand }]} />
                  )}
                </View>
              );
            })}
            <TextInput
              ref={input}
              value={code}
              onChangeText={(text) =>
                setCode(
                  text
                    .replace(/[^a-z0-9]/gi, '')
                    .toUpperCase()
                    .slice(0, CODE_LENGTH),
                )
              }
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={() => complete && findClass()}
              autoFocus
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              maxLength={CODE_LENGTH}
              accessibilityLabel="Class code, 6 letters and numbers"
              style={[styles.hiddenInput, HIDDEN_ON_WEB]}
            />
          </Pressable>

          <View style={styles.hint}>
            <Icon name="info" size={16} color="textWeak" strokeWidth={1.25} />
            <ThemedText type="caption" themeColor="textWeak">
              6 letters and numbers, not case-sensitive
            </ThemedText>
          </View>
        </View>

        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Scan teacher's QR. No code? It's on the class board"
          onPress={findClass}
          style={[styles.qrCard, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <IconTile icon="qr" size={40} iconSize={22} />
          <View style={styles.qrText}>
            <ThemedText type="labelLarge">{"Scan teacher's QR"}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {"No code? It's on the class board"}
            </ThemedText>
          </View>
          <Icon name="chevron-end" size={18} color="textWeak" />
        </Tappable>

        <View style={styles.benefits}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            When you join your class
          </ThemedText>
          {WHEN_YOU_JOIN.map((row) => (
            <View key={row.text} style={styles.benefit}>
              <View style={[styles.benefitIcon, { backgroundColor: theme.fill }]}>
                <Icon name={row.icon} size={14} color="brand" strokeWidth={1.5} />
              </View>
              <ThemedText type="note">{row.text}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.card, bottom: TabBarHeight + insets.bottom }]}>
        <ThemedText type="caption" themeColor="textWeak" style={styles.centred} accessibilityLiveRegion="polite">
          {complete ? 'Code complete' : `${left} more ${left === 1 ? 'character' : 'characters'} to go`}
        </ThemedText>
        <Button label="Find class" disabled={!complete} onPress={findClass} />
      </View>

      <TabBar active="events" />
    </View>
  );
}

// The real field is invisible; the boxes above draw what it holds. React Native's
// types don't list `outlineStyle: 'none'`, though React Native Web accepts it.
const HIDDEN_ON_WEB = (Platform.OS === 'web' ? { outlineStyle: 'none' } : null) as TextStyle | null;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  codeBlock: {
    gap: Spacing.twoThreeQuarters,
  },
  heading: {
    gap: Spacing.twoThreeQuarters,
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 48,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  caret: {
    width: 2,
    height: 26,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    opacity: 0,
    color: 'transparent',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  qrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  qrText: {
    flex: 1,
    gap: Spacing.half,
  },
  benefits: {
    gap: Spacing.twoThreeQuarters,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  centred: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    start: 0,
    end: 0,
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.three,
  },
});
