import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { appleXml, googleXml, shieldXml } from '@/constants/onboarding-art';
import { Spacing } from '@/constants/theme';

export default function SignInRoute() {
  // SAMPLE: no sign-in service is connected yet, so these buttons only move to the next step.
  const continueSignedIn = () => router.push('/onboarding/birthday');

  return (
    <OnboardingScreen
      top={124}
      footer={
        <View>
          <Button label="Continue with UAE PASS" size="large" onPress={continueSignedIn} />
          <View style={styles.providers}>
            <Button
              label="Continue with Apple"
              variant="outline"
              leading={<SvgXml xml={appleXml} width={20} height={20} />}
              onPress={continueSignedIn}
            />
            <Button
              label="Continue with Google"
              variant="outline"
              leading={<SvgXml xml={googleXml} width={20} height={20} />}
              onPress={continueSignedIn}
            />
          </View>
          <View style={styles.other}>
            <TextButton label="Use phone or email instead" onPress={() => router.push('/onboarding/phone')} />
          </View>
          <ThemedText type="terms" themeColor="textWeak" style={styles.terms}>
            By continuing you agree to our Terms and Privacy Policy
          </ThemedText>
        </View>
      }>
      <View style={styles.shield}>
        <SvgXml xml={shieldXml} width={140} height={150} />
      </View>
      <ThemedText type="languageTitle" accessibilityRole="header" style={styles.title}>
        Privacy by design
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={styles.body}>
        We only collect what we need to run cleanups. No biometrics, ever.
      </ThemedText>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  shield: {
    alignSelf: 'center',
  },
  title: {
    marginTop: 26,
    textAlign: 'center',
  },
  body: {
    marginTop: 3,
    maxWidth: 290,
    alignSelf: 'center',
    textAlign: 'center',
  },
  providers: {
    marginTop: Spacing.twoThreeQuarters,
    gap: Spacing.twoHalf,
  },
  other: {
    marginTop: Spacing.three,
  },
  // Figma 8 Nov: 12 px more air above the terms and below them, which lifts the buttons.
  terms: {
    marginTop: 40,
    marginBottom: 12,
    maxWidth: 280,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
