import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { PassCard } from '@/components/events/pass-card';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { Spacing } from '@/constants/theme';
import { type CleanupEvent, findEvent, SAMPLE_FRIEND, SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/**
 * W0 and W6a: why to keep the pass in Wallet. Expo Go can't add real passes, so
 * adding marks the pass as added in the app only. A custom build would hand off
 * to Apple Wallet or Google Wallet here.
 */
export default function WalletSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const wallet = Platform.OS === 'android' ? 'Google Wallet' : 'Apple Wallet';
  const place = event.title.replace(' cleanup', '');

  return (
    <RouteSheet accessibilityLabel={`Add to ${wallet}`}>
      <View style={styles.top}>
        <Glow />
        <MiniPass event={event} crew={registration.friends > 0 ? `You + ${SAMPLE_FRIEND.name}` : 'Just you'} />
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: theme.wellCool }]}>
          <Icon name="close" size={18} color="textWeak" />
        </Tappable>
      </View>

      <ThemedText type="heading" accessibilityRole="header">
        Keep your pass on your lock screen
      </ThemedText>
      <View style={styles.reasons}>
        <Reason icon="check" text="Works offline at the check-in tent" />
        <Reason icon="pin" text={`Pops up when you reach ${place}`} />
        <Reason icon="refresh" text="Updates if the time or gate changes" />
      </View>

      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`Add to ${wallet}`}
        // DEMO: hand over to the mocked system sheet (W1 on iPhone, W6 on Android).
        onPress={() => router.replace('/wallet-add')}
        style={[styles.add, { backgroundColor: theme.textStrong }]}>
        {Platform.OS === 'android' ? (
          <Image source={require('@/assets/images/google-wallet.png')} style={styles.googleLogo} accessible={false} />
        ) : (
          <WalletBadge />
        )}
        <ThemedText type="labelLarge" themeColor="textOnBrand">
          {`Add to ${wallet}`}
        </ThemedText>
      </Tappable>
      <TextButton label="Not now" onPress={() => router.back()} />
    </RouteSheet>
  );
}

const MINI_WIDTH = 138;
const PASS_WIDTH = 328;
const MINI_SCALE = MINI_WIDTH / PASS_WIDTH;

/** The real pass, shrunk and tilted as in Figma. It's a picture here, so screen readers skip it. */
function MiniPass({ event, crew }: { event: CleanupEvent; crew: string }) {
  const [height, setHeight] = useState(0);
  const miniHeight = height * MINI_SCALE;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.mini, { height: miniHeight || 211 }]}>
      <View
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        style={[
          styles.miniPass,
          { top: (miniHeight - height) / 2, opacity: height ? 1 : 0, transform: [{ scale: MINI_SCALE }] },
        ]}>
        <PassCard
          eyebrow="Clean UAE 2026 · Dubai"
          title={event.title}
          fields={[
            { label: 'Date', value: event.day },
            { label: 'Time', value: event.slot.split(' · ')[1].replace('–', ' – ') },
            { label: 'Crew', value: crew },
          ]}
          tag={{ label: "You're going", dot: 'unreadDot' }}
          stub={{ kind: 'qr', value: `CLEANSCAPE-PASS:${SAMPLE_USER.passCode}`, caption: 'Show this at the check-in tent' }}
        />
      </View>
    </View>
  );
}

/** Soft blue light behind the pass (a 300 × 200 blurred ellipse in Figma). */
function Glow() {
  const theme = useTheme();
  return (
    <Svg width={360} height={240} style={styles.glow} pointerEvents="none">
      <Defs>
        <RadialGradient id="walletGlow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0.45" stopColor={theme.fill} stopOpacity={1} />
          <Stop offset="1" stopColor={theme.fill} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={180} cy={120} rx={180} ry={120} fill="url(#walletGlow)" />
    </Svg>
  );
}

/** Figma's stand-in wallet badge. Swap for Apple's official "Add to Apple Wallet" artwork before release. */
function WalletBadge() {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.card }]}>
      {['#5FB3C9', '#F2A516', '#E07A5F'].map((color) => (
        <View key={color} style={[styles.badgeStripe, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function Reason({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.reason}>
      <IconTile icon={icon} size={36} iconSize={18} />
      <ThemedText type="hint" style={styles.reasonText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
  },
  mini: {
    width: MINI_WIDTH,
    transform: [{ rotate: '-6deg' }],
  },
  miniPass: {
    position: 'absolute',
    start: (MINI_WIDTH - PASS_WIDTH) / 2,
    width: PASS_WIDTH,
  },
  glow: {
    position: 'absolute',
    top: -Spacing.four,
    alignSelf: 'center',
  },
  badge: {
    width: 26,
    height: 20,
    justifyContent: 'center',
    gap: 0,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
  googleLogo: {
    width: 26,
    height: 26,
  },
  badgeStripe: {
    height: 4,
    borderRadius: 1,
  },
  close: {
    position: 'absolute',
    top: 0,
    end: 0,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  reasons: {
    gap: Spacing.twoThreeQuarters,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  reasonText: {
    flex: 1,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 52,
    borderRadius: 26,
  },
});
