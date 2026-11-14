import { useRef } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/school/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Avatar, IconTile } from '@/components/ui/parts';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ScreenInsight } from '@/components/earthy/insight';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { CLASS, CLASS_EVENT, CLASSMATES, GROUP_LEAD, SCHOOL_BUS, TEACHER } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

/** F3·4: the class space. The class cleanup, the school bus, who's going and who's in charge. */
export default function ClassRoute() {
  const tipTarget = useRef<ViewInstance>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const waiting = CLASS.size - CLASS.joined;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={CLASS.name} subtitle={CLASS.school} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}>
        <View style={[styles.card, styles.cleanup, { backgroundColor: theme.card, boxShadow: Shadows.classCard }]}>
          <View style={styles.cleanupTop}>
            <View style={[styles.inChip, { backgroundColor: theme.fill }]}>
              <Icon name="check" size={14} color="brand" />
              <ThemedText type="smallMedium" themeColor="brand">
                {"You're in with your class"}
              </ThemedText>
            </View>
            <ThemedText type="filterLabel" themeColor="textWeak">
              {`${CLASS_EVENT.daysToGo} days`}
            </ThemedText>
          </View>
          <View style={styles.cleanupText}>
            <ThemedText type="sheetPrompt" accessibilityRole="header">
              {CLASS_EVENT.title}
            </ThemedText>
            <View style={styles.when}>
              <Icon name="calendar" size={16} color="textWeak" strokeWidth={1.5} />
              <ThemedText type="note" themeColor="textWeak">
                {CLASS_EVENT.when}
              </ThemedText>
            </View>
          </View>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button label="Show pass" size="large" flat onPress={() => router.push('/class-pass')} />
            </View>
            <View style={styles.button}>
              {/* "Details" has no link in Figma's F3; the event page belongs to F1. */}
              <Button label="Details" variant="secondary" size="large" flat />
            </View>
          </View>
        </View>

        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`School bus at ${SCHOOL_BUS.leaves}. From the main gate, your seat is saved`}
          onPress={() => router.push('/class-bus')}
          style={[styles.card, styles.bus, { backgroundColor: theme.card, boxShadow: Shadows.classCard }]}>
          <IconTile icon="bus" size={40} iconSize={22} />
          <View style={styles.busText}>
            <ThemedText type="labelLarge">{`School bus · ${SCHOOL_BUS.leaves}`}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              From the main gate · your seat is saved
            </ThemedText>
          </View>
          <Icon name="chevron-end" size={18} color="textWeak" />
        </Tappable>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              Classmates
            </ThemedText>
            {/* The full classmate list isn't designed yet. */}
            <ThemedText type="bodyMedium" themeColor="brand">
              See all
            </ThemedText>
          </View>
          <View
            ref={tipTarget}
            collapsable={false}
            style={[styles.card, styles.classmates, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <View style={styles.classmatesTop}>
              <AvatarStack people={CLASSMATES} size={28} />
              <ThemedText type="label">{`${CLASS.joined} of ${CLASS.size} are in`}</ThemedText>
            </View>
            <ProgressBar
              progress={CLASS.joined / CLASS.size}
              trackTone="fill"
              label={`${CLASS.joined} of ${CLASS.size} classmates are in`}
            />
            <ThemedText type="caption" themeColor="textWeak">
              {`Waiting on ${waiting} classmates to join`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            {"Who's who"}
          </ThemedText>
          <View style={[styles.card, styles.roles, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <View style={styles.role}>
              <Avatar initials={TEACHER.initials} tone={TEACHER.tone} size={36} ring="card" />
              <View style={styles.roleText}>
                <ThemedText type="labelLarge">{TEACHER.short}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  Teacher · in charge on the day
                </ThemedText>
              </View>
            </View>
            <View style={styles.role}>
              <Avatar initials={GROUP_LEAD.initials} tone={GROUP_LEAD.tone} size={36} ring="card" />
              <View style={styles.roleText}>
                <ThemedText type="labelLarge">{GROUP_LEAD.name}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  Group lead · your class captain
                </ThemedText>
              </View>
              <View style={[styles.leadChip, { backgroundColor: theme.secondaryContainer }]}>
                <ThemedText type="smallMedium" themeColor="textSecondary">
                  Group lead
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`Invite. Bring a friend from outside ${CLASS.short}. They join your crew, not your class`}
          onPress={() => router.push('/class-invite')}
          style={[styles.card, styles.invite, { backgroundColor: theme.fill }]}>
          <IconTile icon="user-plus" size={40} iconSize={22} tone="card" />
          <View style={styles.inviteText}>
            <ThemedText type="labelLarge">{`Bring a friend from outside ${CLASS.short}`}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              They join your crew, not your class
            </ThemedText>
          </View>
          <ThemedText type="label" themeColor="brand">
            Invite
          </ThemedText>
        </Tappable>
      </ScrollView>
      <TabBar active="events" />
      <ScreenInsight id="class" target={tipTarget} onAction={() => router.push('/class-invite')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.threeHalf,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  card: {
    borderRadius: Radius.option,
  },
  cleanup: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  cleanupTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  cleanupText: {
    gap: Spacing.one,
  },
  when: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
  },
  bus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.threeLess,
  },
  busText: {
    flex: 1,
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.twoHalf,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classmates: {
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderWidth: 1,
  },
  classmatesTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roles: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderWidth: 1,
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  roleText: {
    flex: 1,
    gap: Spacing.half,
  },
  leadChip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.threeLess,
  },
  inviteText: {
    flex: 1,
    gap: Spacing.half,
  },
});
