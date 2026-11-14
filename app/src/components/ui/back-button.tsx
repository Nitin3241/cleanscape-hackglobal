import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { useTheme } from '@/hooks/use-theme';

/** Round back button for white pages, where the glass button would vanish (Figma F4·6: white, 1 px #E3E8EB edge). */
export function BackButton({ onPress = () => router.back() }: { onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={6}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
      <Icon name="chevron-start" size={23} color="textStrong" />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
});
