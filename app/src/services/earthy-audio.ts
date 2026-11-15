/**
 * The audio Earthy uses: the microphone recorder and the player for Earthy's voice.
 *
 * On a phone this is expo-audio. In a browser, `earthy-audio.web.ts` does the same jobs with the browser's own
 * audio, so the screens that listen and speak are written once and run in both places.
 */
export {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from 'expo-audio';
