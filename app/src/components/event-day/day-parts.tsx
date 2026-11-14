import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { type CrewFace } from '@/data/event-day.sample';
import { useTheme } from '@/hooks/use-theme';

/** White card with a hairline edge and 18 px corners, the base of every F11 card. */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }, style]}>{children}</View>;
}

/** A card of rows split by hairlines (Figma "List card": 16 px sides, 4 px top and bottom). */
export function ListCard({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const rows = Children.toArray(children);
  return (
    <Card style={styles.list}>
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />}
          {row}
        </Fragment>
      ))}
    </Card>
  );
}

type IconRowProps = {
  icon: IconName;
  title: string;
  note: string;
  /** Vertical padding of the row: 8 on the briefing, 10 elsewhere. */
  pad?: number;
  /** Text at the end, such as "1 min". */
  end?: string;
  /** Makes the row a button. */
  onPress?: () => void;
  /** Shows a chevron at the end (Figma draws one on rows that open something). */
  chevron?: boolean;
  /** The red emergency row (F11·7). */
  danger?: boolean;
};

/** A row with a round 36 px icon tile, a title and a note (F11·2, 3, 7, 8, 9). */
export function IconRow({
  icon,
  title,
  note,
  pad = Spacing.twoHalf,
  end,
  onPress,
  chevron = !!onPress,
  danger = false,
}: IconRowProps) {
  const theme = useTheme();
  const content = (
    <>
      <View style={[styles.iconTile, { backgroundColor: theme[danger ? 'accentSubtle' : 'fill'] }]}>
        <Icon name={icon} size={18} color={danger ? 'issueRed' : 'brand'} strokeWidth={1.75} />
      </View>
      <View style={styles.text}>
        <ThemedText type="reasonTitle" themeColor={danger ? 'issueRed' : 'textStrong'}>
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="textWeak">
          {note}
        </ThemedText>
      </View>
      {end && (
        <ThemedText type="labelSmall" themeColor="brand" style={styles.endText}>
          {end}
        </ThemedText>
      )}
      {chevron && <Icon name="chevron-end" size={18} color="strokeStrong" strokeWidth={1.75} />}
    </>
  );
  const rowStyle = [styles.row, { paddingVertical: pad }];
  return onPress ? (
    <Tappable accessibilityRole="button" accessibilityLabel={`${title}. ${note}`} onPress={onPress} style={rowStyle}>
      {content}
    </Tappable>
  ) : (
    <View accessible accessibilityLabel={`${title}. ${note}${end ? `. ${end}` : ''}`} style={rowStyle}>
      {content}
    </View>
  );
}

/** Three equal tiles with a value over a label (F11·1 forecast, F11·9 recap). */
export function StatTiles({ stats, large = false }: { stats: readonly (readonly [string, string])[]; large?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.stats}>
      {stats.map(([value, label]) => (
        <View
          key={label}
          accessible
          accessibilityLabel={`${value} ${label}`}
          style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <ThemedText type={large ? 'transcript' : 'optionTitle'}>{value}</ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

// Figma avatar text per disc size, all SemiBold: 24 → 9/12, 30 → 11/15, 32 → 12/16.
const AVATAR_TEXT = {
  24: { fontSize: 9, lineHeight: 12 },
  30: { fontSize: 11, lineHeight: 15 },
  32: { fontSize: 12, lineHeight: 16 },
} as const;

/** Overlapping crew discs with a 2 px white ring, 8 px overlap (F11·4, F11·5, F11·11). */
export function Avatars({ people, size }: { people: readonly CrewFace[]; size: keyof typeof AVATAR_TEXT }) {
  const theme = useTheme();
  return (
    <View style={styles.avatars} aria-hidden>
      {people.map((person, index) => (
        <View
          key={`${person.initials}-${index}`}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: theme[person.tone], borderColor: theme.card },
            index > 0 && styles.overlap,
          ]}>
          <ThemedText type="chipAction" themeColor="textOnBrand" style={AVATAR_TEXT[size]}>
            {person.initials}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

/** Earthy's reason for the card: a 20 px orb and a 12 px note on the pale blue fill. */
export function EarthyNote({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.note, { backgroundColor: theme.fill }]}>
      <EarthyOrb size={20} state="still" glow={false} />
      <ThemedText type="meta" style={styles.flex}>
        {text}
      </ThemedText>
    </View>
  );
}

/** Overlapping initials used on the report flow (R2 "Already reported"). */
export function Initials({
  people,
  more,
  size = 30,
}: {
  people: readonly { initials: string; tone: ThemeColor }[];
  more?: number;
  size?: number;
}) {
  const theme = useTheme();
  const items = more ? [...people, { initials: `+${more}`, tone: 'textWeak' as ThemeColor }] : people;
  return (
    <View style={styles.avatars} aria-hidden>
      {items.map((person, index) => (
        <View
          key={`${person.initials}-${index}`}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: theme[person.tone], borderColor: theme.card },
            index > 0 && { marginStart: -size / 4 },
          ]}>
          <ThemedText type="avatarSmall" themeColor="textOnBrand">
            {person.initials}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  card: {
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.large,
  },
  list: {
    paddingVertical: Spacing.one,
  },
  divider: {
    height: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  iconTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  endText: {
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    gap: Spacing.half,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  overlap: {
    marginStart: -8,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
});
