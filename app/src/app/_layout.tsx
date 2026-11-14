import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { ReadexPro_400Regular, ReadexPro_500Medium } from '@expo-google-fonts/readex-pro';
import { PhoneInsets } from '@/components/dev/phone-insets';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SpotOpenedBanner } from '@/components/events/spot-opened-banner';
import { ComingSoonHost } from '@/components/ui/coming-soon-host';
import { Motion } from '@/constants/theme';
import { feedback } from '@/feedback';
import { LanguageProvider } from '@/state/language';
import { RegistrationProvider } from '@/state/registration';
import { RoleProvider } from '@/state/role';

SplashScreen.preventAutoHideAsync();

// Routes shown as bottom sheets over the screen behind them.
const SHEETS = [
  'register',
  'guardian-request',
  'switch-event',
  'cancel-spot',
  'directions',
  'wallet',
  'wallet-add',
  'host-earthy',
  'host-co-host',
  'host-why',
  'host-invite',
  'impact-week',
  'impact-why',
  'impact-item',
  'calendar-add',
  'scan-fix',
  'earthy-source',
  'earthy-ask',
  'earthy-start',
  'class-found',
  'class-invite',
  'waste-emirate',
  'plastic-ask',
  'ride-requested',
  'licence',
  'ride-rematch',
];
const SHEET_OPTIONS = {
  presentation: 'transparentModal',
  animation: 'fade',
  animationDuration: Motion.transition.sheet.duration,
  contentStyle: { backgroundColor: 'transparent' },
} as const;
// Figma (9 Nov): pushes 450 ms, slide-ins 400 ms, tab bar instant. The native stack can set the
// duration (iOS) but not the curve, so pushes use the platform's own easing.
const SLIDE_IN = { animation: 'slide_from_bottom', animationDuration: Motion.transition.sheet.duration } as const;
const TAB_ROOT = { animation: 'none' } as const;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    ReadexPro_400Regular,
    ReadexPro_500Medium,
  });
  // If a font fails to load, carry on with the system font rather than a stuck splash screen.
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    feedback.init();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <PhoneInsets>
      <LanguageProvider>
        <RoleProvider>
          <RegistrationProvider>
          {/* A stack keeps Home mounted, so its entrance animation doesn't replay on the way back. */}
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: Motion.transition.push.duration }}>
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
            <Stack.Screen name="home" options={TAB_ROOT} />
            <Stack.Screen name="event-map" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="wallet-pass" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="crew-scan" options={{ animation: 'fade' }} />
            <Stack.Screen name="waste-scan" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="bag-log" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="bag-weigh" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="earthy" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            {/* Full screen, as in Figma. A plain 'modal' showed Earthy, the map and the pass as iOS page sheets. */}
            <Stack.Screen name="earthy-show" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="earthy-live" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="earthy-lens" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="earthy-voice" options={SHEET_OPTIONS} />
            {/* Spot it is a step in the Host flow (Figma: push from the radar), not a modal. As a modal, iOS presented
                every screen pushed after it (Become a host, Your clean-up, ...) as a page sheet. */}
            <Stack.Screen name="impact-story" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="scanner" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="report" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="report-review" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="report-sent" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            {/* R1·2p and R1·4 open from the report modals, so they must be modals too or iOS shows them as page sheets. */}
            <Stack.Screen name="report-photo-check" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="report-status" options={{ presentation: 'fullScreenModal', ...SLIDE_IN }} />
            <Stack.Screen name="events" options={TAB_ROOT} />
            <Stack.Screen name="smileys" options={TAB_ROOT} />
            <Stack.Screen name="profile" options={TAB_ROOT} />
            <Stack.Screen name="registered" options={{ animation: 'fade' }} />
            {SHEETS.map((name) => (
              <Stack.Screen key={name} name={name} options={SHEET_OPTIONS} />
            ))}
          </Stack>
          <SpotOpenedBanner />
          <ComingSoonHost />
          </RegistrationProvider>
        </RoleProvider>
      </LanguageProvider>
      </PhoneInsets>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
