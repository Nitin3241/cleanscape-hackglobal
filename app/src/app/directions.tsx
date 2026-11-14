import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { openInMaps, openInWaze } from '@/components/event/open-waze';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { findEvent, meetTime, TRANSIT } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** R6a: the ways to get to the cleanup, from the pass. */
export default function DirectionsSheet() {
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const place = event.title.replace(' cleanup', '');

  return (
    <RouteSheet accessibilityLabel={`Get to ${place}`}>
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          {`Get to ${place}`}
        </ThemedText>
        <ThemedText type="note" themeColor="textWeak">
          {`Gate 2, ${event.place} · meet by ${meetTime(event)}`}
        </ThemedText>
      </View>
      <View>
        <Row
          art={<WazeTile />}
          title="Waze"
          detail={`${event.driveMinutes + 6} min drive · live traffic`}
          onPress={openInWaze}
        />
        <Row icon="pin" title="Google Maps" detail={`${event.driveMinutes + 6} min drive`} onPress={openInMaps} />
        <Row
          icon="bus-front"
          title="Metro + bus"
          detail={`${TRANSIT.summary.split(' · ')[0]} · AED 7.5 with Nol`}
          onPress={() => router.replace('/transit')}
        />
        <Row icon="car-front" title="Carpool" detail="3 drivers near you · free" last onPress={() => router.replace('/rides')} />
      </View>
      <TextButton label="Cancel" onPress={() => router.back()} />
    </RouteSheet>
  );
}

/** Waze's own app tile, exported from Figma. */
function WazeTile() {
  return <Image source={require('@/assets/images/waze-tile.png')} style={styles.waze} accessible={false} />;
}

function Row({
  icon,
  art,
  title,
  detail,
  last = false,
  onPress,
}: {
  icon?: IconName;
  art?: React.ReactNode;
  title: string;
  detail: string;
  last?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${detail}`}
      onPress={onPress}
      style={styles.row}>
      {art ?? <IconTile icon={icon ?? 'pin'} size={44} iconSize={22} tone="wellCool" />}
      <View style={styles.rowText}>
        <ThemedText type="labelLarge">{title}</ThemedText>
        <ThemedText type="meta" themeColor="textWeak">
          {detail}
        </ThemedText>
      </View>
      <Icon name="chevron-end" size={18} color="textWeak" />
      {/* Figma starts the divider under the text, not under the tile. */}
      {!last && <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  rowText: {
    flex: 1,
  },
  waze: {
    width: 44,
    height: 44,
    borderRadius: Radius.control,
  },
  divider: {
    position: 'absolute',
    start: 44 + Spacing.twoThreeQuarters,
    end: 0,
    bottom: 0,
    height: 1,
  },
});
