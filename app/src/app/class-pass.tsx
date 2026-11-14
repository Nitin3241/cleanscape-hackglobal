import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/events/action-button';
import { PassCard } from '@/components/events/pass-card';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Spacing, TabBarHeight } from '@/constants/theme';
import { CLASS, CLASS_EVENT, SCHOOL_BUS, TEACHER } from '@/data/school.sample';
import { SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';

/** F3·6: your own pass when you go with your class. The bus time replaces the event time. */
export default function ClassPassRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Your pass" action={{ icon: 'share', label: 'Share' }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}>
        <PassCard
          eyebrow="Clean UAE 2026 · Dubai"
          title={CLASS_EVENT.passTitle}
          fields={[
            { label: 'Date', value: CLASS_EVENT.day },
            { label: 'Bus', value: SCHOOL_BUS.leaves },
            { label: 'Crew', value: '+2 friends' },
          ]}
          tag={{ label: `With ${CLASS.name}`, dot: 'unreadDot' }}
          stub={{
            kind: 'qr',
            value: `CLEANSCAPE-PASS:${SAMPLE_USER.passCode}`,
            caption: 'Scan it yourself at the check-in tent',
            onPress: () => router.push('/class-check-in'),
            pressLabel: 'Check-in code. Tap to check in',
          }}
        />

        <View style={styles.actions}>
          <ActionButton icon="wallet" label="Add to Wallet" tone="marigold" onPress={() => router.push('/wallet')} />
          <ActionButton icon="user-plus" label="Invite friends" tone="outline" onPress={() => router.push('/class-invite')} />
        </View>

        {/* PLACEHOLDER: messaging the teacher isn't designed yet, so this is text, not a button. */}
        <View style={styles.cancel}>
          <ThemedText type="bodyMedium" themeColor="textWeak">
            {`Can't make it? Let ${TEACHER.short} know`}
          </ThemedText>
        </View>
      </ScrollView>
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
