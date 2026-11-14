import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChoiceCard } from '@/components/onboarding/choice-card';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Spacing } from '@/constants/theme';
import { setJoinsWithSchool } from '@/state/school';

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'UAQ'];
const TIMES = ['Weekday mornings', 'Weekday evenings', 'Weekends'];
const WAYS_TO_JOIN = [
  { title: 'On my own', subtitle: 'Meet new people on the day' },
  { title: 'With friends or family', subtitle: 'Sign up as a small group' },
  { title: 'With my school', subtitle: 'Join your class with a code' },
];
const WITH_SCHOOL = 'With my school';

export default function InterestsRoute() {
  // Figma shows example picks, but real choices should start empty. Only "With my school" is saved, to end onboarding on Join your class.
  const [picked, setPicked] = useState<readonly string[]>([]);

  function toggle(option: string) {
    setPicked((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  return (
    <OnboardingScreen
      top={120}
      footer={
        <Button
          label="Continue"
          size="large"
          onPress={() => {
            setJoinsWithSchool(picked.includes(WITH_SCHOOL));
            router.push('/onboarding/notifications');
          }}
        />
      }>
      <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
        What suits you?
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        Pick any. You can change these later.
      </ThemedText>

      <Section label="EMIRATE">
        <View style={styles.chips}>
          {EMIRATES.map((option) => (
            <ChoiceChip key={option} label={option} selected={picked.includes(option)} onPress={() => toggle(option)} />
          ))}
        </View>
      </Section>

      <Section label="WHEN">
        <View style={styles.chips}>
          {TIMES.map((option) => (
            <ChoiceChip key={option} label={option} selected={picked.includes(option)} onPress={() => toggle(option)} />
          ))}
        </View>
      </Section>

      <Section label="HOW DO YOU JOIN?">
        <View style={styles.cards}>
          {WAYS_TO_JOIN.map((option) => (
            <ChoiceCard
              key={option.title}
              {...option}
              indicator="checkbox"
              selected={picked.includes(option.title)}
              onPress={() => toggle(option.title)}
            />
          ))}
        </View>
      </Section>
    </OnboardingScreen>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="sectionCaps" themeColor="textWeak" accessibilityRole="header">
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.two,
  },
  section: {
    marginTop: 18,
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cards: {
    gap: Spacing.two,
  },
});
