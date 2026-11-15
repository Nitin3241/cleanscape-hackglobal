import { Asset } from 'expo-asset';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInDown,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { GlassButton } from '@/components/ui/glass-button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { SHEET_EASING } from '@/constants/motion';
import { floatingSheetEdge } from '@/constants/sheet-edge';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { earthyVoiceUrl, scanItem, type SeenItem } from '@/services/earthy-api';
import { setAudioModeAsync, useAudioPlayer } from '@/services/earthy-audio';

type Step = 'aim' | 'looking' | 'result' | 'failed';

// Where the item goes: the panel's colour, icon and one plain line on what that bin is for.
const BIN = {
  green: { label: 'Green bin', note: 'Clean, dry recycling', icon: 'recycle', fill: 'statusSuccessSubtle', ink: 'statusSuccess' },
  black: { label: 'Black bin', note: 'General waste', icon: 'trash', fill: 'tileNeutral', ink: 'textStrong' },
  'drop-off': { label: 'Drop-off point', note: 'Not for the bins at home', icon: 'pin', fill: 'secondarySubtle', ink: 'textSecondary' },
  unknown: { label: 'Not sure yet', note: 'Check the label on the bin', icon: 'help', fill: 'tileNeutral', ink: 'textWeak' },
} as const;
// What Earthy is doing while it looks. The rows tick over on a timer; the last one waits for the answer.
const STAGES = ['Spotting the item', 'Checking Dubai’s sorting rules', 'Picking the bin'] as const;
const STAGE_TIME = 900;
const SWEEP_TIME = 1400;
const SWEEP_BAND = 96;
const BRACKET = 28;

// "Pre-loaded" items, like the pre-written questions on Earthy's home: with nothing to hand, tap one and the
// same model looks at that photo and answers for real. The photos are Figma's sample shots.
const SAMPLES = [
  { name: 'Pizza box', photo: require('@/assets/images/scan-pizza-camera.png') },
  { name: 'Bottle', photo: require('@/assets/images/lens-bottle-camera.png') },
] as const;

/**
 * Show Earthy an item (built for HackGlobal 2026): a live camera with a frame to fit the item in and one
 * shutter button. Earthy looks at the photo and the result rises over it: what the item is, which bin, a tip,
 * read aloud in Earthy's voice. "Scan another" goes back to the camera.
 *
 * Screen spec
 * - Purpose: answer "where does this go?" for a real item in the person's hand.
 * - Behaviour: aim → looking → result, or an honest failure with "Try again". Nothing is guessed.
 * - Privacy: the photo goes to the Earthy server for this one answer and is not stored, on the phone or the server.
 * - Accessibility: every control is labelled; the result is announced; the hint and result are text, not colour alone.
 * - Edge cases: camera permission refused (explains, links to Settings), server unreachable, item not recognised.
 */
export default function EarthyShowRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [step, setStep] = useState<Step>('aim');
  const [torch, setTorch] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [seen, setSeen] = useState<SeenItem | null>(null);
  const player = useAudioPlayer();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const sweep = useSharedValue(0);
  // Cancels an answer or a voice that arrives after "Scan another" or after leaving.
  const turn = useRef(0);

  // Ask for the camera once when the screen opens. Asking again is the "Allow camera" button's job: a browser
  // that has been told no answers at once every time, and asking in a loop would never stop.
  const asked = useRef(false);
  useEffect(() => {
    if (asked.current) return;
    if (permission && !permission.granted && permission.canAskAgain) {
      asked.current = true;
      requestPermission();
    }
    if (permission) return;
    // Some browsers can't say whether the camera is allowed until it is asked for. Ask, so the screen isn't left empty.
    const timer = setTimeout(() => {
      if (asked.current) return;
      asked.current = true;
      requestPermission();
    }, 1500);
    return () => clearTimeout(timer);
  }, [permission, requestPermission]);

  // While Earthy looks: the rows tick over and a band of light sweeps the frame, so the wait reads as work.
  useEffect(() => {
    if (step !== 'looking') return;
    setStage(0);
    const timers = [1, 2].map((next) => setTimeout(() => setStage(next), next * STAGE_TIME));
    if (!reduceMotion && frameHeight > 0) {
      sweep.value = 0;
      sweep.value = withRepeat(withTiming(1, { duration: SWEEP_TIME, easing: Easing.inOut(Easing.ease) }), -1, true);
    }
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimation(sweep);
    };
  }, [step, reduceMotion, frameHeight, sweep]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sweep.value * Math.max(frameHeight - SWEEP_BAND, 0) }],
  }));

  function hush() {
    Speech.stop();
    try {
      player.pause();
    } catch {
      // The player may already be gone when the screen closes.
    }
  }

  useEffect(
    () => () => {
      turn.current += 1;
      Speech.stop();
    },
    [],
  );

  /** Reads the result aloud: Earthy's own voice from the server, or the phone's voice if that fails. */
  async function speak(text: string, id: number) {
    try {
      const url = await earthyVoiceUrl(text);
      if (id !== turn.current) return;
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      player.replace({ uri: url });
      // Wait for the clip to load before playing: a play() sent too early is dropped and nothing is heard.
      for (let waited = 0; !player.isLoaded && waited < 6000; waited += 100) {
        await new Promise((done) => setTimeout(done, 100));
        if (id !== turn.current) return;
      }
      if (!player.isLoaded) throw new Error('The voice clip did not load');
      player.volume = 1;
      player.play();
    } catch {
      if (id === turn.current) Speech.speak(text, { language: 'en-US' });
    }
  }

  /** Shows a photo in the frame and asks Earthy about it. `getUri` takes the shot or loads a sample. */
  async function look(getUri: () => Promise<string>) {
    if (step !== 'aim') return;
    const id = ++turn.current;
    feedback.play('button.primary');
    try {
      const uri = await getUri();
      if (id !== turn.current) return;
      setPhoto(uri);
      setTorch(false);
      setStep('looking');
      const result = await scanItem(uri);
      if (id !== turn.current) return;
      setSeen(result);
      setStep('result');
      speak(result.reply, id);
    } catch {
      if (id === turn.current) setStep('failed');
    }
  }

  const capture = () =>
    look(async () => {
      if (!camera.current) throw new Error('The camera is not ready');
      // JPEG everywhere: a browser would otherwise hand over a PNG several times the size.
      return (await camera.current.takePictureAsync({ quality: 0.4, imageType: 'jpg' })).uri;
    });

  const trySample = (photo: number) =>
    look(async () => {
      const asset = await Asset.fromModule(photo).downloadAsync();
      if (!asset.localUri) throw new Error('The sample could not be loaded');
      return asset.localUri;
    });

  function again() {
    turn.current += 1;
    hush();
    setPhoto(null);
    setSeen(null);
    setStep('aim');
  }

  const close = () => {
    hush();
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  const allowed = permission?.granted === true;
  const bin = BIN[seen?.bin ?? 'unknown'];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {allowed && !photo && <CameraView ref={camera} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />}
      {photo && <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />}
      {/* Shade behind the top controls and the shutter, so they read on any scene. */}
      <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']} style={styles.topShade} pointerEvents="none" />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']} style={styles.bottomShade} pointerEvents="none" />

      <View style={[styles.top, { paddingTop: insets.top + Spacing.two }]}>
        <GlassButton icon="close" label="Close" surface="art" onPress={close} />
        {step === 'aim' && allowed && Platform.OS !== 'web' && (
          <GlassButton icon="flash" label={torch ? 'Turn the light off' : 'Turn the light on'} surface={torch ? 'light' : 'art'} onPress={() => setTorch((on) => !on)} />
        )}
      </View>

      {/* Four corners mark where to hold the item. They stay on the photo while Earthy looks, with the sweep. */}
      {((step === 'aim' && allowed) || step === 'looking') && (
        <View
          style={styles.frame}
          pointerEvents="none"
          aria-hidden
          onLayout={(event) => setFrameHeight(event.nativeEvent.layout.height)}>
          {step === 'looking' && !reduceMotion && (
            <View style={styles.sweepClip}>
              <Animated.View style={[styles.sweep, sweepStyle]}>
                <LinearGradient
                  colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.sweepLine} />
              </Animated.View>
            </View>
          )}
          <View style={[styles.corner, styles.topStart]} />
          <View style={[styles.corner, styles.topEnd]} />
          <View style={[styles.corner, styles.bottomStart]} />
          <View style={[styles.corner, styles.bottomEnd]} />
        </View>
      )}

      {step === 'aim' && allowed && (
        <>
          <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, Spacing.four) }]}>
            <View style={[styles.hint, { backgroundColor: theme.card }]}>
              <EarthyOrb size={20} state="still" glow={false} />
              <ThemedText type="fieldLabel">Fit one item in the frame</ThemedText>
            </View>
            {/* The shutter in the middle, a sample on each side: nothing to hand still gets a real answer. */}
            <View style={styles.shutterRow}>
              <Sample name={SAMPLES[0].name} photo={SAMPLES[0].photo} onPress={() => trySample(SAMPLES[0].photo)} />
              <Tappable accessibilityRole="button" accessibilityLabel="Take the photo" onPress={capture} style={styles.shutter}>
                <View style={styles.shutterCore} />
              </Tappable>
              <Sample name={SAMPLES[1].name} photo={SAMPLES[1].photo} onPress={() => trySample(SAMPLES[1].photo)} />
            </View>
            <ThemedText type="caption" style={styles.onPhoto}>
              Nothing to hand? Tap a sample
            </ThemedText>
          </View>
        </>
      )}

      {permission && !allowed && step === 'aim' && (
        <View style={styles.centre}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <ThemedText type="sheetTitle" accessibilityRole="header">
              Earthy needs the camera
            </ThemedText>
            <ThemedText type="hint" themeColor="textWeak">
              To see the item you’re holding, allow the camera for this app. The photo is used once and not kept.
            </ThemedText>
            <Button
              label="Allow camera"
              pill
              flat
              onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
            />
            {/* Without the camera the scan can still be tried: Earthy looks at one of the sample photos. */}
            <ThemedText type="caption" themeColor="textWeak" style={styles.orSample}>
              Or let Earthy look at a sample photo
            </ThemedText>
            <View style={styles.actions}>
              {SAMPLES.map((sample) => (
                <View key={sample.name} style={styles.flex}>
                  <Button label={sample.name} variant="secondary" pill flat onPress={() => trySample(sample.photo)} />
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {step !== 'aim' && (
        <Animated.View
          entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
          style={[styles.sheet, { backgroundColor: theme.card }, floatingSheetEdge(insets.bottom)]}
          accessibilityLiveRegion="polite">
          <View style={[styles.grabber, { backgroundColor: theme.strokeControl }]} />
          {step === 'looking' && (
            <View style={styles.result}>
              <View style={styles.looking}>
                <EarthyOrb size={40} state="thinking" glow={false} />
                <View style={styles.flex}>
                  <ThemedText type="rowTitle" accessibilityRole="header">
                    Looking at your photo
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textWeak">
                    This takes a few seconds
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.stages, { backgroundColor: theme.tileNeutral }]}>
                {STAGES.map((label, index) => (
                  <View key={label} style={styles.stage}>
                    {index < stage ? (
                      <View style={[styles.stageMark, { backgroundColor: theme.statusSuccess }]}>
                        <Icon name="check" size={12} color="textOnBrand" strokeWidth={2.5} />
                      </View>
                    ) : index === stage ? (
                      <EarthyOrb size={20} state="thinking" glow={false} />
                    ) : (
                      <View style={[styles.stageMark, styles.stageWaiting, { borderColor: theme.strokeControl }]} />
                    )}
                    <ThemedText type={index === stage ? 'labelMedium14' : 'body14'} themeColor={index > stage ? 'textWeak' : 'textStrong'}>
                      {label}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
          {step === 'result' && seen && (
            <View style={styles.result}>
              {/* What Earthy saw: the photo it looked at, the item's name, and a button to hear the answer again. */}
              <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(200)} style={styles.head}>
                {photo && <Image source={{ uri: photo }} contentFit="cover" style={styles.thumb} accessible={false} />}
                <View style={styles.flex}>
                  <ThemedText type="sheetTitle" accessibilityRole="header" numberOfLines={2}>
                    {seen.item ? seen.item.charAt(0).toUpperCase() + seen.item.slice(1) : 'Earthy’s answer'}
                  </ThemedText>
                  <View style={styles.from}>
                    <EarthyOrb size={16} state="still" glow={false} />
                    <ThemedText type="chip" themeColor="textWeak">
                      Earthy looked at your photo
                    </ThemedText>
                  </View>
                </View>
                <Tappable
                  accessibilityRole="button"
                  accessibilityLabel="Hear the answer again"
                  onPress={() => {
                    hush();
                    speak(seen.reply, turn.current);
                  }}
                  style={[styles.hear, { backgroundColor: theme.fill }]}>
                  <Icon name="volume" size={20} color="brand" />
                </Tappable>
              </Animated.View>
              {/* The answer itself, biggest thing on the sheet: which bin, in colour, icon and words. */}
              <Animated.View
                entering={reduceMotion ? undefined : FadeInDown.delay(60).duration(240)}
                style={[styles.binPanel, { backgroundColor: theme[bin.fill] }]}>
                <View style={[styles.binIcon, { backgroundColor: theme.card }]}>
                  <Icon name={bin.icon} size={24} color={bin.ink} />
                </View>
                <View style={styles.flex}>
                  <ThemedText type="chip" themeColor={bin.ink}>
                    {seen.bin === 'unknown' ? 'Earthy says' : 'Goes in'}
                  </ThemedText>
                  <ThemedText type="sheetTitle" themeColor={bin.ink}>
                    {bin.label}
                  </ThemedText>
                  <ThemedText type="caption" themeColor={bin.ink}>
                    {bin.note}
                  </ThemedText>
                </View>
              </Animated.View>
              <Animated.View entering={reduceMotion ? undefined : FadeInDown.delay(120).duration(240)} style={styles.why}>
                <ThemedText type="body14">{seen.reply}</ThemedText>
                {seen.tip !== '' && (
                  <View style={[styles.tip, { borderColor: theme.strokeWeak }]}>
                    <View style={[styles.tipIcon, { backgroundColor: theme.secondarySubtle }]}>
                      <Icon name="info" size={16} color="textSecondary" />
                    </View>
                    <View style={styles.flex}>
                      <ThemedText type="labelSmall">Before you bin it</ThemedText>
                      <ThemedText type="hint" themeColor="textWeak">
                        {seen.tip}
                      </ThemedText>
                    </View>
                  </View>
                )}
                <ThemedText type="caption" themeColor="textWeak">
                  Earthy can make mistakes. Check the label on the bin.
                </ThemedText>
              </Animated.View>
              <View style={styles.actions}>
                <View style={styles.flex}>
                  <Button label="Scan another" variant="secondary" pill flat onPress={again} />
                </View>
                <View style={styles.flex}>
                  <Button label="Done" pill flat onPress={close} />
                </View>
              </View>
            </View>
          )}
          {step === 'failed' && (
            <View style={styles.result}>
              <ThemedText type="sheetTitle" accessibilityRole="header">
                Earthy couldn’t look
              </ThemedText>
              <ThemedText type="body14" themeColor="textWeak">
                I can’t reach Earthy’s server right now, so I won’t guess. Check your connection and try again.
              </ThemedText>
              <View style={styles.actions}>
                <View style={styles.flex}>
                  <Button label="Try again" pill flat onPress={again} />
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

/** A sample item beside the shutter: its photo in a 48 px tile with its name under it. */
function Sample({ name, photo, onPress }: { name: string; photo: number; onPress: () => void }) {
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={`Try a sample: ${name}`} onPress={onPress} style={styles.sample}>
      <Image source={photo} contentFit="cover" style={styles.sampleTile} accessible={false} />
      <ThemedText type="caption" style={styles.onPhoto} numberOfLines={1}>
        {name}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1A20',
  },
  flex: {
    flex: 1,
  },
  topShade: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    height: 160,
  },
  bottomShade: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    height: 280,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  // The frame: 32 px in from the sides, between the top controls and the shutter.
  frame: {
    position: 'absolute',
    top: '20%',
    bottom: '34%',
    start: Spacing.five,
    end: Spacing.five,
  },
  corner: {
    position: 'absolute',
    width: BRACKET,
    height: BRACKET,
    borderColor: '#FFFFFF',
  },
  topStart: { top: 0, start: 0, borderTopWidth: 3, borderStartWidth: 3, borderTopStartRadius: Radius.option },
  topEnd: { top: 0, end: 0, borderTopWidth: 3, borderEndWidth: 3, borderTopEndRadius: Radius.option },
  bottomStart: { bottom: 0, start: 0, borderBottomWidth: 3, borderStartWidth: 3, borderBottomStartRadius: Radius.option },
  bottomEnd: { bottom: 0, end: 0, borderBottomWidth: 3, borderEndWidth: 3, borderBottomEndRadius: Radius.option },
  bottom: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    alignItems: 'center',
    gap: Spacing.three,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  // 72 px ring with a white core: the one thing to press.
  shutter: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  shutterCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  onPhoto: {
    color: '#FFFFFF',
  },
  shutterRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  sample: {
    width: 80,
    alignItems: 'center',
    gap: Spacing.one,
  },
  sampleTile: {
    width: 48,
    height: 48,
    borderRadius: Radius.small,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  centre: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  orSample: {
    textAlign: 'center',
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.panel,
  },
  // Floating sheet: 8 px from the edges, 32 px corners, 16 px sides, grabber 10 px from the top.
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    paddingTop: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderRadius: 32,
    gap: Spacing.three,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  looking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  stages: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    minHeight: 21,
  },
  stageMark: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  stageWaiting: {
    borderWidth: 1.5,
  },
  // The sweep stays inside the frame: a soft band of light with a bright line through its middle.
  sweepClip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    overflow: 'hidden',
    borderRadius: Radius.option,
  },
  sweep: {
    height: SWEEP_BAND,
    justifyContent: 'center',
  },
  sweepLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  result: {
    gap: Spacing.three,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.small,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.one,
  },
  // 48 px target, the same round button used for Earthy's other controls.
  hear: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  binPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  binIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  why: {
    gap: Spacing.twoThreeQuarters,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  tipIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
});
