import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/parts';
import { type ThemeColor } from '@/constants/theme';

type Person = { initials: string; tone: ThemeColor };

/** Overlapping avatars with a white ring, as on the class cards (Figma F3). Decorative: say who in text nearby. */
export function AvatarStack({ people, size = 26 }: { people: readonly Person[]; size?: number }) {
  return (
    <View style={styles.stack} aria-hidden>
      {people.map((person, index) => (
        <View key={person.initials} style={index > 0 && { marginStart: -size * 0.3 }}>
          <Avatar initials={person.initials} tone={person.tone} size={size} ring="card" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'row',
  },
});
