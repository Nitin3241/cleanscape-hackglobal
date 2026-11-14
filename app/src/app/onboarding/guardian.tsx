import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { InfoNote } from '@/components/onboarding/info-note';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { guardianXml } from '@/constants/onboarding-art';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MIN_PHONE_DIGITS = 7;

function looksLikeContact(value: string) {
  const text = value.trim();
  return /^\S+@\S+\.\S+$/.test(text) || text.replace(/\D/g, '').length >= MIN_PHONE_DIGITS;
}

export default function GuardianRoute() {
  const theme = useTheme();
  // Held only while this screen is open. SAMPLE: no link is sent yet.
  const [contact, setContact] = useState('');

  return (
    <OnboardingScreen
      top={112}
      footer={
        <Button
          label="Send link"
          size="large"
          disabled={!looksLikeContact(contact)}
          onPress={() => router.push('/onboarding/pledge')}
        />
      }>
      <View style={styles.artwork}>
        <SvgXml xml={guardianXml} width={160} height={110} />
      </View>
      <ThemedText type="heading" accessibilityRole="header" style={[styles.centred, styles.title]}>
        Ask a parent or guardian
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        You can browse cleanups now. Joining one unlocks once they say yes.
      </ThemedText>

      <ThemedText type="fieldLabel" style={styles.label}>
        {"Guardian's contact"}
      </ThemedText>
      <TextInput
        value={contact}
        onChangeText={setContact}
        placeholder="Guardian's phone or email"
        placeholderTextColor={theme.textWeak}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Guardian's phone or email"
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.strokeStrong, color: theme.textStrong }]}
      />

      <View style={styles.note}>
        <InfoNote
          icon="clock"
          text="The link stays valid for 7 days. We'll let you know when they approve."
          background="fill"
          foreground="brand"
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  artwork: {
    alignSelf: 'center',
  },
  centred: {
    textAlign: 'center',
  },
  title: {
    marginTop: Spacing.twoThreeQuarters + 6,
  },
  body: {
    marginTop: Spacing.two,
    maxWidth: 296,
    alignSelf: 'center',
  },
  label: {
    marginTop: 28,
  },
  input: {
    marginTop: Spacing.oneHalf,
    height: 56,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.small,
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
  note: {
    marginTop: Spacing.three,
  },
});
