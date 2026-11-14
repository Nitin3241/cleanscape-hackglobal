import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeInput } from '@/components/onboarding/code-input';
import { useOnboarding } from '@/components/onboarding/onboarding-context';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
// SAMPLE: no SMS service is connected yet. Any code passes except this one, which shows the error.
const SAMPLE_WRONG_CODE = '000000';

export default function CodeRoute() {
  const { phone } = useOnboarding();
  const [code, setCode] = useState('');
  const [wrong, setWrong] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const canResend = secondsLeft === 0;

  useEffect(() => {
    if (canResend) return;
    const timer = setTimeout(() => setSecondsLeft((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [canResend, secondsLeft]);

  return (
    <OnboardingScreen
      top={120}
      footer={
        <Button
          label="Verify"
          size="large"
          disabled={code.length < CODE_LENGTH}
          onPress={() => {
            if (code === SAMPLE_WRONG_CODE) {
              feedback.play('form.error');
              setWrong(true);
            } else {
              feedback.play('auth.codeAccepted');
              router.push('/onboarding/birthday');
            }
          }}
        />
      }>
      <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
        Enter the code
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.sent]}>
        {`Sent to ${phone}`}
      </ThemedText>
      <View style={styles.edit}>
        <TextButton label="Edit number" onPress={() => router.back()} />
      </View>

      <View style={styles.boxes}>
        <CodeInput
          value={code}
          length={CODE_LENGTH}
          error={wrong}
          onChange={(next) => {
            setCode(next);
            setWrong(false);
          }}
        />
      </View>

      {wrong && (
        <ThemedText
          type="hint"
          themeColor="textAccent"
          accessibilityLiveRegion="polite"
          style={[styles.centred, styles.status]}>
          {"That code didn't work. Try again."}
        </ThemedText>
      )}

      <View style={styles.status}>
        {canResend ? (
          <TextButton
            label="Resend code"
            onPress={() => {
              setCode('');
              setWrong(false);
              setSecondsLeft(RESEND_SECONDS);
            }}
          />
        ) : (
          <ThemedText type="hint" themeColor="textWeak" style={styles.centred}>
            {`Resend code in 0:${String(secondsLeft).padStart(2, '0')}`}
          </ThemedText>
        )}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  sent: {
    marginTop: Spacing.two,
  },
  edit: {
    marginTop: Spacing.oneHalf,
  },
  boxes: {
    marginTop: 34,
    marginHorizontal: -Spacing.half,
  },
  status: {
    marginTop: 28,
  },
});
