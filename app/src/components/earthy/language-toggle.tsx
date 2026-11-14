import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

export type VoiceLanguage = 'en' | 'ar';

const SEGMENTS = [
  { key: 'en', label: 'EN', type: 'toggle', accessibilityLabel: 'English' },
  { key: 'ar', label: 'ع', type: 'toggleArabic', accessibilityLabel: 'Arabic' },
] as const;

/** EN / ع switch for what language Earthy listens in. */
export function LanguageToggle({ value, onChange }: { value: VoiceLanguage; onChange: (value: VoiceLanguage) => void }) {
  const theme = useTheme();

  return (
    <View accessibilityRole="radiogroup" style={[styles.toggle, { backgroundColor: theme.wellCool }]}>
      {SEGMENTS.map((segment) => {
        const selected = value === segment.key;
        return (
          <Tappable
            key={segment.key}
            accessibilityRole="radio"
            accessibilityLabel={segment.accessibilityLabel}
            accessibilityState={{ checked: selected }}
            hitSlop={{ top: 8, bottom: 8 }}
            onPress={() => {
              if (!selected) feedback.play('toggle.on');
              onChange(segment.key);
            }}
            style={[styles.segment, selected && { backgroundColor: theme.brand }]}>
            <ThemedText type={segment.type} themeColor={selected ? 'textOnBrand' : 'textWeak'}>
              {segment.label}
            </ThemedText>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: Radius.pill,
  },
  segment: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
});
