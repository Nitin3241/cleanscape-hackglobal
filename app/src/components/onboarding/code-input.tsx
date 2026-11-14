import { useEffect } from 'react';
import { I18nManager, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SHAKE_DISTANCE = 4;
const SHAKE_STEP = 50;
const DROP_DISTANCE = 8;

type CodeInputProps = {
  value: string;
  length: number;
  onChange: (value: string) => void;
  /** Turning this on shakes the row and shows the error colour. */
  error: boolean;
};

/** One box per digit over a hidden field, so paste and SMS autofill still work. */
export function CodeInput({ value, length, onChange, error }: CodeInputProps) {
  const reducedMotion = useReducedMotion();
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!error || reducedMotion) return;
    shake.set(
      withSequence(
        withTiming(-SHAKE_DISTANCE, { duration: SHAKE_STEP / 2 }),
        withRepeat(withTiming(SHAKE_DISTANCE, { duration: SHAKE_STEP }), 5, true),
        withTiming(0, { duration: SHAKE_STEP / 2 }),
      ),
    );
  }, [error, reducedMotion, shake]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  return (
    <View>
      <Animated.View style={[styles.row, shakeStyle]}>
        {digits.map((digit, index) => (
          <CodeBox key={index} digit={digit} active={index === value.length} error={error} />
        ))}
      </Animated.View>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        maxLength={length}
        caretHidden
        accessibilityLabel={`${length}-digit code`}
        style={styles.input}
      />
    </View>
  );
}

function CodeBox({ digit, active, error }: { digit: string; active: boolean; error: boolean }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const drop = useSharedValue(1);

  useEffect(() => {
    if (!digit || reducedMotion) return;
    drop.set(0);
    drop.set(withTiming(1, { duration: Motion.duration.fast }));
  }, [digit, drop, reducedMotion]);

  const dropStyle = useAnimatedStyle(() => ({
    opacity: drop.get(),
    transform: [{ translateY: (drop.get() - 1) * DROP_DISTANCE }],
  }));

  const borderColor = error ? theme.textAccent : active ? theme.brand : theme.strokeWeak;

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.card, borderColor, borderWidth: active || error ? 2 : 1 },
      ]}>
      {digit ? (
        <Animated.View style={dropStyle}>
          <ThemedText type="codeDigit" maxFontSizeMultiplier={1.2}>
            {digit}
          </ThemedText>
        </Animated.View>
      ) : active ? (
        <View style={[styles.caret, { backgroundColor: theme.brand }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Codes always read left to right, even when the layout is RTL.
  row: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  box: {
    flex: 1,
    maxWidth: 46,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  caret: {
    width: 2,
    height: 24,
  },
  input: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
});
