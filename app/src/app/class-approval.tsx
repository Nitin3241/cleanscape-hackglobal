import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Logomark } from '@/components/ui/logomark';
import { IconTile } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { CLASS, GUARDIAN, SCHOOL_BUS, STUDENT, TEACHER } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

const MESSAGE =
  `${STUDENT.firstName} wants to join ${CLASS.name}'s beach clean-up at Kite Beach on Sat 5 Dec. ` +
  `Her teacher, ${TEACHER.short}, is in charge, and the school bus leaves at ${SCHOOL_BUS.leaves}.`;

/** F3·3: ask a parent to approve the school trip. One yes covers the bus and the clean-up. */
export default function ClassApprovalRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // DEMO: no message is sent. A real build would open WhatsApp with the approval link,
  // then show the class once the parent says yes.
  const send = () => {
    router.dismissAll();
    router.push('/class');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Parent approval" subtitle="Needed for each school trip" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 96 }]}>
        <View style={styles.ask}>
          <IconTile icon="shield-check" size={52} iconSize={24} />
          <View style={styles.askText}>
            <ThemedText type="sheetPrompt" accessibilityRole="header">
              {`Ask ${GUARDIAN.name} to say yes`}
            </ThemedText>
            <ThemedText type="note" themeColor="textWeak">
              One yes covers the school bus and the clean-up
            </ThemedText>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText type="fieldLabel">Sending to</ThemedText>
          <View style={[styles.contact, { borderColor: theme.strokeStrong, backgroundColor: theme.card }]}>
            <ThemedText type="linkRow">{GUARDIAN.name}</ThemedText>
            <View style={[styles.divider, { backgroundColor: theme.strokeControl }]} />
            <ThemedText type="lead" style={styles.phone}>
              {GUARDIAN.phone}
            </ThemedText>
            {/* Changing the contact isn't designed yet; F3 keeps the one added at sign-up. */}
            <ThemedText type="label">Change</ThemedText>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText type="fieldLabel" themeColor="textWeak">
            What your parent will see
          </ThemedText>
          <View
            accessible
            accessibilityLabel={`Message preview from CleanScape: ${MESSAGE} Approve for ${STUDENT.firstName}.`}
            style={[styles.preview, { backgroundColor: theme.surface }]}>
            <View style={styles.sender}>
              <View style={styles.senderMark}>
                <Logomark size={24} />
              </View>
              <ThemedText type="labelSmall">CleanScape</ThemedText>
            </View>
            <ThemedText type="note">{MESSAGE}</ThemedText>
            <View style={[styles.approve, { backgroundColor: theme.card }]}>
              <ThemedText type="labelSmall" themeColor="brand">
                {`Approve for ${STUDENT.firstName}`}
              </ThemedText>
              <Icon name="chevron-end" size={16} color="brand" />
            </View>
          </View>
        </View>

        <View style={styles.privacy}>
          <Icon name="lock" size={16} color="textWeak" strokeWidth={1.5} />
          <ThemedText type="caption" themeColor="textWeak" style={styles.privacyText}>
            {"This is the contact you added when you signed up. They don't need the app."}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: TabBarHeight + insets.bottom }]}>
        <Button label="Send WhatsApp" size="large" onPress={send} />
      </View>
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.threeLess,
  },
  askText: {
    flex: 1,
    gap: Spacing.one,
  },
  group: {
    gap: Spacing.two,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    height: 52,
    paddingHorizontal: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  divider: {
    width: 1,
    height: 24,
  },
  phone: {
    flex: 1,
  },
  preview: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  sender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  senderMark: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  approve: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.control,
  },
  privacy: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  privacyText: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
