import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TONES = {
  success: { background: 'statusSuccessSubtle', foreground: 'statusSuccess' },
  accent: { background: 'accentSubtle', foreground: 'textAccent' },
} as const satisfies Record<string, { background: ThemeColor; foreground: ThemeColor }>;

type ChipProps = {
  label: string;
  tone: keyof typeof TONES;
  icon?: IconName;
};

/** Small status label, like "Registered" or "18 spots left". */
export function Chip({ label, tone, icon }: ChipProps) {
  const theme = useTheme();
  const { background, foreground } = TONES[tone];

  return (
    <View style={[styles.chip, { backgroundColor: theme[background] }]}>
      {icon && <Icon name={icon} size={14} color={foreground} />}
      <ThemedText type="chip" themeColor={foreground}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
