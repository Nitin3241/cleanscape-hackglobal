import type BottomSheet from '@gorhom/bottom-sheet';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from 'expo-audio';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { VoiceMic } from '@/components/ask-earthy/voice-mic';
import { EarthyOrb, type OrbState } from '@/components/earthy/earthy-orb';
import { LanguageToggle, type VoiceLanguage } from '@/components/earthy/language-toggle';
import { dur, ease, pop } from '@/components/earthy/motion';
import * as FileSystem from 'expo-file-system/legacy';

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
import { Fonts, Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { LIVE_TIMING, LIVE_TURN } from '@/data/earthy.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { askEarthy, type EarthyMessage, earthyIsLive, earthyVoiceUrl, lookEarthy, transcribeVoice } from '@/services/earthy-api';

type Phase = 'listening' | 'thinking' | 'speaking';

const QUICK_SHARE = 0.62;
const HANDLE = 24;
const ORB = 180;
const ORB_BOX = ORB * 1.8;
const HEARD = LIVE_TURN.question.split(' ');
const NOTICE_TIME = 2400;
// LIVE: what the thinking steps say while the server works, and how fast the answer's words appear
// so they roughly keep pace with the spoken voice.
const LIVE_STEPS = ['Hearing your question', 'Finding the answer'];
const PHOTO_STEPS = ['Looking at your photo'];
const LIVE_WORD_TIME = 280;
// LIVE highlight: Earthy's voice speaks about this many words a second; the highlight leads it by this many seconds.
const VOICE_WORDS_PER_SECOND = 3.2;
const HIGHLIGHT_LEAD = 0.2;
const LIVE_MAX_RECORDING = 15000;
// LIVE: Earthy answers by itself once you stop talking. The mic level is checked a few times a second;
// after speech has been heard, this much quiet ends the question. Levels are in dB (0 is the loudest).
// Speech needs far less than music quality: one channel at 16 kHz is a small file, quick to send and to read.
const LIVE_RECORDING = { ...RecordingPresets.HIGH_QUALITY, sampleRate: 16000, numberOfChannels: 1, bitRate: 32000, isMeteringEnabled: true };
const LEVEL_CHECK = 150;
const SPEECH_LEVEL = -50;
// Speech is at least this much louder than the room, in dB.
const SPEECH_RISE = 9;
// The room's level is the value this far up the sorted levels heard so far (0.35 = just below the middle).
const ROOM_SHARE = 0.35;
// A voice holds its level; a clink or a door doesn't. This many checks in a row must be loud to count as speech.
const SPEECH_CHECKS = 2;
// With no level reading from the microphone, listen this long and then send.
const NO_LEVEL_LISTEN = 6000;
const QUIET_TIME = 900;
// LIVE: a conversation, not single questions. When Earthy finishes speaking it listens again by itself.
// If nothing is said for this long, it stops listening and waits for a tap.
const FOLLOW_UP_WAIT = 7000;
const RECORD_FAILED = "I couldn't record that. Tap anywhere to try again.";
const SERVER_DOWN = "I can't reach Earthy's server right now, so I won't guess. Check your connection and try again.";
// Where each phase's words start below the full layout's top (F9v2·2 y 372, 2a y 300, 2b y 190).
// LIVE gives the orb more air: 32 px between it and "Thinking" (Figma's 6 let the orb's glow touch the label),
// and 24 px above "Earthy is speaking".
const LIVE_CONTENT_TOP: Record<Phase, number> = { listening: 328, thinking: 282, speaking: 152 };
const CONTENT_TOP: Record<Phase, number> = { listening: 328, thinking: 256, speaking: 146 };

type VoiceSheetProps = {
  /** Called once the sheet has fully closed. */
  onClose: () => void;
  /** Book on the answer card: Figma links it to F9v2·5, the chat's "next clean-up" thread. */
  onBook: (eventId: string) => void;
  /** Open straight in the full-screen layout (F9v2·2), as the chat screens' Full screen button does. */
  startFullScreen?: boolean;
  /** LIVE: a question already asked by tapping it. Earthy skips listening and answers it out loud. */
  ask?: string;
  /** Show or Type when the sheet is its own route: replace it rather than close it and push. */
  onLeave?: (path: '/earthy' | '/earthy-lens') => void;
};

/**
 * Talking to Earthy (F9v2·0, 2, 2a, 2b) in ONE bottom sheet. It opens at 62% already listening.
 * Full screen, or the start of thinking, snaps it to 100%. The two layouts crossfade with the
 * sheet's position while the orb scales and moves, so there is no new screen and no grey flash.
 * LIVE (EXPO_PUBLIC_EARTHY_API_URL set): the phone records the question, the server on Vultr turns it
 * into text and asks the model, and the phone reads the answer aloud with its built-in voice.
 * SAMPLE (no server address): the conversation is scripted and no audio is recorded.
 */
export function VoiceSheet({ onClose, onBook, startFullScreen = false, onLeave, ask }: VoiceSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const sheet = useRef<BottomSheet>(null);
  // A stable list: a new array each render makes the sheet re-snap.
  const snapPoints = useMemo(() => [Math.round(height * QUICK_SHARE), height], [height]);
  const position = useSharedValue(0);
  const [expanded, setExpanded] = useState(false);
  // A tapped question opens straight on Thinking: the mic never opens, so Listening is never shown for it.
  const [phase, setPhase] = useState<Phase>(earthyIsLive && ask ? 'thinking' : 'listening');
  const [heard, setHeard] = useState(0);
  const [stepsDone, setStepsDone] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [language, setLanguage] = useState<VoiceLanguage>('en');
  const [notice, setNotice] = useState<string | null>(null);
  // LIVE voice: one recorder for the sheet's life. `turn` cancels answers that arrive after a restart.
  const live = earthyIsLive;
  const recorder = useAudioRecorder(LIVE_RECORDING);
  // 0 to 1 mic level, so the orb moves with the speaker's voice.
  const micLevel = useSharedValue(0);
  const recording = useRef(false);
  const turn = useRef(0);
  // What has been said so far, so a follow-up ("and the lid?") is understood. Cleared when the sheet closes.
  const history = useRef<EarthyMessage[]>([]);
  // True when Earthy started listening by itself after an answer, and not because of a tap.
  const followUp = useRef(false);
  // True while answering a question that was tapped on Earthy home rather than spoken.
  const [tapped, setTapped] = useState(Boolean(earthyIsLive && ask));
  // The photo taken with Show, for the turn it belongs to.
  const [photo, setPhoto] = useState<string | null>(null);
  const [liveQuestion, setLiveQuestion] = useState(earthyIsLive && ask ? ask : '');
  const [liveAnswer, setLiveAnswer] = useState('');

  // Earthy's own voice (text to speech on Vultr) plays here. `afterVoice` runs once it has finished.
  const player = useAudioPlayer(null, { updateInterval: 100 });
  const playerStatus = useAudioPlayerStatus(player);
  const afterVoice = useRef<(() => void) | null>(null);
  // Backup for the end of the voice, in case the player doesn't report that it finished.
  const voiceEnd = useRef<ReturnType<typeof setTimeout> | null>(null);
  // How long each word of the answer takes to light up, so the words keep pace with the voice.
  const [wordTime, setWordTime] = useState(LIVE_WORD_TIME);
  // LIVE: how many words Earthy's voice has spoken, read from the player, so the highlight follows the voice.
  // `pace` holds the word counts of the clip(s); `undefined` means there is no clip and the clock is used.
  const [spoken, setSpoken] = useState<number | undefined>(undefined);
  const pace = useRef<{ first: number; total: number; rest: boolean } | null>(null);
  // For noticing the end of a clip from the player itself: it was playing, and now it has stopped.
  const wasPlaying = useRef(false);
  const stoppedFor = useRef(0);
  const stopCheck = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A second player for the rest of a long answer: it loads while the first sentence is being spoken, so
  // the voice carries straight on instead of pausing to fetch.
  const restPlayer = useAudioPlayer(null, { updateInterval: 100 });
  const restStatus = useAudioPlayerStatus(restPlayer);

  function voiceFinished() {
    if (voiceEnd.current) clearTimeout(voiceEnd.current);
    voiceEnd.current = null;
    if (stopCheck.current) clearTimeout(stopCheck.current);
    stopCheck.current = null;
    wasPlaying.current = false;
    const next = afterVoice.current;
    afterVoice.current = null;
    next?.();
  }

  /** Loads a sound into the player and waits until its length is known. Returns the length in seconds (0 if unknown). */
  async function loadVoice(url: string) {
    // Save the clip on the phone first, then play that copy. A saved clip has a known length and never stops
    // to wait for the network, which is what keeps the highlight and the voice together.
    let source = url;
    try {
      const saved = await FileSystem.downloadAsync(url, `${FileSystem.cacheDirectory}earthy-voice-${Date.now()}.mp3`);
      if (saved.status === 200) source = saved.uri;
    } catch {
      // Play it straight from the server instead.
    }
    player.replace({ uri: source });
    await new Promise((resolve) => setTimeout(resolve, 120));
    const started = Date.now();
    while (Date.now() - started < 4000) {
      if (player.isLoaded && player.duration > 0) return player.duration;
      // Loaded but no length after a second: carry on without it.
      if (player.isLoaded && Date.now() - started > 1000) return 0;
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    return 0;
  }

  function hush() {
    afterVoice.current = null;
    if (voiceEnd.current) clearTimeout(voiceEnd.current);
    voiceEnd.current = null;
    if (stopCheck.current) clearTimeout(stopCheck.current);
    stopCheck.current = null;
    wasPlaying.current = false;
    Speech.stop();
    try {
      player.pause();
      restPlayer.pause();
    } catch {
      // The player may already be gone when the sheet closes.
    }
  }

  /**
   * Reads a line aloud in Earthy's voice, or in the phone's own voice if the server's isn't available.
   * `ready` is a sound that was fetched ahead, so the words and the voice can start together; `null`
   * means go straight to the phone's voice (for example when the server itself is down).
   */
  async function say(text: string, language: 'en' | 'ar', then?: () => void, ready?: string | null, length = 0) {
    const id = turn.current;
    hush();
    try {
      if (ready === null) throw new Error('Use the phone voice');
      let seconds = length;
      if (ready === undefined) {
        const url = await earthyVoiceUrl(text);
        if (id !== turn.current) return;
        seconds = await loadVoice(url);
        if (id !== turn.current) return;
      }
      afterVoice.current = then ?? null;
      wasPlaying.current = false;
      stoppedFor.current = 0;
      player.play();
      // Last resort if the player never reports the end: the clip's length, or a generous guess from its words.
      const spokenWords = pace.current?.first ?? text.split(' ').length;
      voiceEnd.current = setTimeout(voiceFinished, seconds > 0 ? seconds * 1000 + 300 : (spokenWords / 1.5) * 1000 + 2500);
    } catch {
      if (id !== turn.current) return;
      const arabic = Platform.OS === 'ios' ? 'ar-001' : 'ar';
      Speech.speak(text, { language: language === 'ar' ? arabic : 'en-US', onDone: then });
    }
  }

  useEffect(() => {
    if (playerStatus.didJustFinish) voiceFinished();
    // Runs when the player reports the end of the sound.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerStatus.didJustFinish]);

  // While Earthy speaks, the players report where the voice is ten times a second. The highlight goes there.
  useEffect(() => {
    if (phase !== 'speaking') return;
    const clip = pace.current;
    if (!clip) return;
    const status = clip.rest ? restStatus : playerStatus;
    const words = clip.rest ? clip.total - clip.first : clip.first;
    const at = status.currentTime || 0;
    // Words per second: from the clip's real length when the player knows it, otherwise Earthy's usual pace.
    const rate = status.duration > 0 ? words / status.duration : VOICE_WORDS_PER_SECOND;
    // The highlight runs a touch ahead of the voice while it is speaking, and stops when the voice stops.
    const done = Math.min(words, (at + (status.playing ? HIGHLIGHT_LEAD : 0)) * rate);
    setSpoken((clip.rest ? clip.first : 0) + (at > 0 ? done : 0));
    // The end of the clip, seen from the player: it was playing and has now stopped.
    // A short stop in the middle is only the clip still arriving, so the end counts when the voice is at the
    // end of the clip, or has stayed stopped for most of a second.
    if (status.playing) {
      wasPlaying.current = true;
      if (stopCheck.current) clearTimeout(stopCheck.current);
      stopCheck.current = null;
    } else if (wasPlaying.current && at > 0.2 && !stopCheck.current) {
      const finish = () => {
        stopCheck.current = null;
        wasPlaying.current = false;
        if (afterVoice.current) voiceFinished();
      };
      if (status.duration > 0 && at >= status.duration - 0.3) finish();
      else stopCheck.current = setTimeout(finish, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, playerStatus.currentTime, playerStatus.playing, restStatus.currentTime, restStatus.playing]);

  useEffect(() => {
    if (restStatus.didJustFinish) voiceFinished();
    // Runs when the second player reports the end of the rest of the answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restStatus.didJustFinish]);

  async function startListening(afterAnswer = false) {
    const id = ++turn.current;
    followUp.current = afterAnswer;
    setTapped(false);
    setPhoto(null);
    hush();
    setLiveQuestion('');
    setLiveAnswer('');
    setStepsDone(0);
    setAnswered(false);
    setMuted(false);
    setPhase('listening');
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setMuted(true);
        setNotice('Allow the microphone in Settings to talk to Earthy');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      if (id !== turn.current) return;
      recorder.record();
      recording.current = true;
    } catch {
      setMuted(true);
      setNotice('Earthy can’t use the microphone right now');
    }
  }

  async function finishListening() {
    if (!recording.current) return;
    recording.current = false;
    const id = ++turn.current;
    setStepsDone(0);
    setPhase('thinking');
    let uri: string | null = null;
    try {
      await recorder.stop();
      // Back to playback, so the answer comes out of the speaker and not the earpiece.
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      uri = recorder.uri;
    } catch {
      uri = null;
    }
    if (id !== turn.current) return;
    if (!uri) {
      setLiveAnswer(RECORD_FAILED);
      setPhase('speaking');
      say(RECORD_FAILED, 'en', undefined, null);
      return;
    }
    try {
      const heardVoice = await transcribeVoice(uri);
      if (id !== turn.current) return;
      if (!heardVoice.text) {
        // Nothing but room noise after an answer: stop quietly and wait for a tap, instead of asking again.
        if (followUp.current) {
          setPhase('listening');
          setMuted(true);
          return;
        }
        setNotice('I didn’t catch that. Try again');
        startListening();
        return;
      }
      await answer(heardVoice.text, heardVoice.language, id);
    } catch {
      if (id !== turn.current) return;
      // Honest failure: say so instead of making an answer up.
      setLiveAnswer(SERVER_DOWN);
      setPhase('speaking');
      say(SERVER_DOWN, 'en', undefined, null);
    }
  }

  /** Shows the question, asks the model and reads the answer out. Throws if the server can't be reached. */
  async function answer(text: string, language: 'en' | 'ar', id: number, photoUri?: string) {
    setLiveQuestion(text);
    setStepsDone(1);
    pace.current = null;
    setSpoken(undefined);
    const question: EarthyMessage = { role: 'user', content: photoUri ? `(Showed a photo) ${text}` : text };
    // A photo goes to the model that can see. Otherwise `true` says the answer will be read aloud, so the
    // server keeps it to a sentence or two (quicker to voice).
    const reply = photoUri ? await lookEarthy(photoUri, text) : await askEarthy([...history.current, question], true);
    if (id !== turn.current) return;
    history.current = [...history.current, question, { role: 'assistant', content: reply }];
    // Fetch the voice before showing the answer, so the words and the voice begin together.
    // Without this the text appeared first and the voice came in a few seconds later.
    //
    // To start speaking sooner, only the FIRST sentence is voiced before Earthy starts. The rest is voiced at
    // the same time and plays straight after. A built-in question's answer is already voiced on the server,
    // whole, so that is asked for first.
    let voice: string | null = null;
    let seconds = 0;
    let spokenFirst = reply;
    let rest: Promise<string | null> | null = null;
    try {
      // The whole answer is voiced as one clip: one length to follow, and nothing to join.
      voice = await earthyVoiceUrl(reply);
      if (id !== turn.current) return;
      // Load the sound now and read its length, so each word lights up as it is spoken.
      seconds = await loadVoice(voice);
    } catch {
      voice = null;
      rest = null;
    }
    if (id !== turn.current) return;
    setWordTime(seconds > 0 ? (seconds * 1000) / spokenFirst.split(' ').length : LIVE_WORD_TIME);
    if (voice) {
      pace.current = { first: spokenFirst.split(' ').length, total: reply.split(' ').length, rest: false };
      setSpoken(0);
    }
    setLiveAnswer(reply);
    setPhase('speaking');
    // Keep the conversation going: once the answer has been read out, listen for a follow-up.
    const done = () => {
      if (id === turn.current) startListening(true);
    };
    const thenRest = async () => {
      const next = rest ? await rest : null;
      if (id !== turn.current) return;
      if (!next) {
        done();
        return;
      }
      // Usually loaded already; otherwise wait a moment for it.
      for (let waited = 0; !restPlayer.isLoaded && waited < 4000; waited += 60) {
        await new Promise((resolve) => setTimeout(resolve, 60));
        if (id !== turn.current) return;
      }
      afterVoice.current = done;
      restPlayer.seekTo(0);
      if (pace.current) pace.current.rest = true;
      wasPlaying.current = false;
      stoppedFor.current = 0;
      restPlayer.play();
      const length = restPlayer.duration;
      const restWords = pace.current ? pace.current.total - pace.current.first : 12;
      voiceEnd.current = setTimeout(voiceFinished, length > 0 ? length * 1000 + 700 : (restWords / 1.5) * 1000 + 2500);
    };
    say(reply, language, voice ? thenRest : done, voice, seconds);
  }

  /** Show: opens the scan screen (live camera, frame, shutter, result). The mic is closed while it is open. */
  function openCamera() {
    turn.current += 1;
    hush();
    if (recording.current) {
      recording.current = false;
      recorder.stop().catch(() => {});
    }
    // Back from the camera, the voice screen waits: Unmute starts listening again.
    setPhoto(null);
    setPhase('listening');
    setMuted(true);
    router.push('/earthy-show');
  }

  /**
   * Show without the scan screen (kept as a fallback): take a photo with the phone's own camera and Earthy says what it is and where it goes, out loud. The photo is sent to
   * the server for this one answer and is not kept.
   */
  async function showItem() {
    hush();
    const id = ++turn.current;
    if (recording.current) {
      recording.current = false;
      await recorder.stop().catch(() => {});
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setMuted(true);
        setNotice('Allow the camera in Settings to show Earthy an item');
        return;
      }
      const shot = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.4 });
      if (id !== turn.current) return;
      const uri = shot.canceled ? undefined : shot.assets[0]?.uri;
      if (!uri) {
        // Camera closed without a photo: carry on listening.
        startListening();
        return;
      }
      setMuted(false);
      setTapped(true);
      setPhoto(uri);
      setStepsDone(0);
      setPhase('thinking');
      await answer('What is this, and where does it go?', 'en', id, uri);
    } catch {
      if (id !== turn.current) return;
      setLiveAnswer(SERVER_DOWN);
      setPhase('speaking');
      say(SERVER_DOWN, 'en', undefined, null);
    }
  }

  /** A question tapped on Earthy home: no listening, straight to the answer. */
  async function answerAsked(text: string) {
    const id = ++turn.current;
    setTapped(true);
    setPhoto(null);
    setStepsDone(0);
    setPhase('thinking');
    try {
      await answer(text, /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en', id);
    } catch {
      if (id !== turn.current) return;
      setLiveAnswer(SERVER_DOWN);
      setPhase('speaking');
      say(SERVER_DOWN, 'en', undefined, null);
    }
  }

  // LIVE: nobody answered Earthy's follow-up listening, so stop the mic and wait for a tap on Unmute.
  function pauseListening() {
    turn.current += 1;
    if (recording.current) {
      recording.current = false;
      recorder.stop().catch(() => {});
    }
    setMuted(true);
  }

  function toggleMute() {
    if (live && muted && !recording.current) {
      startListening();
      return;
    }
    if (live && recording.current) {
      if (muted) recorder.record();
      else recorder.pause();
    }
    setMuted((value) => !value);
  }

  // Mount closed, then open once the sheet has measured itself: opening on mount doesn't animate reliably.
  useEffect(() => {
    feedback.play('voice.open');
    const timer = setTimeout(() => sheet.current?.snapToIndex(startFullScreen ? 1 : 0), 120);
    if (live && ask) answerAsked(ask);
    else if (live) startListening();
    return () => {
      clearTimeout(timer);
      // Leaving the sheet drops any answer still on its way and stops the voice.
      turn.current += 1;
      hush();
      if (recording.current) {
        recording.current = false;
        recorder.stop().catch(() => {});
      }
    };
    // Runs once on open; startFullScreen is fixed for the sheet's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LIVE: listen to the mic level. The orb follows the voice, and once the speaker has said something
  // and then gone quiet, the question is sent without a tap. A question also can't run past 30 s.
  useEffect(() => {
    if (!live || phase !== 'listening' || muted) return;
    const started = Date.now();
    let spoke = false;
    let lastLoud = started;
    // Every level heard in this turn. The room's own level (talk, traffic, music) is taken as the quieter part
    // of them, and it is worked out again at every check, so it follows a room that is never silent. A voice
    // close to the phone stands clearly above that; music across the room is the level itself, not above it.
    const levels: number[] = [];
    let metered = false;
    let loud = 0;
    const timer = setInterval(() => {
      if (!recording.current) return;
      const now = Date.now();
      let level: number | undefined;
      try {
        level = recorder.getStatus().metering;
      } catch {
        level = undefined;
      }
      if (typeof level === 'number' && Number.isFinite(level)) {
        metered = true;
        levels.push(Math.max(level, -90));
        const sorted = [...levels].sort((x, y) => x - y);
        const room = sorted[Math.floor(sorted.length * ROOM_SHARE)];
        micLevel.set(withTiming(Math.min(1, Math.max(0, (level - room) / 30)), { duration: LEVEL_CHECK }));
        if (now - started > 450 && level > Math.max(room + SPEECH_RISE, SPEECH_LEVEL)) {
          loud += 1;
          if (loud >= SPEECH_CHECKS) {
            spoke = true;
            lastLoud = now;
          }
        } else {
          loud = 0;
        }
      }
      // No level from the microphone at all: it can't tell when the talking stops, so it listens for a fixed
      // few seconds and then sends what it recorded.
      const blind = !metered && now - started > NO_LEVEL_LISTEN;
      if ((spoke && now - lastLoud > QUIET_TIME) || blind || now - started > LIVE_MAX_RECORDING) finishListening();
      else if (metered && !spoke && followUp.current && now - started > FOLLOW_UP_WAIT) pauseListening();
    }, LEVEL_CHECK);
    return () => {
      clearInterval(timer);
      micLevel.set(withTiming(0, { duration: LEVEL_CHECK }));
    };
    // Restarts with each listening turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, phase, muted]);

  // The scripted turn moves itself along. Muting pauses the listening part.
  useEffect(() => {
    if (live) return;
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
  }, [live, phase, heard, stepsDone, muted]);

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
    if (live) {
      startListening();
      return;
    }
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
  // A question that was tapped was never spoken, so "Hearing your question" is left out for it.
  const skipped = live && tapped ? 1 : 0;
  const stepLabels: readonly string[] = !live ? LIVE_TURN.steps : photo ? PHOTO_STEPS : LIVE_STEPS.slice(skipped);
  const doneSteps = Math.max(stepsDone - skipped, 0);
  const steps: ThinkingStep[] = stepLabels
    .slice(0, Math.min(doneSteps + 1, stepLabels.length))
    .map((label, index) => ({ id: String(index), label, status: index < doneSteps ? 'done' : 'active' }));
  const quickFooterTop = height * QUICK_SHARE - HANDLE - 53;

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
          {live && phase === 'listening' && !muted && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done speaking"
              onPress={finishListening}
              style={StyleSheet.absoluteFill}
            />
          )}
          {phase === 'speaking' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Interrupt Earthy"
              onPress={interrupt}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={[styles.topBar, { top: Math.max(Spacing.two, fullTop + Spacing.two) }]}>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Close voice"
              onPress={() => leaveTo('/earthy')}
              style={[styles.round, { backgroundColor: theme.glassOnMap, borderColor: theme.strokeWeak }]}>
              <Icon name="chevron-down" size={24} color="textStrong" />
            </Tappable>
            <View style={[styles.languagePill, { backgroundColor: theme.tileNeutral }]}>
              <ThemedText type="filterLabel" accessibilityLabel="Language: English or Arabic, detected automatically">
                EN · ع auto
              </ThemedText>
            </View>
          </View>

          <View
            pointerEvents="box-none"
            style={[styles.fullContent, phase === 'speaking' && styles.fullContentWide, { top: fullTop + (live ? LIVE_CONTENT_TOP : CONTENT_TOP)[phase] }]}>
            {phase === 'listening' && (
              <Fade key="listening" align="center" gap={Spacing.two}>
                <Status color="statusSuccess" label={muted ? 'Muted' : 'Listening'} type="fieldLabel" />
                {live ? <LivePrompt muted={muted} type="etaTitle" /> : <Words shown={heard} type="etaTitle" />}
                {live && !muted && (
                  <ThemedText type="meta" themeColor="textWeak" style={styles.centred}>
                    Earthy answers when you stop talking, or tap anywhere
                  </ThemedText>
                )}
              </Fade>
            )}
            {phase === 'thinking' && (
              <Fade key="thinking" align="center" gap={Spacing.threeHalf}>
                <Status color="secondary" label="Thinking" type="fieldLabel" />
                {live && photo && <Image source={{ uri: photo }} contentFit="cover" style={styles.shown} accessibilityLabel="Your photo" />}
                <ThemedText type="fieldValue" themeColor="textWeak" style={styles.centred}>
                  {live ? liveQuestion : LIVE_TURN.question}
                </ThemedText>
                {/* The step list belongs to the scripted demo. Live, Earthy just thinks: it is quick, and a
                    checklist made the wait feel longer. */}
                {!live && (
                  <View style={styles.steps}>
                    <ThinkingSteps steps={steps} />
                  </View>
                )}
              </Fade>
            )}
            {phase === 'speaking' && (
              <Fade key="speaking" align="start" gap={Spacing.threeHalf}>
                <Status color="brand" label="Earthy is speaking" type="fieldLabel" />
                <StreamingText
                  text={live ? liveAnswer : LIVE_TURN.answer}
                  msPerWord={live ? wordTime : LIVE_TIMING.spokenWord}
                  position={live ? spoken : undefined}
                  style={{ fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 28, color: theme.textStrong }}
                  onDone={() => {
                    setAnswered(true);
                    feedback.play('voice.results');
                  }}
                />
                {answered && (
                  <>
                    {/* The result card belongs to the scripted turn; a live answer stands on its own. */}
                    {!live && <ResultCard onBook={() => onBook(LIVE_TURN.result.eventId)} />}
                    <ThemedText type="meta" themeColor="strokeStrong" style={[styles.centred, styles.interruptHint]}>
                      {live ? 'Earthy listens again after answering' : 'Tap anywhere to interrupt'}
                    </ThemedText>
                  </>
                )}
              </Fade>
            )}
          </View>

          <View style={[styles.controls, { bottom: insets.bottom + Spacing.four }]}>
            <View style={styles.controlRow}>
              {/* The icon shows the state: a mic while it is on, a struck-through mic on a solid circle once muted. */}
              <Control icon={muted ? 'mic-off' : 'mic'} label={muted ? 'Unmute' : 'Mute'} active={muted} onPress={toggleMute} />
              <Control icon="camera" label="Show" onPress={live ? openCamera : () => leaveTo('/earthy-lens')} />
              <Control icon="keyboard" label="Type" onPress={() => leaveTo('/earthy')} />
              <Control icon="close" label="End" tone="earthyDanger" onPress={close} />
            </View>
            <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.centred}>
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
            style={[styles.fullScreen, { backgroundColor: theme.segmentWell }]}>
            <Icon name="expand" size={14} color="brand" strokeWidth={1.8} />
            <ThemedText type="dateline" themeColor="brand">
              Full screen
            </ThemedText>
          </Tappable>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={6}
            onPress={close}
            style={[styles.quickClose, { backgroundColor: theme.tileNeutral }]}>
            <Icon name="close" size={22} color="textWeak" strokeWidth={1.375} />
          </Tappable>

          <View style={styles.quickCopy}>
            <Status color="statusSuccess" label={muted ? 'Muted' : 'Listening'} type="body" />
            {live ? <LivePrompt muted={muted} type="transcript" /> : <Words shown={heard} type="transcript" />}
          </View>

          <View style={styles.quickMic}>
            <VoiceMic
              state={phase === 'listening' && !muted ? 'listening' : 'done'}
              accessibilityLabel="Stop listening"
              onPress={() => (live ? finishListening() : setHeard(HEARD.length))}
            />
          </View>
          <ThemedText type="caption" themeColor="textWeak" style={styles.quickHint}>
            {live ? 'Earthy answers when you stop talking' : 'Tap to stop'}
          </ThemedText>

          <View style={[styles.quickFooter, { top: quickFooterTop }]}>
            <TextButton label="Type instead" onPress={() => leaveTo('/earthy')} />
            <LanguageToggle value={language} onChange={setLanguage} />
          </View>
        </Animated.View>

        {/* One orb for both layouts. It moves and scales with the sheet. */}
        <Animated.View pointerEvents="none" style={[styles.orb, { left: width / 2 - ORB_BOX / 2 }, orbStyle]}>
          <EarthyOrb state={orbState} size={ORB} level={live ? micLevel : undefined} />
        </Animated.View>

        {notice && (
          <View
            pointerEvents="none"
            style={[styles.notice, { top: expanded ? height - insets.bottom - 240 : quickFooterTop - 64 }]}>
            <Toast text={notice} />
          </View>
        )}
      </DirectionView>
    </Sheet>
  );
}

/** Splits an answer into its first sentence and the rest ('' if it is one sentence). */
function firstSentence(text: string): [string, string] {
  const match = /^(.+?[.!?؟])\s+(\S.*)$/s.exec(text.trim());
  return match ? [match[1], match[2]] : [text.trim(), ''];
}

function Fade({ align, gap, children }: { align: 'center' | 'start'; gap: number; children: ReactNode }) {
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
    <Animated.View pointerEvents="box-none" style={[styles.phase, { gap }, align === 'start' && styles.phaseStart, style]}>
      {children}
    </Animated.View>
  );
}

function Status({ color, label, type }: { color: ThemeColor; label: string; type: 'body' | 'fieldLabel' }) {
  const theme = useTheme();
  return (
    <View style={styles.status} accessibilityLiveRegion="polite">
      <View style={[styles.dot, { backgroundColor: theme[color] }]} />
      <ThemedText type={type} themeColor="textWeak">
        {label}
      </ThemedText>
    </View>
  );
}

/** Words heard so far are dark. The rest of the sentence waits in grey. */
function Words({ shown, type }: { shown: number; type: 'etaTitle' | 'transcript' }) {
  const theme = useTheme();
  const said = HEARD.slice(0, shown).join(' ');
  const rest = HEARD.slice(shown).join(' ');
  return (
    <ThemedText type={type} accessibilityLabel={said} style={styles.words}>
      <ThemedText type={type}>{said}</ThemedText>
      <ThemedText type={type} style={{ color: theme.earthyUnheard }}>
        {shown > 0 && rest ? ` ${rest}` : rest}
      </ThemedText>
    </ThemedText>
  );
}

/** LIVE: there are no scripted words to show, so the sheet asks for the question instead. */
function LivePrompt({ muted, type }: { muted: boolean; type: 'etaTitle' | 'transcript' }) {
  const theme = useTheme();
  return (
    <ThemedText type={type} style={[styles.words, { color: theme.earthyUnheard }]}>
      {muted ? 'Tap Unmute to ask again' : 'Ask your question'}
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
    <Animated.View style={style}>
      <Card padding={Spacing.twoThreeQuarters} style={styles.cardRow}>
        {/* Figma's own thumbnail image for the result card, cropped to a square. */}
        <Image source={require('@/assets/images/voice-result-thumb.png')} contentFit="cover" style={styles.thumb} />
        <View style={styles.cardText}>
          <ThemedText type="labelMedium14" numberOfLines={1}>
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
          <ThemedText type="labelSmall" themeColor="textOnBrand" style={styles.bookLabel}>
            Book
          </ThemedText>
        </Tappable>
      </Card>
    </Animated.View>
  );
}

function Control({
  icon,
  label,
  tone,
  active = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  tone?: ThemeColor;
  /** On: a solid brand circle with a white icon (Mute while muted). */
  active?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const solid = tone ?? (active ? 'brand' : undefined);
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.control}>
      {/* Brand-blue icons on the pale blue fill: clearer than the old dark-on-grey, and they match the app's buttons. */}
      <View style={[styles.controlCircle, { backgroundColor: solid ? theme[solid] : theme.fill }]}>
        <Icon name={icon} size={26} color={solid ? 'textOnBrand' : 'brand'} strokeWidth={2} />
      </View>
      <ThemedText type="filterLabel">{label}</ThemedText>
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
  // Figma places the pill and the close 18 and 16 px below the sheet's top edge, inside the 24 px handle.
  // The sheet clips anything above its content, so they sit at the top of the content instead.
  fullScreen: {
    position: 'absolute',
    top: 0,
    start: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: 7,
    borderRadius: Radius.option,
  },
  quickClose: {
    position: 'absolute',
    top: 0,
    end: Spacing.four,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  quickCopy: {
    position: 'absolute',
    top: 136,
    start: 30,
    end: 30,
    alignItems: 'center',
    gap: Spacing.one,
  },
  quickMic: {
    position: 'absolute',
    top: 240,
    start: 0,
    end: 0,
    alignItems: 'center',
  },
  quickHint: {
    position: 'absolute',
    top: 384,
    start: 30,
    end: 30,
    textAlign: 'center',
  },
  quickFooter: {
    position: 'absolute',
    start: Spacing.four,
    end: Spacing.five,
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
    borderWidth: 1,
  },
  fullContent: {
    position: 'absolute',
    start: 30,
    end: 30,
  },
  fullContentWide: {
    start: Spacing.four,
    end: Spacing.four,
  },
  phase: {
    alignItems: 'center',
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
    marginTop: Spacing.two,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.small,
  },
  cardText: {
    flex: 1,
    gap: 1,
  },
  book: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: Radius.option,
  },
  // Figma: 13 px SemiBold on a "normal" 20 px line.
  bookLabel: {
    lineHeight: 20,
  },
  // Figma: 18 px below the card; the phase gap gives 20.
  interruptHint: {
    marginTop: -2,
  },
  controls: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    // Figma: control labels end at y 725, the note starts at y 760.
    gap: 35,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
  },
  control: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  // The photo taken with Show, above the question it belongs to.
  shown: {
    width: 96,
    height: 96,
    borderRadius: Radius.card,
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
