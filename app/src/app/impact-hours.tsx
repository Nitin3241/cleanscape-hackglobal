import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { CERTIFICATE_SETUP } from '@/data/impact.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** I3 Hours & certificate — set up. "Create" plays I3s (Earthy preparing) and lands on I4 Certificate ready. */
export default function ImpactHoursRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [use, setUse] = useState<string>(CERTIFICATE_SETUP.uses[0].id);
  const [language, setLanguage] = useState<string>(CERTIFICATE_SETUP.languages[0]);
  const [include, setInclude] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CERTIFICATE_SETUP.include.map((item) => [item.id, true])),
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Certificate" subtitle={CERTIFICATE_SETUP.subtitle} centred />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <EarthyNote title={CERTIFICATE_SETUP.earthy.title} body={CERTIFICATE_SETUP.earthy.body} />

        <View>
          <ThemedText type="sectionTitle" accessibilityRole="header">
            Use it for
          </ThemedText>
          <View accessibilityRole="radiogroup" style={[styles.list, { borderColor: theme.strokeWeak }]}>
            {CERTIFICATE_SETUP.uses.map((item, index) => {
              const on = item.id === use;
              return (
                <Tappable
                  key={item.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${item.title}. ${item.body}`}
                  onPress={() => {
                    feedback.play('toggle.on');
                    setUse(item.id);
                  }}
                  style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
                  <RowText title={item.title} body={item.body} />
                  <View
                    style={[
                      styles.radio,
                      on ? { borderWidth: 7, borderColor: theme.brand } : { borderWidth: 1.5, borderColor: theme.strokeChip },
                    ]}
                  />
                </Tappable>
              );
            })}
          </View>
        </View>

        <View>
          <ThemedText type="sectionTitle" accessibilityRole="header">
            Language
          </ThemedText>
          <View accessibilityRole="radiogroup" style={[styles.segmented, { backgroundColor: theme.tileNeutral }]}>
            {CERTIFICATE_SETUP.languages.map((item) => {
              const on = item === language;
              return (
                <Tappable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={item}
                  onPress={() => setLanguage(item)}
                  style={[styles.segment, on && { backgroundColor: theme.card, boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)' }]}>
                  <ThemedText type={on ? 'labelMedium14' : 'bodyMedium14'} themeColor={on ? 'textStrong' : 'textWeak'} style={styles.line21}>
                    {item}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>

        <View>
          <ThemedText type="sectionTitle" accessibilityRole="header">
            Include
          </ThemedText>
          <View style={[styles.list, { borderColor: theme.strokeWeak }]}>
            {CERTIFICATE_SETUP.include.map((item, index) => {
              const on = include[item.id];
              return (
                <Tappable
                  key={item.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${item.title}. ${item.body}`}
                  onPress={() => setInclude((all) => ({ ...all, [item.id]: !all[item.id] }))}
                  style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
                  <RowText title={item.title} body={item.body} />
                  <View style={[styles.check, on ? { backgroundColor: theme.brand } : { borderWidth: 1.5, borderColor: theme.strokeChip }]}>
                    {on && <Icon name="check" size={14} color="textOnBrand" strokeWidth={2.5} />}
                  </View>
                </Tappable>
              );
            })}
          </View>
        </View>

        {/* The list of sessions isn't designed yet: says "Coming soon". */}
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`${CERTIFICATE_SETUP.sessions.title}. ${CERTIFICATE_SETUP.sessions.body}`}
          style={[styles.list, styles.row, { borderColor: theme.strokeWeak }]}>
          <View style={[styles.tile, { backgroundColor: theme.statusSuccessSubtle }]}>
            <Icon name="check" size={18} color="statusSuccess" strokeWidth={2.2} />
          </View>
          <RowText title={CERTIFICATE_SETUP.sessions.title} body={CERTIFICATE_SETUP.sessions.body} />
          <Icon name="chevron-end" size={16} color="brand" strokeWidth={2} />
        </Tappable>
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button
            label="Create"
            flat
            onPress={() => {
              feedback.play('button.primary');
              // Figma I4: back returns to I1, so I3 hands over to I4 instead of staying underneath.
              router.replace('/impact-certificate');
            }}
          />
        </View>
      </PairBar>
    </View>
  );
}

function RowText({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.text}>
      <ThemedText type="reasonTitle" style={styles.line23}>
        {title}
      </ThemedText>
      <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
        {body}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma I3 at "normal" line height: 15 → 23, 14 → 21, 12 → 18.
  line23: {
    lineHeight: 23,
  },
  line21: {
    lineHeight: 21,
  },
  line18: {
    lineHeight: 18,
  },
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  list: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  check: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.oneHalf,
  },
  segmented: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    borderRadius: Radius.medium,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.control,
  },
  tile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
});
