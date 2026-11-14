import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, type TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListScanToggle } from '@/components/scan/list-scan-toggle';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { CHECK_IN, ROSTER, type RosterPerson } from '@/data/check-in.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { useRole } from '@/state/role';

type Filter = 'all' | 'in' | 'notIn';

/** F4·3: the crew head's roster. Filter, search, and check people in by hand. Works offline. */
export default function CrewRosterRoute() {
  const theme = useTheme();
  const { setRole } = useRole();
  // Keep the demo role switch in step with the screen, however it was opened.
  useEffect(() => setRole('crewHead'), [setRole]);
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  // Manual check-ins made on this screen (DEMO: kept in memory, would sync later).
  const [checkedNow, setCheckedNow] = useState<readonly string[]>([]);

  const statusOf = (person: RosterPerson) => (checkedNow.includes(person.initials) ? 'in' : person.status);
  const inCount = CHECK_IN.checkedIn + checkedNow.length;
  const people = ROSTER.filter((person) => {
    const isIn = statusOf(person) === 'in';
    if (filter === 'in' && !isIn) return false;
    if (filter === 'notIn' && isIn) return false;
    return person.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={CHECK_IN.rosterTitle} subtitle={`Check-in · ${inCount} of ${CHECK_IN.total} in`}>
        <View style={[styles.offline, { backgroundColor: theme.secondarySubtle }]}>
          <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
          <ThemedText type="smallMedium" themeColor="textSecondary">
            Offline · syncs later
          </ThemedText>
        </View>
      </ScreenHeader>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.filters} accessibilityRole="tablist">
          <FilterChip label="All" count={CHECK_IN.total} active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="In" count={inCount} active={filter === 'in'} onPress={() => setFilter('in')} />
          <FilterChip label="Not in" count={CHECK_IN.total - inCount} active={filter === 'notIn'} onPress={() => setFilter('notIn')} />
        </View>

        <View style={[styles.search, { borderColor: theme.strokeControl }]}>
          <Icon name="search" size={18} color="textWeak" strokeWidth={1.5} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search a name"
            placeholderTextColor={theme.textWeak}
            accessibilityLabel="Search a name"
            autoCorrect={false}
            style={[styles.searchInput, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>

        <View style={[styles.list, { borderColor: theme.strokeWeak }]}>
          {people.map((person, index) => (
            <View key={person.initials} style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
              <Avatar initials={person.initials} tone={person.tone} size={40} />
              <View style={styles.flex}>
                <ThemedText type="labelLarge">{person.name}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {person.crew}
                </ThemedText>
              </View>
              <Status
                person={person}
                status={statusOf(person)}
                onCheckIn={() => {
                  feedback.play('register.success');
                  setCheckedNow((current) => [...current, person.initials]);
                }}
              />
            </View>
          ))}
          {people.length === 0 && (
            <ThemedText type="note" themeColor="textWeak" style={styles.empty}>
              {`No one called "${query.trim()}" on this roster`}
            </ThemedText>
          )}
        </View>
      </ScrollView>

      <View style={[styles.toggleWrap, { bottom: insets.bottom + Spacing.three }]}>
        <ListScanToggle active="list" light />
      </View>
    </View>
  );
}

function FilterChip({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}, ${count}`}
      onPress={onPress}
      style={[styles.chip, active ? { backgroundColor: theme.textStrong } : { borderColor: theme.strokeControl, borderWidth: 1 }]}>
      <ThemedText type="labelSmall" themeColor={active ? 'textOnBrand' : 'textStrong'}>
        {label}
      </ThemedText>
      <ThemedText type="caption" themeColor={active ? 'textOnBrandWeak' : 'textWeak'}>
        {`${count}`}
      </ThemedText>
    </Tappable>
  );
}

function Status({ person, status, onCheckIn }: { person: RosterPerson; status: RosterPerson['status']; onCheckIn: () => void }) {
  const theme = useTheme();
  if (status === 'in') {
    return (
      <View style={[styles.pill, { backgroundColor: theme.statusSuccessSubtle }]}>
        <ThemedText type="smallMedium" themeColor="statusSuccess">
          {`✓ In · ${person.time ?? 'now'}`}
        </ThemedText>
      </View>
    );
  }
  if (status === 'checkIn') {
    return (
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`Check in ${person.name}`}
        onPress={onCheckIn}
        style={[styles.pill, styles.checkIn, { borderColor: theme.brand }]}>
        <ThemedText type="labelSmall" themeColor="brand">
          Check in
        </ThemedText>
      </Tappable>
    );
  }
  return (
    <View style={[styles.pill, { backgroundColor: status === 'noConsent' ? theme.accentSubtle : theme.wellCool }]}>
      <ThemedText type="smallMedium" themeColor={status === 'noConsent' ? 'textAccent' : 'textWeak'}>
        {status === 'noConsent' ? 'No consent' : 'Absent'}
      </ThemedText>
    </View>
  );
}

// React Native's types don't list `outlineStyle: 'none'`, though React Native Web accepts it.
const NO_WEB_FOCUS_RING = (Platform.OS === 'web' ? { outlineStyle: 'none' } : null) as TextStyle | null;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  offline: {
    position: 'absolute',
    end: Spacing.twoThreeQuarters,
    bottom: Spacing.threeLess + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 44,
    paddingHorizontal: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  flex: {
    flex: 1,
  },
  pill: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.small,
  },
  checkIn: {
    borderWidth: 1.5,
  },
  empty: {
    paddingVertical: Spacing.three,
    textAlign: 'center',
  },
  toggleWrap: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
