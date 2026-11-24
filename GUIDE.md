# Study hub guide

How the hubs work, and how to make a new one in about an hour. For the list of existing hubs see [OUTLINE.md](OUTLINE.md). The starter files are in [base/](base/).

## 1. How a hub is built

A hub is a **static website**: plain HTML, CSS and JavaScript, no build step, no npm, no frameworks. GitHub Pages serves it straight from the `main` branch.

```
index.html            all markup and CSS (colours are CSS variables, light + dark)
app.js                the engine: home, lessons, quizzes, games, Mastery, XP, review, dictionary, exam practice
lib/lecture-lib.js    reads and validates lecture data (also used by tools/validate.js)
lib/path.js           "Start studying" study path
lib/tickall.js        "tick all that apply" drill (optional)
lib/cat.js            the Study Cat
lib/firebase-*.js     optional Google sign-in sync
sw.js                 offline cache (bump the version when shell files change)
courses/<name>/       ALL the subject content, as data
  course.json         title, intro, tests, list of lectures, exam format, grade scale
  lectures/tN/        one folder per lecture: lecture.json + steps.md
  path/<test>.json    optional study path
  tickall.json        optional tick-all questions
tools/validate.js     checks the data before you publish
templates/lecture/    an empty lecture to copy
```

The engine never changes per subject; only `courses/` does (plus the names in a few files, see step 3 below).

## 2. Lecture data in one minute

`lecture.json` holds `questions` (1 right + 3 wrong, a hint, an explanation; mark key ones `"fol": true`), `vocab` (term + meaning), `facts` (fill-the-gap sentences for Mastery), `six` (takeaways) and optional `cards`, `names` and `sheet` tables. `steps.md` is the lesson: `## Title | 5 min` per step, callout boxes `:::idea`, `:::teach`, `:::trap`, `:::ana`, `:::skip`, and `{{q:id}}` to drop in a check question. Full reference: `base/AUTHORING.md`. To have an AI write a lecture from slides, paste `base/PROMPT.md` plus the slides.

Colour meaning everywhere: accent = idea, amber = teacher said, red = exam trap, green = correct, cyan = analogy, grey = don't memorise.

## 3. Make a new hub

1. **Copy the base**: `cp -R hub-kit/base ~/Projects/<name>-hub` (the folder name becomes the URL).
2. **Rename the course folder**: `courses/example` → `courses/<name>`.
3. **Replace the placeholders** (search for `NEW Hub`, `newHub`, `new-hub`, `courses/example`, `CODE`, `Subject`):
   - `index.html`: `<title>`, `apple-mobile-web-app-title`, description, brand line, exam card text, `data-key` of the cat.
   - `app.js`: `KEY` (`<name>Hub.v1`), default course path, default title.
   - `lib/path.js`, `lib/tickall.js`: their storage keys.
   - `sw.js`: cache name and the course path in `SHELL`.
   - `manifest.webmanifest`: name and description.
4. **Fill `course.json`**: title, subtitle, intro, footer, `tests` (what each test covers, its date as `badge`), `exam` (`n` questions, `min` minutes for the exam-practice button), `grades` (`[[min %, "label"], …]`, highest first), optional `tickall` and `paths`.
5. **Add lectures**: one folder per lecture, list each in `course.json` → `lectures` and in its test's `lectures`.
6. **Check**: `node tools/validate.js courses/<name>` (fix every ERROR) and `python3 -m http.server 8000`, then open http://localhost:8000.
7. **Write the hub's own docs**: `README.md`, `HANDOFF.md` (course facts, what is built, to do), `AGENTS.md` (rules). Copy them from the newest hub and edit.
8. **Publish** (step 4 below).

## 4. Publish to GitHub Pages

```bash
cd ~/Projects/<name>-hub
git init -b main
git add -A
git -c user.name=mrsimonm -c user.email=322631765+mrsimonm@users.noreply.github.com commit -m "<Name> Hub: study hub for <course>"
gh repo create mrsimonm/<name>-hub --public --source . --push
gh api -X POST repos/mrsimonm/<name>-hub/pages -f "source[branch]=main" -f "source[path]=/"
```

The site appears at `https://mrsimonm.github.io/<name>-hub/` after a minute or two. Always commit with the GitHub noreply address, never a personal email. Keep `.nojekyll` in the root so Pages serves every file as is.

## 5. Optional: Google sign-in sync

Create a Firebase project for the hub, paste its web config into `lib/firebase-config.js`, publish `firestore.rules`, and add `mrsimonm.github.io` to the authorised domains. While `apiKey` is empty the hub works with browser storage only.

## 6. Rules for anyone (or any AI) working on a hub

- Facts must match the teacher's material. If unsure, write `TODO: verify`, never guess.
- Phone first: 16px side gutters, no sideways scrolling, light and dark mode, only existing CSS variables.
- Question ids are stable and unique across the course (progress and review are stored by id).
- Run the validator after every change. Don't rename or delete files without a reason.
- After changing shell files (`index.html`, `app.js`, `lib/*`), bump the cache version in `sw.js`.
- Update [OUTLINE.md](OUTLINE.md) and `index.html` in this kit when a hub is added.
