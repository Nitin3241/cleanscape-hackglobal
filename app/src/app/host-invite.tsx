import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Share, StyleSheet, View } from 'react-native';

import { ShareArt, type ShareArtName } from '@/components/host/share-art';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { SuccessTick } from '@/components/ui/success-tick';
import { Tappable } from '@/components/ui/tappable';
import { type ThemeColor, Fonts, Radius, Spacing } from '@/constants/theme';
import { HOST_INVITE } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

// SAMPLE link: there is no public event page yet.
const LINK = 'https://cleanscape.app/e/kite-beach-12-dec';
const FACE_TONES: ThemeColor[] = ['avatarMarigold', 'avatarTeal', 'avatarLavender', 'avatarCoral'];

/**
 * F10·17i Invite neighbours (sheet). "Send invites" turns it into F10·17j Invites sent, with the success tick;
 * "Done" goes back to Home. SAMPLE: no one is really sent anything.
 */
export default function HostInviteSheet() {
  const theme = useTheme();
  const [sent, setSent] = useState(false);
  const [nearby, setNearby] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function share() {
    Share.share({ message: `${HOST_INVITE.shareMessage} ${LINK}` }).catch(() => {
      // The share sheet was closed or isn't available; nothing to do.
    });
  }

  async function whatsApp() {
    const url = `whatsapp://send?text=${encodeURIComponent(`${HOST_INVITE.shareMessage} ${LINK}`)}`;
    // Falls back to the share sheet when WhatsApp isn't installed.
    if (await Linking.canOpenURL(url).catch(() => false)) Linking.openURL(url);
    else share();
  }

  async function copy() {
    await Clipboard.setStringAsync(LINK);
    feedback.play('toggle.on');
    setCopied(true);
  }

  if (sent) {
    return (
      <RouteSheet accessibilityLabel="Invites sent">
        <View style={styles.done} accessibilityLiveRegion="polite">
          <View style={styles.tickWrap}>
            <SuccessTick size={56} />
          </View>
          <ThemedText type="sheetTitle" accessibilityRole="header">
            Invites sent
          </ThemedText>
          <ThemedText type="meta13" themeColor="textWeak" style={[styles.centred, styles.lead]}>
            {HOST_INVITE.sent}
          </ThemedText>
        </View>
        <Button label="Done" flat onPress={() => router.dismissTo('/home')} />
      </RouteSheet>
    );
  }

  return (
    <RouteSheet accessibilityLabel="Invite neighbours">
      <ThemedText type="sheetTitle" accessibilityRole="header">
        Invite neighbours
      </ThemedText>
      <ThemedText type="meta13" themeColor="textWeak" style={styles.lead}>
        {HOST_INVITE.body}
      </ThemedText>

      <Tappable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: nearby }}
        accessibilityLabel={`${HOST_INVITE.option}. ${HOST_INVITE.optionSub}`}
        onPress={() => {
          feedback.play('toggle.on');
          setNearby((on) => !on);
        }}
        style={[styles.nearby, { backgroundColor: theme.loaderCard }]}>
        <View style={styles.faces}>
          {HOST_INVITE.faces.map((initial, index) => (
            <View
              key={initial}
              style={[
                styles.face,
                { backgroundColor: theme[FACE_TONES[index % FACE_TONES.length]], borderColor: theme.loaderCard },
                index > 0 && styles.overlap,
              ]}>
              <ThemedText type="micro11" themeColor="textOnBrand" style={styles.faceText}>
                {initial}
              </ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.flex}>
          <ThemedText type="labelMedium14" style={styles.optionTitle}>
            {HOST_INVITE.option}
          </ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {HOST_INVITE.optionSub}
          </ThemedText>
        </View>
        <View style={[styles.check, nearby ? { backgroundColor: theme.brand } : { borderWidth: 1.5, borderColor: theme.radioRing }]}>
          {nearby && <Icon name="check" size={14} color="textOnBrand" strokeWidth={2.5} />}
        </View>
      </Tappable>

      <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header">
        Or share the link
      </ThemedText>
      <View style={styles.share}>
        <ShareOption art="whatsapp" label="WhatsApp" onPress={whatsApp} />
        <ShareOption art="copy" label={copied ? 'Copied' : 'Copy link'} onPress={copy} />
        <ShareOption art="more" label="More" onPress={share} />
      </View>

      <Button
        label="Send invites"
        flat
        disabled={!nearby}
        onPress={() => {
          feedback.play('button.primary');
          setSent(true);
        }}
      />
    </RouteSheet>
  );
}

function ShareOption({ art, label, onPress }: { art: ShareArtName; label: string; onPress: () => void }) {
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.option}>
      <ShareArt name={art} />
      <ThemedText type="filterLabelTight" accessibilityLiveRegion="polite">
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  // Figma lead copy on both sheets: 13 regular at 19.
  lead: {
    lineHeight: 19,
  },
  flex: {
    flex: 1,
  },
  centred: {
    textAlign: 'center',
  },
  nearby: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  faces: {
    flexDirection: 'row',
  },
  face: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 13,
  },
  overlap: {
    marginStart: -Spacing.two,
  },
  faceText: {
    fontFamily: Fonts.semiBold,
  },
  optionTitle: {
    lineHeight: 20,
  },
  check: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  share: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  done: {
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingTop: Spacing.two,
  },
  tickWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
