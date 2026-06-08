# jobpath methodology

The code in this repo is the easy part. The methodology -- the rules, conventions, and discipline encoded in the modes, prompts, and folder layout -- is the actual product.

This document captures the opinions. If you do not agree with them, fork the repo and override them. They are tuned for AI / data / engineering job hunts at the senior to staff to principal levels.

## 1. Resume rigor rules

A resume is a document under constraint. The constraints are non-negotiable; the content is the lever.

### Font and layout

- **Single-page first, two pages hard cap.** If your CV does not fit two pages, the content is wrong, not the font size.
- **Professional Summary fixed at 10.5px / size 21.** Do not shrink the summary to fit more. Trim content first.
- **No font size below 9pt anywhere.** ATS parsers can struggle, recruiters notice.
- **Single-column layout.** Two-column resumes confuse ATS systems. The visual interest is not worth the parse failure rate.

### Header rules

- **One line, pipe-separated.** Name, email, LinkedIn, GitHub, phone, location.
- **Email and LinkedIn and GitHub as hyperlinks.** Phone and location plain text.
- **No icons in the header.** They render badly in ATS preview and add noise.
- **Cover letter header matches the resume header exactly.** Same line, same separators, same order. Recruiters who see both documents read consistency as professionalism.

### Content rules

- **Certifications use canonical dates and verification URLs.** PMP, GCP, Coursera, Toastmasters -- pick the format, use it on every variant, never paraphrase.
- **Academic credentials verbatim.** GPAs, distinctions, university names. Do not inflate. "First Class with Distinction" is real and provable; "Magna Cum Laude" added because it sounds better is not.
- **Quantify everything quantifiable.** Cost saves, latency reductions, NPS, headcount, ARR, throughput. Do not write "improved performance" when you can write "reduced p95 latency from 4.2s to 1.1s."
- **Match seniority framing to the JD.** Do not lead with "7+ years" on a mid-level IC role; you will be filtered out as over-qualified or over-scrutinized.

### Tailoring rule

- The canonical resume lives in `cv.md`. Every per-JD variant is generated from it.
- Tailoring means: reorder bullets to put the most JD-relevant work first, swap in synonyms that match the JD vocabulary, drop sections that are not relevant. Tailoring does not mean: invent experience, change titles, alter dates.

## 2. Per-job folder convention

Each role you genuinely consider gets a folder under `jobs/{company-slug}/{role-slug}/`. Inside:

```
jobs/{company}/{role}/
├── CONTEXT.md            # append-only running brief for this role
├── JD.md                 # the job description, captured at first contact
├── resume.pdf            # the tailored resume actually submitted
├── resume.html           # source for the PDF
├── cover-letter.md       # if applicable
├── ats-answers.md        # answers to common ATS form fields
└── {round}/              # per-round subfolders for active interview cycles
    └── notes.md
```

Why this matters:

- A single folder per role means you can hand any of them to a fresh chat and get continuity. "Read jobs/anthropic/staff-applied-ai/CONTEXT.md and tell me what I prepped for the system design round" -- and it works.
- The CONTEXT.md is **append-only**. Each interaction adds new notes at the bottom. You never edit history. This survives chat compaction better than anything else.
- The JD.md is captured once, at first contact, before the company takes down the posting. You will need it later for thank-you notes, offer negotiations, and post-mortem.

## 3. Daily scan cadence

- **One scan per day, automated.** Pick a time (morning is good), set `/loop` or `/schedule` to run `/jobpath scan` daily.
- **Scanner output is silent unless new postings hit.** No noise, no daily "0 new" email. Only signal.
- **Liveness check before evaluation.** Postings expire. Run `node scripts/pipeline/check-liveness.mjs` before paying for an evaluation if the posting is more than 14 days old.

The point of daily scanning is **availability bias**. If you only scan when you feel like applying, you miss postings that go up briefly and come down. Daily scanning catches them all.

## 4. Canonical state machine

Source of truth: `templates/states.yml`. The states are:

| State | When to use |
|-------|-------------|
| `Evaluated` | Report completed, you have not decided yet |
| `Applied` | Application submitted |
| `Responded` | Company responded (positively or not) |
| `Interview` | In active interview process |
| `Offer` | Offer received |
| `Rejected` | Company rejected you |
| `Discarded` | You decided not to apply, or the posting closed |
| `SKIP` | Hard pass, do not apply (use for SKIP triggers from `modes/_profile.md`) |

Rules:

- **No markdown bold in the status field.** Plain text only.
- **No dates in the status field.** Dates live in the date column.
- **No free text in the status field.** Use the notes column.
- **Run `node scripts/tracker/normalize-statuses.mjs` weekly** to catch drift.

The state machine is rigid on purpose. Without it, `data/applications.md` becomes unreadable past 50 entries. With it, you can grep, sort, and report cleanly past 500.

## 5. Evaluate-before-apply 4.0/5 floor

`modes/oferta.md` produces an A-G structured evaluation:

- **A. Match against your target archetype**
- **B. Comp signal**
- **C. Growth signal**
- **D. Location + visa fit**
- **E. Process fit (interview style, takehome length, etc.)**
- **F. Differentiation (why you over the next 100 applicants)**
- **G. Posting legitimacy (real role vs. requisition fishing)**

Each block scored 0-5. Weighted composite is the headline score.

**Rule: do not apply to roles scoring under 4.0/5 without an explicit override reason.** Your time is finite, recruiter attention is finite. A weak application teaches the company nothing useful and gives you nothing back.

If you find yourself overriding repeatedly, your archetypes are wrong. Fix `modes/_profile.md`, do not lower the floor.

## 6. Interview prep gets its own context

When a role moves to `Interview`, create `interview-prep/{company-slug}-{role-slug}.md` for company intel (founders, recent funding, technical bets, public roadmap) and per-round subfolders inside `jobs/{company}/{role}/` for round-specific prep.

Why two locations:

- `interview-prep/` is the strategic / company-level brief. Read it once at the start of the cycle.
- `jobs/{company}/{role}/{round}/` is tactical. STAR stories, system design diagrams, code review prompts. One folder per round.

The split keeps the cycle manageable when there are six rounds across three weeks.

## 7. STAR story accumulation

`interview-prep/story-bank.md` is your accumulated bank of STAR + R (Situation, Task, Action, Result + Reflection) stories. After every interview cycle, write up the 3-5 stories that worked. Across 5-10 cycles you build a battery of 30+ stories that handle 90% of behavioral questions.

The reflection layer (the "R") is the most valuable. Recording **what you would do differently** turns interview prep into actual learning.

## 8. Why all of this matters more than the code

You can build the scripts in `jobpath` in a weekend. The methodology took longer to learn -- through running the loop, hitting the edges, fixing the breakdowns. The rules in this document are what kept the operation honest under load: 700+ scans, 100+ evaluations, 20+ interview cycles, without the tracker rotting or the resumes drifting.

If you fork jobpath, fork the methodology too. Adjust the rules to your hunt -- but keep some rules. The discipline is the lever.
