import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { DEMO_MODE } from '@/data/demo';
import { useTheme } from '@/hooks/use-theme';
import { type Role, useRole } from '@/state/role';

const ROLES: readonly { key: Role; label: string }[] = [
  { key: 'volunteer', label: 'Volunteer' },
  { key: 'crewHead', label: 'Crew head' },
];

/** Demo only: switches between the volunteer and crew-head views. Hidden outside DEMO_MODE. */
/** `onChange` runs after the switch, so a screen can show the other role's version. */
export function RoleSwitcher({ onChange }: { onChange?: (role: Role) => void } = {}) {
  const theme = useTheme();
  const { role, setRole } = useRole();
  if (!DEMO_MODE) return null;

  return (
    <View accessibilityRole="radiogroup" style={[styles.group, { backgroundColor: theme.wellCool }]}>
      {ROLES.map((item) => {
        const selected = item.key === role;
        return (
          <Tappable
            key={item.key}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${item.label} view`}
            onPress={() => {
              setRole(item.key);
              onChange?.(item.key);
            }}
            style={[styles.option, selected && { backgroundColor: item.key === 'crewHead' ? theme.secondary : theme.brand }]}>
            <ThemedText type="chip" themeColor={selected ? (item.key === 'crewHead' ? 'textStrong' : 'textOnBrand') : 'textWeak'}>
              {item.label}
            </ThemedText>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 3,
    borderRadius: Radius.pill,
  },
  option: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
