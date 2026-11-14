import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Earthy card (Figma Home "HostCleanup" clone: orb 36, 15 SemiBold title, 12 Regular sub, #E6F3F8, 18 px corners). */
export function EarthyNote({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.earthy, { backgroundColor: theme.fill }]}>
      <View style={styles.head}>
        <EarthyOrb size={36} state="still" glow={false} />
        <View style={styles.flex}>
          <ThemedText type="rowTitle" style={styles.titleLine}>
            {title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textWeak" style={styles.bodyLine}>
            {body}
          </ThemedText>
        </View>
      </View>
      {children}
    </View>
  );
}

export type TileRow = { title: string; body: string; icon: IconName; onPress?: () => void };

/** White card of rows, each with a grey 40 px icon tile (F10·11w reasons, F10·18 tips, F10·19 next steps). */
export function TileRows({ rows }: { rows: readonly TileRow[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.rows, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
      {rows.map((row, index) => {
        const content = (
          <>
            <View style={[styles.tile, { backgroundColor: theme.tileNeutral }]}>
              <Icon
                name={row.icon}
                size={row.icon === 'pin' ? 14 : row.icon === 'map' || row.icon === 'badge-check' ? 18 : 16}
                color="brand"
                strokeWidth={1.8}
              />
            </View>
            <View style={styles.flex}>
              <ThemedText type="reasonTitle" style={styles.titleLine}>
                {row.title}
              </ThemedText>
              <ThemedText type="caption" themeColor="textWeak" style={styles.bodyLine}>
                {row.body}
              </ThemedText>
            </View>
            {row.onPress && <Icon name="chevron-end" size={16} color="brand" strokeWidth={2} />}
          </>
        );
        const style = [styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }];
        return row.onPress ? (
          <Tappable
            key={row.title}
            accessibilityRole="button"
            accessibilityLabel={`${row.title}. ${row.body}`}
            onPress={row.onPress}
            style={style}>
            {content}
          </Tappable>
        ) : (
          <View key={row.title} style={style} accessible accessibilityLabel={`${row.title}. ${row.body}`}>
            {content}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma sets these at "normal" line height: 15 px → 23, 12 px → 18.
  titleLine: {
    lineHeight: 23,
  },
  bodyLine: {
    lineHeight: 18,
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
  earthy: {
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.large,
  },
  head: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  rows: {
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
  tile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
});

/**
 * Figma "Button" Type=Tertiary inside an Earthy card (F10·19 "Fix count", I7 "Fix receipt"): a 200 × 48 text button
 * under the note's text column (orb 36 + gap 12). Without onPress it says "Coming soon".
 */
export function EarthyNoteAction({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={actionStyles.action}>
      <ThemedText type="buttonPrimary" themeColor="brand">
        {label}
      </ThemedText>
    </Tappable>
  );
}

const actionStyles = StyleSheet.create({
  action: {
    alignSelf: 'flex-start',
    width: 200,
    height: 48,
    marginStart: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/** Figma "AI/Chip": a white follow-up question inside an Earthy card. */
export function EarthyChip({ label, onPress }: { label: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`Ask Earthy: ${label}`}
      onPress={onPress}
      style={[chipStyles.chip, { backgroundColor: theme.card }]}>
      <ThemedText type="meta13">{label}</ThemedText>
    </Tappable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
});
