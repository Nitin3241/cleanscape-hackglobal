import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast } from '@/components/ui/toast';
import { Spacing, TabBarHeight } from '@/constants/theme';
import { useComingSoon } from '@/state/coming-soon';

/** Shows the "Coming soon" toast above the tab bar, on top of every screen. Mounted once in the root layout. */
export function ComingSoonHost() {
  const insets = useSafeAreaInsets();
  const text = useComingSoon();
  if (!text) return null;

  return (
    <View pointerEvents="none" style={[styles.host, { bottom: TabBarHeight + insets.bottom + Spacing.two }]}>
      <Toast icon="clock" text={text} />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
});
