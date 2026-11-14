import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { useTheme } from '@/hooks/use-theme';

/**
 * The plastic quiz buttons (Figma 794:12837 and the quiz Feedback panels): 48 tall full pills with a SemiBold
 * 16 / 24 label, filled brand or outlined 1.5 px brand. The shared Button uses 15 / 22, so these are their own.
 */
export function QuizButton({ label, onPress, outlined = false }: { label: string; onPress: () => void; outlined?: boolean }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.button,
        outlined
          ? {
              backgroundColor: theme.card,
              borderColor: theme.brand,
              borderWidth: 1.5,
            }
          : { backgroundColor: theme.brand },
      ]}>
      <ThemedText type="sectionTitle" themeColor={outlined ? 'brand' : 'textOnBrand'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
});
