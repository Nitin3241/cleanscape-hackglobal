import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { STORY } from '@/data/proactive.sample';
import { useTheme } from '@/hooks/use-theme';

const PHOTO = require('@/assets/images/story-kite-crew.png');

/**
 * F10·13 AI impact story: Earthy turns the day's check-ins into a shareable story. Only the
 * first of its slides is designed; the progress bar shows where it sits in the story.
 */
export default function ImpactStoryRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const glass = { backgroundColor: theme.storyGlass, borderColor: theme.storyGlassStroke };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image
        source={PHOTO}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessible
        accessibilityLabel="The Kite Beach crew, smiling with their bags"
      />
      <LinearGradient
        colors={['rgba(11, 26, 32, 0.35)', 'rgba(11, 26, 32, 0)', 'rgba(11, 26, 32, 0.55)', 'rgba(11, 26, 32, 0.92)']}
        locations={[0, 0.2, 0.5, 0.85]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.top, { paddingTop: insets.top + 2 }]}>
        <View style={styles.segments} accessible accessibilityLabel={`Slide 1 of ${STORY.slides}`}>
          {/* Figma "Story progress": the first slide white, the next one white 90%, the rest white 35%. */}
          {Array.from({ length: STORY.slides }, (_, index) => (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  backgroundColor:
                    index === 0 ? theme.textOnBrand : index === 1 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.35)',
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.bar}>
          <StoryButton icon="close" label="Close story" size={40} onPress={() => router.back()} />
          {/* The story is shown in English; the Arabic version isn't designed yet. */}
          <View style={[styles.lang, glass]}>
            <ThemedText type="chip" themeColor="textOnBrand">
              EN · عربي
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 36) }]}>
        <View style={styles.story}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.made}>
            <EarthyOrb size={20} state="still" glow={false} />
            <ThemedText type="chip" themeColor="storyTextSoft">
              Earthy made this from today’s check-ins
            </ThemedText>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.copy}>
            <ThemedText type="dateline" themeColor="storyGold" style={styles.eyebrow}>
              {STORY.place}
            </ThemedText>
            <ThemedText type="sheetTitle" themeColor="textOnBrand" accessibilityRole="header" style={styles.headline}>
              {STORY.headline}
            </ThemedText>
            <View style={styles.kgRow}>
              <ThemedText style={styles.kg} themeColor="textOnBrand">{`${STORY.kg} kg`}</ThemedText>
              <ThemedText type="fieldValue" themeColor="storyTextSoft" style={styles.time}>
                {STORY.time}
              </ThemedText>
            </View>
            <View style={styles.chips}>
              {STORY.chips.map((chip) => (
                <View key={chip} style={[styles.chip, glass]}>
                  <ThemedText type="chip" themeColor="textOnBrand">
                    {chip}
                  </ThemedText>
                </View>
              ))}
            </View>
            <View style={[styles.yours, glass]}>
              <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
                <ThemedText type="labelMedium14">{STORY.yours.initial}</ThemedText>
              </View>
              <View style={styles.flex}>
                <ThemedText type="micro11" themeColor="storyTextMuted" style={styles.line17}>
                  {STORY.yours.label}
                </ThemedText>
                <ThemedText type="labelMedium14" themeColor="textOnBrand">
                  {STORY.yours.value}
                </ThemedText>
              </View>
              <ThemedText type="tag" themeColor="storyGold" style={styles.line17}>
                {STORY.yours.added}
              </ThemedText>
            </View>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          {/* Saving the story as a video isn't built yet. */}
          <StoryButton icon="download" label="Save story" />
          <StoryButton
            icon={copied ? 'check' : 'link'}
            label={copied ? 'Link copied' : 'Copy link'}
            onPress={() => {
              Clipboard.setStringAsync('https://cleanscape.app/story/kite-beach-5-dec').catch(() => {});
              setCopied(true);
            }}
          />
          <View style={styles.flex}>
            <Button
              label="Share story"
              flat
              onPress={() => {
                // Close the story first: anything pushed on top of a modal opens as an iOS page sheet.
                router.dismiss();
                router.push({ pathname: '/earthy-chat', params: { start: 'caption' } });
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

/** Figma story buttons: white 16% glass with a 55% edge, 20 px icon (Close 40, Save and Copy link 48). */
function StoryButton({
  icon,
  label,
  onPress,
  size = 48,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  size?: number;
}) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.round,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.storyGlass,
          borderColor: theme.storyGlassStroke,
        },
      ]}>
      <Icon name={icon} size={20} color="textOnBrand" />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1A20',
  },
  // Figma: progress at y 46, Close and the language pill from y 60.
  top: {
    gap: 11,
    paddingHorizontal: Spacing.three,
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  round: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  // Figma "Language": 78 × 38, 9 / 14 padding, 2 px lower than Close.
  lang: {
    marginTop: 2,
    // Figma's pill ends at x 326, 18 px short of the margin.
    marginEnd: 18,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  bottom: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  // Figma "Story": 10 gap between every line.
  story: {
    gap: Spacing.twoHalf,
  },
  made: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  copy: {
    gap: Spacing.twoHalf,
  },
  // 12 semibold, 8% letter spacing.
  eyebrow: {
    letterSpacing: 0.96,
  },
  headline: {
    lineHeight: 30,
  },
  kgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  // Figma "86 kg": 64 Bold (no Bold weight in the app, so SemiBold), -2 letter spacing, 68 line.
  kg: {
    fontFamily: Fonts.semiBold,
    fontSize: 64,
    lineHeight: 68,
    letterSpacing: -2,
  },
  // The app has no Poppins Bold, so "86 kg" is ~6 px narrower; this keeps "in 2 hours" on Figma's x.
  time: {
    lineHeight: 24,
    marginStart: 6,
  },
  line17: {
    lineHeight: 17,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  // Figma "Your part": 12 padding and gap, 18 radius.
  yours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  flex: {
    flex: 1,
  },
  // Figma "Share bar" is 324 wide (ends at x 340).
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    marginEnd: Spacing.one,
  },
});
