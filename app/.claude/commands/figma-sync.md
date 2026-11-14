---
description: Update the app from the live Figma design (one frame, a flow, or everything that changed)
argument-hint: <frame name | node id | flow name | "changed">
---

# /figma-sync $ARGUMENTS

Figma is the source of truth. File `6Jc3DgUuXJDOdc5Z4IC4Lm`, page **Rain Ready (UAE)**,
section **🌿 CleanScape × EEG — MVP (New Iteration)**. Screen list and node IDs: `design/SCREENS.md`.

## 0. Read the design changelog
Read `design/CHANGELOG.md`. Entries under **Not synced yet** are Figma changes waiting for code. Include those frames
in step 1 even if their screenshot looks the same (motion changes don't show in a PNG).

## 1. Find the frames
- A frame name or node ID: use that frame.
- A flow name (for example "Home", "F1 edge states"): every frame under that heading in `design/SCREENS.md`.
- `changed`: for every frame in `design/SCREENS.md`, fetch a fresh screenshot with the Figma MCP
  `get_screenshot` and compare it with `design/screens/<slug>.png`. Any frame whose image differs counts as changed.
  List the changed frames to me before editing anything.

## 2. Read the live design (never work from an old PNG)
For each frame:
1. `get_screenshot` → overwrite `design/screens/<slug>.png`.
2. `get_design_context` on the frame, and on any layer whose size, spacing or alignment you need.
   Use the exact numbers (x, y, width, height, padding, gap, radius, font size, line height, colours).
3. Write down what differs from the current code before you change it: a short list such as
   "tile label: left → centred; illustration: top 44 → bottom 0".

## 2b. Motion
- Frames marked **MOTION STATE** in `design/SCREENS.md` (names ending `· enter A/B`, `· Skeleton`, `Motion 1/2`,
  `Pre-animate`, `(pre)`) are animation or loading states of the screen they auto-advance into. Never build them as
  routes. Build them as that screen's entrance animation or loading skeleton, with Reanimated.
- Each navigation line ends with its transition, e.g. `[smart_animate 450ms bezier(0.22,1,0.36,1)]`. Match the
  duration and curve; `instant` means no animation (tab bar).
- Follow the motion rules in `docs/DESIGN_HANDOFF.md` §6 and respect `useReducedMotion()`.

## 3. Change the code
- Reuse the existing components and `src/constants/theme.ts` tokens. If a Figma value is not a token, use the
  literal value with a comment naming the Figma layer.
- Keep RTL working (mirror with `start`/`end`, never `left`/`right` for layout).
- Do not touch screens that did not change.

## 4. Check it against Figma (required, do not skip)
1. Run the app (iOS Simulator, or `npx expo start --web` at a 360 px wide viewport) and open the screen.
2. Screenshot it, and put it next to the Figma PNG at the same scale. Crop to the changed area.
3. Compare edges, centres and spacing. Fix until they line up within 1 px. Show me both crops.
4. `npm run check` must pass.

## 5. Finish
- Commit: `figma-sync: <frame names> — <what changed>`.
- In `design/CHANGELOG.md`, move the entries you built from **Not synced yet** to **Synced** with the commit hash.
- After committing, `touch` every changed file so Metro reloads it, and tell me to reload Expo Go.
