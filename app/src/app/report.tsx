import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { STATE_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { DETECTED, SCAN_MESSAGES, VOICE_NOTE } from '@/data/reports.sample';
import { useTheme } from '@/hooks/use-theme';
import { currentScene } from '@/state/reports';

const BEACH = require('@/assets/images/report-beach-camera.png');
/** DEMO: Earthy's framing tip shows briefly, then it "sees" the litter (R1·1a → R1·1). */
const COACH_FOR = 2000; // Figma R1·1a → R1·1: auto 2 s.
/** DEMO: the voice note "records" this long, then goes to review (R1·1c → R1·2). */
const LISTEN_FOR = 2500; // Figma R1·1c → R1·2: auto 2.5 s.

type Step = 'coach' | 'detected' | 'voice';

/**
 * R1·1 Report a dirty spot: point the camera, Earthy frames it, counts the litter and flags
 * hazards. The shutter goes to review; the Earthy button records a voice note.
 * SAMPLE: always Figma's Kite Beach photo; the scene changes with each report (see state/reports).
 */
export default function ReportRoute() {
  const [step, setStep] = useState<Step>('coach');
  const [scene] = useState(currentScene);
  const hazard = scene === 'hazard';

  const review = (withNote = false) =>
    router.replace({ pathname: '/report-review', params: { kind: scene, note: withNote ? '1' : '0' } });

  useEffect(() => {
    if (step === 'detected') return;
    const timer = setTimeout(
      () => (step === 'coach' ? setStep('detected') : router.replace({ pathname: '/report-review', params: { kind: scene, note: '1' } })),
      step === 'coach' ? COACH_FOR : LISTEN_FOR,
    );
    return () => clearTimeout(timer);
  }, [step, scene]);

  const tone = step === 'coach' ? 'alertBadge' : hazard ? 'accent' : 'textOnBrand';

  return (
    <Scanner feed={BEACH}>
      {step !== 'voice' && <Corners tone={tone} />}
      {step === 'coach' && (
        <View style={styles.chevrons} pointerEvents="none" aria-hidden>
          <Icon name="chevron-down" size={30} color="alertBadge" strokeWidth={2.5} />
          <View style={styles.chevronTwo}>
            <Icon name="chevron-down" size={30} color="alertBadge" strokeWidth={2.5} />
          </View>
        </View>
      )}
      {step === 'detected' && <Tags hazard={hazard} />}
      {step === 'voice' ? (
        <Voice />
      ) : (
        <Panel step={step} hazard={hazard} onShutter={() => review()} onVoice={() => setStep('voice')} />
      )}
    </Scanner>
  );
}

function Corners({ tone }: { tone: 'alertBadge' | 'accent' | 'textOnBrand' }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const color = theme[tone];
  return (
    <View style={[styles.corners, { top: insets.top + 148 }]} pointerEvents="none" aria-hidden>
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <View key={corner} style={[styles.corner, styles[corner], { borderColor: color }]} />
      ))}
    </View>
  );
}

function Tags({ hazard }: { hazard: boolean }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill} pointerEvents="none">
      {DETECTED.map((tag, index) => {
        const glass = hazard && index === 0;
        return (
          <View key={tag.label} style={[styles.tag, { top: tag.top, left: tag.left }]}>
            <View style={[styles.tagDot, { borderColor: theme.textOnBrand, backgroundColor: glass ? theme.metroRed : theme[tag.tone] }]} />
            <View style={[styles.tagLabel, { backgroundColor: glass ? theme.metroRed : theme.glassOnMap }]}>
              <ThemedText type="smallMedium" themeColor={glass ? 'textOnBrand' : 'textStrong'}>
                {glass ? 'Broken glass' : tag.label}
              </ThemedText>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

function Panel({ step, hazard, onShutter, onVoice }: { step: Step; hazard: boolean; onShutter: () => void; onVoice: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const message = step === 'coach' ? SCAN_MESSAGES.coach : hazard ? SCAN_MESSAGES.hazard : SCAN_MESSAGES.normal;
  return (
    <View style={[styles.panel, { bottom: Math.max(insets.bottom, Spacing.two) }]}>
      <Animated.View
        key={`${step}-${hazard}`}
        entering={FadeInDown.duration(Motion.transition.state.duration).easing(STATE_EASING)}
        accessibilityLiveRegion="polite"
        style={[styles.message, hazard && step === 'detected' && { backgroundColor: 'rgba(217, 71, 59, 0.85)' }]}>
        {step === 'coach' ? (
          <View style={[styles.messageIcon, { backgroundColor: theme.alertBadge }]}>
            <Icon name="arrow-up" size={16} color="textStrong" strokeWidth={2.5} />
          </View>
        ) : hazard ? (
          <View style={[styles.messageIcon, { backgroundColor: theme.textAccent }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand">
              !
            </ThemedText>
          </View>
        ) : (
          <EarthyOrb size={28} state="still" glow={false} />
        )}
        <View style={styles.flex}>
          <ThemedText type="label" themeColor="textOnBrand">
            {message.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textOnBrandWeak">
            {message.note}
          </ThemedText>
        </View>
        {step === 'detected' && !hazard && (
          <View style={[styles.ready, { backgroundColor: 'rgba(30, 122, 70, 0.35)' }]}>
            <View style={[styles.readyDot, { backgroundColor: theme.unreadDot }]} />
            <ThemedText type="small" themeColor="textOnBrand">
              Ready
            </ThemedText>
          </View>
        )}
      </Animated.View>
      <View style={styles.controls}>
        {/* Picking a photo from the library isn't designed yet. */}
        <View style={styles.thumb}>
          <Image source={BEACH} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        </View>
        <Tappable accessibilityRole="button" accessibilityLabel="Take photo" onPress={onShutter} style={styles.shutter}>
          <View style={styles.shutterInner} />
        </Tappable>
        <Tappable accessibilityRole="button" accessibilityLabel="Add a voice note" accessibilityHint="Earthy listens and adds what you say" onPress={onVoice} style={styles.orbButton}>
          <EarthyOrb size={30} state="still" glow={false} />
        </Tappable>
      </View>
    </View>
  );
}

function Voice() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(1);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Animated.View entering={FadeIn.duration(240)} style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)', '#FFFFFF', '#F3F8FA']}
        locations={[0, 0.3, 0.55, 1]}
        style={[styles.voice, { paddingBottom: insets.bottom + Spacing.five }]}>
        <EarthyOrb size={48} state="listening" glow={false} />
        <ThemedText type="screenTitle" style={styles.center} accessibilityLiveRegion="polite">
          {VOICE_NOTE}
        </ThemedText>
        <ThemedText type="caption" themeColor="textWeak">{`0:0${Math.min(seconds, 9)} · Listening in English`}</ThemedText>
        <ThemedText type="note" themeColor="textWeak" style={styles.release}>
          {/* DEMO: it adds the note on its own after a few seconds. */}
          Adding your note…
        </ThemedText>
        <View style={styles.wave} aria-hidden>
          {Array.from({ length: 28 }, (_, index) => (
            <View key={index} style={[styles.waveBar, { height: 6 + ((index * 37) % 22), backgroundColor: theme.brand }]} />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  corners: {
    position: 'absolute',
    start: 30,
    end: 30,
    height: 330,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  chevrons: {
    position: 'absolute',
    top: 476,
    alignSelf: 'center',
    alignItems: 'center',
  },
  chevronTwo: {
    marginTop: -20,
  },
  tag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  tagDot: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 6,
  },
  tagLabel: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.small,
  },
  panel: {
    position: 'absolute',
    start: Spacing.twoHalf,
    end: Spacing.twoHalf,
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.panel,
    backgroundColor: 'rgba(11, 26, 32, 0.45)',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    marginHorizontal: -Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.option,
  },
  messageIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  flex: {
    flex: 1,
  },
  ready: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.small,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  thumb: {
    width: 44,
    height: 44,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: Radius.control,
  },
  shutter: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 40,
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  orbButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 22,
  },
  voice: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  center: {
    textAlign: 'center',
  },
  release: {
    marginTop: Spacing.four,
  },
  wave: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
});
