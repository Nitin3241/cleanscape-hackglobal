import { router, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { MaxContentWidth, Radius, Shadows, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { markTabEntry } from '@/state/tab-entry';
import { useHomeCopy } from '@/data/home-copy';

const TABS = [
  { key: 'home', icon: 'home', href: '/home' },
  { key: 'events', icon: 'calendar', href: '/events' },
  { key: 'smileys', icon: 'smile', href: '/smileys' },
  { key: 'profile', icon: 'user', href: '/profile' },
] as const satisfies readonly { key: string; icon: IconName; href: '/home' | '/events' | '/smileys' | '/profile' | null }[];

type TabKey = (typeof TABS)[number]['key'];

/**
 * Floating glass tab bar (Figma component `TabBar / Glass`): a pill with four destinations
 * and a separate Scan button, which opens the scanner chooser (S0).
 */
export function TabBar({ active }: { active: TabKey }) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.bar, { paddingBottom: Spacing.twoThreeQuarters + insets.bottom }]}>
      <View style={[styles.pillShadow, { boxShadow: Shadows.tabBar }]}>
        <Glass style={styles.pill}>
          <View accessibilityRole="tablist" style={styles.tabs}>
            {TABS.map((tab) => {
              const selected = tab.key === active;
              return (
                <Tappable
                  key={tab.key}
                  accessibilityRole="tab"
                  accessibilityLabel={copy.tabs[tab.key]}
                  accessibilityState={{ selected }}
                  onPress={() => {
                    feedback.play('nav.tab');
                    // Go to the tab's main screen unless already there, so a tab also works
                    // from deeper screens that count as that tab (such as the pass).
                    if (tab.href && pathname !== tab.href) {
                      markTabEntry(tab.href);
                      router.navigate(tab.href);
                    }
                  }}
                  style={[styles.tab, selected && { backgroundColor: theme.fill }]}>
                  <Icon name={tab.icon} size={24} color={selected ? 'brand' : 'textWeak'} />
                  <ThemedText
                    type={selected ? 'tabLabelActive' : 'tabLabel'}
                    themeColor={selected ? 'brand' : 'textWeak'}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.2}>
                    {copy.tabs[tab.key]}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </Glass>
      </View>

      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Scan"
        pressedScale={0.92}
        onPress={() => {
          feedback.play('button.primary');
          // Event day: crew heads scan passes (F4·2); volunteers show their pass (F4·1),
          // then, once checked in, log their bags (F5·1).
          // Figma S0 (9 Nov): the Scan button asks what you're scanning first.
          router.push('/scanner');
        }}
        style={[styles.scan, { backgroundColor: theme.secondary, borderColor: theme.glassStroke, boxShadow: Shadows.tabBar }]}>
        <Icon name="scan" size={26} color="textStrong" />
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  pillShadow: {
    flex: 1,
    borderRadius: 32,
  },
  pill: {
    height: 64,
    borderRadius: 32,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    padding: Spacing.one - 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    borderRadius: Radius.tab,
  },
  scan: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 32,
  },
});
