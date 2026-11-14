import { Image } from 'expo-image';
import { router } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Toggle } from '@/components/ui/toggle';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { CLEANUP_DETAILS } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;
const CREW_MIN = 4;
const CREW_MAX = 25;

/**
 * C1 v2 Clean-up details: the host edits what Earthy drafted, in grouped cards. Reached from "Edit" and the
 * place row on F10·10, and from "Fix it" on F10·16b. "Save changes" goes back. SAMPLE: nothing is saved.
 */
export default function CleanupDetailsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState<string>(CLEANUP_DETAILS.name);
  const [crewSize, setCrewSize] = useState<number>(CLEANUP_DETAILS.crewSize);
  const [under18, setUnder18] = useState(true);
  const [rides, setRides] = useState(true);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/cleanup-draft'));

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader
        title="Clean-up details"
        centred
        onBack={close}
        action={{
          art: <EarthyOrb size={22} state="still" glow={false} />,
          label: 'Ask Earthy about your clean-up',
          onPress: () => router.push('/host-earthy'),
        }}
      />
      <ScrollView
        contentContainerStyle={[styles.form, { paddingBottom: 88 + insets.bottom + Spacing.five }]}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.name, { backgroundColor: theme.loaderCard }]}>
          <ThemedText type="caption" themeColor="textWeak">
            Name
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            accessibilityLabel="Clean-up name"
            placeholderTextColor={theme.textPlaceholder}
            style={[styles.nameInput, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>

        <Group title="When">
          {/* Date and time pickers aren't designed yet: the pills say "Coming soon". */}
          <Row icon="calendar" title="Date" end={<ValuePill text={CLEANUP_DETAILS.date} label="Change date" />} />
          <Row
            icon="clock"
            title="Time"
            divider
            tight
            end={
              <View style={styles.times}>
                <ValuePill text={CLEANUP_DETAILS.start} label="Change start time" />
                <ThemedText type="meta13" themeColor="textWeak">
                  –
                </ThemedText>
                <ValuePill text={CLEANUP_DETAILS.end} label="Change end time" />
              </View>
            }
          />
          <View style={styles.hint}>
            <ThemedText type="caption" themeColor="textWeak">
              {CLEANUP_DETAILS.heat}
            </ThemedText>
          </View>
        </Group>

        <Group title="Where">
          <View style={styles.map} accessible accessibilityLabel={`Map: meeting point at ${CLEANUP_DETAILS.place}`}>
            <Image
              source={require('@/assets/images/host/dubai-map.jpg')}
              style={styles.mapImage}
              contentFit="cover"
              accessible={false}
            />
            <View style={styles.pinAnchor} pointerEvents="none">
              <View style={[styles.pin, { backgroundColor: theme.meetPin, borderColor: theme.meetPinStroke }]}>
                <View style={[styles.pinDot, { backgroundColor: theme.brand, borderColor: theme.textOnBrand }]} />
                <ThemedText type="pinLabel">Meet here</ThemedText>
              </View>
              <Svg width={12} height={5.8} viewBox="0 0 12 5.8">
                <Path d="M0 0H12L7 5.4C6.333 5.933 5.667 5.933 5 5.4L0 0Z" fill={theme.meetPinStroke} />
              </Svg>
            </View>
            {/* Recentring needs the real map; it says "Coming soon" for now. */}
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Recentre the map"
              style={[styles.recentre, { backgroundColor: theme.glassOnMap, borderColor: theme.meetPinStroke }]}>
              <Icon name="locate" size={16} color="textStrong" strokeWidth={1.5} />
            </Tappable>
          </View>
          <Row
            icon="pin"
            title={CLEANUP_DETAILS.place}
            note={CLEANUP_DETAILS.placeNote}
            end={
              // Moving the meeting point isn't designed yet: says "Coming soon".
              <Tappable accessibilityRole="button" accessibilityLabel="Change meeting point" hitSlop={8}>
                <ThemedText type="labelSmall" themeColor="brand">
                  Change
                </ThemedText>
              </Tappable>
            }
          />
        </Group>

        <Group title="Who can join">
          <Row
            icon="users"
            title="Crew size"
            note={CLEANUP_DETAILS.crewNote}
            end={<Stepper value={crewSize} onChange={setCrewSize} />}
          />
          <Row
            icon="shield-check"
            title="Open to under-18s"
            note="Needs a guardian’s OK in the app"
            divider
            end={<Toggle value={under18} onValueChange={setUnder18} label="Open to under-18s" />}
          />
          <Row
            icon="car"
            title="Shared rides"
            note="Neighbours can offer seats"
            divider
            end={<Toggle value={rides} onValueChange={setRides} label="Shared rides" />}
          />
        </Group>

        <Group title="Rewards">
          <Row
            icon="smile"
            title="Smileys per check-in"
            note="Given when the QR is scanned on site"
            end={<ValuePill text={`${CLEANUP_DETAILS.smileys}`} label="Change Smileys per check-in" />}
          />
        </Group>
      </ScrollView>

      <View
        style={[
          styles.bar,
          { backgroundColor: theme.saveBar, borderTopColor: theme.strokeCard, paddingBottom: Math.max(insets.bottom, 29) },
        ]}>
        <Button
          label="Save changes"
          flat
          disabled={name.trim().length === 0}
          onPress={() => {
            feedback.play('button.primary');
            close();
          }}
        />
      </View>
    </View>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <>
      <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header">
        {title}
      </ThemedText>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>{children}</View>
    </>
  );
}

function Row({
  icon,
  title,
  note,
  end,
  divider = false,
  tight = false,
}: {
  icon: IconName;
  title: string;
  note?: string;
  end: ReactNode;
  divider?: boolean;
  /** The time row hands its bottom padding to the heat hint under it. */
  tight?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        tight && styles.rowTight,
        divider && { borderTopWidth: 1, borderTopColor: theme.strokeCard },
      ]}>
      <Icon name={icon} size={20} color="brand" strokeWidth={1.6} />
      <View style={styles.rowText}>
        <ThemedText type="bodyMedium14">{title}</ThemedText>
        {note && (
          <ThemedText type="caption" themeColor="textWeak">
            {note}
          </ThemedText>
        )}
      </View>
      {end}
    </View>
  );
}

function ValuePill({ text, label }: { text: string; label: string }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${label}, now ${text}`}
      style={[styles.pill, { backgroundColor: theme.hostTint }]}>
      <ThemedText type="labelSmall" themeColor="brand">
        {text}
      </ThemedText>
    </Tappable>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const theme = useTheme();
  const set = (next: number) => onChange(Math.min(CREW_MAX, Math.max(CREW_MIN, next)));
  return (
    <View
      style={[styles.stepper, { borderColor: theme.strokeChip }]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Crew size"
      accessibilityValue={{ now: value, min: CREW_MIN, max: CREW_MAX }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => set(value + (event.nativeEvent.actionName === 'increment' ? 1 : -1))}>
      <Tappable accessibilityRole="button" accessibilityLabel="Fewer people" hitSlop={8} disabled={value <= CREW_MIN} onPress={() => set(value - 1)}>
        <ThemedText type="fieldValue" themeColor={value <= CREW_MIN ? 'strokeStrong' : 'brand'} style={styles.stepGlyph}>
          –
        </ThemedText>
      </Tappable>
      <ThemedText type="labelMedium14" style={styles.stepValue}>
        {value}
      </ThemedText>
      <Tappable accessibilityRole="button" accessibilityLabel="More people" hitSlop={8} disabled={value >= CREW_MAX} onPress={() => set(value + 1)}>
        <ThemedText type="fieldValue" themeColor={value >= CREW_MAX ? 'strokeStrong' : 'brand'} style={styles.stepGlyph}>
          +
        </ThemedText>
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    // Figma "Form" starts at y 108, 4 px under the 104 px header.
    paddingTop: Spacing.one,
  },
  name: {
    gap: Spacing.half,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
  nameInput: {
    padding: 0,
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  rowTight: {
    paddingBottom: Spacing.oneHalf,
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  times: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  hint: {
    paddingStart: 48,
    paddingEnd: Spacing.three,
    paddingBottom: Spacing.threeLess,
  },
  pill: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.small,
  },
  map: {
    height: 128,
    overflow: 'hidden',
  },
  // Figma crop of the map image: 161.29% × 547.72% of the box, offset −22.58% / −234.81%.
  mapImage: {
    position: 'absolute',
    width: '161.29%',
    height: '547.72%',
    left: '-22.58%',
    top: '-234.81%',
  },
  // The pill's pointer sits at x 185 of 328 in Figma (56.4%); a 160 px anchor centred on that point holds it.
  pinAnchor: {
    position: 'absolute',
    top: 34,
    start: '56.4%',
    width: 160,
    marginStart: -80,
    alignItems: 'center',
  },
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  recentre: {
    position: 'absolute',
    top: 10,
    end: Spacing.twoThreeQuarters,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  // Figma stepper glyphs are text: 16 medium at 24.
  stepGlyph: {
    lineHeight: 24,
  },
  stepValue: {
    minWidth: 18,
    textAlign: 'center',
  },
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingTop: 11,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
});
