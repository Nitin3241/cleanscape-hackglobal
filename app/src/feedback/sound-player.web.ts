import { Asset } from 'expo-asset';

import { SOUND_ASSETS } from './sound-assets.generated';

let context: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();

function loadBuffer(name: string, audio: AudioContext) {
  let buffer = buffers.get(name);
  if (!buffer) {
    const { uri } = Asset.fromModule(SOUND_ASSETS[name as keyof typeof SOUND_ASSETS]);
    buffer = fetch(uri)
      .then((response) => response.arrayBuffer())
      .then((data) => audio.decodeAudioData(data));
    buffers.set(name, buffer);
  }
  return buffer;
}

export function prepareAudio() {}

/** Browsers only allow audio after a tap, so nothing loads ahead of time. */
export function preloadSounds() {}

export async function playSound(name: string, volume: number) {
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') await context.resume();
    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = volume;
    source.buffer = await loadBuffer(name, context);
    source.connect(gain).connect(context.destination);
    source.start();
  } catch {
    // A missed UI sound should never interrupt what the user is doing.
  }
}
