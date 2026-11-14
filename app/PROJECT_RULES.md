# CleanScape – project rules (shared by Claude Code, Cursor and Grok Bot)

## Sources of truth
- Plans, tasks, decisions: Miro "CleanScape — Source of Truth" https://miro.com/app/board/uXjVEUrD-Lo=/
- Design: Figma "CleanScape – Rain Ready (UAE)" https://www.figma.com/design/6Jc3DgUuXJDOdc5Z4IC4Lm/ (section "CleanScape × EEG — MVP": StatusBar, Button Primary/Secondary/Tertiary, Smiley, TabBar)
- Product docs: ../CleanScape_MVP_plan.md, ../CleanScape_business_model.md
- Design system and Figma → code rules: DESIGN_SYSTEM.md (read before building any UI)
- If code and these sources disagree, ask Nitin; don't guess.

## Stack
- Expo (React Native) + Expo Router + TypeScript. Package manager: npm (package-lock.json). Don't mix pnpm/yarn here.
- Target: iOS first, Android second. Built for UAE users; support English and Arabic (RTL) from the start.

## How to work
- Build UI from the Figma components; match tokens (colors, type, spacing). Flag anything off-system.
- Write a short screen spec (purpose, behavior, accessibility, edge cases) before building a new screen.
- Small, focused changes. One AI tool edits at a time. Commit after each working step with a clear message.
- Never commit secrets, .env files, photos or PDFs. Keep the GitHub repo private.
- Ask Nitin before: adding paid services, publishing, deploying to stores, deleting files, or pushing to main.
