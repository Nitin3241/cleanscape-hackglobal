import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { StagedLoader } from '@/components/ui/staged-loader';
import { Spacing } from '@/constants/theme';
import { HOST_DRAFT_STEPS } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

/** F10·10a Earthy drafting (loader): plays once, then opens the drafted clean-up (F10·10). */
export default function HostDraftingRoute() {
  const theme = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      <StagedLoader
        title="Earthy is drafting your clean-up"
        subtitle="This takes a few seconds"
        steps={HOST_DRAFT_STEPS}
        onDone={() => router.replace('/cleanup-draft')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 196,
    paddingHorizontal: Spacing.three,
  },
});
