/**
 * Small pieces shared by the registration and travel screens: avatars, icon tiles,
 * notices, the spots bar, seat dots, the ride timeline and a stepper.
 */
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Avatar({
  initials,
  tone,
  size = 36,
  ring,
}: {
  initials: string;
  tone: ThemeColor;
  size?: number;
  /** A border in this colour, for stacked avatars. */
  ring?: ThemeColor;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: theme[tone] },
        ring && { borderWidth: 2, borderColor: theme[ring] },
      ]}>
      <ThemedText type={size > 30 ? 'labelSmall' : 'avatarSmall'} themeColor="textOnBrand" maxFontSizeMultiplier={1}>
        {initials}
      </ThemedText>
    </View>
  );
}

/** A tinted square holding a line icon. */
export function IconTile({
  icon,
  size = 40,
  iconSize = 20,
  tone = 'fill',
  color = 'brand',
}: {
  icon: IconName;
  size?: number;
  iconSize?: number;
  tone?: ThemeColor;
  color?: ThemeColor;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.tile, { width: size, height: size, backgroundColor: theme[tone] }]}>
      <Icon name={icon} size={iconSize} color={color} strokeWidth={1.5} />
    </View>
  );
}

/** A notice row: info in pale blue, warnings in pale marigold. */
export function Notice({
  text,
  icon,
  tone = 'info',
  children,
}: {
  text: string;
  icon: IconName;
  tone?: 'info' | 'warning';
  children?: ReactNode;
}) {
  const theme = useTheme();
  const warning = tone === 'warning';

  return (
    <View accessibilityRole="text" style={[styles.notice, { backgroundColor: warning ? theme.secondarySubtle : theme.fill }]}>
      <Icon name={icon} size={18} color={warning ? 'textSecondary' : 'brand'} strokeWidth={1.5} />
      <View style={styles.noticeText}>
        <ThemedText type="note" themeColor={warning ? 'textStrong' : 'brand'}>
          {text}
        </ThemedText>
        {children}
      </View>
    </View>
  );
}

/** Amber banner with a "!" badge, for a clash the user should resolve before going on (R3b). */
export function AlertBanner({ title, body }: { title: string; body: string }) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${body}`}
      style={[styles.alert, { backgroundColor: theme.secondarySubtle, borderColor: theme.alertStroke }]}>
      <View style={[styles.alertBadge, { backgroundColor: theme.alertBadge }]}>
        <ThemedText type="labelSmall" themeColor="textOnBrand">
          !
        </ThemedText>
      </View>
      <View style={styles.noticeText}>
        <ThemedText type="labelSmall" themeColor="textAlert">
          {title}
        </ThemedText>
        <ThemedText type="meta" themeColor="textAlertWeak">
          {body}
        </ThemedText>
      </View>
    </View>
  );
}

/** How full a cleanup is. Coral when it still needs people (under half full), as on the R2 map. */
export function SpotsBar({
  filled,
  width = 170,
  needsPeople = false,
}: {
  filled: number;
  width?: number;
  needsPeople?: boolean;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.track, { width, backgroundColor: theme.track }]}>
      <View
        style={[
          styles.bar,
          { width: width * Math.min(Math.max(filled, 0), 1), backgroundColor: needsPeople ? theme.avatarCoral : theme.brand },
        ]}
      />
    </View>
  );
}

/** One dot per seat: taken seats are grey, open seats are brand, or coral when only one is left. */
export function SeatDots({ seats, open }: { seats: number; open: number }) {
  const theme = useTheme();
  const openColor = open === 1 ? theme.avatarCoral : theme.brand;

  return (
    <View style={styles.seats} accessible={false}>
      {Array.from({ length: seats }, (_, index) => (
        <View key={index} style={[styles.seat, { backgroundColor: index >= seats - open ? openColor : theme.seatEmpty }]} />
      ))}
    </View>
  );
}

type Stop = { time: string; place: string; note: string; action?: ReactNode };

/** Pickup and drop-off with times, joined by a line. */
export function RouteTimeline({ from, to }: { from: Stop; to: Stop }) {
  const theme = useTheme();

  return (
    <View style={styles.route} accessible accessibilityLabel={`${from.time} ${from.place}, then ${to.time} ${to.place}`}>
      <View style={styles.times}>
        <ThemedText type="eventTitle" style={FigmaLines.l24}>
          {from.time}
        </ThemedText>
        <ThemedText type="eventTitle" style={FigmaLines.l24}>
          {to.time}
        </ThemedText>
      </View>
      <View style={styles.line}>
        <View style={[styles.stopOpen, { borderColor: theme.brand, backgroundColor: theme.card }]} />
        <View style={[styles.rail, { backgroundColor: theme.brand }]} />
        <View style={[styles.stopFilled, { backgroundColor: theme.brand }]} />
      </View>
      <View style={styles.places}>
        <View>
          <ThemedText type="label" style={FigmaLines.l21}>
            {from.place}
          </ThemedText>
          <View style={styles.inline}>
            <ThemedText type="meta" themeColor="textWeak">
              {from.note}
            </ThemedText>
            {from.action}
          </View>
        </View>
        <View>
          <ThemedText type="label" style={FigmaLines.l21}>
            {to.place}
          </ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
            {to.note}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

/** A minus and plus pair around a number. */
export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <View style={styles.stepper} accessibilityRole="adjustable" accessibilityLabel={`${label}: ${value}`}>
      <StepButton icon="minus" label={`Fewer ${label}`} disabled={value <= min} onPress={() => onChange(value - 1)} />
      <ThemedText type="sectionTitle" style={styles.stepValue}>
        {value}
      </ThemedText>
      <StepButton icon="plus" label={`More ${label}`} disabled={value >= max} onPress={() => onChange(value + 1)} />
    </View>
  );
}

function StepButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: IconName;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={[styles.stepButton, { borderColor: theme.brand, backgroundColor: theme.card }]}>
      <Icon name={icon} size={18} color="brand" />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: 13,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  alertBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.control,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  noticeText: {
    flex: 1,
    gap: Spacing.half,
  },
  track: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 3,
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },
  seats: {
    flexDirection: 'row',
    gap: 3,
  },
  seat: {
    width: 8,
    height: 12,
    borderRadius: 3,
  },
  // Figma ride "Route" (T3, T4, T8, T10, T13): times 16 / 24 with 30 between, a 12 x 74 line (open stop at y 4,
  // rail 17–57, filled stop 58–70) and places 14 / 21 over 12 / 18 with 10 between the two stops.
  route: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  times: {
    gap: 30,
  },
  line: {
    width: 12,
    height: 74,
    alignItems: 'center',
    paddingTop: Spacing.one,
  },
  stopOpen: {
    width: 12,
    height: 12,
    borderWidth: 3,
    borderRadius: 6,
  },
  rail: {
    width: 3,
    height: 40,
    marginTop: 1,
    marginStart: 1,
  },
  stopFilled: {
    width: 12,
    height: 12,
    marginTop: 1,
    borderRadius: 6,
  },
  places: {
    flex: 1,
    gap: Spacing.twoHalf,
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.one,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  stepValue: {
    minWidth: 14,
    textAlign: 'center',
  },
  stepButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
  },
});
