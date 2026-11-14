import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOST_BAR_HEIGHT, HostBottomBar, HostEventCard } from '@/components/host/host-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_CHANGES } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

/** F10·16b EEG asked for changes. Reached from Demo branches (X0). "Fix it" opens C1 Clean-up details. */
export default function HostChangesRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Your clean-up" centred onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: HOST_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <HostEventCard status="fix" />
        <ThemedText type="heading" accessibilityRole="header">
          {HOST_CHANGES.title}
        </ThemedText>
        <ThemedText type="body14" themeColor="textWeak">
          {HOST_CHANGES.body}
        </ThemedText>
        <View style={[styles.issue, { backgroundColor: theme.issueFill, borderColor: theme.issueStroke }]}>
          <ThemedText type="labelSmall" themeColor="levelHighText">
            {HOST_CHANGES.issueTitle}
          </ThemedText>
          <ThemedText type="answer14">{HOST_CHANGES.issue}</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {HOST_CHANGES.from}
          </ThemedText>
        </View>
      </ScrollView>

      <HostBottomBar>
        <Button label="Fix it" flat onPress={() => router.push('/cleanup-details')} />
      </HostBottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  issue: {
    gap: Spacing.oneHalf,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
});
