# jobpath -- 15-minute quickstart

This walks you from `git clone` to your first scan + first tailored CV. Designed to be run inside a coding agent (Claude Code, OpenCode, or Gemini CLI) -- the agent does most of the work.

## Prerequisites

- Node.js 18+ and npm
- Git
- A coding agent that supports project skills (Claude Code, OpenCode, Gemini CLI)
- An Anthropic API key (or your agent's equivalent)

## Step 1 -- Clone and install (2 min)

```bash
git clone https://github.com/mohithkanala/jobpath.git
cd jobpath
npm install
npx playwright install chromium
```

## Step 2 -- Open in your agent (1 min)

```bash
# Claude Code
claude

# or OpenCode
opencode

# or Gemini CLI
gemini
```

The agent will read `CLAUDE.md` automatically and detect that user files are missing. It enters onboarding mode.

## Step 3 -- Drop in your CV (3 min)

The agent will ask one of:

- Paste your CV text and it converts to markdown
- Paste a LinkedIn URL and it extracts key info
- Talk through your experience and it drafts

You end with a `cv.md` in project root. This is the **source of truth** for every tailored CV the system generates. Keep it clean, keep it up to date.

## Step 4 -- Set your profile (3 min)

The agent asks for:

- Your full name, email, location, timezone
- Target roles (e.g. "Senior Backend Engineer", "AI Product Manager")
- Salary target range
- Any deal-breakers (on-site only, no Java shops, no startups under 20 people, etc.)

It writes `config/profile.yml`. You can edit it later anytime.

## Step 5 -- Pick your portals (2 min)

`portals.yml` ships with 45+ pre-configured companies (Greenhouse / Ashby / Lever / Workday boards). The agent asks if you want to customize the title filter for your target roles.

Say yes if you want the scanner to skip "Designer" or "Policy Analyst" postings at AI companies, for example.

## Step 6 -- First scan (1 min)

```
/jobpath scan
```

The scanner hits portal APIs directly. Zero LLM cost on the discovery step. New postings land in `data/pipeline.md`.

## Step 7 -- First evaluation (3 min)

Pick a posting from the pipeline that looks interesting and paste the URL into chat. The agent runs the `oferta` mode -- structured A-G scoring against your profile, written to `reports/001-{company}-{date}.md`. If the score is at or above 4.0/5 the agent will offer to generate a tailored CV.

## Step 8 -- First tailored CV (1 min)

```
/jobpath pdf
```

This reads `cv.md`, the target JD, and `modes/_profile.md` (your customizations) and generates a 2-page ATS-friendly PDF in `jobs/{company}/{role}/`. You review, you decide to apply, you submit yourself.

## That is the loop

From here:

- Daily: `/jobpath scan` to refresh the pipeline
- Per interesting posting: paste URL, get a report, decide whether to tailor + apply
- Per active interview: `/jobpath interview-prep` builds a company-specific prep doc
- Weekly: `/jobpath tracker` for overview, `/jobpath followup` to nudge stale apps

## Recurring scans

Want the scan to run on a schedule without you typing it? Tell the agent: "Set up a recurring scan every 3 days." It will configure `/loop` or `/schedule` if available, or hand you a cron command you can paste.

## When things break

- Run `node scripts/system/test-all.mjs` to see what is missing or broken
- Run `node scripts/tracker/verify-pipeline.mjs` to check tracker integrity
- Run `node scripts/system/doctor.mjs` for a health sweep

## Next reading

- `METHODOLOGY.md` -- the discipline rules that make this work
- `CLAUDE.md` -- the full agent instructions, including data contract and state machine
- `DATA_CONTRACT.md` -- user layer vs system layer split
- `docs/CUSTOMIZATION.md` -- how to make jobpath yours
