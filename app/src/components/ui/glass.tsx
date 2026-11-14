import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GlassProps = {
  style?: StyleProp<ViewStyle>;
  /** The tint laid over the blur. */
  fill?: ThemeColor;
  intensity?: number;
  children?: ReactNode;
};

/** Frosted surface from the Figma "Glass" components: a blur, a soft white tint and a hairline edge. */
export function Glass({ style, fill = 'glass', intensity = 24, children }: GlassProps) {
  const theme = useTheme();

  return (
    <View style={[styles.base, { borderColor: theme.glassStroke }, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme[fill] }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
