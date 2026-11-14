# Claude Code instructions

Read and follow @PROJECT_RULES.md and @AGENTS.md.

Design system and Figma → code rules: @DESIGN_SYSTEM.md

Current build brief (everything changed in Figma since 9 Nov): `docs/BUILD_ROUND_2.md`. Read it before building.
Frame-by-frame change list and the required build procedure (fetch every frame fresh from Figma, never build from old PNGs or changelog prose): `design/ROUND_2_MANIFEST.md`.

## Figma is the source of truth
- The live Figma file (`6Jc3DgUuXJDOdc5Z4IC4Lm`) always wins over PNGs in `design/screens/`, older docs or memory.
- Whenever Nitin says he changed a design, or before you build or edit any screen, run `/figma-sync <frame>`:
  fetch the frame fresh with the Figma MCP (`get_screenshot` + `get_design_context`), change the code,
  then screenshot the running app and compare it with Figma before committing.
- `/figma-sync changed` finds every frame that changed since the last export.

## Linking features
- After building any flow, wire its rows in `docs/NAVIGATION_MAP.md` (tab bar, Home entry points, cross-flow links). No dead taps: unbuilt targets show a "Coming soon" toast.
