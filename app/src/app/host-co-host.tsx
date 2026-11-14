import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { CO_HOSTS } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** F10·10c Add a co-host (sheet): friends with a reason each, Omar picked first. */
export default function HostCoHostSheet() {
  const theme = useTheme();
  const [picked, setPicked] = useState<string>(CO_HOSTS[0].id);
  const friend = CO_HOSTS.find((item) => item.id === picked) ?? CO_HOSTS[0];
  const first = friend.name.split(' ')[0];

  return (
    <RouteSheet accessibilityLabel="Add a co-host">
      <ThemedText type="sheetTitle" accessibilityRole="header">
        Add a co-host
      </ThemedText>
      <ThemedText type="meta13" themeColor="textWeak" style={styles.lead}>
        They share the lead on the day and can edit the plan. Pick a friend who knows Kite Beach.
      </ThemedText>

      <View accessibilityRole="radiogroup" style={[styles.list, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
        {CO_HOSTS.map((item, index) => {
          const on = item.id === picked;
          return (
            <Tappable
              key={item.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${item.name}. ${item.note}`}
              onPress={() => {
                feedback.play('toggle.on');
                setPicked(item.id);
              }}
              style={[
                styles.row,
                on && { backgroundColor: theme.hostTint },
                index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeCard },
              ]}>
              <View style={[styles.avatar, { backgroundColor: theme[item.tone] }]}>
                <ThemedText type="labelMedium14" themeColor="textOnBrand">
                  {item.initials}
                </ThemedText>
              </View>
              <View style={[styles.flex, styles.who]}>
                <ThemedText type="labelMedium14" style={styles.name}>
                  {item.name}
                </ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {item.note}
                </ThemedText>
              </View>
              <View style={[styles.radio, on ? { borderColor: theme.brand, backgroundColor: theme.brand } : { borderColor: theme.radioRing, backgroundColor: theme.card }]}>
                {on && <View style={[styles.dot, { backgroundColor: theme.card }]} />}
              </View>
            </Tappable>
          );
        })}
      </View>

      <Button
        label={`Ask ${first}`}
        flat
        onPress={() => {
          feedback.play('button.primary');
          router.back();
        }}
      />
      {/* Figma "More": 13 semibold, centred across the sheet. */}
      <Tappable accessibilityRole="button" accessibilityLabel="Not in the list? Add friends" onPress={() => router.replace('/friends-add')} style={styles.more}>
        <ThemedText type="labelSmall" themeColor="brand">
          Not in the list? Add friends
        </ThemedText>
      </Tappable>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma F10·10c: lead 13/19, names 14/20 with a 1 px gap to the note.
  lead: {
    lineHeight: 19,
  },
  who: {
    gap: 1,
  },
  name: {
    lineHeight: 20,
  },
  more: {
    alignItems: 'center',
  },
  list: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  avatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  flex: {
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 11,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
