import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { type Person } from '@/data/friends.sample';
import { useTheme } from '@/hooks/use-theme';

/** One person in a P1 Friends list: coloured initial, name, how you know them, then an action or tag. */
export function PersonRow({ person, end, divider = false }: { person: Person; end?: ReactNode; divider?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, divider && { borderTopWidth: 1, borderTopColor: theme.strokeCard }]}>
      <View style={[styles.avatar, { backgroundColor: theme[person.tone] }]} accessibilityElementsHidden>
        <ThemedText type="labelMedium14" themeColor="textOnBrand" style={styles.initial}>
          {person.initials}
        </ThemedText>
      </View>
      <View style={styles.text} accessible accessibilityLabel={`${person.name}. ${person.note}${person.tag ? `. ${person.tag}` : ''}`}>
        <ThemedText type="label">{person.name}</ThemedText>
        <ThemedText type="caption" themeColor="textWeak">
          {person.note}
        </ThemedText>
      </View>
      {end ??
        (person.tag && (
          <View style={[styles.tag, { backgroundColor: theme.approvedFill }]}>
            <ThemedText type="tag" themeColor="statusSuccess" style={styles.tagText}>
              {person.tag}
            </ThemedText>
          </View>
        ))}
    </View>
  );
}

/** A titled white card of people (P1). */
export function PeopleCard({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  avatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  initial: {
    lineHeight: 18,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  tag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  tagText: {
    lineHeight: 15,
  },
});
