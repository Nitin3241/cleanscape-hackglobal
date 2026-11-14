# CleanScape — project status

_Last checked: 9 November 2026, after the overnight build of all remaining flows._

This is the caretaker's record: what is built, what is healthy, what is open. The sources of truth for product and design are still Miro and Figma (see `PROJECT_RULES.md`).

## Snapshot

- **App:** `~/Projects/CleanScape/app` — Expo SDK 58, React Native 0.88, React 19.3, Expo Router, TypeScript.
- **Branch:** `feat/design-update`, 69 commits ahead of `main`.
- **`main`:** only the setup commit `7da60b3` — none of the app work is on it.
- **Health (9 Nov):** typecheck ✅ · lint ✅ · iOS and Android JS bundles ✅. `expo-doctor` not re-run (no dependency changes overnight).

## How to check it

```bash
npm run check    # tsc --noEmit && expo lint
npm run doctor   # Expo dependency and config check (needs network)
npx expo export --platform ios --output-dir /tmp/cleanscape-export   # bundle smoke test
```

`npm start` runs the dev server for Expo Go.

## Branches

| Branch | Commits ahead of `main` | What it holds |
|---|---|---|
| `feat/design-update` | 69 | **Current line of work.** Every flow in `docs/BUILD_ALL_SCREENS.md` (see below) |
| `feat/ask-earthy` | 11 | Earlier Ask Earthy work, now folded into `feat/design-update` |
| `feat/onboarding` | 10 | Earlier onboarding work, now folded in |
| `feat/home-screen` | 8 | Earlier home work, now folded in |
| `docs/design-system-rules` | 2 | The design system doc |
| `main` | 0 | Scaffold only |

Nothing has been pushed: `origin/main` is still the scaffold commit.

## What is built

All flows in `docs/BUILD_ALL_SCREENS.md` now have screens. Decisions made without Nitin are in `docs/OVERNIGHT_LOG.md`.

| Flow | Commit | Main routes |
|---|---|---|
| Onboarding (12 screens) | earlier | `onboarding/*` |
| Home, event detail, map/Waze, sound and haptics | earlier | `home`, `event-detail`, `event-map` |
| F1 Register, edge states, Wallet | earlier | `register`, `registered`, `pass`, `wallet*`, `cancel-spot`, `switch-event` |
| F2 Transport and shared rides | `465a02b` | `getting-there`, `transit`, `rides`, `ride*`, `offer-seats` |
| F3 School group | `6de0cd1` | `class-join` … `class-impact` |
| F4 QR check-in and Know your waste | `ad53d52` | `check-in`, `crew-scan`, `crew-roster`, `waste-*` |
| F5 Bag log | `59c54b2` | `bag-log`, `bag-handed`, `bag-weigh`, `bag-earned` |
| F7 Smileys | `a1ff792` | `smileys`, `smileys-badges`, `smileys-reward`, `smileys-voucher` |
| F9 v2 AI assistant (Stories A and B) | `b03df7b` | `earthy`, `earthy-chat`, `earthy-voice`, `earthy-lens` |
| F10 Proactive AI | `26e62e0` | Insight tips on 6 screens; `spot-it`, `cleanup-draft`, `litter-radar`, `mission`, `impact-story`, `neighbourhood-goal` |
| F11 Earthy on event day | `653035c` | `event-day?step=1…11` |
| R Resident reports | `822b2a1` | `report`, `report-review`, `report-sent` |
| Organiser console | `7dfb51f` | `organiser-new` |

Skipped on purpose: "F9 · Ask Earthy (v1 · archived)" and "Spec panel". Not built as screens: F10·8 (a lock-screen
notification, needs push), F6 and F8 (not in the build list).

## Decisions worth knowing

- The sound kit is one bell sound, `cs.done`. The glide sounds and `cs.logo` were **removed on 30 Oct 2026**; those moments are now silent with a haptic. `docs/sound-haptics-spec.md` records this.
- Light mode only. `app.json` sets `userInterfaceStyle: light`, and Figma has no dark palette yet.
- `src/data/*.sample.ts` is placeholder content copied from Figma, not real data. Nothing talks to a server yet.
- Earthy is scripted everywhere (no model is called). Timers stand in for Figma's "auto" prototype steps.
- Earthy home is the way into screens Figma doesn't link from anywhere (Litter radar, Daily mission, Event day, Report a dirty spot, Organiser). Easy to move once Nitin decides where they live.

## Open items

| # | Item | Why it matters |
|---|---|---|
| 1 | 29 commits exist only on this Mac | No remote copy. Backup: `~/Backups/cleanscape-2026-11-03-pre.bundle` (all branches). Pushing needs Nitin's OK |
| 2 | `main` is scaffold only | A fresh clone or a new collaborator sees none of the app. Needs a merge decision |
| 3 | No tests, no test script | The feedback policy (`src/feedback/policy.ts`) is pure functions and cheap to test |
| 4 | No Arabic / RTL yet | `PROJECT_RULES.md` asks for it from day one; `expo-localization` is not installed and strings are hardcoded English |
| 5 | App identity is still `"app"` | `app.json` name/slug/scheme are defaults; rename before any build or TestFlight |
| 6 | `mobile/` is a stale duplicate | One commit, its own `node_modules`. Edit `app/`, not `mobile/` |
| 7 | `.claude/skills/replica-*` is untracked here | Looks unrelated to CleanScape. Not committed; awaiting a decision |
| 8 | `npm audit` reports 19 issues (18 moderate, 1 high) in the full tree, 5 moderate in production deps | Review before shipping; fixes may be breaking |
| 9 | The "10 known flaws" for F9 v2 weren't found anywhere | Built to the frames; needs the list to check against |
| 10 | Several photos and maps are 1× Figma exports | May look soft on 3× phones; swap for full-size files |
| 11 | Overnight flows not yet checked on a phone | Motion and timing were only checked in the web preview, which is unreliable for animation |
| 12 | Open design questions | Hours conflict (F7 46/60 vs F9 14/20), Spot mode on the Scan button, organiser role in the switcher. See `docs/OVERNIGHT_LOG.md` |

## Routine after each Claude session

1. Run `npm run check`. Fix or report red — never say "done" on a failing check.
2. Run `npm run doctor` when dependencies or `app.json` changed.
3. Run the bundle smoke test when dependencies changed.
4. Update the date, the health line and the open items in this file.
5. Commit in small steps. **Never push, merge, deploy or delete without Nitin's OK.**
