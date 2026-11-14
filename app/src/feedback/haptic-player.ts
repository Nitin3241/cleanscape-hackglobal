import * as Haptics from 'expo-haptics';

import { SIGNATURES } from './events.generated';

const IMPACTS = {
  light: Haptics.ImpactFeedbackStyle.Light,
  soft: Haptics.ImpactFeedbackStyle.Soft,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  rigid: Haptics.ImpactFeedbackStyle.Rigid,
} as const;

const NOTIFICATIONS = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
} as const;

/** Plays a haptic such as `impact:light`, `notification:success` or `signature:swell`. */
export function playHaptic(haptic: string) {
  const [kind, name] = haptic.split(':');
  const ignoreFailure = () => {};
  if (kind === 'selection') {
    Haptics.selectionAsync().catch(ignoreFailure);
  } else if (kind === 'impact') {
    Haptics.impactAsync(IMPACTS[name as keyof typeof IMPACTS]).catch(ignoreFailure);
  } else if (kind === 'notification') {
    Haptics.notificationAsync(NOTIFICATIONS[name as keyof typeof NOTIFICATIONS]).catch(ignoreFailure);
  } else if (kind === 'signature') {
    // Expo Go can't play .ahap files, so signatures are built from timed taps.
    SIGNATURES[name as keyof typeof SIGNATURES].forEach(({ at, style }) => {
      setTimeout(() => {
        Haptics.impactAsync(IMPACTS[style as keyof typeof IMPACTS]).catch(ignoreFailure);
      }, at);
    });
  }
}
