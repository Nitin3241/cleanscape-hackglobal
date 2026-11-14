import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ChoiceCard } from '@/components/onboarding/choice-card';
import { Mascot } from '@/components/onboarding/mascot';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useLanguage } from '@/state/language';

export default function LanguageRoute() {
  // Arabic switches the screens that have Arabic copy (Home so far) to right to left.
  const { language, setLanguage } = useLanguage();

  return (
    <OnboardingScreen
      top={150}
      footer={<Button label="Continue" size="large" onPress={() => router.push('/onboarding/welcome')} />}>
      <View style={styles.mascot}>
        <Mascot size={120} />
      </View>
      <ThemedText type="languageTitle" accessibilityRole="header" style={styles.title}>
        Choose your language
      </ThemedText>
      <ThemedText type="arabicTitle" themeColor="textWeak" style={styles.arabic}>
        اختر لغتك
      </ThemedText>

      <View style={styles.options}>
        <ChoiceCard
          title="العربية"
          titleType="arabicOption"
          subtitle="Arabic · right to left"
          indicator="radio"
          selected={language === 'ar'}
          onPress={() => setLanguage('ar')}
        />
        <ChoiceCard
          title="English"
          titleType="optionTitle"
          subtitle="English · left to right"
          indicator="radio"
          selected={language === 'en'}
          onPress={() => setLanguage('en')}
        />
      </View>

      <ThemedText type="note" themeColor="textWeak" style={styles.note}>
        You can change this anytime in Settings
      </ThemedText>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  mascot: {
    alignSelf: 'center',
  },
  title: {
    marginTop: 22,
    textAlign: 'center',
  },
  arabic: {
    marginTop: 1,
    textAlign: 'center',
  },
  options: {
    marginTop: 43,
    gap: Spacing.twoThreeQuarters,
  },
  note: {
    marginTop: Spacing.three,
    textAlign: 'center',
  },
});
