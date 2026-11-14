import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListScanToggle } from '@/components/scan/list-scan-toggle';
import { ScanBrackets } from '@/components/scan/scan-brackets';
import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { CHECK_IN, ROSTER, SCAN_ISSUES, type ScanIssue } from '@/data/check-in.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { useRole } from '@/state/role';

const TOAST_OUT_MS = 3400;

/** F4·2 and F4·2a–c: the crew head scans passes. Works offline; problems show in a sheet. */
export default function CrewScanRoute() {
  const theme = useTheme();
  const { setRole } = useRole();
  // Keep the demo role switch in step with the screen, however it was opened.
  useEffect(() => setRole('crewHead'), [setRole]);
  const insets = useSafeAreaInsets();
  // DEMO: each tap on the scan window steps through Figma's cases: not on roster, already in, no approval.
  // `?case=0|1|2` opens F4·2a, F4·2b or F4·2c straight away (demo links and screen checks).
  const { case: startCase } = useLocalSearchParams<{ case?: string }>();
  const [step, setStep] = useState(() => (startCase !== undefined && Number(startCase) >= 0 && Number(startCase) < SCAN_ISSUES.length ? Number(startCase) : -1));
  // The "checked in" toast shows after each scan and leaves at 3.4 s.
  const [toastGoneFor, setToastGoneFor] = useState<number | null>(null);
  const toastShown = toastGoneFor !== step;
  useEffect(() => {
    const timer = setTimeout(() => setToastGoneFor(step), TOAST_OUT_MS);
    return () => clearTimeout(timer);
  }, [step]);
  const issue: ScanIssue | undefined = step >= 0 ? SCAN_ISSUES[step] : undefined;
  const recent = ROSTER.filter((person) => person.status === 'in');

  function scan() {
    feedback.play('button.primary');
    // DEMO: after Figma's three problem cases, the next scan is a bag sticker (F5·3 weigh-in).
    if (step === SCAN_ISSUES.length - 1 || step === -2) {
      setStep(-1);
      router.push('/bag-weigh');
      return;
    }
    setStep((current) => current + 1);
  }

  // After the last case, close the sheet; the next tap on the window weighs a bag.
  const next = () => setStep((current) => (current + 1 < SCAN_ISSUES.length ? current + 1 : -2));
  const close = () => setStep(-1);

  return (
    <Scanner
      feed={require('@/assets/images/scan-crew-camera.jpg')}
      title={`${CHECK_IN.rosterTitle} check-in`}
      subtitle={CHECK_IN.place}
      header={
        <View style={styles.progress} accessible accessibilityLabel={`${CHECK_IN.checkedIn} of ${CHECK_IN.total} checked in`}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelSmall" themeColor="textOnBrand" style={styles.progressLabel}>
              {`${CHECK_IN.checkedIn} of ${CHECK_IN.total} checked in`}
            </ThemedText>
            <ThemedText type="filterLabelTight" themeColor="timeNoteOnBrand" style={styles.toGo}>
              {`${CHECK_IN.total - CHECK_IN.checkedIn} to go`}
            </ThemedText>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(CHECK_IN.checkedIn / CHECK_IN.total) * 100}%`, backgroundColor: theme.checkInBar }]} />
          </View>
        </View>
      }>
      {/* Figma "Camera": dimmed 22%, then a top scrim (190 px) and a bottom scrim (260 px from y 540). */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.scanCameraDim }]} pointerEvents="none" />
      <LinearGradient colors={[theme.scanScrimTop, 'rgba(5, 15, 20, 0)']} style={styles.scrimTop} pointerEvents="none" />
      <LinearGradient colors={['rgba(5, 15, 20, 0)', theme.scanScrimBottom]} style={styles.scrimBottom} pointerEvents="none" />

      {/* F4·2: marigold brackets at y 236 with the line. F4·2a–c: white brackets at x 60, y 212, no line. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scan a pass"
        onPress={scan}
        style={[styles.window, issue ? { top: insets.top + 168, marginStart: -120 } : { top: insets.top + 192 }]}>
        <ScanBrackets size={240} arm={34} stroke={4} line={!issue} color={issue ? 'textOnBrand' : 'scanBracket'} />
      </Pressable>

      {!issue && toastShown && (
        <Animated.View
          entering={FadeIn.delay(200).duration(200)}
          exiting={FadeOut.duration(200)}
          accessibilityLiveRegion="polite"
          style={[styles.success, { top: insets.top + 104, backgroundColor: theme.checkInToast, borderColor: theme.passGlassStroke }]}>
          <View style={[styles.successTick, { backgroundColor: theme.textOnBrand }]}>
            <Icon name="check" size={13} color="statusSuccess" strokeWidth={3} />
          </View>
          <View style={styles.successText}>
            <ThemedText type="labelSmall" themeColor="textOnBrand" style={styles.progressLabel}>
              {`${recent[0].name} checked in`}
            </ThemedText>
            <ThemedText type="ticketCaption" themeColor="statusSuccessSubtle" style={styles.toastSub}>
              {`${recent[0].crew} · ${CHECK_IN.time}`}
            </ThemedText>
          </View>
        </Animated.View>
      )}

      {!issue && (
        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 17) }]} pointerEvents="box-none">
          <View style={[styles.recent, { backgroundColor: theme.scanCard, borderColor: theme.scanCardStroke }]}>
            <ThemedText type="chipAction" themeColor="timeNoteOnBrand" style={styles.recentLabel}>
              Recent
            </ThemedText>
            {recent.map((person) => (
              <View key={person.initials} style={styles.recentRow}>
                <View style={[styles.avatar, { backgroundColor: theme[person.initials === 'SA' ? 'avatarSea' : person.tone] }]}>
                  <ThemedText type="chipAction" themeColor="textOnBrand">
                    {person.initials}
                  </ThemedText>
                </View>
                <View style={styles.flex}>
                  <ThemedText type="labelMedium14" themeColor="textOnBrand">
                    {person.name}
                  </ThemedText>
                  <ThemedText type="meta" themeColor="timeNoteOnBrand">
                    {person.crew}
                  </ThemedText>
                </View>
                <ThemedText type="filterLabel" themeColor="checkedInOnDark">
                  {person.time}
                </ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.controls}>
            <ListScanToggle active="scan" />
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Search the roster"
              onPress={() => router.replace('/crew-roster')}
              style={[styles.search, { borderColor: theme.glassStroke, backgroundColor: theme.glassOnBrand }]}>
              <Icon name="search" size={22} color="textOnBrand" strokeWidth={1.75} />
            </Tappable>
          </View>
        </View>
      )}

      {issue && <IssueSheet issue={issue} onPrimary={next} onSecondary={close} />}
    </Scanner>
  );
}

/** F4·2a–c Result sheet: floating (x 8, 8 above the bottom, 32 radius), 12 / 28 / 20 padding, 14 gap, centred. */
function IssueSheet({ issue, onPrimary, onSecondary }: { issue: ScanIssue; onPrimary: () => void; onSecondary: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const warning = issue.kind === 'alreadyIn';

  return (
    <Animated.View entering={FadeIn.duration(150)} style={[StyleSheet.absoluteFill, styles.issueLayer, { backgroundColor: theme.scanIssueDim }]} pointerEvents="box-none">
      <Animated.View
        entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
        accessibilityViewIsModal
        style={[styles.sheet, { backgroundColor: theme.card, bottom: Math.max(insets.bottom, Spacing.two) }]}>
        <View style={[styles.grabber, { backgroundColor: theme.strokeChip }]} />
        <View style={[styles.issueIcon, { backgroundColor: warning ? theme.secondarySubtle : theme.issueRedFill }]}>
          <ThemedText type="issueGlyph" themeColor={warning ? 'textPaper' : 'issueRed'}>
            {issue.kind === 'notOnRoster' ? '✕' : '!'}
          </ThemedText>
        </View>
        <ThemedText type="sheetTitle" accessibilityRole="header" style={[styles.centred, styles.issueTitle]}>
          {issue.title}
        </ThemedText>
        <ThemedText type="body14" themeColor="textWeak" style={[styles.centred, styles.issueBody]}>
          {issue.body}
        </ThemedText>
        <View style={[styles.person, { backgroundColor: theme.tileNeutral }]}>
          <View style={[styles.personAvatar, { backgroundColor: theme[issue.person.tone] }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand">
              {issue.person.initials}
            </ThemedText>
          </View>
          <View>
            <ThemedText type="labelMedium14">{issue.person.name}</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              {issue.person.detail}
            </ThemedText>
          </View>
        </View>
        <View style={styles.sheetActions}>
          <Button label={issue.primary} flat onPress={onPrimary} />
          {/* DEMO: "Add guest" and "Call parent" aren't designed further; they close the sheet. */}
          {'secondary' in issue && issue.secondary && <Button label={issue.secondary} variant="secondary" flat onPress={onSecondary} />}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Figma "Progress": x 24, y 112, 312 wide; row then a 6 px bar, 8 apart.
  // Measured against Figma: label box 107–127, bar at 130 (the frame's 10 px row lets the text overflow it).
  progress: {
    gap: 3,
    marginTop: 1,
    marginHorizontal: Spacing.two,
  },
  progressLabel: {
    lineHeight: 20,
  },
  toGo: {
    lineHeight: 18,
  },
  // Figma toast lines: 13 SemiBold (20 box) and 11 Regular (17 box), 55 px capsule in all.
  toastSub: {
    lineHeight: 17,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Figma "Bar" track: white 20%
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  scrimTop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    height: 190,
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    height: 260,
  },
  // Figma "Scan brackets": 240 box at x 61, y 236.
  window: {
    position: 'absolute',
    start: '50%',
    marginStart: -119,
  },
  // Figma "Checked-in toast": 265 wide, centred, y 148, capsule 27.5, 36 / 14 padding, 13 gap.
  success: {
    position: 'absolute',
    alignSelf: 'center',
    width: 265,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingStart: 36,
    paddingEnd: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: 27.5,
  },
  successTick: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  successText: {
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    gap: 26, // Figma: Recent card (562–708) ends 26 px above the List / Scan pill (734)
  },
  // Figma "Recent scans": 312 wide, 22 radius, 16 / 14 padding, 10 gap.
  recent: {
    width: 312,
    marginStart: Spacing.four,
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: 22,
  },
  recentLabel: {
    lineHeight: 18,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  avatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  flex: {
    flex: 1,
  },
  // Figma: the pill is centred on the screen; the search button sits 16 px from the right edge.
  controls: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: 'absolute',
    end: Spacing.three,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 24,
  },
  issueLayer: {
    zIndex: 3,
  },
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    alignItems: 'center',
    gap: Spacing.threeLess,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: 28,
    paddingHorizontal: Spacing.threeHalf,
    borderRadius: 32,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  issueIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  centred: {
    textAlign: 'center',
  },
  issueTitle: {
    lineHeight: 30,
  },
  issueBody: {
    width: 284,
  },
  person: {
    width: 304,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.option,
  },
  personAvatar: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  sheetActions: {
    alignSelf: 'stretch',
    gap: Spacing.threeLess,
  },
});
