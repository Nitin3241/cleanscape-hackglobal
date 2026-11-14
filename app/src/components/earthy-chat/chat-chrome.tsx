import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { lensIconXml } from '@/constants/earthy-icons';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * The header every Earthy chat screen shares (handoff 5.3): Close (down chevron) on the left,
 * "Earthy" with a small orb in the middle, Full screen voice on the right. Earthy home shows
 * history instead of the title.
 */
/** Close goes back; opened straight from a link with nothing behind it, it goes to Home. */
const closeEarthy = () => (router.canGoBack() ? router.back() : router.replace('/home'));

export function ChatHeader({ home = false, onClose = closeEarthy }: { home?: boolean; onClose?: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <RoundButton icon="chevron-down" label="Close Earthy" onPress={onClose} outlined iconSize={24} />
      {home ? (
        <View style={styles.flex} />
      ) : (
        <View style={styles.title}>
          <EarthyOrb size={20} state="still" glow={false} />
          <ThemedText type="splashLine" accessibilityRole="header" style={styles.titleText}>
            Earthy
          </ThemedText>
        </View>
      )}
      {home ? (
        // Chat history isn't designed yet.
        <RoundButton icon="history" label="Chat history" outlined />
      ) : (
        <RoundButton icon="expand" label="Full screen voice" onPress={() => router.push('/earthy-voice')} outlined />
      )}
    </View>
  );
}

/** Space a scrolling thread leaves under its last item: the composer (56) sits 24 above the bottom, 16 clear of it (Figma: thread ends at y 704). */
export const composerClearance = (bottomInset: number) => Math.max(bottomInset, Spacing.four) + 56 + Spacing.three;

/**
 * The floating composer (handoff 5.3): +, "Ask Earthy", mic, lens, and the wave button for
 * full-screen voice. SAMPLE: typing isn't wired to a model; tapping the field asks the scripted
 * "Did you mean?" turn, as Figma's prototype does.
 */
export function ChatComposer({
  onAsk,
  elevated = false,
}: {
  onAsk: () => void;
  /** Figma F4·6: a soft shadow where the composer floats over a page. */ elevated?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.composerRow, { bottom: Math.max(insets.bottom, Spacing.four) }]} pointerEvents="box-none">
      <View
        style={[
          styles.composer,
          { backgroundColor: theme.card, borderColor: theme.strokeWeak },
          elevated && { boxShadow: Shadows.composer },
        ]}>
        <View style={styles.slot}>
          <Icon name="plus" size={20} color="textStrong" />
        </View>
        <Tappable accessibilityRole="button" accessibilityLabel="Ask Earthy" onPress={onAsk} style={styles.field}>
          <ThemedText type="hintTight" themeColor="textPlaceholder">
            Ask Earthy
          </ThemedText>
        </Tappable>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Talk to Earthy"
          onPress={() => router.push('/earthy-voice')}
          style={styles.slot}>
          <Icon name="mic" size={20} color="textStrong" />
        </Tappable>
        <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Earthy Lens: ask with the camera"
          onPress={() => router.push('/earthy-lens')}
          style={styles.slot}>
          <SvgXml xml={lensIconXml(theme.textStrong)} width={20} height={20} />
        </Tappable>
      </View>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Full screen voice"
        onPress={() => router.push('/earthy-voice')}
        style={[styles.wave, elevated && { borderRadius: 28, boxShadow: Shadows.composer }]}>
        <EarthyOrb size={56} state="still" glow={false} />
        <View style={styles.waveIcon} pointerEvents="none">
          <Icon name="audio-lines" size={22} color="textOnBrand" strokeWidth={2} />
        </View>
      </Tappable>
    </View>
  );
}

/** Thumbs up / down, copy and share under an answer (handoff 5.3). Figma: 18 px, 2 px lines, 18 apart. */
export function FeedbackRow({ onCopy, onShare }: { onCopy: () => void; onShare: () => void }) {
  return (
    <View style={styles.feedback}>
      {/* Rating answers isn't stored yet; the thumbs are shown as in Figma. */}
      <Icon name="thumbs-up" size={18} color="textWeak" strokeWidth={2} />
      <Icon name="thumbs-down" size={18} color="textWeak" strokeWidth={2} />
      <Tappable accessibilityRole="button" accessibilityLabel="Copy answer" hitSlop={8} onPress={onCopy}>
        <Icon name="copy" size={18} color="textWeak" strokeWidth={2} />
      </Tappable>
      <Tappable accessibilityRole="button" accessibilityLabel="Share answer" hitSlop={8} onPress={onShare}>
        <Icon name="share" size={18} color="textWeak" strokeWidth={2} />
      </Tappable>
    </View>
  );
}

/**
 * A suggestion row: text and a 16 px arrow. Figma: 14 regular, 10 above and below in an answer;
 * 15 regular, 11 above and below on Earthy home (`large`).
 */
export function SuggestionRow({
  label,
  onPress,
  disabled = false,
  large = false,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  large?: boolean;
}) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.suggestion, large && styles.suggestionLarge]}>
      <ThemedText type={large ? 'reasonTitleRegular' : 'hint'} style={styles.flex}>
        {label}
      </ThemedText>
      <Icon name="arrow-end" size={16} color="textWeak" />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  // Figma: 20 px orb, 6 gap, "Earthy" 16 medium at 1.45.
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 23,
  },
  // Figma composer row: x 16, y 720 (24 above the bottom), 10 gap.
  composerRow: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  // Figma composer (F9v2): 56 tall, white with a 1 px #E3E8EB edge, 6 / 8 padding, 36 px icon slots, 2 gap.
  composer: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingStart: Spacing.oneHalf,
    paddingEnd: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  slot: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 20,
  },
  wave: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveIcon: {
    position: 'absolute',
  },
  // Figma feedback row: 18 px icons, 18 apart.
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.twoHalf,
  },
  suggestionLarge: {
    paddingVertical: 11,
  },
});
