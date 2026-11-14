import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FriendCode } from '@/components/friends/friend-code';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PlainHeader } from '@/components/ui/plain-header';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { DEMO_PROFILE } from '@/data/demo';
import { FRIEND_LINK, FRIEND_PRIVACY, MY_CODE } from '@/data/friends.sample';
import { useTheme } from '@/hooks/use-theme';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;

/**
 * P2 Add friends: your code to show at a clean-up, scan someone else's, share a link or pick from contacts.
 * Under-18s don't get the open "Name or @username" search (Decisions, safer default); a parent approves new friends.
 */
export default function FriendsAddRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <PlainHeader title="Add friends" />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.code, { backgroundColor: theme.loaderCard }]} accessible accessibilityLabel={`Your friend code, ${MY_CODE.name}. ${MY_CODE.hint}`}>
          <FriendCode />
          <ThemedText type="eventTitle">{MY_CODE.name}</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {MY_CODE.hint}
          </ThemedText>
        </View>

        <View style={styles.ways}>
          <Way icon="scan" label="Scan code" onPress={() => router.push('/scanner')} />
          <Way
            icon="share"
            label="Share link"
            onPress={() => Share.share({ message: `Add me on CleanScape: ${FRIEND_LINK}` }).catch(() => {})}
          />
          {/* Picking from the phone's contacts isn't built yet: says "Coming soon". */}
          <Way icon="contact" label="Contacts" />
        </View>

        {!DEMO_PROFILE.isUnder18 && (
          <View style={[styles.search, { backgroundColor: theme.loaderCard }]}>
            <Icon name="search" size={14} color="textWeak" strokeWidth={2} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name or @username"
              placeholderTextColor={theme.textPlaceholder}
              accessibilityLabel="Find a friend by name or username"
              style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
            />
          </View>
        )}

        <View style={[styles.privacy, { backgroundColor: theme.hostTint }]}>
          <Icon name="shield" size={16} color="brand" strokeWidth={1.6} />
          <ThemedText type="caption" style={styles.flex}>
            {FRIEND_PRIVACY}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

function Way({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.way, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
      <Icon name={icon} size={18} color="brand" strokeWidth={1.7} />
      <ThemedText type="filterLabelTight">{label}</ThemedText>
    </Tappable>
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
  code: {
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeHalf,
    borderRadius: Radius.card,
  },
  ways: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  way: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.threeLess,
    paddingBottom: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.option,
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
  privacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
});
