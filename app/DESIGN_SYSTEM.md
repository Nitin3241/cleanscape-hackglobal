# CleanScape – design system rules (Figma → code)

How to turn Figma designs into code in this app. Read together with
[PROJECT_RULES.md](PROJECT_RULES.md) and [AGENTS.md](AGENTS.md).

> **Current state (Oct 2026):** the home screen (Figma `74:278`) is built and `theme.ts`
> holds the real CleanScape tokens. Where the sections below still describe the starter,
> the notes marked **Updated** win. The app is locked to light mode until Figma has dark values.
>
> **Updated:**
> - **Tab bar:** a custom floating `src/components/ui/tab-bar.tsx`, not native tabs, because
>   native tabs can't produce the pill plus separate Scan button.
> - **Tokens:** Figma now has colour variables; `Colors.light` mirrors them. `Spacing` gained
>   the 6, 10, 12, 14 and 20 steps, and `Radius`, `Gradients` and `Shadows` were added.
> - **Type:** Poppins for Latin and Readex Pro for Arabic, loaded with `useFonts` in
>   `src/app/_layout.tsx`. No other typefaces.
> - **Icons and art:** `react-native-svg` is installed. Line icons live in
>   `src/components/ui/icon.tsx`; Figma artwork lives in `src/constants/illustrations.ts`.
> - **Components:** home sections are in `src/components/home/`; sample data is in `src/data/`.
> - **Onboarding:** the app opens on the splash (`src/app/index.tsx`), then `src/app/onboarding/`,
>   then Home (`src/app/home.tsx`). Its parts are in `src/components/onboarding/`, and Figma art
>   split into animatable layers is in `src/constants/onboarding-art.ts`. Arabic text uses Readex Pro.
> - **Colours:** `background` is white. `card` always has a `strokeWeak` border or a shadow.
>   `surface` (`#F2EADD`) is only for skeleton blocks and segmented-control tracks.
>   `strokeControl` (`#D9DEE1`) borders unselected chips, option rows and join cards.
> - **Selection controls:** `ChoiceChip` and `ChoiceCard`. Borders and fills use
>   `useSelectionTween` (150 ms); ticks and dots use `useSelection` (a spring). No shadows.
> - **Ticket card:** `src/components/home/ticket-card.tsx` replaces the campaign banner. It has its
>   own skeleton and 600 ms reveal, and `useDailyFlip` limits the countdown flip to once a day.
> - **Ask Earthy and events:** the sheet is in `src/components/ask-earthy/`, and results, event
>   detail and the map are `src/app/cleanups.tsx`, `event-detail.tsx` and `event-map.tsx`. The
>   root layout is a stack, so Home stays mounted. The voice is simulated with sample data.
> - **Sound and haptics:** call `feedback.play('event.id')` from `src/feedback/`, never `expo-haptics`
>   directly. Sounds and events are defined in `tools/synth/sounds.json`. See `docs/sound-haptics-spec.md`.
> - **Motion:** spec values are in `Motion` in `theme.ts`, with easing and spring helpers in
>   `src/constants/motion.ts`. Use `RevealBlock` for skeletons and `Tappable` for pressed
>   states. Every animation needs a Reduce Motion fallback (Figma motion spec, node `102:321`).

---

## 1. Sources of truth

| What | Where |
| --- | --- |
| Design file | Figma `6Jc3DgUuXJDOdc5Z4IC4Lm` – page `Rain Ready (UAE)` (`0:1`) |
| MVP component section | `🌿 CleanScape × EEG — MVP (Claude)` – node `3:2` |
| Plans / decisions | Miro "CleanScape — Source of Truth" |

### Figma components (local, not published as a library)

| Figma component | Node | Variants | Code target (to create) |
| --- | --- | --- | --- |
| `StatusBar` | `3:3` | `Theme=Dark` (`3:4`), `Theme=Light` (`3:13`) – 360×44 | **Don't build.** Use `expo-status-bar` `<StatusBar style="dark" \| "light" />` |
| `Button` | `3:22` | `Type=Primary` (`3:23`), `Type=Secondary` (`3:25`), `Type=Tertiary` (`3:27`) – 200×48 | `src/components/ui/button.tsx` → `<Button variant="primary" \| "secondary" \| "tertiary">` |
| `Smiley` | `3:29` | – (24×24) | `src/components/ui/smiley.tsx` |
| `TabBar` | `3:36` | – (360×84); tabs: Home, Events, Scan (centre `scanButton`), Smileys, Profile | `src/components/app-tabs.tsx` (native tabs), not a custom view |

Other repeated patterns in the screens that are **not** components yet (flag to Nitin
before inventing them): `chip/*`, `IconButton/*`, `SmileysChip`, `sectionTitle`,
`iconBubble`, `Header`, `Bottom sheet`, `button/*` (older 44px-high buttons on screens
01–04 – check against the 48px `Button` component before building).

### Figma tokens

The Figma file currently has **no variables and no text/colour styles** (`get_variable_defs`
on `3:2` returns nothing). Colours, type and spacing are raw values on layers.

- Read raw values with `get_design_context` on the component/screen node.
- Put each new value in `src/constants/theme.ts` with a semantic name (see §2), then use the token.
- If two layers use near-identical values (e.g. `#1F7A4D` vs `#1F7A4E`), ask Nitin which is correct – don't add both.
- Suggest to Nitin that Figma variables be created; once they exist, mirror their names 1:1 in `theme.ts`.

---

## 2. Tokens

**Single file:** `src/constants/theme.ts`. Plain TypeScript `as const` objects – no token
build step (no Style Dictionary, no Tailwind/NativeWind). `src/global.css` only holds web
font-family CSS variables.

```ts
// src/constants/theme.ts (current shape – keep this structure)
export const Colors = {
  light: { text, background, backgroundElement, backgroundSelected, textSecondary },
  dark:  { /* same keys */ },
} as const;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({ ios: {...}, default: {...}, web: {...} });

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
```

Rules:

- **Colours:** every colour gets a key in **both** `Colors.light` and `Colors.dark` (the
  `ThemeColor` type only allows keys present in both). Name by role, not hue:
  `primary`, `onPrimary`, `border`, `danger`, `success`… not `green500`.
- **Spacing:** use `Spacing.*`. Figma values off the 2/4/8/16/24/32/64 scale (e.g. 12, 20)
  → flag to Nitin; if approved, add a step rather than hard-coding the number.
- **Radius:** there is no radius token yet (starter reuses `Spacing.*` for radii). When
  building the first CleanScape component, add `export const Radius = {...}` to `theme.ts`.
- **Typography:** text styles live in `ThemedText`'s `type` prop (`src/components/themed-text.tsx`).
  Add CleanScape type styles there (e.g. `type="heading"`) – don't set `fontSize` inline in screens.
- **Fonts:** Figma's font isn't loaded yet. Custom fonts must be added via `expo-font`
  (config plugin in `app.json`) and must include **Arabic glyphs** (or pair a Latin + Arabic family).
- **Hard-coded hex values in components are off-system.** The starter has a few
  (`#3c87f7` in `themed-text.tsx`, `#208AEF` splash, gradient in `animated-icon*`) – these
  are starter leftovers, not patterns to follow.

---

## 3. Components

- **Location:**
  - `src/components/` – app-level building blocks (`themed-text.tsx`, `themed-view.tsx`, `app-tabs.tsx`, `external-link.tsx`).
  - `src/components/ui/` – design-system primitives that map to Figma components (`collapsible.tsx` today; `button.tsx`, `smiley.tsx` next).
  - `src/app/` – **routes only** (Expo Router). No reusable components here.
- **Naming:** files `kebab-case.tsx`; components `PascalCase` **named exports**
  (`export function Collapsible`). Only route files and `app-tabs` use `export default`.
- **Platform variants:** `name.web.tsx` beside `name.tsx` (see `app-tabs.web.tsx`,
  `animated-icon.web.tsx`, `use-color-scheme.web.ts`). Use only when native and web truly differ.
- **Props:** extend the native props type and spread the rest, like `ThemedText`:

```tsx
// Pattern to follow (src/components/themed-text.tsx)
export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}
```

- **Figma variants → props:** a Figma property becomes a typed union prop with the same
  values in lower case: `Type=Primary` → `variant="primary"`, `Theme=Dark` → `theme="dark"`.
- **Always build on `ThemedText` / `ThemedView`** (or `useTheme()`) so dark mode works.
- **No Storybook** or component docs exist. Document props with a short JSDoc on the component.
- **Code Connect:** none set up yet. After a Figma component has a code twin, map it
  (Figma `add_code_connect_map`) so future `get_design_context` calls return our component.

---

## 4. Frameworks & build

| | |
| --- | --- |
| UI | React 19.3 + React Native 0.88 via **Expo SDK 58** (`react-native-web` for web) |
| Routing | Expo Router 58 – file-based, `src/app/`, typed routes on (`experiments.typedRoutes`) |
| Compiler | React Compiler on (`experiments.reactCompiler`) – **don't add `useMemo`/`useCallback` by habit** |
| Animation | `react-native-reanimated` 4 + `react-native-worklets` |
| Native UI | `@expo/ui`, `expo-glass-effect`, `expo-router/native-tabs` |
| Bundler | Metro (Expo default); no custom `metro.config.js` / `babel.config.js` |
| Language | TypeScript 6, `strict: true`; path aliases `@/*` → `src/*`, `@/assets/*` → `assets/*` |
| Package manager | **npm**. Add packages with `npx expo install <pkg>` |
| Checks | `npx expo lint`, `npx tsc --noEmit` (no ESLint config committed yet – `expo lint` sets one up on first run; no test runner yet) |

Expo APIs change every SDK – check `https://docs.expo.dev/versions/v58.0.0/` before using one.

---

## 5. Styling

- **Method:** React Native `StyleSheet.create` at the **bottom** of each file, named
  `styles`. No CSS-in-JS library, no Tailwind/NativeWind.
- **CSS Modules** only for web-only files (`animated-icon.module.css` used from
  `animated-icon.web.tsx`). Don't use them in native code.
- **Theme-dependent values** (colours) go inline from `useTheme()`; **static values**
  (layout, spacing) go in `StyleSheet`:

```tsx
const theme = useTheme();
<ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]} />
```

- **Pressed state:** `Pressable` with a style function – `({ pressed }) => pressed && styles.pressed` (`opacity: 0.7`).
- **Global styles:** none on native. `src/global.css` (imported by `theme.ts`) only sets web font variables.
- **Dark mode:** `app.json` → `userInterfaceStyle: "automatic"`. `useTheme()` picks
  `Colors.light`/`Colors.dark`. Every Figma screen should be checked in both modes;
  if Figma only has light, ask for the dark values.

### Layout & responsiveness

- Figma frames are **360×800** (Android-size phone). Build fluid layouts (flex, `%`,
  `alignSelf: 'stretch'`) – never fix widths to 360/328. Screen padding = 16 (`Spacing.three`), since 328 = 360 − 2×16.
- Safe areas: `SafeAreaView` / `useSafeAreaInsets()` from `react-native-safe-area-context`;
  bottom padding adds `BottomTabInset` so content clears the tab bar.
- Cap wide layouts with `maxWidth: MaxContentWidth` (tablet/web).
- Test on a small iPhone (SE) and a large one; text must not clip with larger Dynamic Type.

### RTL (Arabic) – required from day one

- Use **logical** style props: `marginStart/End`, `paddingStart/End`, `start/end`,
  `borderTopStartRadius`… never `marginLeft/Right` or `left/right` for direction-dependent layout.
  (The starter uses `marginLeft`/`marginRight` – fix when touched.)
- `flexDirection: 'row'` flips automatically in RTL – don't hard-reverse it.
- Directional icons (`arrow-left`, `chevron-right`) must mirror in RTL
  (`transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]`).
- No user-facing string literals in components once i18n is added (no i18n library yet –
  ask Nitin before choosing one).

### Accessibility

- Every `Pressable` gets `accessibilityRole` and `accessibilityLabel` (icon-only buttons especially).
- Minimum touch target 44×44 (`hitSlop` if the visual is smaller, e.g. 24px icons).
- Check contrast of every new colour pair (4.5:1 body text, 3:1 large text/icons) in both modes.

---

## 6. Assets

- **Location:** `assets/images/` (app icon, splash, Android adaptive icon, tab icons).
  iOS app icon is an Icon Composer bundle at `assets/expo.icon/`.
- **Reference:** `require('@/assets/images/…')` rendered with **`expo-image`** `<Image>` (not RN `Image`).
- **Densities:** ship `name.png`, `name@2x.png`, `name@3x.png`; require the base name.
- **Optimisation:** none automated. Export PNGs at exact 1x/2x/3x sizes; prefer vector for icons.
- **CDN:** none. Remote images (e.g. user report photos) will be URLs passed to `expo-image`
  `source={{ uri }}` – use `placeholder` and `contentFit`.
- From Figma: download assets with the Figma MCP asset tools; **don't** commit Figma
  placeholder art (e.g. `Map (placeholder)`, `Map pin (placeholder map)`) as real assets.
- Never commit user photos or PDFs (`PROJECT_RULES.md`).

---

## 7. Icons

- **Today:** `expo-symbols` `SymbolView` (SF Symbols on iOS, Material Symbols on Android/web),
  plus template PNGs for tabs (`assets/images/tabIcons/*.png`, `renderingMode="template"`).

```tsx
<SymbolView
  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
  size={14}
  tintColor={theme.text}
/>
```

- **Figma icon set** (layers named `icon/<name>`, lucide-style names): `arrow-left, bell,
  calendar, check, chevron-right, gift, home, image, info, map-pin, mic, minus, pencil, plus,
  recycle, scan, share, smile, sparkles, sun, tree, truck, user, users, x, zap`.
  Icon buttons are `IconButton/<icon>`.
- **Rule:** map each Figma `icon/<name>` to the closest SF Symbol / Material name and keep
  that mapping in one place (create `src/constants/icons.ts` when the first CleanScape icon is
  used). If no good system symbol exists, export the SVG from Figma and ask Nitin before adding
  an SVG library (`react-native-svg` is not installed).
- Icons always take `tintColor` from the theme – never a hard-coded colour.

---

## 8. Project structure

```
app/
├── app.json                 # Expo config (plugins, splash, icons, experiments)
├── assets/
│   ├── expo.icon/           # iOS Icon Composer icon
│   └── images/              # PNGs (+ @2x/@3x), tabIcons/
├── scripts/reset-project.js # starter cleanup script
└── src/
    ├── app/                 # ROUTES ONLY – _layout.tsx, index.tsx, explore.tsx
    ├── components/          # shared components (+ .web.tsx variants)
    │   └── ui/              # design-system primitives (Figma components)
    ├── constants/theme.ts   # ALL tokens
    ├── hooks/               # use-theme.ts, use-color-scheme(.web).ts
    └── global.css           # web-only font variables
```

- Imports: external packages first, blank line, then `@/…` aliases. Use `@/` for anything outside the current folder.
- New feature (e.g. Report flow): routes in `src/app/report/…`, feature-only components in
  `src/components/report/`, shared primitives in `src/components/ui/`.

---

## 9. Figma → code workflow

1. Write the short screen spec first (purpose, behaviour, accessibility, edge cases) – `PROJECT_RULES.md`.
2. `create_session` (file key `6Jc3DgUuXJDOdc5Z4IC4Lm`), then `get_design_context` +
   `get_screenshot` on the screen/component node.
3. Treat the generated code as a **reference** (it comes out as React + Tailwind). Rebuild it with
   `StyleSheet`, `ThemedText`/`ThemedView`, `Spacing`, and existing `ui/` components.
4. Any value not already in `theme.ts` → add a semantic token (light + dark) or flag it.
5. Add empty / loading / error states even if Figma only shows the happy path – ask for designs if they're missing.
6. Check: light + dark, RTL, small screen, VoiceOver labels. Run `npx expo lint` and `npx tsc --noEmit`.
7. Compare with the Figma screenshot and list any differences for Nitin.
