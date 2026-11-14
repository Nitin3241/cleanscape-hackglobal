import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useTheme } from '@/hooks/use-theme';

// Figma positions are measured from the top of an 800 px frame with a 44 px status bar.
const FRAME_STATUS_BAR = 44;
const FRAME_BOTTOM_MARGIN = 36;

type OnboardingScreenProps = {
  /** Where content starts in the Figma frame, in pixels from the top. */
  top: number;
  children: ReactNode;
  /** Stays pinned to the bottom, and keeps still while content fades in. */
  footer?: ReactNode;
  /** Turn off for screens that use their own gestures. */
  scrollable?: boolean;
};

/** Shared layout for onboarding: scrolling content that fades up, and a pinned footer. */
export function OnboardingScreen({ top, children, footer, scrollable = true }: OnboardingScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const fadeUp = useFadeUp();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        scrollEnabled={scrollable}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + top - FRAME_STATUS_BAR, paddingBottom: Spacing.three },
        ]}>
        <Animated.View style={[styles.column, fadeUp]}>{children}</Animated.View>
      </ScrollView>
      {footer && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom + Spacing.twoThreeQuarters, FRAME_BOTTOM_MARGIN) },
          ]}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
  },
});
