import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { IconTile } from '@/components/ui/parts';
import { RoleSwitcher } from '@/components/ui/role-switcher';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { CHECK_IN } from '@/data/check-in.sample';
import { SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRole } from '@/state/role';

/** DEMO: Figma's prototype moves on by itself, standing in for the crew head scanning the pass. */
const SCANNED_AFTER = 3000; // Figma F4·1 → F4·4: auto 3 s.

/** F4·1: the check-in pass, big and bright, to show to the crew head. Works offline. */
export default function CheckInPassRoute() {
  const theme = useTheme();
  const { setRole } = useRole();
  // Keep the demo role switch in step with the screen, however it was opened.
  useEffect(() => setRole('volunteer'), [setRole]);
  const insets = useSafeAreaInsets();

  // Only while this screen is in front: opening Sort / Log / Report pauses the demo scan.
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => router.replace('/checked-in'), SCANNED_AFTER);
      return () => clearTimeout(timer);
    }, []),
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Check-in pass" subtitle={CHECK_IN.place} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
        <RoleSwitcher onChange={(role) => role === 'crewHead' && router.replace('/crew-scan')} />

        <View style={[styles.pass, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.card }]}>
          <View style={[styles.eventChip, { backgroundColor: theme.fill }]}>
            <ThemedText type="smallMedium" themeColor="brand">
              {CHECK_IN.event}
            </ThemedText>
          </View>
          <View accessible accessibilityLabel="Your check-in code">
            <QRCode value={`CLEANSCAPE-PASS:${SAMPLE_USER.passCode}`} size={176} color={theme.textStrong} backgroundColor={theme.card} />
          </View>
          <View style={styles.who}>
            <ThemedText type="etaTitle">{CHECK_IN.volunteer.name}</ThemedText>
            <ThemedText type="note" themeColor="textWeak">
              {CHECK_IN.volunteer.detail}
            </ThemedText>
          </View>
          <View style={styles.tear}>
            <Svg width="100%" height={2}>
              <Line x1={1} x2="100%" y1={1} y2={1} stroke={theme.strokeControl} strokeWidth={1.5} strokeDasharray={[5, 5]} />
            </Svg>
          </View>
          <View style={styles.show}>
            <IconTile icon="user" size={36} iconSize={18} />
            <View style={styles.showText}>
              <ThemedText type="label">Show this to your crew head</ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                Logs you in and starts your hours
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.offline, { backgroundColor: theme.secondarySubtle }]}>
          <Icon name="sun" size={14} color="textSecondary" strokeWidth={1.5} />
          <ThemedText type="smallMedium" themeColor="textSecondary">
            Brightness up · works offline
          </ThemedText>
        </View>

        {/* One scanner for everything (NAVIGATION_MAP): the other things the Scan button can do. */}
        <View style={[styles.modes, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
          <ListRow icon="scan-eye" title="Sort an item" detail="Earthy tells you the right bin" onPress={() => router.push('/waste-scan')} divider />
          <ListRow icon="trash" title="Log a bag" detail="Scan the sticker on your bag" onPress={() => router.push('/bag-log')} divider />
          <ListRow icon="camera" title="Report a dirty spot" detail="Earthy sizes it for you" onPress={() => router.push('/report')} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Add to Apple Wallet"
          onPress={() => router.push('/wallet')}
          style={[styles.wallet, { backgroundColor: theme.textStrong }]}>
          <Icon name="wallet" size={20} color="textOnBrand" strokeWidth={1.75} />
          <ThemedText type="labelLarge" themeColor="textOnBrand">
            Add to Apple Wallet
          </ThemedText>
        </Tappable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modes: {
    borderWidth: 1,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  pass: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  eventChip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  who: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  tear: {
    alignSelf: 'stretch',
  },
  show: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  showText: {
    flex: 1,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
  wallet: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 26,
  },
});
