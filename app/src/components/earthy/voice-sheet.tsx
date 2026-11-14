import type BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, RadialGradient, Stop, SvgXml } from 'react-native-svg';

import { VoiceMic } from '@/components/ask-earthy/voice-mic';
import { EarthyOrb, type OrbState } from '@/components/earthy/earthy-orb';
import { LanguageToggle, type VoiceLanguage } from '@/components/earthy/language-toggle';
import { dur, ease, pop } from '@/components/earthy/motion';
import { StreamingText } from '@/components/earthy/streaming-text';
import { ThinkingSteps, type ThinkingStep } from '@/components/earthy/thinking-steps';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { DirectionView } from '@/components/ui/direction-view';
import { Icon, type IconName } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { Toast } from '@/components/ui/toast';
import { listBeachXml } from '@/constants/events-art';
import { Fonts, Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { LIVE_TIMING, LIVE_TURN } from '@/data/earthy.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

type Phase = 'listening' | 'thinking' | 'speaking';

const QUICK_SHARE = 0.62;
const HANDLE = 24;
const ORB = 180;
const ORB_BOX = ORB * 1.8;
const HEARD = LIVE_TURN.question.split(' ');
const NOTICE_TIME = 2400;

type VoiceSheetProps = {
  /** Called once the sheet has fully closed. */
  onClose: () => void;
  /** Book on the answer card. */
  onBook: (eventId: string) => void;
  /** Open straight in the full-screen layout (F9v2·2), as the chat screens' Full screen button does. */
  startFullScreen?: boolean;
  /** Show or Type when the sheet is its own route: replace it rather than close it and push. */
  onLeave?: (path: '/earthy' | '/earthy-lens') => void;
};

/**
 * Talking to Earthy (F9v2·0, 2, 2a, 2b) in ONE bottom sheet. It opens at 62% already listening.
 * Full screen, or the start of thinking, snaps it to 100%. The two layouts crossfade with the
 * sheet's position while the orb scales and moves, so there is no new screen and no grey flash.
 * SAMPLE: the conversation is scripted and no audio is recorded.
 */
export function VoiceSheet({ onClose, onBook, startFullScreen = false, onLeave }: VoiceSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const sheet = useRef<BottomSheet>(null);
  // A stable list: a new array each render makes the sheet re-snap.
  const snapPoints = useMemo(() => [Math.round(height * QUICK_SHARE), height], [height]);
  const position = useSharedValue(0);
  const [expanded, setExpanded] = useState(false);
  const [phase, setPhase] = useState<Phase>('listening');
  const [heard, setHeard] = useState(0);
  const [stepsDone, setStepsDone] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [language, setLanguage] = useState<VoiceLanguage>('en');
  const [notice, setNotice] = useState<string | null>(null);

  // Mount closed, then open once the sheet has measured itself: opening on mount doesn't animate reliably.
  useEffect(() => {
    feedback.play('voice.open');
    const timer = setTimeout(() => sheet.current?.snapToIndex(startFullScreen ? 1 : 0), 120);
    return () => clearTimeout(timer);
    // Runs once on open; startFullScreen is fixed for the sheet's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The scripted turn moves itself along. Muting pauses the listening part.
  useEffect(() => {
    if (phase === 'listening' && !muted) {
      if (heard < HEARD.length) {
        const timer = setTimeout(() => setHeard((count) => count + 1), LIVE_TIMING.heardWord);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase('thinking'), LIVE_TIMING.afterHeard);
      return () => clearTimeout(timer);
    }
    if (phase === 'thinking') {
      if (stepsDone < LIVE_TURN.steps.length) {
        const timer = setTimeout(() => setStepsDone((count) => count + 1), stepsDone === 0 ? 200 : LIVE_TIMING.step);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase('speaking'), LIVE_TIMING.afterSteps);
      return () => clearTimeout(timer);
    }
  }, [phase, heard, stepsDone, muted]);

  // The answer needs the room, so thinking opens the full layout.
  useEffect(() => {
    if (phase === 'thinking' && !expanded) sheet.current?.snapToIndex(1);
    // Only when thinking starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_TIME);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (expanded) sheet.current?.snapToIndex(0);
      else sheet.current?.close();
      return true;
    });
    return () => subscription.remove();
  }, [expanded]);

  function close() {
    sheet.current?.close();
  }

  // Leaving for the chat or the camera closes the sheet first, so it isn't left open behind.
  function leaveTo(path: '/earthy' | '/earthy-lens') {
    if (onLeave) {
      onLeave(path);
      return;
    }
    close();
    router.push(path);
  }

  function interrupt() {
    setHeard(0);
    setStepsDone(0);
    setAnswered(false);
    setPhase('listening');
  }

  // Where the orb sits in the full layout for each phase, in sheet content coordinates.
  const fullTop = insets.top - HANDLE;
  const orbTarget = {
    listening: { y: fullTop + 200, scale: 1 },
    thinking: { y: fullTop + 180, scale: 140 / ORB },
    speaking: { y: fullTop + 96, scale: 64 / ORB },
  }[phase];
  const fullY = useSharedValue(orbTarget.y);
  const fullScale = useSharedValue(orbTarget.scale);
  useEffect(() => {
    const timing = { duration: reducedMotion ? 0 : 450, easing: ease };
    fullY.set(withTiming(orbTarget.y, timing));
    fullScale.set(withTiming(orbTarget.scale, timing));
  }, [fullScale, fullY, orbTarget.scale, orbTarget.y, reducedMotion]);

  const QUICK_Y = 80;
  const QUICK_SCALE = 96 / ORB;
  const orbStyle = useAnimatedStyle(() => {
    const open = Math.min(1, Math.max(0, position.get()));
    return {
      transform: [
        { translateY: QUICK_Y + (fullY.get() - QUICK_Y) * open },
        { scale: QUICK_SCALE + (fullScale.get() - QUICK_SCALE) * open },
      ],
    };
  });
  const quickStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, 1 - position.get() * 2)) }));
  const fullStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, position.get() * 2 - 1)) }));

  const orbState: OrbState = muted ? 'still' : phase;
  const steps: ThinkingStep[] = LIVE_TURN.steps
    .slice(0, Math.min(stepsDone + 1, LIVE_TURN.steps.length))
    .map((label, index) => ({ id: String(index), label, status: index < stepsDone ? 'done' : 'active' }));
  const quickFooterTop = height * QUICK_SHARE - HANDLE - 56;

  return (
    <Sheet
      ref={sheet}
      snapPoints={snapPoints}
      index={-1}
      animatedIndex={position}
      onChange={(index) => setExpanded(index === 1)}
      onClose={() => {
        feedback.play('voice.close');
        onClose();
      }}>
      {/* Every layer is positioned absolutely, so the content needs a real height. */}
      {/* Earthy's voice copy is English for now, so the sheet stays left to right. */}
      <DirectionView direction="ltr" style={{ height: height - HANDLE }} accessibilityViewIsModal>
        {/* Full layout: listening, thinking and speaking with the call controls. */}
        <Animated.View pointerEvents={expanded ? 'box-none' : 'none'} style={[StyleSheet.absoluteFill, fullStyle]}>
          <BottomGlow height={height} />
          {phase === 'speaking' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Interrupt Earthy"
              onPress={interrupt}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={[styles.topBar, { top: Math.max(Spacing.two, fullTop + Spacing.three) }]}>
            <View style={[styles.languagePill, { backgroundColor: theme.wellCool }]}>
              <ThemedText type="small" accessibilityLabel="Language: English or Arabic, detected automatically">
                EN · ع auto
              </ThemedText>
            </View>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Close voice"
              onPress={close}
              style={[styles.round, { backgroundColor: theme.wellCool }]}>
              <Icon name="close" size={20} color="textStrong" />
            </Tappable>
          </View>

          <View
            pointerEvents="box-none"
            style={[styles.fullContent, { top: fullTop + (phase === 'speaking' ? 150 : 300) }]}>
            {phase === 'listening' && (
              <Fade key="listening" align="center">
                <Status color="statusSuccess" label={muted ? 'Muted' : 'Listening'} />
                <Words shown={heard} type="heading" />
              </Fade>
            )}
            {phase === 'thinking' && (
              <Fade key="thinking" align="center">
                <Status color="secondary" label="Thinking" />
                <ThemedText type="wheel" themeColor="textWeak" style={styles.centred}>
                  {LIVE_TURN.question}
                </ThemedText>
                <View style={styles.steps}>
                  <ThinkingSteps steps={steps} />
                </View>
              </Fade>
            )}
            {phase === 'speaking' && (
              <Fade key="speaking" align="start">
                <Status color="brand" label="Earthy is speaking" />
                <StreamingText
                  text={LIVE_TURN.answer}
                  msPerWord={LIVE_TIMING.spokenWord}
                  style={{ fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 28, color: theme.textStrong }}
                  onDone={() => {
                    setAnswered(true);
                    feedback.play('voice.results');
                  }}
                />
                {answered && (
                  <>
                    <ResultCard onBook={() => onBook(LIVE_TURN.result.eventId)} />
                    <ThemedText type="small" themeColor="textWeak" style={[styles.centred, styles.interruptHint]}>
                      Tap anywhere to interrupt
                    </ThemedText>
                  </>
                )}
              </Fade>
            )}
          </View>

          <View style={[styles.controls, { bottom: insets.bottom + Spacing.three }]}>
            <View style={styles.controlRow}>
              <Control
                icon={muted ? 'mic' : 'mic-off'}
                label={muted ? 'Unmute' : 'Mute'}
                onPress={() => setMuted((value) => !value)}
              />
              <Control icon="scan-eye" label="Show" onPress={() => leaveTo('/earthy-lens')} />
              <Control icon="keyboard" label="Type" onPress={() => leaveTo('/earthy')} />
              <Control icon="close" label="End" tone="endCall" onPress={close} />
            </View>
            <ThemedText type="small" themeColor="textWeak" style={styles.centred}>
              Earthy can make mistakes. Check event details.
            </ThemedText>
          </View>
        </Animated.View>

        {/* Quick layout: the 62% sheet from the Home button. */}
        <Animated.View pointerEvents={expanded ? 'none' : 'box-none'} style={[StyleSheet.absoluteFill, quickStyle]}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Full screen voice"
            onPress={() => sheet.current?.snapToIndex(1)}
            style={[styles.fullScreen, { backgroundColor: theme.fill }]}>
            <Icon name="expand" size={14} color="brand" />
            <ThemedText type="small" themeColor="brand">
              Full screen
            </ThemedText>
          </Tappable>
          <Tappable accessibilityRole="button" accessibilityLabel="Close" hitSlop={12} onPress={close} style={styles.quickClose}>
            <Icon name="close" size={20} color="textWeak" />
          </Tappable>

          <View style={styles.quickCopy}>
            <Status color="statusSuccess" label={muted ? 'Muted' : 'Listening'} />
            <Words shown={heard} type="transcript" />
          </View>

          <View style={styles.quickMic}>
            <VoiceMic
              state={phase === 'listening' && !muted ? 'listening' : 'done'}
              accessibilityLabel="Stop listening"
              onPress={() => setHeard(HEARD.length)}
            />
          </View>
          <ThemedText type="caption" themeColor="textWeak" style={styles.quickHint}>
            Tap to stop
          </ThemedText>

          <View style={[styles.quickFooter, { top: quickFooterTop }]}>
            <TextButton label="Type instead" onPress={() => leaveTo('/earthy')} />
            <LanguageToggle value={language} onChange={setLanguage} />
          </View>
        </Animated.View>

        {/* One orb for both layouts. It moves and scales with the sheet. */}
        <Animated.View pointerEvents="none" style={[styles.orb, { left: width / 2 - ORB_BOX / 2 }, orbStyle]}>
          <EarthyOrb state={orbState} size={ORB} />
        </Animated.View>

        {notice && (
          <View pointerEvents="none" style={[styles.notice, { top: expanded ? height - insets.bottom - 240 : quickFooterTop - 64 }]}>
            <Toast text={notice} />
          </View>
        )}
      </DirectionView>
    </Sheet>
  );
}

function Fade({ align, children }: { align: 'center' | 'start'; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const appear = useSharedValue(0);
  useEffect(() => {
    appear.set(withTiming(1, { duration: dur.base, easing: ease }));
  }, [appear]);
  const style = useAnimatedStyle(() => ({
    opacity: appear.get(),
    transform: [{ translateY: reducedMotion ? 0 : (1 - appear.get()) * 8 }],
  }));
  return (
    <Animated.View pointerEvents="box-none" style={[styles.phase, align === 'start' && styles.phaseStart, style]}>
      {children}
    </Animated.View>
  );
}

function Status({ color, label }: { color: ThemeColor; label: string }) {
  const theme = useTheme();
  return (
    <View style={styles.status} accessibilityLiveRegion="polite">
      <View style={[styles.dot, { backgroundColor: theme[color] }]} />
      <ThemedText type="hint" themeColor="textWeak">
        {label}
      </ThemedText>
    </View>
  );
}

/** Words heard so far are dark. The rest of the sentence waits in grey. */
function Words({ shown, type }: { shown: number; type: 'heading' | 'transcript' }) {
  const theme = useTheme();
  const said = HEARD.slice(0, shown).join(' ');
  const rest = HEARD.slice(shown).join(' ');
  return (
    <ThemedText type={type} accessibilityLabel={said} style={styles.words}>
      <ThemedText type={type}>{said}</ThemedText>
      <ThemedText type={type} style={{ color: theme.seatEmpty }}>
        {shown > 0 && rest ? ` ${rest}` : rest}
      </ThemedText>
    </ThemedText>
  );
}

/** The answer's one result card. It pops in after the last word. */
function ResultCard({ onBook }: { onBook: () => void }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const appear = useSharedValue(0);
  useEffect(() => {
    appear.set(withDelay(LIVE_TIMING.cardAfterAnswer, withTiming(1, { duration: 550, easing: pop })));
  }, [appear]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(appear.get(), 1),
    transform: [{ scale: reducedMotion ? 1 : 0.8 + 0.2 * appear.get() }],
  }));

  return (
    <Animated.View style={[styles.card, style]}>
      <Card padding={Spacing.twoThreeQuarters} style={styles.cardRow}>
        <View style={styles.thumb}>
          <SvgXml xml={listBeachXml} width={104} height={56} style={styles.thumbArt} />
        </View>
        <View style={styles.cardText}>
          <ThemedText type="labelLarge" numberOfLines={1}>
            {LIVE_TURN.result.title}
          </ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
            {LIVE_TURN.result.when}
          </ThemedText>
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`Book ${LIVE_TURN.result.title}`}
          onPress={onBook}
          style={[styles.book, { backgroundColor: theme.brand }]}>
          <ThemedText type="label" themeColor="textOnBrand">
            Book
          </ThemedText>
        </Tappable>
      </Card>
    </Animated.View>
  );
}

function Control({ icon, label, tone, onPress }: { icon: IconName; label: string; tone?: ThemeColor; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.control}>
      <View style={[styles.controlCircle, { backgroundColor: tone ? theme[tone] : theme.wellCool }]}>
        <Icon name={icon} size={22} color={tone ? 'textOnBrand' : 'textStrong'} strokeWidth={1.75} />
      </View>
      <ThemedText type="small">{label}</ThemedText>
    </Tappable>
  );
}

/** Soft marigold and sea light behind the controls, from the Figma frames. */
function BottomGlow({ height }: { height: number }) {
  return (
    <Svg width="100%" height={260} style={[styles.bottomGlow, { top: height - 420 }]} pointerEvents="none">
      <Defs>
        <RadialGradient id="voiceGlowSun" cx="50%" cy="45%" rx="60%" ry="40%">
          <Stop offset="0" stopColor="#FFC94D" stopOpacity={0.28} />
          <Stop offset="1" stopColor="#FFC94D" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="voiceGlowSea" cx="50%" cy="58%" rx="30%" ry="18%">
          <Stop offset="0" stopColor="#5FB3C9" stopOpacity={0.28} />
          <Stop offset="1" stopColor="#5FB3C9" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx="50%" cy="45%" rx="70%" ry="40%" fill="url(#voiceGlowSun)" />
      <Ellipse cx="50%" cy="58%" rx="40%" ry="20%" fill="url(#voiceGlowSea)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    top: -ORB_BOX / 2,
    width: ORB_BOX,
    height: ORB_BOX,
  },
  // Quick layout, from F9v2·0.
  fullScreen: {
    position: 'absolute',
    top: Spacing.one,
    start: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  quickClose: {
    position: 'absolute',
    top: Spacing.two,
    end: 22,
  },
  quickCopy: {
    position: 'absolute',
    top: 136,
    start: 30,
    end: 30,
    alignItems: 'center',
    gap: Spacing.half,
  },
  quickMic: {
    position: 'absolute',
    top: 220,
    start: 0,
    end: 0,
    alignItems: 'center',
  },
  quickHint: {
    position: 'absolute',
    top: 364,
    start: 30,
    end: 30,
    textAlign: 'center',
  },
  quickFooter: {
    position: 'absolute',
    start: Spacing.four,
    end: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Full layout, from F9v2·2, 2a and 2b.
  topBar: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languagePill: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  round: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  fullContent: {
    position: 'absolute',
    start: Spacing.threeHalf,
    end: Spacing.threeHalf,
  },
  phase: {
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  phaseStart: {
    alignItems: 'stretch',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  words: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  centred: {
    textAlign: 'center',
  },
  steps: {
    alignSelf: 'stretch',
    marginTop: Spacing.three,
  },
  card: {
    marginTop: Spacing.four,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  thumb: {
    width: 52,
    height: 52,
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  thumbArt: {
    marginStart: -26,
  },
  cardText: {
    flex: 1,
    gap: Spacing.half,
  },
  book: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  interruptHint: {
    marginTop: Spacing.three,
  },
  controls: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    gap: Spacing.four,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  control: {
    alignItems: 'center',
    gap: Spacing.two,
    minWidth: 64,
  },
  controlCircle: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  bottomGlow: {
    position: 'absolute',
    start: 0,
    end: 0,
  },
  notice: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
});
