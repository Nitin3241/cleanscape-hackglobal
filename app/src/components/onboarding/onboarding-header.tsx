import { router, usePathname, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressDots } from '@/components/onboarding/progress-dots';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PROGRESS_STEPS = 5;

type HeaderConfig = {
  /** Current step of the five, if the screen shows progress. */
  step?: number;
  skipTo?: Href;
};

// Only screens with a back button are listed.
const HEADERS: Record<string, HeaderConfig> = {
  '/onboarding/sign-in': {},
  '/onboarding/phone': { step: 0 },
  '/onboarding/code': { step: 0 },
  '/onboarding/birthday': { step: 1 },
  '/onboarding/guardian': { step: 1 },
  '/onboarding/pledge': { step: 2 },
  '/onboarding/location': { step: 3, skipTo: '/onboarding/interests' },
  '/onboarding/interests': { step: 3, skipTo: '/onboarding/notifications' },
  '/onboarding/notifications': { step: 4, skipTo: '/onboarding/good-to-go' },
};

/** Back, progress and Skip. It lives in the layout so it stays put as screens change. */
export function OnboardingHeader() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const config = HEADERS[usePathname()];

  if (!config) return null;

  return (
    <View pointerEvents="box-none" style={[styles.header, { top: insets.top + Spacing.two }]}>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={[styles.back, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
        <Icon name="chevron-start" size={20} color="textStrong" />
      </Tappable>

      {config.step !== undefined && (
        <View pointerEvents="none" style={styles.progress}>
          <ProgressDots
            count={PROGRESS_STEPS}
            active={config.step}
            accessibilityLabel={`Step ${config.step + 1} of ${PROGRESS_STEPS}`}
          />
        </View>
      )}

      {config.skipTo && <SkipLink href={config.skipTo} />}
    </View>
  );
}

export function SkipLink({ href }: { href: Href }) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel="Skip"
      hitSlop={{ top: 11, bottom: 11, left: 12, right: 12 }}
      onPress={() => router.push(href)}>
      <ThemedText type="skip" themeColor="textWeak">
        Skip
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.threeHalf,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  progress: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
