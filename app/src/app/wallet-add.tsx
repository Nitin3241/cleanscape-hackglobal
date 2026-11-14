import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WalletPass } from '@/components/events/wallet-pass';
import { Avatar } from '@/components/ui/parts';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { ThemedText } from '@/components/themed-text';
import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { findEvent, SAMPLE_FRIEND, SAMPLE_USER } from '@/data/events.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/**
 * DEMO MOCK of the phone's own "add pass" sheet: Apple Wallet on iPhone (Figma W1),
 * Google Wallet on Android (W6). Expo Go can't add real passes, so adding only marks
 * the pass as added in the app. A custom build would hand the .pkpass or Google
 * Wallet link to the system here instead.
 */
export default function WalletAddSheet() {
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const crew = registration.friends > 0 ? `You + ${SAMPLE_FRIEND.name}` : 'Just you';

  function add() {
    feedback.play('register.success');
    registration.addToWallet();
    router.back();
  }

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFill, styles.scrim]}>
        <Pressable accessibilityLabel="Cancel" onPress={() => router.back()} style={StyleSheet.absoluteFill} />
      </Animated.View>
      {Platform.OS === 'android' ? (
        <GoogleSheet event={event} crew={crew} onSave={add} />
      ) : (
        <AppleSheet event={event} crew={crew} onAdd={add} />
      )}
    </View>
  );
}

type SheetProps = { event: ReturnType<typeof findEvent>; crew: string };

/** W1: iOS card sheet with Cancel and Add in system blue. */
function AppleSheet({ event, crew, onAdd }: SheetProps & { onAdd: () => void }) {
  const insets = useSafeAreaInsets();
  const place = event.title.replace(' cleanup', '');

  return (
    <Animated.View
      entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
      accessibilityViewIsModal
      style={[styles.appleSheet, { marginBottom: Math.max(insets.bottom, Spacing.two) }]}>
      <View style={styles.appleNav}>
        <Tappable accessibilityRole="button" accessibilityLabel="Cancel" hitSlop={10} onPress={() => router.back()}>
          <Text style={styles.appleAction}>Cancel</Text>
        </Tappable>
        <Tappable accessibilityRole="button" accessibilityLabel="Add to Apple Wallet" hitSlop={10} onPress={onAdd}>
          <Text style={[styles.appleAction, styles.appleBold]}>Add</Text>
        </Tappable>
      </View>
      <View style={styles.appleBody}>
        <WalletPass event={event} crew={crew} width={300} />
        <Text style={styles.appleNote}>
          {`Adding this pass lets it appear on your lock screen when you're near ${place}.`}
        </Text>
      </View>
    </Animated.View>
  );
}

/** W6: Google Wallet's bottom sheet with the account picker and Save. */
function GoogleSheet({ event, crew, onSave }: SheetProps & { onSave: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
      accessibilityViewIsModal
      style={[styles.googleSheet, { paddingBottom: insets.bottom + Spacing.three }]}>
      <View style={styles.googleHandle} />
      <View style={styles.googleHeader}>
        <Image source={require('@/assets/images/google-wallet.png')} style={styles.googleLogo} accessible={false} />
        <ThemedText type="screenTitle" accessibilityRole="header" style={styles.googleTitle}>
          Google Wallet
        </ThemedText>
      </View>
      <ThemedText type="note" themeColor="textWeak" style={styles.centred}>
        Save this pass to open it in one tap, even offline
      </ThemedText>
      <WalletPass event={event} crew={crew} width={280} scale={280 / 300} />
      {/* Account picker: shown as in Figma; switching accounts isn't part of the demo. */}
      <View
        accessible
        accessibilityLabel={`Saving to ${SAMPLE_USER.googleAccount}`}
        style={[styles.account, { backgroundColor: theme.wellCool }]}>
        <Avatar initials={SAMPLE_USER.firstName[0]} tone="avatarCoral" size={24} />
        <ThemedText type="note">{SAMPLE_USER.googleAccount}</ThemedText>
        <Icon name="chevron-down" size={16} color="textWeak" />
      </View>
      <View style={styles.googleActions}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Save to Google Wallet"
          onPress={onSave}
          style={[styles.save, { backgroundColor: theme.brand }]}>
          <ThemedText type="labelLarge" themeColor="textOnBrand">
            Save
          </ThemedText>
        </Tappable>
        <Tappable accessibilityRole="button" accessibilityLabel="Cancel" hitSlop={8} onPress={() => router.back()}>
          <ThemedText type="labelLarge" themeColor="brand">
            Cancel
          </ThemedText>
        </Tappable>
      </View>
    </Animated.View>
  );
}

// System colours for the mock sheets come from iOS and Google's own UI, not the app theme.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  appleSheet: {
    marginHorizontal: Spacing.two,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
  },
  appleNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.twoHalf,
  },
  appleAction: {
    color: '#007AFF',
    fontSize: 17,
  },
  appleBold: {
    fontWeight: '600',
  },
  appleBody: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.twoHalf,
    paddingBottom: Spacing.five,
  },
  appleNote: {
    color: '#6E6E73',
    fontSize: 13,
    lineHeight: 16,
  },
  googleSheet: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.twoHalf,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  googleHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C4C7C5',
  },
  googleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    marginTop: Spacing.two,
  },
  googleLogo: {
    width: 28,
    height: 28,
  },
  googleTitle: {
    color: '#1F1F1F',
  },
  centred: {
    textAlign: 'center',
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  googleActions: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.two,
  },
  save: {
    alignSelf: 'stretch',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
});
