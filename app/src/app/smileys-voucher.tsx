import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { beatOne, beatTwo } from '@/components/motion/celebrate';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { JUICE, SMILEYS } from '@/data/smileys.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** DEMO: Figma shows 14:52 left; the timer starts there and counts down live. */
const START_SECONDS = 14 * 60 + 52;

/** F7·4: the voucher to show at the counter, valid for 15 minutes. */
export default function SmileysVoucherRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(START_SECONDS);
  const expired = seconds <= 0;

  useEffect(() => {
    feedback.play('register.success');
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Your voucher" subtitle={JUICE.shopShort} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}>
        {/* Figma F7·4 "· enter A/B" (9 Nov): the voucher card is beat 1, the rest beat 2. */}
        <Animated.View entering={beatOne()} style={[styles.card, { borderColor: theme.strokeWeak, boxShadow: Shadows.card }]}>
          <View
            style={[styles.timer, { backgroundColor: expired ? theme.accentSubtle : theme.secondarySubtle }]}
            accessibilityLiveRegion="polite">
            <Icon name="clock" size={14} color={expired ? 'textAccent' : 'textSecondary'} strokeWidth={1.75} />
            <ThemedText type="smallMedium" themeColor={expired ? 'textAccent' : 'textSecondary'}>
              {expired ? 'Expired · Smileys returned' : `${clock} left`}
            </ThemedText>
          </View>
          <View style={[styles.qr, expired && styles.faded]} accessible accessibilityLabel={`Voucher code ${JUICE.code}`}>
            <QRCode value={`CLEANSCAPE-VOUCHER:${JUICE.code}`} size={160} color={theme.textStrong} backgroundColor={theme.card} />
          </View>
          <ThemedText type="etaTitle" style={styles.code}>
            {JUICE.code}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            Show this at the counter
          </ThemedText>
          <View style={styles.tear}>
            <Svg width="100%" height={2}>
              <Line x1={1} x2="100%" y1={1} y2={1} stroke={theme.strokeControl} strokeWidth={1.5} strokeDasharray={[5, 5]} />
            </Svg>
          </View>
          <View style={styles.item}>
            <IconTile icon="cup" size={40} iconSize={20} tone="secondarySubtle" color="textPaper" />
            <View>
              <ThemedText type="label">{JUICE.title}</ThemedText>
              <ThemedText
                type="caption"
                themeColor="textWeak">{`${JUICE.cost} Smileys · ${(SMILEYS.balance - JUICE.cost).toLocaleString('en-US')} left`}</ThemedText>
            </View>
          </View>
        </Animated.View>
        <Animated.View entering={beatTwo()} style={[styles.back, { backgroundColor: theme.statusSuccessSubtle }]}>
          <ThemedText type="smallMedium" themeColor="statusSuccess">
            Not used in time? Your Smileys come back
          </ThemedText>
        </Animated.View>
      </ScrollView>
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.card, boxShadow: Shadows.stickyFooter, paddingBottom: Math.max(insets.bottom, Spacing.three) },
        ]}>
        <Button label="Done" size="large" onPress={() => router.dismissTo('/smileys')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  card: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.threeHalf,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  qr: {
    marginVertical: Spacing.two,
  },
  faded: {
    opacity: 0.25,
  },
  code: {
    letterSpacing: 1,
  },
  tear: {
    alignSelf: 'stretch',
    marginVertical: Spacing.one,
  },
  item: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  back: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
  },
  footer: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
});
