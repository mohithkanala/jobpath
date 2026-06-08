# jobpath

> An opinionated job search OS: daily portal scan, batch evaluation, tailored CV generation, per-job context that survives chat compaction.

jobpath runs from inside a coding agent (Claude Code, OpenCode, Gemini CLI). You point it at the companies you care about, it scans them daily, evaluates each posting against your profile, generates tailored CVs and cover letters, and keeps your application tracker honest. The whole pipeline lives on your machine. No SaaS, no scraping logs uploaded anywhere.

It is designed for AI / data / engineering job hunts where tailoring quality matters more than application volume.

## What it does

1. **Scans portals.** Hits Greenhouse / Ashby / Lever / Workday APIs directly. Zero LLM cost on the discovery step. New postings land in `data/pipeline.md`.
2. **Evaluates with a structured rubric.** A-G scoring blocks (fit, comp, growth, location, legitimacy, etc.) save to `reports/{NNN}-{company}-{date}.md`. Scores under 4.0/5 are explicitly discouraged.
3. **Tailors CVs per JD.** Uses `cv.md` as source of truth plus a strict template (font sizes, 2-page cap, ordering rules) to produce ATS-friendly PDFs.
4. **Tracks the pipeline.** Canonical states (`Evaluated`, `Applied`, `Interview`, `Offer`, `Rejected`, etc.) keep `data/applications.md` consistent across 100+ entries.
5. **Survives chat compaction.** Per-job `jobs/{company}/{role}/CONTEXT.md` running brief means a new chat can pick up an interview cycle mid-stream without rereading history.

## Quick start

```bash
git clone https://github.com/mohithkanala/jobpath.git
cd jobpath
npm install
npx playwright install chromium   # for PDF generation
```

Then open the folder in Claude Code (or your coding agent of choice) and let it walk you through onboarding. The agent reads `CLAUDE.md` and walks you through CV, profile, portals, tracker setup.

**First scan in 15 minutes.** See [`QUICKSTART.md`](QUICKSTART.md) for the full walkthrough.

## Methodology

The actual signal in this repo is in the discipline rules, not the code. Read [`METHODOLOGY.md`](METHODOLOGY.md) for:

- Resume rigor rules (font sizes, 2-page cap, cert date canonicalization, academic credentials verbatim)
- Per-job folder convention (`jobs/{company}/{role}/` with CONTEXT.md, resume, cover letter, JD copy, prep notes)
- Daily scan cadence and the canonical state machine
- The evaluate-before-apply 4.0/5 floor
- Why interview prep gets its own context file per cycle

## Architecture overview

```
portals.yml -> scripts/pipeline/scan.mjs -> data/pipeline.md -> modes/oferta.md -> reports/NNN-*.md
                                                                                       |
                                                                                       v
                                                                       scripts/cv/generate-pdf.mjs
                                                                                       |
                                                                                       v
                                                                  jobs/{company}/{role}/resume.pdf
                                                                                       |
                                                                                       v
                                                       batch/tracker-additions/ -> data/applications.md
```

- **System layer** (the repo's product): `modes/`, `scripts/`, `templates/`, `dashboard/`, `batch/batch-prompt.md`
- **User layer** (your data, never overwritten by updates): `cv.md`, `config/profile.yml`, `modes/_profile.md`, `portals.yml`, `data/`, `reports/`, `jobs/`, `interview-prep/`

The split is enforced by `scripts/system/update-system.mjs` -- updating the system layer never touches user data.

## Slash commands

Once installed, your coding agent gets these slash commands:

| Command | What it does |
|---------|--------------|
| `/jobpath` | Show menu, or evaluate JD with args |
| `/jobpath scan` | Scan all portals listed in `portals.yml` |
| `/jobpath pipeline` | Process pending URLs from `data/pipeline.md` |
| `/jobpath oferta` | Evaluate a single posting against your profile |
| `/jobpath pdf` | Generate ATS-optimized CV for a target role |
| `/jobpath apply` | Live application assistant (fill forms, never submits) |
| `/jobpath tracker` | Application status overview |
| `/jobpath batch` | Batch processing with parallel workers |
| `/jobpath patterns` | Analyze rejection patterns, improve targeting |
| `/jobpath followup` | Follow-up cadence tracker |
| `/jobpath deep` | Deep company research |
| `/jobpath contacto` | LinkedIn outreach (find contacts, draft message) |
| `/jobpath interview-prep` | Build company-specific interview intel report |

Run `/jobpath` with no args to see them all.

## Ethical use

jobpath is for quality, not quantity. The system **will not** submit on your behalf. It drafts, fills, prepares, but you press the final button. If a score is under 4.0/5, the system actively discourages applying. Respect recruiters' time.

## Customization

jobpath is designed to be made yours by your coding agent. Examples that work out of the box:

- "Change the archetypes to data engineering roles" -> agent edits `modes/_profile.md`
- "Add these 10 companies to my portals" -> agent edits `portals.yml`
- "Adjust the scoring weights, comp matters less than growth for me" -> agent edits `modes/_profile.md`
- "Translate the evaluation mode to French" -> agent edits `modes/fr/`

The whole point is that the AI agent reads the same files it edits, so you describe changes in English and they ship.

## Why this exists

I built and used jobpath for my own AI / Applied AI / Principal Engineer job search. The methodology layer (the rules in `METHODOLOGY.md`, the per-job folder convention, the daily scan discipline) is what made it work. Open-sourcing it because the workflow generalizes.

## Status

v0.1.0. Working, used in production by the author, not yet battle-tested across many users. Issues and PRs welcome.

## Credits

jobpath builds on prior open-source work in the AI job-search space. See [`ATTRIBUTION.md`](ATTRIBUTION.md) and [`LICENSE`](LICENSE).

## License

MIT. See [`LICENSE`](LICENSE).
