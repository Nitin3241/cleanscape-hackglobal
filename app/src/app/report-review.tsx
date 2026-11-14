import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Initials } from '@/components/event-day/day-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { GlassButton } from '@/components/ui/glass-button';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { Tappable } from '@/components/ui/tappable';
import { Toggle } from '@/components/ui/toggle';
import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { ALREADY, REVIEW, type ReportScene, SPOT_PLACE, VOICE_NOTE } from '@/data/reports.sample';
import { useTheme } from '@/hooks/use-theme';
import { finishReport } from '@/state/reports';

const BEACH = require('@/assets/images/report-beach-camera.png');

// A new report goes through R1·2p Check your photo first (Figma, 13 Nov); a hazard (R1·2b) and a +1 are sent
// straight away, as the prototype links them to R1·3 and R1·3c.
const send = (kind: 'new' | 'hazard' | 'plusOne') => {
  if (kind === 'new') {
    router.push('/report-photo-check');
    return;
  }
  finishReport();
  router.replace({ pathname: '/report-sent', params: { kind: kind === 'hazard' ? 'new' : kind } });
};

/**
 * R1·2 / R1·2b / R1·2c: Earthy's draft of the report over the photo. Everything can be changed
 * before sending. If someone already reported the spot nearby, it offers a +1 instead.
 */
export default function ReportReviewRoute() {
  const params = useLocalSearchParams<{ kind?: ReportScene; note?: string }>();
  const kind: ReportScene = params.kind === 'hazard' || params.kind === 'already' ? params.kind : 'normal';
  const [showReview, setShowReview] = useState(kind !== 'already');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image source={BEACH} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      <View style={[styles.close, { top: insets.top + Spacing.one }]}>
        <GlassButton icon="close" label="Close report" onPress={() => router.back()} surface="brand" />
      </View>
      {showReview ? (
        <Review hazard={kind === 'hazard'} withNote={params.note === '1'} />
      ) : (
        <Already onDifferent={() => setShowReview(true)} />
      )}
    </View>
  );
}

function Sheet({ children, top }: { children: React.ReactNode; top: number }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Animated.View entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)} style={[styles.sheet, { top, backgroundColor: theme.card }]}>
      <View style={[styles.grabber, { backgroundColor: theme.seatEmpty }]} />
      <ScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}

function Review({ hazard, withNote }: { hazard: boolean; withNote: boolean }) {
  const theme = useTheme();
  const data = hazard ? REVIEW.hazard : REVIEW.normal;
  const [items, setItems] = useState(data.items);
  const [size, setSize] = useState(1);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <Sheet top={hazard ? 178 : 156}>
      <View style={styles.titleRow}>
        <EarthyOrb size={26} state="still" glow={false} />
        <View style={styles.flex}>
          <ThemedText type="screenTitle" accessibilityRole="header">
            {data.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {data.note}
          </ThemedText>
        </View>
      </View>

      {hazard && (
        <View style={[styles.warning, { backgroundColor: theme.accentSubtle }]} accessibilityRole="alert">
          <View style={[styles.warnIcon, { backgroundColor: theme.textAccent }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand">
              !
            </ThemedText>
          </View>
          <View style={styles.flex}>
            <ThemedText type="label" themeColor="textAccent">
              {REVIEW.hazard.warning.title}
            </ThemedText>
            <ThemedText type="caption">{REVIEW.hazard.warning.body}</ThemedText>
            <View style={[styles.sentTo, { borderColor: theme.accent, backgroundColor: theme.card }]}>
              <ThemedText type="small" themeColor="textAccent">
                {REVIEW.hazard.warning.sentTo}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      <View style={styles.group}>
        <ThemedText type="labelSmall">What’s there</ThemedText>
        <View style={styles.chips}>
          {items.map((item, index) => {
            const isHazard = 'hazard' in item && item.hazard;
            return (
              <Tappable
                key={item.label}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.on }}
                accessibilityLabel={item.label}
                onPress={() => setItems((list) => list.map((it, i) => (i === index ? { ...it, on: !it.on } : it)))}
                style={[
                  styles.chip,
                  item.on
                    ? { backgroundColor: isHazard ? theme.accentSubtle : theme.fill, borderColor: isHazard ? theme.textAccent : theme.brand }
                    : { backgroundColor: theme.card, borderColor: theme.strokeControl },
                ]}>
                <ThemedText type="bodyMedium" themeColor={item.on ? (isHazard ? 'textAccent' : 'brand') : 'textWeak'}>
                  {item.on ? `✓ ${item.label}` : item.label}
                </ThemedText>
              </Tappable>
            );
          })}
          {/* Adding an item type isn't designed yet. */}
          <View style={[styles.chip, { backgroundColor: theme.card, borderColor: theme.strokeControl }]}>
            <ThemedText type="bodyMedium">+ Add</ThemedText>
          </View>
        </View>
      </View>

      {!hazard && (
        <View style={styles.group}>
          <ThemedText type="labelSmall">How big is it?</ThemedText>
          <View style={[styles.segments, { backgroundColor: theme.wellCool }]} accessibilityRole="radiogroup">
            {REVIEW.sizes.map((option, index) => {
              const on = size === index;
              return (
                <Tappable
                  key={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${option.label}, ${option.note}`}
                  onPress={() => setSize(index)}
                  style={[styles.segment, on && { backgroundColor: theme.card }]}>
                  <ThemedText type="labelSmall" themeColor={on ? 'brand' : 'textStrong'}>
                    {option.label}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textWeak">
                    {option.note}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>
      )}

      <View style={[styles.place, { borderColor: theme.strokeWeak }]}>
        <View style={[styles.placeIcon, { backgroundColor: theme.fill }]}>
          <Icon name="pin" size={20} color="textPaper" strokeWidth={2} />
        </View>
        <View style={styles.flex}>
          <ThemedText type="label">{SPOT_PLACE.name}</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {SPOT_PLACE.accuracy}
          </ThemedText>
        </View>
        {/* Moving the pin isn't designed yet. */}
        <ThemedText type="labelSmall" themeColor="brand">
          Adjust
        </ThemedText>
      </View>

      <View style={[styles.note, { borderColor: withNote ? theme.brand : theme.strokeControl }]}>
        <Icon name="mic" size={18} color={withNote ? 'brand' : 'textWeak'} strokeWidth={1.75} />
        <ThemedText type="hint" themeColor={withNote ? 'textStrong' : 'textWeak'} style={styles.flex}>
          {withNote ? VOICE_NOTE : 'Add a note (optional)'}
        </ThemedText>
      </View>

      <View style={styles.anon}>
        <View style={styles.flex}>
          <ThemedText type="label">Report anonymously</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            Your name stays hidden from others
          </ThemedText>
        </View>
        <Toggle value={anonymous} onValueChange={setAnonymous} label="Report anonymously" />
      </View>

      <Button label="Send report" size="large" disabled={!items.some((item) => item.on)} onPress={() => send(hazard ? 'hazard' : 'new')} />
    </Sheet>
  );
}

function Already({ onDifferent }: { onDifferent: () => void }) {
  const theme = useTheme();
  return (
    <Sheet top={316}>
      <View style={styles.alreadyHead}>
        <Initials people={ALREADY.people} size={40} />
        <ThemedText type="screenTitle" accessibilityRole="header" style={styles.center}>
          {ALREADY.title}
        </ThemedText>
        <ThemedText type="hint" themeColor="textWeak" style={styles.center}>
          {ALREADY.body}
        </ThemedText>
      </View>
      <View style={[styles.existing, { borderColor: theme.strokeWeak }]}>
        <Image source={BEACH} style={styles.existingThumb} contentFit="cover" contentPosition="bottom" accessible={false} />
        <View style={styles.flex}>
          <ThemedText type="label">{ALREADY.spot}</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {ALREADY.meta}
          </ThemedText>
          <View style={styles.tags}>
            <View style={[styles.miniTag, { backgroundColor: theme.fill }]}>
              <ThemedText type="small" themeColor="brand">
                {ALREADY.tags[0]}
              </ThemedText>
            </View>
            <View style={[styles.miniTag, { backgroundColor: theme.secondarySubtle }]}>
              <ThemedText type="small" themeColor="textSecondary">
                {ALREADY.tags[1]}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.reward}>
        <Smiley size={18} />
        <ThemedText type="bodyMedium" themeColor="textSecondary">
          {ALREADY.reward}
        </ThemedText>
      </View>
      <Button label="Add +1" size="large" onPress={() => send('plusOne')} />
      <Button label="Different spot" variant="outline" size="large" onPress={onDifferent} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1A20',
  },
  close: {
    position: 'absolute',
    start: Spacing.three,
    zIndex: 2,
  },
  sheet: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    borderTopStartRadius: Radius.panel,
    borderTopEndRadius: Radius.panel,
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    marginTop: Spacing.twoHalf,
    borderRadius: 2,
  },
  sheetContent: {
    gap: Spacing.threeLess,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  flex: {
    flex: 1,
  },
  warning: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  warnIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  sentTo: {
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  group: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  segments: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.option,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  placeIcon: {
    width: 52,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  anon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  alreadyHead: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  existing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  existingThumb: {
    width: 64,
    height: 64,
    borderRadius: Radius.small,
  },
  tags: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  miniTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.small,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
  },
});
