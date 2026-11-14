import { Platform, View, type ViewProps } from 'react-native';

type DirectionViewProps = ViewProps & {
  /** Reading direction for everything inside: row order, start and end. */
  direction: 'ltr' | 'rtl';
};

/**
 * A View with its own reading direction. Phones use the `direction` style; the web preview
 * needs the HTML `dir` attribute instead, because React Native Web rejects that style.
 */
export function DirectionView({ direction, style, ...rest }: DirectionViewProps) {
  if (Platform.OS === 'web') {
    return <View {...rest} style={style} {...({ dir: direction } as object)} />;
  }
  return <View {...rest} style={[{ direction }, style]} />;
}
