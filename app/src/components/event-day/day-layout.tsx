import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Toast } from '@/components/ui/toast';
import { Radius, Spacing } from '@/constants/theme';
import { DAY_EVENT, type DayPhase } from '@/data/event-day.sample';
import { useTheme } from '@/hooks/use-theme';

const PHASES: readonly DayPhase[] = ['before', 'arrival', 'during', 'after'];
const PHASE_LABEL: Record<DayPhase, string> = { before: 'Before', arrival: 'Arrival', during: 'During', after: 'After' };

type Action = { label: string; onPress: () => void };

type DayLayoutProps = {
  phase: DayPhase;
  /** The date line under "Kite Beach clean-up", such as "Today · Sat 5 Dec · 6:52 AM". */
  when: string;
  title: string;
  subtitle: string;
  /** Filled button on the end side and the outlined one before it. */
  primary?: Action;
  secondary?: Action;
  /** The Help glass button in the header (F11·6, F11·8), which opens "What do you need?". */
  onHelp?: () => void;
  /** Jump to the first card of another phase from the stepper. */
  onPhase?: (phase: DayPhase) => void;
  /** A short confirmation above the buttons, such as "Certificate sent to your email". */
  toast?: string | null;
  children: ReactNode;
};

/**
 * One Earthy card on event day (Figma F11·1–11, 13 Nov): the blue event header, a four-step phase bar, a title with
 * a line under it, the card's content and two pill buttons.
 */
export function DayLayout({
  phase,
  when,
  title,
  subtitle,
  primary,
  secondary,
  onHelp,
  onPhase,
  toast,
  children,
}: DayLayoutProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, FOOTER_BOTTOM);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader
        angled
        title={DAY_EVENT.title}
        subtitle={when}
        action={
          onHelp && { label: 'Help', art: <Icon name="help" size={22} color="textOnBrand" strokeWidth={1.75} />, onPress: onHelp }
        }
      />
      <PhaseBar phase={phase} onPhase={onPhase} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(260)} style={styles.content}>
          <View style={styles.titles}>
            <ThemedText type="etaTitle" accessibilityRole="header">
              {title}
            </ThemedText>
            <ThemedText type="hint" themeColor="textWeak">
              {subtitle}
            </ThemedText>
          </View>
          {children}
        </Animated.View>
      </ScrollView>

      {toast && (
        <View style={[styles.toast, { bottom: bottom + FOOTER_ROW + Spacing.three }]} pointerEvents="none">
          <Toast icon="check" text={toast} />
        </View>
      )}
      {(primary || secondary) && (
        <View style={[styles.footer, { backgroundColor: theme.card, paddingBottom: bottom }]}>
          {secondary && <PillButton {...secondary} outline />}
          {primary && <PillButton {...primary} />}
        </View>
      )}
    </View>
  );
}

// Figma StickyFooter: 88 tall, 12 above the 48 px buttons and 28 below.
const FOOTER_ROW = 48 + Spacing.twoThreeQuarters;
const FOOTER_BOTTOM = 28;

/** Figma footer button: 48 px pill, 16 SemiBold; the outlined one has a 1.5 px brand edge. */
function PillButton({ label, onPress, outline = false }: Action & { outline?: boolean }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.button,
        outline ? { backgroundColor: theme.card, borderColor: theme.brand, borderWidth: 1.5 } : { backgroundColor: theme.brand },
      ]}>
      <ThemedText type="sectionTitle" themeColor={outline ? 'brand' : 'textOnBrand'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

/** Before · Arrival · During · After: done phases are pale with a tick, the current one is solid blue. */
function PhaseBar({ phase, onPhase }: { phase: DayPhase; onPhase?: (phase: DayPhase) => void }) {
  const theme = useTheme();
  const current = PHASES.indexOf(phase);
  return (
    <View style={styles.phases} accessibilityRole="tablist">
      {PHASES.map((step, index) => {
        const done = index < current;
        const now = index === current;
        const look = [
          styles.phase,
          now
            ? { backgroundColor: theme.brand }
            : done
              ? { backgroundColor: theme.fill }
              : { backgroundColor: theme.card, borderColor: theme.strokeWeak, borderWidth: 1 },
        ];
        const label = (
          <>
            {done && <Icon name="check" size={14} color="brand" strokeWidth={2.5} />}
            <ThemedText type={now ? 'dateline' : 'chip'} themeColor={now ? 'textOnBrand' : done ? 'brand' : 'strokeStrong'}>
              {PHASE_LABEL[step]}
            </ThemedText>
          </>
        );
        return now ? (
          <View key={step} accessibilityRole="tab" accessibilityState={{ selected: true }} style={look}>
            {label}
          </View>
        ) : (
          <Tappable
            key={step}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            accessibilityLabel={`${PHASE_LABEL[step]}${done ? ', done' : ''}`}
            onPress={() => onPhase?.(step)}
            style={look}>
            {label}
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma: the phase bar sits 12 under the header (y 116), 32 tall, 6 apart.
  phases: {
    flexDirection: 'row',
    gap: Spacing.oneHalf,
    marginTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  phase: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    borderRadius: Radius.pill,
  },
  scroll: {
    flexGrow: 1,
  },
  // Figma content starts at y 168, 20 under the phase bar, with 16 between blocks.
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.three,
  },
  titles: {
    gap: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  button: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  toast: {
    position: 'absolute',
    start: Spacing.four,
    end: Spacing.four,
  },
});
