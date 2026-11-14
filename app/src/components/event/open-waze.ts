import { Linking, Platform } from 'react-native';

import { SAMPLE_EVENT } from '@/data/ask-earthy.sample';
import { feedback } from '@/feedback';

const { latitude, longitude } = SAMPLE_EVENT.coordinates;

/** Opens directions in Apple Maps on iOS and Google Maps everywhere else. */
export function openInMaps() {
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url).catch(() => {});
}

/**
 * Opens Waze with directions, falling back to the phone's maps app if it isn't installed.
 * Phones refuse the `waze://` link when Waze is missing, whereas the waze.com link would
 * open a web page instead of the fallback. The web preview can't tell, so it uses waze.com.
 */
export function openInWaze() {
  feedback.play('map.waze');
  const query = `ll=${latitude},${longitude}&navigate=yes`;
  if (Platform.OS === 'web') {
    Linking.openURL(`https://waze.com/ul?${query}`).catch(() => {});
    return;
  }
  Linking.openURL(`waze://?${query}`).catch(openInMaps);
}
