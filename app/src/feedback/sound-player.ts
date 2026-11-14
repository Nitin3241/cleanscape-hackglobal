import { type AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

import { SOUND_ASSETS } from './sound-assets.generated';

const players = new Map<string, AudioPlayer>();

function playerFor(name: string) {
  let player = players.get(name);
  if (!player) {
    player = createAudioPlayer(SOUND_ASSETS[name as keyof typeof SOUND_ASSETS]);
    players.set(name, player);
  }
  return player;
}

/** Respects the iOS silent switch, and lets the user's music keep playing. */
export function prepareAudio() {
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
}

export function preloadSounds(names: readonly string[]) {
  names.forEach(playerFor);
}

export function playSound(name: string, volume: number) {
  try {
    const player = playerFor(name);
    player.volume = volume;
    // Wait for the rewind, so a sliver of the old position can't play first.
    player.seekTo(0).then(() => player.play(), () => player.play());
  } catch {
    // A missed UI sound should never interrupt what the user is doing.
  }
}
