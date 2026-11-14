import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { OnboardingProvider } from '@/components/onboarding/onboarding-context';
import { OnboardingHeader } from '@/components/onboarding/onboarding-header';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <Slot />
        <OnboardingHeader />
      </View>
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
