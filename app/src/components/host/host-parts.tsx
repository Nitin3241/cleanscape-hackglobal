import { Image } from 'expo-image';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { type ThemeColor, Radius, Spacing } from '@/constants/theme';
import { HOST_DRAFT } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

export type HostStatus = 'review' | 'fix';

const STATUS: Record<HostStatus, { label: string; fill: ThemeColor; dot: ThemeColor; text: ThemeColor }> = {
  review: { label: 'In review', fill: 'levelMediumFill', dot: 'reviewPending', text: 'levelMediumText' },
  fix: { label: 'Needs a fix', fill: 'levelHighFill', dot: 'levelHighText', text: 'levelHighText' },
};

/** The small event card at the top of F10·16 and F10·16b: photo, name, time and a status pill. */
export function HostEventCard({ status }: { status: HostStatus }) {
  const theme = useTheme();
  const look = STATUS[status];
  return (
    <View
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}
      accessible
      accessibilityLabel={`${HOST_DRAFT.title}, ${HOST_DRAFT.whenShort}. ${look.label}`}>
      <Image source={require('@/assets/images/host/review-thumb.jpg')} style={styles.thumb} contentFit="cover" accessible={false} />
      <View style={styles.text}>
        <ThemedText type="rowTitle">{HOST_DRAFT.title}</ThemedText>
        <ThemedText type="caption" themeColor="textWeak">
          {HOST_DRAFT.whenShort}
        </ThemedText>
      </View>
      <View style={[styles.status, { backgroundColor: theme[look.fill] }]}>
        <View style={[styles.dot, { backgroundColor: theme[look.dot] }]} />
        <ThemedText type="chipAction" themeColor={look.text}>
          {look.label}
        </ThemedText>
      </View>
    </View>
  );
}

/** White bottom bar holding one full-width button (F10·16, F10·16b, F10·17: 12 px above the button). */
export function HostBottomBar({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { backgroundColor: theme.card, paddingBottom: Math.max(insets.bottom, 28) }]}>{children}</View>
  );
}

/** Height the bottom bar covers, for the scroll padding under it. */
export const HOST_BAR_HEIGHT = 88;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  status: {
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
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
});
