import { router, useLocalSearchParams } from 'expo-router';

import { VoiceSheet } from '@/components/earthy/voice-sheet';

/**
 * F9v2·2 full-screen voice, opened from the chat screens' Full screen and wave buttons.
 * It's the same voice sheet as Home's Earthy button, opening straight at full height.
 */
export default function EarthyVoiceRoute() {
  // LIVE: a question tapped on Earthy home arrives here and is answered out loud.
  const { ask } = useLocalSearchParams<{ ask?: string }>();
  return (
    <VoiceSheet
      startFullScreen
      ask={ask}
      // Close and Type go back to the Earthy screen underneath. Replacing it would stack a second copy,
      // so the down arrow there had to be tapped twice.
      onLeave={(path) => (path === '/earthy' && router.canGoBack() ? router.back() : router.replace(path))}
      onClose={() => (router.canGoBack() ? router.back() : router.replace('/earthy'))}
      onBook={() => router.replace({ pathname: '/earthy-chat', params: { start: 'next' } })}
    />
  );
}
