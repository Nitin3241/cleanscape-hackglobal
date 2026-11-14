import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AvatarStack } from '@/components/school/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { CLASS, CREW_FRIENDS } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

const LINK = `https://${CLASS.inviteLink}`;
const MESSAGE = `Join my crew for the Kite Beach clean-up on Sat 5 Dec: ${LINK}`;

/** F3·9: bring friends from outside the class into your crew with a link. */
export default function ClassInviteSheet() {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await Clipboard.setStringAsync(LINK);
    setCopied(true);
  }

  async function whatsApp() {
    const url = `whatsapp://send?text=${encodeURIComponent(MESSAGE)}`;
    // Falls back to the share sheet when WhatsApp isn't installed.
    if (await Linking.canOpenURL(url).catch(() => false)) Linking.openURL(url);
    else share();
  }

  function share() {
    Share.share({ message: MESSAGE }).catch(() => {
      // The user closed the share sheet or sharing isn't available; nothing to do.
    });
  }

  return (
    <RouteSheet accessibilityLabel="Bring friends to your crew">
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header" style={styles.centred}>
          Bring friends to your crew
        </ThemedText>
        <ThemedText type="note" themeColor="textWeak" style={styles.centred}>
          {`They join you on the day, not ${CLASS.name}, and make their own way there. Under 18? They get their own parent link.`}
        </ThemedText>
      </View>

      <View style={[styles.link, { backgroundColor: theme.wellCool }]}>
        <Icon name="link" size={18} color="brand" strokeWidth={1.5} />
        <ThemedText type="link" style={styles.linkText} numberOfLines={1}>
          {CLASS.inviteLink}
        </ThemedText>
        <Tappable accessibilityRole="button" accessibilityLabel={copied ? 'Link copied' : 'Copy link'} hitSlop={8} onPress={copy}>
          <ThemedText type="label" themeColor="brand" accessibilityLiveRegion="polite">
            {copied ? 'Copied' : 'Copy'}
          </ThemedText>
        </Tappable>
      </View>

      {showQr && (
        <View style={styles.qr} accessible accessibilityLabel="QR code for the invite link">
          <QRCode value={LINK} size={140} color={theme.textStrong} backgroundColor={theme.card} />
        </View>
      )}

      <View style={styles.options}>
        <ShareOption icon="chat" label="WhatsApp" onPress={whatsApp} />
        <ShareOption icon="qr" label={showQr ? 'Hide QR' : 'Show QR'} onPress={() => setShowQr((current) => !current)} />
        <ShareOption icon="share" label="More" onPress={share} />
      </View>

      <View style={styles.crew}>
        <AvatarStack people={CREW_FRIENDS} size={24} />
        <ThemedText type="bodyMedium">Maya and Zaid are in your crew</ThemedText>
      </View>

      <Button
        label="Share link"
        size="large"
        onPress={() => {
          share();
          router.back();
        }}
      />
    </RouteSheet>
  );
}

function ShareOption({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.option}>
      <View style={[styles.optionIcon, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
        <Icon name={icon} size={22} color="brand" strokeWidth={1.5} />
      </View>
      <ThemedText type="filterLabel">{label}</ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.two,
  },
  centred: {
    textAlign: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  linkText: {
    flex: 1,
  },
  qr: {
    alignSelf: 'center',
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  optionIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  crew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
