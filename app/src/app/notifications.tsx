import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinkGroup, type LinkItem } from '@/components/ui/link-group';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * N0 Notifications (Figma "🔗 Prototype connections", 9 Nov 2026), opened from Home's bell. Each
 * row opens the screen its nudge points at. Lock-screen nudges (F10·8, W4, W5) aren't app screens,
 * so they open what they're about: Earthy's heat answer and your pass.
 * SAMPLE: fixed demo notifications.
 */
const TODAY: readonly LinkItem[] = [
  // Figma N0: opens F10·11 Litter radar.
  { title: 'Earthy noticed 3 spots near you', detail: '2 min ago', href: '/litter-radar' },
  { title: 'Your 5-minute mission is ready', detail: '8:00 AM', href: '/mission' },
  // Changelog 9 Nov: F10·8 heat nudge → F9v2·11 Safety — Heat.
  {
    title: 'Heat warning for Saturday',
    detail: 'Lock screen · 7:30 AM',
    onPress: () => router.push({ pathname: '/earthy-chat', params: { start: 'heat' } }),
  },
];
const THIS_WEEK: readonly LinkItem[] = [
  // Figma N0: opens R3, the Kite Beach clean-up.
  {
    title: 'Picked for you: Kite Beach',
    detail: 'Fits your Saturday',
    onPress: () => router.push({ pathname: '/event-detail', params: { id: 'kite-beach' } }),
  },
  { title: 'Leave at 6:05 to beat traffic', detail: 'Smart departure', href: '/getting-there' },
  { title: 'Rally your classmates', detail: '4 of Grade 9B going', href: '/class' },
  { title: 'Your class story is ready', detail: 'Grade 9B', href: '/class-impact' },
  { title: '40 Smileys to your next reward', detail: 'Fresh juice at Kite Beach', href: '/smileys' },
];
const EVENT_DAY: readonly LinkItem[] = [
  // Figma N0 → "01 Home — event day", whose card then starts F11·1.
  { title: 'It’s event day: get ready', detail: 'Kite Beach · Sat 5 Dec', href: { pathname: '/home', params: { day: 'event' } } },
  { title: 'You’re at Kite Beach', detail: 'Lock screen', href: '/pass' },
  { title: 'Meet point moved to Gate 3', detail: 'Lock screen · pass updated', href: '/pass' },
  { title: 'Your impact story', detail: 'After the clean-up', href: '/impact-story' },
];

export default function NotificationsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Notifications" subtitle="From Earthy and your clean-ups" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
        showsVerticalScrollIndicator={false}>
        <LinkGroup title="Today" items={TODAY} />
        <LinkGroup title="This week" items={THIS_WEEK} />
        <LinkGroup title="Event day" items={EVENT_DAY} />
      </ScrollView>
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
