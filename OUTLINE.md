# Study hubs: outline

Every hub is the same engine with different course data. Live sites are on GitHub Pages under `mrsimonm.github.io`. Local folders are in `/Users/simonmusel/Projects/`.

| Hub | Course | School | Live site | Repo | Progress key | Extras on top of the engine |
|---|---|---|---|---|---|---|
| **Geology Hub** | ZOX101E Geology (Mgr. Václav Santolík) | ČZU Prague | https://mrsimonm.github.io/geo-hub/ | `mrsimonm/geo-hub` | `geoHub.v1` | weekly-test card, lecture slides panel, old JS topic files (`topics/`), day/night button, Firebase sync on |
| **Statistics Hub** | 4ST601 Statistics | VŠE Prague | https://mrsimonm.github.io/stats-hub/ | `mrsimonm/stats-hub` | `statsHub.v1` | formula panel, seminar exercises, transcripts, Firebase sync on |
| **Micro Hub** | 3BE123 Microeconomics (Ing. Zuzana Dzbánková) | VŠE Prague | https://mrsimonm.github.io/micro-hub/ | `mrsimonm/micro-hub` | `microHub.v1` | formula coach, interactive graphs and drills, seminar exercises, Test 2 study path |
| **Eco Hub** | Fundamentals of Ecology (Martin Bulla & Peter Mikula) | ČZU Prague | https://mrsimonm.github.io/eco-hub/ | `mrsimonm/eco-hub` | `ecoHub.v1` | "tick all that apply" drill (exam scoring), real exam format (19 q / 10 min), exam study path |

## What every hub has (the engine)

- **Home by test**: one card per test, with lessons in order and a progress bar.
- **Lessons** (`steps.md`): small bites, tap-for-definition glossary words, inline check questions.
- **Mastery**: four stars per lesson; a star counts only at 100 %.
- **Flashcards**, **Which one am I?**, **Games** (match pairs, type it, true/false, Quick 5).
- **Mock test** per lesson, **Exam practice** across lessons with a grade estimate.
- **Review**: every wrong answer comes back until you get it right.
- **Dictionary**: every term, searchable, blur-to-test.
- **Study path** ("Start studying"): one test walked through in small steps.
- **XP, levels, streak, daily goal, focus sprint timer** and the **Study Cat**.
- **Offline PWA**, light and dark mode, phone-first layout.
- **Optional Google sign-in sync** through Firebase (one project per hub).

## Engine lineage

Geology Hub (first) → Statistics Hub → Micro Hub → Eco Hub (newest, copied from Micro Hub on 24 Nov 2026) → `base/` in this kit (Eco Hub engine with the subject removed). Start new hubs from `base/`.
