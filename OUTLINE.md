# Study hubs: outline

Every hub is the same engine with different course data. Live sites are on GitHub Pages under `mrsimonm.github.io`. Local folders are in `/Users/simonmusel/Projects/`.

| Hub | Course | School | Live site | Repo | Progress key | Extras on top of the engine |
|---|---|---|---|---|---|---|
| **Geology Hub** | ZOX101E Geology (Mgr. Václav Santolík) | ČZU Prague | https://mrsimonm.github.io/geo-hub/ | `mrsimonm/geo-hub` | `geoHub.v1` | weekly-test card, lecture slides panel, old JS topic files (`topics/`), day/night button, Firebase sync on |
| **Statistics Hub** | 4ST601 Statistics | VŠE Prague | https://mrsimonm.github.io/stats-hub/ | `mrsimonm/stats-hub` | `statsHub.v1` | formula panel, seminar exercises, transcripts, Firebase sync on |
| **Micro Hub** | 3BE123 Microeconomics (Ing. Zuzana Dzbánková) | VŠE Prague | https://mrsimonm.github.io/micro-hub/ | `mrsimonm/micro-hub` | `microHub.v1` | formula coach, interactive graphs and drills, seminar exercises, Test 2 study path |
| **Op Man Hub** | 3BE216 Operations Management (Felipe Martinez) | VŠE Prague | https://mrsimonm.github.io/margo-hub/opman/ (no standalone site yet) | local only, not on GitHub yet | `opmanHub.v1` | interactive widgets (steel bars, lead-time timelines, break-even, drag/sort/order), calculation drills, 90-min mock tests, practice-test apply sets |
| **Eco Hub** | Fundamentals of Ecology (Martin Bulla & Peter Mikula) | ČZU Prague | https://mrsimonm.github.io/eco-hub/ | `mrsimonm/eco-hub` | `ecoHub.v1` | "tick all that apply" drill (exam scoring), real exam format (19 q / 10 min), exam study path |
| **Bio Hub** | ZEX108E Fundamentals of Biology | ČZU Prague | https://mrsimonm.github.io/bio-hub/ | `mrsimonm/bio-hub` | `bioHub.v1` | 12 lectures, 24-question exam practice |

## Family hubs (several subjects in one app)

A family hub puts several subject hubs behind one picker, with a `Subjects ▾` switcher, one Google sign-in, one shared Study Cat and one Statistics page. Each subject is synced in from its own repo above; never edit the copies inside a family hub. All family hubs share Firebase project `geo-hub-96426`.

| Family hub | For | Subjects | Live site | Repo | Storage prefix |
|---|---|---|---|---|---|
| **Study Hub** | Simon | Bio, Eco, Geology | https://mrsimonm.github.io/study-hub/ | `mrsimonm/study-hub` | `studyHub.*` |
| **Margo's Study Hub** | Margo | Statistics, Micro, Op Man | https://mrsimonm.github.io/margo-hub/ | `mrsimonm/margo-hub` | `margoHub.*` |

Their hub-level files (picker, switcher, offline cache, Study Cat, stats, sign-in) all come from [shell/](shell/) in this kit. See GUIDE.md, section 7.

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
