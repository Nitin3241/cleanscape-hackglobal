import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Whether this person already did F10·15 Become a host (one time). Saved on the phone, so "Host here" skips
 * straight to Earthy drafting after the first time. The demo long-press on the Home greeting clears it.
 * SAMPLE: the real check is UAE Pass + a registered volunteer team.
 */
const STORAGE_KEY = 'host-onboarded';
let onboarded: boolean | null = null;

export async function isHostOnboarded() {
  if (onboarded === null) {
    try {
      onboarded = (await AsyncStorage.getItem(STORAGE_KEY)) === 'yes';
    } catch {
      onboarded = false;
    }
  }
  return onboarded;
}

export function setHostOnboarded() {
  onboarded = true;
  AsyncStorage.setItem(STORAGE_KEY, 'yes').catch(() => {
    // Without storage it lasts for this app session only.
  });
}

export async function resetHostOnboarded() {
  onboarded = false;
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
