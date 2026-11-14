import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';

import { EarthyNote } from '@/components/host/earthy-note';
import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Button } from '@/components/ui/button';
import { RouteSheet } from '@/components/ui/route-sheet';
import { SheetHeader } from '@/components/ui/sheet-header';
import { SuccessTick } from '@/components/ui/success-tick';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { ASK_ORGANISER } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const NO_WEB_FOCUS_RING = { outlineStyle: 'none' } as object;

/**
 * F9·S2 Earthy — ask the organiser (sheet): when Earthy has no approved answer it drafts a message to the
 * organiser instead of guessing. "Send" turns it into F9·S3 Question sent. SAMPLE: nothing is sent.
 */
export default function EarthyAskSheet() {
  const theme = useTheme();
  const input = useRef<TextInputInstance>(null);
  const [message, setMessage] = useState<string>(ASK_ORGANISER.draft);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <RouteSheet accessibilityLabel={ASK_ORGANISER.sent.title} bottomPadding={34}>
        <View style={styles.sent} accessibilityLiveRegion="polite">
          <SuccessTick size={56} />
          <ThemedText style={FigmaLines.l30} type="sheetTitle" accessibilityRole="header">
            {ASK_ORGANISER.sent.title}
          </ThemedText>
          <ThemedText type="hint" themeColor="textWeak" style={[styles.centred, FigmaLines.l21]}>
            {ASK_ORGANISER.sent.body}
          </ThemedText>
        </View>
        <Button label="Done" flat onPress={() => router.back()} />
      </RouteSheet>
    );
  }

  return (
    <RouteSheet accessibilityLabel="Ask the organiser" bottomPadding={34}>
      <SheetHeader title="Ask the organiser" />
      <View style={[styles.asked, { backgroundColor: theme.fill }]}>
        <ThemedText style={FigmaLines.l20} type="fieldLabel" themeColor="brand">
          {ASK_ORGANISER.asked}
        </ThemedText>
      </View>
      <EarthyNote title={ASK_ORGANISER.earthy.title} body={ASK_ORGANISER.earthy.body} />
      <View
        style={[styles.organiser, { borderColor: theme.strokeWarm }]}
        accessible
        accessibilityLabel={`${ASK_ORGANISER.organiser.name}, ${ASK_ORGANISER.organiser.role}`}>
        <View style={[styles.avatar, { backgroundColor: theme.fill }]}>
          <ThemedText type="labelMedium14" themeColor="brand">
            {ASK_ORGANISER.organiser.initials}
          </ThemedText>
        </View>
        <View style={[styles.flex, styles.who]}>
          <ThemedText style={FigmaLines.l23} type="reasonTitle">
            {ASK_ORGANISER.organiser.name}
          </ThemedText>
          <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
            {ASK_ORGANISER.organiser.role}
          </ThemedText>
        </View>
      </View>
      <TextInput
        ref={input}
        value={message}
        onChangeText={setMessage}
        multiline
        accessibilityLabel="Message to the organiser"
        style={[styles.field, { borderColor: theme.strokeChip, color: theme.textStrong }, NO_WEB_FOCUS_RING]}
      />
      <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
        {ASK_ORGANISER.drafted}
      </ThemedText>
      <View style={styles.buttons}>
        <View style={styles.flex}>
          <Button label="Edit" variant="secondary" flat onPress={() => input.current?.focus()} />
        </View>
        <View style={styles.flex}>
          <Button
            label="Send"
            flat
            disabled={message.trim().length === 0}
            onPress={() => {
              feedback.play('button.primary');
              setSent(true);
            }}
          />
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma organiser card: 2 px between the name and the role.
  who: {
    gap: 2,
  },
  flex: {
    flex: 1,
  },
  centred: {
    textAlign: 'center',
  },
  asked: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.medium,
  },
  organiser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  field: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1.5,
    borderRadius: Radius.medium,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sent: {
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.one,
  },
});
