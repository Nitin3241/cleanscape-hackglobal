# CleanScape navigation map: how the features link together

Source: Figma prototype links (file `6Jc3DgUuXJDOdc5Z4IC4Lm`, re-indexed 13 Nov 2026 in `design/SCREENS.md`) plus the logical links Figma doesn't draw.

**Rules**
- When a flow is built, wire every row below whose target now exists, and update its status here.
- Never a dead tap. This is automatic since 13 Nov: any `Tappable` with `accessibilityRole="button"` and no `onPress`, and any `Button` with no `onPress`, shows a "Coming soon" toast above the tab bar (`src/state/coming-soon.ts`, `src/components/ui/coming-soon-host.tsx`). To show it on purpose, call `showComingSoon()`.
- Links inside a flow follow `design/SCREENS.md`. Only the tab bar and the rows below cross between flows.

Status: **built** = the target screen exists and is wired · **wire** = target exists, link still to change · **later** = target not built yet (shows "Coming soon" or an older screen) · **system** = phone UI, not built.

## Tab bar and app-wide entry points
| Element | Goes to (Figma) | App today | Status |
|---|---|---|---|
| Home tab | `01 Home — EN · v2 (3 Final)` | `/home` | built |
| Events tab | `R1 Cleanups — list` (with skeleton) | `/events` | built |
| Smileys tab | `F7·1 Smileys — home` (with skeleton) | `/smileys` | built |
| Profile tab | `P0 Profile` | `/profile` | built; Community section (Friends) comes with flow D |
| Scan button | `S0 Scanner — what are you scanning?` (Check in, Sort an item, Log a bag, Report litter, Scan passes) | `/scanner` | built |
| Home bell | `N0 Notifications` | `/notifications` | built; rows re-checked in Phase 3 |
| P0 → Demo branches | `X0 Demo branches` | — | later (flow G) |

## Home
| Element | Goes to (Figma) | App today | Status |
|---|---|---|---|
| Map button | `R2 Cleanups — map` | `/event-map` (Getting there map) | wire in Phase 3 (should open the Cleanups map) |
| Smileys chip | (not linked in Figma) | `/smileys` | built |
| Campaign banner, Near you "See all" | `R1 Cleanups — list` | `/events` | built |
| Know your waste · Plastic | `F4·2 Plastic — how to sort` | `/waste-plastic` | built |
| Know your waste · Paper / Food / E-waste, See more | `F4·1 Know your waste — guide` | `/waste-guide` | built |
| Host a clean-up | `F10·11s` → `F10·11 Litter radar` | `/litter-radar` | rework in flow A |
| Your next clean-up card | `R7 Event detail — registered` | `/event-detail` | built |
| Next clean-up · Add to calendar | `CAL1 Add to calendar — choose (sheet)` | — | later (flow C) |
| Your impact card | `I0` → `I1 My impact — 2026` | `/smileys` | later (flow B) |
| Near you event cards | `R3 Event detail` | `/event-detail` | built |
| Earthy button | `F9v2·0 Voice — quick sheet` | voice sheet | built |
| Earthy tip (once) | `01 Home — Earthy tip`: Action → `F10·11s` | built earlier, Phase 1 re-checks the coach-mark rules | wire |
| Event day state | `01 Home — event day`: next clean-up card → `F11·1` | — | later (Phase 3) |

## Events, passes and getting there
| Element | Goes to (Figma) | Status |
|---|---|---|
| R6 pass heading | `F4·1 Check-in pass — show to crew leader` | wire in Phase 3 |
| R7 · Getting there | `T1 Getting there — options` | built |
| 02b map · Other ways | `T1 Getting there — options` | built |
| T1, R1, F3·4, F7·1 Earthy tips | shown once, then the normal screen | Phase 2 flow E |

## Earthy (AI)
| Element | Goes to (Figma) | Status |
|---|---|---|
| Earthy home suggestions | `F9v2·A1` Plan my Saturday, `F9v2·B1` On the day, plus the answer screens | built |
| Voice: listening / thinking → speaking; tap speaking to listen again | `F9v2·2b` | built (motion matches Figma) |
| F4·6 "Source: EEG guide" pill | `F9·S1 Earthy — source (sheet)` | later (flow F) |
| F4·6 ask field | `F9·S2 Ask the organiser` → `F9·S3 Question sent` | later (flow F) |
| Share story (F10·13, F10·5) | `F9v2·15 Caption writer (18+)` | later (Phase 3) |
| Gloves mode, Locked under 13 | only from `X0 Demo branches` in Figma | waiting on Nitin's decision |

## Hosting and impact
| Element | Goes to (Figma) | Status |
|---|---|---|
| F10·17 You're live · Crew | `F9v2·13 Organiser — Headcount + broadcast` | later (flow A) |
| F10·10c Add a co-host · "Not in the list? Add friends" | `P2 Add friends` | later (flows A, D) |
| I1 · Earthy host nudge, I9 · Host it | `F10·11 Litter radar` | later (flows A, B) |
| N0 · Heat warning | `W4h` lock-screen nudge (mock) → `F9v2·11 Safety — Heat` | later (flow E) |

## Not to link
- Anything in Figma section `786:12912` "Later — parked" (voice v1, `02 Event detail — v2`, F10·7, old C1, F10·12 Daily mission, old drafts). P0 and N0 still point at the Daily mission: keep the existing `/mission` route as is.
- Motion-state frames (`· enter A/B`, `· Skeleton`, `Motion 1/2`, `Pre-animate`) are entrances or loading states, never routes.
- System UI: lock screens W4, W5, W4h; Apple Wallet W3 (mocked in demo mode); iOS calendar CAL2 and CAL4.
- `Spec panel`.
