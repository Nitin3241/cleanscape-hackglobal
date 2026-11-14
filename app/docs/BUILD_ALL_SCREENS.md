# CleanScape: build every Figma screen (instructions for Claude Code)

Read this whole file before writing code. Then work through the phases in order and check in with me after each phase.

Figma file: `6Jc3DgUuXJDOdc5Z4IC4Lm` · page **Rain Ready (UAE)** · section **🌿 CleanScape × EEG — MVP (New Iteration)**.
Stack: Expo (React Native), demoed in **Expo Go**, so use no custom native modules.

---

## Phase 0: Pull the designs (do this first)

1. Ask me for a Figma personal access token (Figma → Settings → Security → Personal access tokens, read-only "File content").
2. Run:
   ```bash
   FIGMA_TOKEN=<token> node scripts/figma-export.mjs
   ```
   This creates:
   - `design/screens/*.png`: a 2× screenshot of every screen. **This is the source of truth for layout.**
   - `design/SCREENS.md`: every screen grouped by flow, with its text and where each button goes.
   - `design/screens.json`: the same data, for scripts.
3. If the Figma MCP server is connected, use `get_design_context` with a screen's node ID for exact spacing. Otherwise, measure from the 2× PNG: divide pixels by 2.
4. Re-run the script whenever I say "Figma changed", then update only the screens whose PNG changed (`git diff --stat design/`).

---

## Phase 1: Foundations (before any screen)

Read `docs/DESIGN_HANDOFF.md` (included) and implement:
- `theme/tokens.ts` (colours, radius, spacing, motion) exactly as written there.
- Fonts: Poppins 400/500/600 and Readex Pro 500 (Arabic). **Never use Bold 700 or Light.**
- Core components, each in `components/ui/`:
  `Button` (primary, secondary, text; label ≤ 2 words), `Card` (white, 1 px #E3E8EB, radius 18, soft shadow), `Chip`, `ListRow`, `Sheet` (@gorhom/bottom-sheet, white, radius 28), `GlassButton` (expo-blur, 40 px circle, 44 px hit area), `Header` (glass back/close · centred title · glass action), `TabBar` (Home · Events · Smileys · Profile, glass, **no animation**), `Avatar`, `ProgressBar`, `Stepper`, `Toggle`, `StatTile`, `EmptyState`.
- Icons: `lucide-react-native` line icons only. **No emojis anywhere.**
- Logo: `assets/brand/cleanscape-logomark.svg` via `react-native-svg`.
- RTL: support `I18nManager.forceRTL` for Arabic and mirror chevrons. There is an Arabic Home screen to match (`07 Home — AR (RTL)`).
- `DEMO_MODE` mock data: user **Sara Al Mansoori**, Al Karama Dubai, Grade 9B Al Barsha School, 1,240 Smileys, next clean-up **Kite Beach, Sat 5 Dec, 7–10 AM**, friends Omar and Lina.

## Phase 2: Earthy motion components (fixes the current lag)

The current build has three motion bugs, seen in a screen recording:
1. The "thinking" step spinner is a dashed circle that **never rotates**.
2. The orb **drops about 20% of frames**. It is animated on the JS thread and/or re-renders a live blur every frame.
3. When a step finishes, its text switches from bold to regular. The **width jumps**, and the tick appears without animation.

Replace them with the files in `components/earthy/` (included, ready to use):

| File | What it does |
|---|---|
| `motion.ts` | Shared easing and durations: ease-out bezier(0.2,0.8,0.2,1), pop bezier(0.34,1.56,0.64,1) |
| `StepSpinner.tsx` | A real SVG arc spinning at 800 ms per turn on the UI thread |
| `StepCheck.tsx` | A green tick that pops in (scale 0.6 → 1) and draws its stroke |
| `ThinkingSteps.tsx` | Steps slide in 6 px and fade; the spinner fades into the tick; text keeps **one weight** and only its colour changes |
| `EarthyOrb.tsx` | The orb's gradient rotates inside a circle mask (16 s idle, 3.2 s thinking), with breathing scale and an SVG radial glow. **No BlurView, no setState per frame.** Use `compact` to shrink it while speaking (scale, not width) |
| `StreamingText.tsx` | The spoken answer fades in word by word on the UI thread |

Rules for all motion:
- Animate **only transform and opacity**, always with Reanimated shared values. Never animate width, height, blur or gradient colours per frame.
- Never `setState` inside an animation loop. Never use `Animated` from react-native without `useNativeDriver: true`.
- Respect `useReducedMotion()`: keep the fades, drop the movement.
- **Sheet → full screen:** do not close the sheet and open a new modal (that causes the grey flash in the recording). Use one `BottomSheet` with snap points `['62%', '100%']`. "Full screen" calls `snapToIndex(1)`, and the content crossfades from sheet layout to full layout while the orb scales up.
- Test on a real iPhone in Expo Go with the **Perf Monitor** on (shake → Perf Monitor). UI and JS should both hold 60 fps during the thinking state.

## Phase 3: Build the screens, flow by flow

Build in this order. Each flow's screens are listed in `design/SCREENS.md` under the matching heading. Navigation must follow the "Navigation" lines there. **Links stay inside their own flow**; only the tab bar can jump anywhere.

| # | Flow (heading in SCREENS.md) | Notes |
|---|---|---|
| 1 | F0 · Onboarding | Splash → language → welcome ×4 → sign-in → phone/code → birthday → guardian (under 18) → pledge (draw a tick) → location → interests → notifications → good to go. 24 px side margins are intentional here. |
| 2 | Home | Final EN home plus skeleton loading states (Motion 1/2). Arabic RTL home. |
| 3 | F1 · Find events & register (happy path) | List → map → detail → confirm → you're in (confetti) → pass → registered |
| 4 | F1 · Edge states | Same day, under 18, waitlist, cancel + undo, no matches, offline, guardian said no |
| 5 | F1 · Add to Wallet | Build the in-app screens; in demo mode, mock the system add-to-wallet sheet. Lock-screen frames are for reference only; don't build those as screens. |
| 6 | F2 · Transport & shared rides | Getting there, carpool, Metro + bus, offer seats, licence check, edge states |
| 7 | F3 · School group (student) | Join class by code → parent approval → class space → bus → pass → live check-in → class impact |
| 8 | F4 · QR check-in, hours & certificate | Volunteer pass, **crew head** scanner (works offline), roster, edge states. Also "Know your waste" + Earthy scan (F4·1–F4·11). **One scanner component for everything.** |
| 9 | F5 · Bag log | Scan bag sticker → hand to crew head → weigh → Smileys |
| 10 | F7 · Smileys | Earn, levels, badges, spend at sponsor shops |
| 11 | F9 v2: AI assistant | Earthy home, the voice sheet from the Home FAB, full-screen voice (listening → thinking → speaking), chat screens, **Story A** (plan my Saturday) and **Story B** (on the day). Use the Phase 2 components. |
| 12 | F10: Proactive AI | Insight cards on existing screens (1–8) plus new screens (9 Spot it, 10 Drafted clean-up, 11 Litter radar, 12 Daily mission, 13 Impact story, 14 Neighbourhood goal) |
| 13 | F11: Earthy on event day | Before, arrival, during, after |
| 14 | R: Resident cleanliness reports | Earthy detects litter → coach → hazard → voice note → review → sent / already reported / +1 |
| 15 | Organiser console | Create event (v1, v2). Low priority. |

**Skip:** `F9 · Ask Earthy (v1 · archived)` (the "Voice 0–5, E1–E5" frames) and `Spec panel`.

POV labels: screens marked **Crew head** are a separate role from the volunteer. Add a dev-only role switcher in demo mode. The organiser POV comes later.

For each screen:
1. Open its PNG and its entry in `SCREENS.md`.
2. Build it from the Phase 1 components. Don't write one-off styles if a component exists.
3. Wire the navigation exactly as listed.
4. Put the PNG and a simulator screenshot side by side and fix any spacing, colour or text differences. Aim for pixel-close.
5. Commit per flow: `feat(flow): F1 register happy path`.

## Phase 4: Demo polish for the investor recording

- Scripted Earthy replies in `DEMO_MODE` (no network): stream words at about 70 ms each and run thinking steps 900 ms apart.
- Status bar at 9:41, no dev overlays, 60 fps.
- Record each story in under 30 s: Home → FAB → voice sheet → full screen → thinking → answer → Book; then Story A; then Story B; then Litter radar → Spot it → host.

## Definition of done
- Every screen in `SCREENS.md` (except the skipped ones) exists and matches its PNG.
- All navigation from `SCREENS.md` works and stays inside its flow.
- Thinking, orb and streaming text run at a steady 60 fps on a real device.
- No emojis, no bold-700 text, CTA labels of two words or fewer, white backgrounds (camera screens excepted).
