import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { LinkGroup, type LinkItem } from '@/components/ui/link-group';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Spacing, TabBarHeight } from '@/constants/theme';
import { FRIENDS_SUMMARY } from '@/data/friends.sample';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/state/language';

/**
 * P0 Profile (Figma "🔗 Prototype connections", 9 Nov 2026): the Profile tab, and the way into
 * features that have no other entry point. "Demo branches" (X0) opens the prototype-only edge states.
 * SAMPLE: the persona is the demo student.
 */
export default function ProfileRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();

  // P0 Community (Figma, 13 Nov): Friends with a face stack and a red request count, then Add friends.
  const community: readonly LinkItem[] = [
    {
      title: 'Friends',
      detail: `${FRIENDS_SUMMARY.count} friends · ${FRIENDS_SUMMARY.requests} requests`,
      href: '/friends',
      trailing: <FriendsTrailing />,
    },
    { title: 'Add friends', detail: 'Scan a code at your next clean-up', href: '/friends-add' },
  ];
  const activity: readonly LinkItem[] = [
    { title: 'Class impact', detail: 'Grade 9B vs other classes', href: '/class-impact' },
    { title: 'Join your class', detail: 'Use the code from your teacher', href: '/class-join' },
    { title: 'Daily 5-minute mission', detail: 'Pick up 5 things on your walk', href: '/mission' },
    { title: 'Your impact story', detail: 'Kite Beach, 5 Dec', href: '/impact-story' },
  ];
  const settings: readonly LinkItem[] = [
    {
      title: 'Language',
      detail: 'English · العربية',
      // Figma links to 07 Home — AR: switch to Arabic and show Home right to left.
      onPress: () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
        router.navigate('/home');
      },
    },
    { title: 'Wallet on Android', detail: 'Save your pass to Google Wallet', href: '/wallet' },
    // X0: prototype-only edge states (Figma P0 → X0).
    { title: 'Demo branches', detail: 'Edge cases for the prototype', href: '/demo-branches' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Profile" subtitle="Sara Al Mansoori · Grade 9B" hideBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}
        showsVerticalScrollIndicator={false}>
        <LinkGroup title="Community" items={community} />
        <LinkGroup title="Your activity" items={activity} />
        <LinkGroup title="Settings" items={settings} />
      </ScrollView>
      <TabBar active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    padding: Spacing.three,
  },
});

/** Three friend faces and the red request badge, before the chevron (P0 Community · Friends). */
function FriendsTrailing() {
  const theme = useTheme();
  const tones = ['avatarMarigold', 'avatarTeal', 'avatarLavender'] as const;
  return (
    <View style={trailing.row} accessibilityElementsHidden>
      <View style={trailing.faces}>
        {FRIENDS_SUMMARY.faces.map((face, index) => (
          <View key={face} style={[trailing.face, { backgroundColor: theme[tones[index]] }, index > 0 && trailing.overlap]}>
            <ThemedText type="micro10" themeColor="textOnBrand">
              {face}
            </ThemedText>
          </View>
        ))}
      </View>
      <View style={[trailing.badge, { backgroundColor: theme.levelHighText }]}>
        <ThemedText type="tag" themeColor="textOnBrand">
          {FRIENDS_SUMMARY.requests}
        </ThemedText>
      </View>
      <Icon name="chevron-end" size={18} color="textWeak" />
    </View>
  );
}

const trailing = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  faces: {
    flexDirection: 'row',
  },
  face: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  overlap: {
    marginStart: -Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: 1,
    borderRadius: 9,
  },
});
