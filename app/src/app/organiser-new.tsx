import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenInsight } from '@/components/earthy/insight';
import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { GlassButton } from '@/components/ui/glass-button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Toast } from '@/components/ui/toast';
import { Toggle } from '@/components/ui/toggle';
import { Fonts, Gradients, Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;

/**
 * Organiser console · New Clean-up (Figma C1 v2; v1 is the earlier wireframe of the same form).
 * EEG reviews it before it goes live. Earthy offers to draft it (F10·7). SAMPLE: nothing is sent.
 */
export default function OrganiserNewRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nameRef = useRef<ViewInstance>(null);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [under18, setUnder18] = useState(true);
  const [rides, setRides] = useState(true);
  const [smileys, setSmileys] = useState(50);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const submit = () => {
    setToast('Sent to EEG for review. Usually within a day.');
    setTimeout(() => (router.canGoBack() ? router.back() : router.replace('/home')), 1600);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <LinearGradient {...Gradients.header} style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <View style={styles.headerBar}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={() => router.back()}
            style={[styles.cancel, { backgroundColor: theme.glassOnBrand, borderColor: theme.passGlassStroke }]}>
            <ThemedText type="linkRow" themeColor="textOnBrand">
              Cancel
            </ThemedText>
          </Tappable>
          {/* The organiser's more menu isn't designed yet. */}
          <GlassButton icon="more" label="More options" surface="brand" />
        </View>
        <ThemedText style={styles.title} themeColor="textOnBrand" accessibilityRole="header">
          New Clean-up
        </ThemedText>
        <ThemedText type="hint" themeColor="textOnBrandWeak">
          EEG reviews it before it goes live, usually within a day.
        </ThemedText>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        keyboardShouldPersistTaps="handled">
        <Section title="Details">
          <View ref={nameRef} collapsable={false} style={[styles.row, { borderColor: theme.divider }]}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name, e.g. Kite Beach Clean-up"
              placeholderTextColor={theme.strokeStrong}
              accessibilityLabel="Clean-up name"
              style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
            />
          </View>
          {/* Date and time pickers aren't designed yet; the values are shown as in Figma. */}
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <ThemedText type="lead">Date</ThemedText>
            <Pill text="Sat, 5 Dec" />
          </View>
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <ThemedText type="lead">Time</ThemedText>
            <View style={styles.times}>
              <Pill text="7:00 AM" />
              <ThemedText type="lead">–</ThemedText>
              <Pill text="10:00 AM" />
            </View>
          </View>
        </Section>

        <Section title="Meeting Point">
          <View style={styles.map}>
            <ZoomableMap controls={{ bottom: Spacing.two, end: Spacing.two }}>
              <MapArt left={-120} top={-150} />
            </ZoomableMap>
          </View>
          <View style={[styles.place, { borderColor: theme.divider }]}>
            <Icon name="pin" size={20} color="brand" strokeWidth={1.75} />
            <View style={styles.flex}>
              <ThemedText type="lead">Kite Beach</ThemedText>
              <ThemedText type="note" themeColor="textWeak">
                Umm Suqeim 1, Dubai
              </ThemedText>
            </View>
            {/* Moving the pin isn't designed yet. */}
            <ThemedText type="linkRow" themeColor="brand">
              Edit
            </ThemedText>
          </View>
          <ThemedText type="note" themeColor="textWeak" style={styles.help}>
            Volunteers see the exact pin 2 days before the clean-up.
          </ThemedText>
        </Section>

        <Section title="Volunteers">
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <ThemedText type="lead">Capacity</ThemedText>
            <Stepper value={capacity} min={5} max={500} step={5} label="volunteers" onChange={setCapacity} />
          </View>
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <ThemedText type="lead">Open to Under-18s</ThemedText>
            <Toggle value={under18} onValueChange={setUnder18} label="Open to under-18s" />
          </View>
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <ThemedText type="lead">Shared Rides</ThemedText>
            <Toggle value={rides} onValueChange={setRides} label="Offer shared rides" />
          </View>
          {under18 && (
            <ThemedText type="note" themeColor="textWeak" style={styles.help}>
              Under-18s join only after a guardian approves in the app.
            </ThemedText>
          )}
        </Section>

        <Section title="Rewards">
          <View style={[styles.row, styles.between, { borderColor: theme.divider }]}>
            <View style={styles.flex}>
              <ThemedText type="lead">Smileys</ThemedText>
              <ThemedText type="note" themeColor="textWeak">
                Per check-in, given when the QR is scanned on site
              </ThemedText>
            </View>
            <Stepper value={smileys} min={10} max={200} step={10} label="Smileys per check-in" onChange={setSmileys} />
          </View>
        </Section>
      </ScrollView>

      {toast && (
        <View style={[styles.toast, { bottom: insets.bottom + 96 }]} pointerEvents="none">
          <Toast icon="check" text={toast} />
        </View>
      )}
      <View
        style={[
          styles.footer,
          { bottom: Math.max(insets.bottom, Spacing.three), backgroundColor: theme.glassOnMap, boxShadow: Shadows.glassPill },
        ]}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Save draft"
          onPress={() => setToast('Draft saved')}
          style={[styles.draft, { backgroundColor: theme.fill }]}>
          <ThemedText type="buttonPrimary" themeColor="brand">
            Save Draft
          </ThemedText>
        </Tappable>
        <View style={styles.flex}>
          <Button label="Submit for Review" pill flat disabled={name.trim().length === 0} onPress={submit} />
        </View>
      </View>

      <ScreenInsight id="organiser" target={nameRef} onAction={() => router.push('/cleanup-draft')} />
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="labelLarge" accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function Pill({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme.fill }]}>
      <ThemedText type="lead" themeColor="brand">
        {text}
      </ThemedText>
    </View>
  );
}

function Stepper({
  value,
  min,
  max,
  step,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  onChange: (value: number) => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={[styles.stepper, { backgroundColor: theme.fill }]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: value, min, max }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) =>
        onChange(Math.min(max, Math.max(min, value + (event.nativeEvent.actionName === 'increment' ? step : -step))))
      }>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`Fewer ${label}`}
        hitSlop={8}
        disabled={value <= min}
        onPress={() => onChange(value - step)}>
        <Icon name="minus" size={18} color={value <= min ? 'strokeStrong' : 'brand'} />
      </Tappable>
      <ThemedText type="labelLarge" style={styles.stepValue}>{`${value}`}</ThemedText>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`More ${label}`}
        hitSlop={8}
        disabled={value >= max}
        onPress={() => onChange(value + step)}>
        <Icon name="plus" size={18} color={value >= max ? 'strokeStrong' : 'brand'} />
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.twoHalf,
  },
  cancel: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 32,
    lineHeight: 40,
  },
  content: {
    paddingHorizontal: Spacing.three,
  },
  section: {
    marginTop: Spacing.three,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.one,
  },
  row: {
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    paddingVertical: Spacing.one,
  },
  times: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  map: {
    height: 140,
    overflow: 'hidden',
    borderTopLeftRadius: Radius.option,
    borderTopRightRadius: Radius.option,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderBottomWidth: 1,
  },
  flex: {
    flex: 1,
  },
  help: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  stepValue: {
    minWidth: 30,
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    start: Spacing.four,
    end: Spacing.four,
  },
  footer: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.pill,
  },
  draft: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
});
