import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { PeopleCard, PersonRow } from '@/components/friends/person-row';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PlainHeader } from '@/components/ui/plain-header';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { DEMO_PROFILE } from '@/data/demo';
import { CLEANED_WITH, FRIEND_NUDGE, FRIENDS, FRIENDS_SUMMARY, type Person, REQUESTS } from '@/data/friends.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { showNotice } from '@/state/coming-soon';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;

/**
 * P1 Friends: requests, people you cleaned with, and your friends. The search box filters your own friends only;
 * under-18s never search for strangers (Decisions: add by QR or class, a parent approves).
 * SAMPLE: accepting or adding changes the list on this phone only.
 */
export default function FriendsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState<readonly Person[]>(REQUESTS);
  const [friends, setFriends] = useState<readonly Person[]>(FRIENDS);
  const [asked, setAsked] = useState<readonly string[]>([]);
  const shown = query.trim() ? friends.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase())) : friends;
  const total = FRIENDS_SUMMARY.count + (friends.length - FRIENDS.length);

  const accept = (person: Person) => {
    feedback.play('toggle.on');
    setRequests((list) => list.filter((p) => p.id !== person.id));
    if (DEMO_PROFILE.isUnder18) {
      showNotice(`Sent to your parent to approve ${person.name.split(' ')[0]}`);
    } else {
      setFriends((list) => [...list, person]);
      showNotice(`${person.name.split(' ')[0]} is now your friend`);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <PlainHeader title="Friends" end={<RoundButton icon="user-plus" label="Add friends" onPress={() => router.push('/friends-add')} />} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.search, { backgroundColor: theme.loaderCard }]}>
          <Icon name="search" size={14} color="textWeak" strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search friends"
            placeholderTextColor={theme.textPlaceholder}
            accessibilityLabel="Search your friends"
            style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>

        {!query && (
          <View style={[styles.nudge, { backgroundColor: theme.hostTint }]}>
            <EarthyOrb size={20} state="still" glow={false} />
            <ThemedText type="note" style={styles.flex}>
              {FRIEND_NUDGE}
            </ThemedText>
          </View>
        )}

        {!query && requests.length > 0 && (
          <>
            <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header">
              {`Requests · ${requests.length}`}
            </ThemedText>
            <PeopleCard>
              {requests.map((person, index) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  divider={index > 0}
                  end={
                    <View style={styles.actions}>
                      <Tappable
                        accessibilityRole="button"
                        accessibilityLabel={`Accept ${person.name}`}
                        onPress={() => accept(person)}
                        style={[styles.pill, { backgroundColor: theme.brand }]}>
                        <ThemedText type="chipAction" themeColor="textOnBrand">
                          Accept
                        </ThemedText>
                      </Tappable>
                      <Tappable
                        accessibilityRole="button"
                        accessibilityLabel={`Decline ${person.name}`}
                        hitSlop={6}
                        onPress={() => setRequests((list) => list.filter((p) => p.id !== person.id))}
                        style={[styles.decline, { backgroundColor: theme.tileNeutral }]}>
                        <Icon name="close" size={16} color="textStrong" strokeWidth={2} />
                      </Tappable>
                    </View>
                  }
                />
              ))}
            </PeopleCard>
          </>
        )}

        {!query && (
          <>
            <View style={styles.label}>
              <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header" style={styles.flex}>
                People you cleaned with
              </ThemedText>
              {/* The full list isn't designed yet: "See all" says "Coming soon". */}
              <Tappable accessibilityRole="button" accessibilityLabel="See all people you cleaned with" hitSlop={8}>
                <ThemedText type="labelSmall" themeColor="brand">
                  See all
                </ThemedText>
              </Tappable>
            </View>
            <PeopleCard>
              {CLEANED_WITH.map((person, index) => {
                const sent = asked.includes(person.id);
                return (
                  <PersonRow
                    key={person.id}
                    person={person}
                    divider={index > 0}
                    end={
                      <Tappable
                        accessibilityRole="button"
                        accessibilityLabel={sent ? `Request sent to ${person.name}` : `Add ${person.name}`}
                        disabled={sent}
                        onPress={() => {
                          feedback.play('toggle.on');
                          setAsked((list) => [...list, person.id]);
                          showNotice(DEMO_PROFILE.isUnder18 ? 'Request sent. Your parent approves it first.' : 'Request sent');
                        }}
                        style={[styles.pill, styles.outline, { borderColor: sent ? theme.strokeChip : theme.brand }]}>
                        <ThemedText type="chipAction" themeColor={sent ? 'textWeak' : 'brand'}>
                          {sent ? 'Sent' : 'Add'}
                        </ThemedText>
                      </Tappable>
                    }
                  />
                );
              })}
            </PeopleCard>
          </>
        )}

        <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header">
          {`Your friends · ${total}`}
        </ThemedText>
        {shown.length > 0 ? (
          <PeopleCard>
            {shown.map((person, index) => (
              <PersonRow key={person.id} person={person} divider={index > 0} />
            ))}
          </PeopleCard>
        ) : (
          <ThemedText type="note" themeColor="textWeak" style={styles.empty}>
            {`No friend called “${query.trim()}”. Add people from your clean-ups with your code.`}
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  // Figma "Body" starts at y 104, 4 px under the 100 px plain header.
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: 11,
    borderRadius: 22,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  nudge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  pill: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: 7,
    borderRadius: Radius.option,
  },
  outline: {
    borderWidth: 1.25,
  },
  decline: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
});
