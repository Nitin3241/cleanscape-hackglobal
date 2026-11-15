// Speaking text: words fade from 25% to 100% one by one, on the UI thread.
// Each word is its own Animated.Text in a wrapping row (animated styles don't work on nested Text).
import { useEffect, useRef } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { linear } from '@/components/earthy/motion';

function Word({ word, index, progress, style }: { word: string; index: number; progress: SharedValue<number>; style: TextStyle }) {
  const fade = useAnimatedStyle(() => {
    const shown = Math.min(1, Math.max(0, progress.get() - index));
    return { opacity: 0.25 + 0.75 * shown };
  });
  return <Animated.Text style={[style, fade]}>{word}</Animated.Text>;
}

type StreamingTextProps = {
  text: string;
  msPerWord?: number;
  style: TextStyle;
  /**
   * How many words have been spoken so far (can be a fraction). When given, the words follow this instead of
   * the clock, so the highlight stays with a real voice whatever its pace or pauses.
   */
  position?: number;
  /** Called once the last word is fully shown. */
  onDone?: () => void;
};

export function StreamingText({ text, msPerWord = 70, position, style, onDone }: StreamingTextProps) {
  const words = text.split(' ');
  const progress = useSharedValue(0);

  const followed = position !== undefined;
  const finished = useRef(false);

  useEffect(() => {
    finished.current = false;
    progress.set(0);
    if (followed) return;
    progress.set(withTiming(words.length, { duration: words.length * msPerWord, easing: linear }));
    if (!onDone) return;
    const timer = setTimeout(onDone, words.length * msPerWord);
    return () => clearTimeout(timer);
    // Restart only when the text changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, followed]);

  // Following a voice: glide to where the voice is. The steps arrive about ten times a second.
  useEffect(() => {
    if (position === undefined) return;
    progress.set(withTiming(Math.min(position, words.length), { duration: 140, easing: linear }));
    if (position >= words.length - 0.05 && !finished.current) {
      finished.current = true;
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  const space = (style.fontSize ?? 16) * 0.28;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={text} accessibilityLiveRegion="polite">
      {words.map((word, index) => (
        <View key={index} style={{ marginEnd: space }}>
          <Word word={word} index={index} progress={progress} style={style} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { flexDirection: 'row', flexWrap: 'wrap' } });
