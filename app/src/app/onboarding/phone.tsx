import { router } from 'expo-router';
import { useState } from 'react';
import { I18nManager, StyleSheet, TextInput, View } from 'react-native';

import { useOnboarding } from '@/components/onboarding/onboarding-context';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const NUMBER_LENGTH = 9;

/** Groups a UAE mobile number the way it's read aloud: 50 123 4567. */
function formatNumber(digits: string) {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, NUMBER_LENGTH)]
    .filter(Boolean)
    .join(' ');
}

export default function PhoneRoute() {
  const theme = useTheme();
  const { setPhone } = useOnboarding();
  const [digits, setDigits] = useState('');
  const complete = digits.length === NUMBER_LENGTH;

  return (
    <OnboardingScreen
      top={120}
      footer={
        <Button
          label="Send code"
          size="large"
          disabled={!complete}
          onPress={() => {
            setPhone(`+971 ${formatNumber(digits)}`);
            router.push('/onboarding/code');
          }}
        />
      }>
      <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
        {"What's your phone number?"}
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        {"We'll text you a 6-digit code to sign in."}
      </ThemedText>

      <View style={[styles.field, { borderBottomColor: theme.strokeStrong }]}>
        <ThemedText type="phonePrefix">🇦🇪 +971</ThemedText>
        <TextInput
          value={formatNumber(digits)}
          onChangeText={(text) => setDigits(text.replace(/\D/g, '').slice(0, NUMBER_LENGTH))}
          placeholder="50 123 4567"
          placeholderTextColor={theme.strokeStrong}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel-national"
          autoFocus
          accessibilityLabel="Phone number, after +971"
          style={[styles.input, { color: theme.textStrong }]}
        />
      </View>

      {/* There's no email screen in Figma yet, so this doesn't go anywhere. */}
      <View style={styles.email}>
        <TextButton label="Use email instead" disabled />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.two,
  },
  // Phone numbers always read left to right, even when the layout is RTL.
  field: {
    marginTop: 40,
    height: 52,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.twoHalf,
    borderBottomWidth: 1.5,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: Fonts.regular,
    fontSize: 20,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  email: {
    marginTop: Spacing.threeHalf,
  },
});
