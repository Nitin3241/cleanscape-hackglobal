import { router } from 'expo-router';

import { VoiceSheet } from '@/components/earthy/voice-sheet';

/**
 * F9v2·2 full-screen voice, opened from the chat screens' Full screen and wave buttons.
 * It's the same voice sheet as Home's Earthy button, opening straight at full height.
 */
export default function EarthyVoiceRoute() {
  return (
    <VoiceSheet
      startFullScreen
      onLeave={(path) => router.replace(path)}
      onClose={() => (router.canGoBack() ? router.back() : router.replace('/earthy'))}
      onBook={(id) => router.replace({ pathname: '/event-detail', params: { id } })}
    />
  );
}
