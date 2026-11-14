import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InviteCard, Seats } from '@/app/cleanup-draft';
import { HOST_BAR_HEIGHT, HostBottomBar } from '@/components/host/host-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_DRAFT, HOST_LIVE } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** F10·17 Approved — you're live (2 days later). "Invite neighbours" opens F10·17i; Crew opens F9v2·13 Headcount. */
export default function HostLiveRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Your clean-up" centred onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: HOST_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View style={[styles.approved, { backgroundColor: theme.approvedFill }]}>
          <View style={[styles.status, { backgroundColor: theme.card }]}>
            <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
            <ThemedText type="chipAction" themeColor="statusSuccess">
              Approved by EEG
            </ThemedText>
          </View>
          <ThemedText type="heading" accessibilityRole="header">
            You’re live
          </ThemedText>
          <ThemedText type="body14" themeColor="textWeak">
            {HOST_LIVE.body}
          </ThemedText>
        </View>

        <InviteCard tag="live" onCoHost={() => router.push('/host-co-host')} />

        <View style={[styles.crew, { backgroundColor: theme.loaderCard }]}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Crew, 3 of ${HOST_DRAFT.crewSize} spots filled. Open the crew list`}
            onPress={() => router.push({ pathname: '/earthy-chat', params: { start: 'organiser' } })}>
            <ThemedText type="rowTitle">Crew</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {`3 of ${HOST_DRAFT.crewSize} spots filled`}
            </ThemedText>
          </Tappable>
          <View style={styles.seatGroup}>
            <Seats size={HOST_DRAFT.crewSize} />
            <ThemedText type="caption" themeColor="textWeak">
              {HOST_DRAFT.roles}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <HostBottomBar>
        <Button
          label="Invite neighbours"
          flat
          onPress={() => {
            feedback.play('button.primary');
            router.push('/host-invite');
          }}
        />
      </HostBottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  approved: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: 5,
    borderRadius: Radius.medium,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  crew: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  seatGroup: {
    gap: Spacing.two,
  },
});
