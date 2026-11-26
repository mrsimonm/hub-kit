# Plan: one shared hub shell for every family hub

> **Done (26 Nov 2026).** All six steps are finished and live. How it works now: [GUIDE.md](GUIDE.md), section 7. Differences from the plan:
> - Extra placeholders: `{{ID}}`, `{{TAGLINE}}`, `{{SCHOOL}}`, `{{BG_COLOR}}`, `{{THEME_COLOR}}` (instead of one `{{THEME_COLORS}}`).
> - `lib/cat.js` gets its subject list from `subjects.json` too, so Op Man XP now counts for Margo's Study Cat.
> - New optional `subjects.json` fields for Study Hub: `hubDoc` (`""` keeps Geology at `users/{uid}`), `examKey`, `catalogStatic`, `extraShell`.
> - `build.js --check --diff` shows the changes; `--check` alone lists the files that would change.
> - Op Man Hub was also published on its own: https://mrsimonm.github.io/opman-hub/
> - The "Later" step (sharing the lesson engine) has not been started.

For a fresh Claude Code (or Gemini) session. Work in `~/Projects/hub-kit`. Read this file only; don't re-read whole hubs unless needed.

## Goal
`~/Projects/study-hub` (Simon: bio, eco, geo) and `~/Projects/margo-hub` (Margo: stats, micro, opman) must look and work the same, except for their subjects. A change made once in hub-kit applies to both, and to any future hub, with one command.

## Current state (as of 26 Nov 2026)
- margo-hub already has `subjects.json` + `tools/hub.js` (`sync | add | remove | check`), which generates the subject lists between `HUB:BEGIN/HUB:END` markers in `switcher.js`, `index.html`, `sw.js`, `lib/stats.js`, `tools/validate.js`. Firestore rule accepts any subject id. It has `CLAUDE.md` and `AGENTS.md` recipes.
- study-hub still has the OLD hand-written setup (`tools/sync-from-hubs.js`, subjects hard-coded).
- Both hubs share Firebase project `geo-hub-96426` and the same `lib/cat.js`, `lib/stats.js`, `lib/firebase-*.js` design, but with different prefixes: `studyHub.*` vs `margoHub.*` in localStorage keys, page titles, manifest.
- Both are static sites (plain HTML/CSS/JS, no npm), deployed by GitHub Pages from `main`. Commit identity: `mrsimonm` / `322631765+mrsimonm@users.noreply.github.com`.

## Steps
1. **Shell folder.** Create `hub-kit/shell/` with the hub-level files, taken from margo-hub (the newest): `index.html`, `switcher.js`, `sw.js`, `manifest.webmanifest`, `firestore.rules`, `lib/cat.js`, `lib/stats.js`, `lib/firebase-sync.js`, `tools/hub.js`, `tools/validate.js`, icons. Replace every hub-specific value with a placeholder: `{{HUB_NAME}}` ("Margo's Study Hub"), `{{HUB_SHORT}}`, `{{PREFIX}}` (`margoHub`), `{{DESCRIPTION}}`, `{{THEME_COLORS}}`. Diff margo-hub against study-hub first and list every difference; anything that isn't a name/prefix/subject must be decided (prefer margo-hub's newer version).
2. **Per-hub config.** In each hub add `hub.json`: `{ "name", "short", "prefix", "description", "colors", "firebaseProject" }`. Keep `subjects.json` (create it for study-hub: bio, eco, geo, with values copied from its current `switcher.js`).
3. **One command.** `hub-kit/tools/build.js`:
   - `node tools/build.js <hubDir>`: copy `shell/` into the hub, fill the placeholders from `hub.json`, then run that hub's `tools/hub.js sync` (subjects + generated lists + validation).
   - `node tools/build.js all`: do it for every hub listed in `hub-kit/hubs.json` (`["../study-hub", "../margo-hub"]`).
   - `--check`: report what would change, don't write.
   Generated or copied files get a first-line comment "Generated from hub-kit/shell, edit there".
4. **Keep user data safe.** Prefixes must stay exactly as they are now (`studyHub`, `margoHub`) so nobody loses progress or the Study Cat. Firestore paths (`users/{uid}/hubs/{id}`) stay the same.
5. **Docs.** Update `hub-kit/GUIDE.md` and `OUTLINE.md` (add Op Man Hub and margo-hub), and each hub's `CLAUDE.md`/`AGENTS.md`: "Shell changes: edit `hub-kit/shell/`, run `node ~/Projects/hub-kit/tools/build.js all`, commit and push each hub. Subject changes: edit the subject repo, then `node tools/hub.js sync` in the hub. New family hub: new folder with `hub.json` + `subjects.json`, add it to `hubs.json`, run build."
6. **Test.** Run build on both hubs; `git diff` in each should show only the intended differences. Serve each (`python3 -m http.server`) and check: picker, Subjects ▾ switcher, stats page, Study Cat, every subject opens, phone width, dark mode, no console errors (the service worker may not register inside the in-app browser; that's fine). Then commit and push both; check the live sites mrsimonm.github.io/study-hub/ and mrsimonm.github.io/margo-hub/.

## Later (separate task, not now)
Share the lesson engine too (`app.js`, `lib/lecture-lib.js`, `lib/path.js`, `lib/apply.js`, `lib/formulas.js` base) across subject repos from `hub-kit/base`, while keeping each subject's own extras (`lib/opman.js`, `lib/graphs.js`, formulas data). Riskier: engines differ between subjects; do it one subject at a time.

## Rules
- Plain HTML/CSS/JS, no npm, no build step for the sites themselves (the Node tools only copy/generate files).
- Mobile-first, light and dark mode via CSS variables.
- Don't change subject content. Ask before pushing if anything looks wrong.
