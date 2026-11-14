import { type ReactNode } from 'react';
import { Platform } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

// Figma frames are 360 × 800 with a 44 px status bar. On the web preview (development only) the page gets the same
// 44 px top inset, so screens line up with the frames to the pixel when compared. Native builds use real insets.
const FIGMA_STATUS_BAR = 44;

export function PhoneInsets({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  if (Platform.OS !== 'web' || !__DEV__) return children;
  return (
    <SafeAreaInsetsContext.Provider value={{ ...insets, top: Math.max(insets.top, FIGMA_STATUS_BAR) }}>
      {children}
    </SafeAreaInsetsContext.Provider>
  );
}
