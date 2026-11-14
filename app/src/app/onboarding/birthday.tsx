import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DateWheel, WheelColumn } from '@/components/onboarding/date-wheel';
import { InfoNote } from '@/components/onboarding/info-note';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';

const ADULT_AGE = 18;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1));
const FIRST_YEAR = 1940;
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - FIRST_YEAR + 1 }, (_, index) => String(FIRST_YEAR + index));

function ageOn(today: Date, year: number, month: number, day: number) {
  // A day past the end of the month (31 Feb) rolls into the next month, which is close enough for age.
  const birthday = new Date(year, month, day);
  const hadBirthdayThisYear =
    today.getMonth() > birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());
  return today.getFullYear() - birthday.getFullYear() - (hadBirthdayThisYear ? 0 : 1);
}

export default function BirthdayRoute() {
  // Starts on the date shown in Figma. It's only used to work out age and is never kept.
  const [day, setDay] = useState(13);
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(YEARS.indexOf('2008'));

  return (
    <OnboardingScreen
      top={120}
      footer={
        <Button
          label="Continue"
          size="large"
          onPress={() => {
            const age = ageOn(new Date(), FIRST_YEAR + year, month, day + 1);
            feedback.setKidMode(age < ADULT_AGE);
            router.push(age < ADULT_AGE ? '/onboarding/guardian' : '/onboarding/pledge');
          }}
        />
      }>
      <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
        {"When's your birthday?"}
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        {"We ask to keep young volunteers safe. Under 18s need a parent or guardian's OK."}
      </ThemedText>

      <View style={styles.wheel}>
        {/* Figma column centres: 60 / 161 / 264 across the 312 px wheel. */}
        <DateWheel style={styles.columns}>
          <WheelColumn label="Day" items={DAYS} index={day} onChange={setDay} width={80} />
          <WheelColumn label="Month" items={MONTHS} index={month} onChange={setMonth} width={90} />
          <WheelColumn label="Year" items={YEARS} index={year} onChange={setYear} width={80} />
        </DateWheel>
      </View>

      <InfoNote
        icon="lock"
        text="Only your age is used. Your birthday is never shown."
        background="secondarySubtle"
        foreground="textSecondary"
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.two,
    maxWidth: 296,
    alignSelf: 'center',
  },
  wheel: {
    marginTop: 40,
    marginBottom: Spacing.four,
  },
  columns: {
    paddingStart: Spacing.threeHalf,
    gap: 17,
  },
});
