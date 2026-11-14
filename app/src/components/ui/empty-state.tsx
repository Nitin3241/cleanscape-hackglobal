import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useFadeUp } from '@/hooks/use-fade-up';

type EmptyStateProps = {
  art: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
};

/** A friendly dead end with a way forward, such as "No cleanups match". */
export function EmptyState({ art, title, body, children }: EmptyStateProps) {
  const fadeUp = useFadeUp();

  return (
    <Animated.View style={[styles.empty, fadeUp]}>
      {art}
      <View style={styles.copy}>
        <ThemedText type="cardTitle" accessibilityRole="header" style={styles.centred}>
          {title}
        </ThemedText>
        <ThemedText type="note" themeColor="textWeak" style={styles.centred}>
          {body}
        </ThemedText>
      </View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 28,
  },
  copy: {
    gap: 6,
  },
  centred: {
    textAlign: 'center',
  },
});
