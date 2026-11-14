import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextStyle, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { findEvent } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const CHANNELS = ['WhatsApp', 'SMS'] as const;
const UAE_MOBILE_DIGITS = 9;

/** "+971 50 ••• 4567": enough to recognise the number, without keeping all of it. */
function mask(digits: string) {
  return `+971 ${digits.slice(0, 2)} ••• ${digits.slice(-4)}`;
}

/** E2: an under-18 sends a parent or guardian a link to approve. */
export default function GuardianRequestSheet() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const event = findEvent(id);
  const registration = useRegistration();
  const [digits, setDigits] = useState('');
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>('WhatsApp');
  const complete = digits.length === UAE_MOBILE_DIGITS;

  return (
    <RouteSheet accessibilityLabel="Guardian approval">
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          One quick step for under-18s
        </ThemedText>
        <ThemedText type="note" themeColor="textWeak">
          A parent or guardian approves with one tap. It takes them about 30 seconds.
        </ThemedText>
      </View>

      <View style={styles.group}>
        <ThemedText type="fieldLabel">{"Guardian's mobile number"}</ThemedText>
        <View style={[styles.field, { borderColor: theme.brand, backgroundColor: theme.card }]}>
          <View style={[styles.prefix, { borderEndColor: theme.strokeControl }]}>
            <ThemedText type="lead">+971</ThemedText>
            <Icon name="chevron-down" size={16} color="textWeak" />
          </View>
          <TextInput
            value={digits.replace(/^(\d{2})(\d{0,3})(\d{0,4}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))}
            onChangeText={(text) => setDigits(text.replace(/\D/g, '').slice(0, UAE_MOBILE_DIGITS))}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            placeholder="50 123 4567"
            placeholderTextColor={theme.textWeak}
            accessibilityLabel="Guardian's mobile number"
            style={[styles.input, { color: theme.textStrong }, NO_WEB_FOCUS_RING]}
          />
        </View>
      </View>

      <View style={styles.group}>
        <ThemedText type="fieldLabel">Send the link by</ThemedText>
        <View accessibilityRole="radiogroup" style={[styles.segments, { backgroundColor: theme.surface }]}>
          {CHANNELS.map((option) => {
            const selected = option === channel;
            return (
              <Tappable
                key={option}
                accessibilityRole="radio"
                accessibilityLabel={option}
                accessibilityState={{ checked: selected }}
                onPress={() => setChannel(option)}
                style={[styles.segment, selected && { backgroundColor: theme.brand }]}>
                <Icon name="chat" size={16} color={selected ? 'textOnBrand' : 'textStrong'} strokeWidth={1.5} />
                <ThemedText type={selected ? 'labelLarge' : 'lead'} themeColor={selected ? 'textOnBrand' : 'textStrong'}>
                  {option}
                </ThemedText>
              </Tappable>
            );
          })}
        </View>
      </View>

      <Notice icon="shield-check" text="They'll see the event, time, meeting point and the crew lead. Nothing else." />

      <Button
        label="Send request"
        size="large"
        disabled={!complete}
        onPress={() => {
          registration.requestGuardian(event.id, mask(digits), channel);
          router.replace('/pass');
        }}
      />
    </RouteSheet>
  );
}

// The field's brand border already shows focus, so drop the browser's own ring on web.
// React Native's types don't list `outlineStyle: 'none'`, though React Native Web accepts it.
const NO_WEB_FOCUS_RING = (Platform.OS === 'web' ? { outlineStyle: 'none' } : null) as TextStyle | null;

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.one,
  },
  group: {
    gap: Spacing.two,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderRadius: Radius.small,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    height: '100%',
    paddingHorizontal: Spacing.three,
    borderEndWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.regular,
    fontSize: 15,
  },
  segments: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.small,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
    height: 44,
    borderRadius: Radius.control,
  },
});
