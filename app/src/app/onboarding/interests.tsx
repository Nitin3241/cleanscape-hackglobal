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
  // SAMPLE: starts on Figma Onb 10's example picks. Only "With my school" is saved, to end onboarding on Join your class.
  const [picked, setPicked] = useState<readonly string[]>(['Dubai', 'Weekends', 'With friends or family']);

  function toggle(option: string) {
    setPicked((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]));
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

      {/* Figma gaps above the section labels: 18, 16, then 14. */}
      <Section label="EMIRATE" gap={18}>
        <View style={styles.chips}>
          {EMIRATES.map((option) => (
            <ChoiceChip
              key={option}
              label={option}
              selected={picked.includes(option)}
              onPress={() => toggle(option)}
              borderOutsidePadding
            />
          ))}
        </View>
      </Section>

      <Section label="WHEN" gap={Spacing.three}>
        <View style={styles.chips}>
          {TIMES.map((option) => (
            <ChoiceChip
              key={option}
              label={option}
              selected={picked.includes(option)}
              onPress={() => toggle(option)}
              borderOutsidePadding
            />
          ))}
        </View>
      </Section>

      <Section label="HOW DO YOU JOIN?" gap={Spacing.threeLess}>
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

function Section({ label, gap, children }: { label: string; gap: number; children: React.ReactNode }) {
  return (
    <View style={[styles.section, { marginTop: gap }]}>
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
