import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AvatarStack } from '@/components/school/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { CLASS, CLASSMATES, TEACHER } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

/** F3·2: the code matched a class. Check it's yours, then join. */
export default function ClassFoundSheet() {
  const theme = useTheme();

  return (
    <RouteSheet accessibilityLabel={`${CLASS.name} found`}>
      <View style={styles.classRow}>
        <View style={[styles.badge, { backgroundColor: theme.brand }]}>
          <ThemedText type="etaTitle" themeColor="textOnBrand">
            {CLASS.short}
          </ThemedText>
        </View>
        <View style={styles.classText}>
          <View style={styles.titleRow}>
            <ThemedText type="etaTitle" accessibilityRole="header">
              {CLASS.name}
            </ThemedText>
            <View style={[styles.found, { backgroundColor: theme.statusSuccessSubtle }]}>
              <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
              <ThemedText type="tag" themeColor="statusSuccess">
                Class found
              </ThemedText>
            </View>
          </View>
          <ThemedText type="note" themeColor="textWeak">
            {CLASS.school}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.card, { borderColor: theme.strokeWeak }]}>
        <View style={styles.teacher}>
          <Avatar initials={TEACHER.initials} tone={TEACHER.tone} size={40} />
          <View style={styles.teacherText}>
            <ThemedText type="label">{TEACHER.name}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              Class teacher · runs the cleanup and the bus
            </ThemedText>
          </View>
        </View>
        <View style={[styles.classmates, { borderTopColor: theme.strokeWeak, backgroundColor: theme.wellCool }]}>
          <AvatarStack people={CLASSMATES.slice(0, 5)} />
          <ThemedText type="bodyMedium">{`${CLASS.joined - 1} classmates joined`}</ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Join class" size="large" onPress={() => router.replace('/class-approval')} />
        <TextButton label="Wrong class" onPress={() => router.back()} />
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  badge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.option,
  },
  classText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  found: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  teacher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
  },
  teacherText: {
    flex: 1,
    gap: Spacing.half,
  },
  classmates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderTopWidth: 1,
  },
  actions: {
    gap: Spacing.twoThreeQuarters,
  },
});
