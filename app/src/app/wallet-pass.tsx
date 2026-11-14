import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WalletPass } from '@/components/events/wallet-pass';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { findEvent, SAMPLE_FRIEND } from '@/data/events.sample';
import { useRegistration } from '@/state/registration';

/**
 * DEMO MOCK of the pass inside the Wallet app (Figma W3), opened from "In Wallet".
 * A custom build would open the real Wallet app instead.
 */
export default function WalletPassScreen() {
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const crew = registration.friends > 0 ? `You + ${SAMPLE_FRIEND.name}` : 'Just you';
  const place = event.title.replace(' cleanup', '');

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.one }]}>
      <StatusBar style="dark" />
      <View style={styles.nav}>
        <Tappable accessibilityRole="button" accessibilityLabel="Done" hitSlop={10} onPress={() => router.back()}>
          <Text style={[styles.navText, styles.bold]}>Done</Text>
        </Tappable>
        {/* Wallet's own pass menu; not part of the demo. */}
        <Text style={[styles.navText, styles.bold]} accessible={false}>
          •••
        </Text>
      </View>
      <View style={styles.body}>
        <WalletPass event={event} crew={crew} width={328} />
        <View style={styles.hint}>
          <Icon name="pin" size={16} color="textWeak" />
          <Text style={styles.hintText}>{`Shows on your lock screen near ${place}`}</Text>
        </View>
      </View>
    </View>
  );
}

// iOS system colours, as the Wallet app draws them.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  navText: {
    color: '#007AFF',
    fontSize: 17,
  },
  bold: {
    fontWeight: '600',
  },
  body: {
    alignItems: 'center',
    gap: Spacing.four,
    paddingTop: Spacing.twoHalf,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  hintText: {
    color: '#6E6E73',
    fontSize: 13,
  },
});
