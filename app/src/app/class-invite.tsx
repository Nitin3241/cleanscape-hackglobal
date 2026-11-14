import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SvgXml } from 'react-native-svg';

import { AvatarStack } from '@/components/school/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { linkXml, msgXml, qrXml, shareXml } from '@/constants/rides-art';
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
    <RouteSheet accessibilityLabel="Bring friends to your crew" bottomPadding={25}>
      {/* Figma F3·9 "Sheet": a 1 px edge, 16 padding and 16 between blocks; content starts 31 under the top. */}
      <View style={styles.body}>
        <View style={styles.heading}>
          <ThemedText type="screenTitle" accessibilityRole="header" style={[styles.centred, FigmaLines.l30]}>
            Bring friends to your crew
          </ThemedText>
          <ThemedText type="body" themeColor="textWeak" style={styles.centred}>
            {`They join you on the day, not ${CLASS.name}, and make their own way there. Under 18? They get their own parent link.`}
          </ThemedText>
        </View>

        <View style={[styles.link, { backgroundColor: theme.fill }]}>
          <SvgXml xml={linkXml(theme.brand)} width={18} height={18} />
          <ThemedText type="link" style={[styles.linkText, FigmaLines.l21]} numberOfLines={1}>
            {CLASS.inviteLink}
          </ThemedText>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={copied ? 'Link copied' : 'Copy link'}
            hitSlop={8}
            onPress={copy}>
            <ThemedText type="label" themeColor="brand" accessibilityLiveRegion="polite" style={FigmaLines.l21}>
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
          <ShareOption xml={msgXml(theme.brand)} label="WhatsApp" onPress={whatsApp} />
          <ShareOption
            xml={qrXml(theme.brand)}
            label={showQr ? 'Hide QR' : 'Show QR'}
            onPress={() => setShowQr((current) => !current)}
          />
          <ShareOption xml={shareXml(theme.brand)} label="More" onPress={share} />
        </View>

        <View style={styles.crew}>
          <AvatarStack people={CREW_FRIENDS} size={28} />
          <ThemedText type="bodyMedium" style={FigmaLines.l20}>
            Maya and Zaid are in your crew
          </ThemedText>
        </View>

        <Button
          label="Share link"
          flat
          onPress={() => {
            share();
            router.back();
          }}
        />
      </View>
    </RouteSheet>
  );
}

function ShareOption({ xml, label, onPress }: { xml: string; label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.option}>
      <View style={[styles.optionIcon, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
        <SvgXml xml={xml} width={24} height={24} />
      </View>
      <ThemedText type="chip">{label}</ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
    paddingTop: 1,
    paddingHorizontal: 1,
  },
  heading: {
    gap: Spacing.oneHalf,
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
    gap: Spacing.two,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
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
    gap: Spacing.twoHalf,
  },
});
