---
name: finish-stage
description: Close a roadmap stage of Editorial Flow. Runs the four checks, reviews the branch with the fsd-reviewer agent, updates docs/ROADMAP.md (and the other docs if the stage touched them), commits, pushes when the user says so, and drafts the PR title and description for the user to open on GitHub.
disable-model-invocation: true
argument-hint: "[stage number]"
---

# Finish a stage

A stage branch (`feat/*`, `docs/*`, `fix/*`, `refactor/*`) collects small commits, and the PR into `develop` opens only when the whole stage is done. This skill is that last step.

The stage is `$ARGUMENTS` if given; otherwise work it out from the branch name and `docs/ROADMAP.md`.

## 1. Orient

- `git branch --show-current`, `git status`, `git log --oneline develop..HEAD`.
- Stop if the branch is `develop` or `main`: stages never land there directly.
- If there are uncommitted changes, ask whether they belong to this stage before doing anything with them.
- Read the stage's section in `docs/ROADMAP.md` and compare it with what the commits did. Unchecked items that the branch didn't do are worth pointing out: either the stage isn't done or the roadmap needs adjusting. Ask which.

## 2. Run the checks

Run them in this order, each to completion:

```bash
npm run lint
npx tsc --noEmit
npm run test:run
npm run build
```

If one fails, show the relevant output. Fix it when the cause is clear and inside the stage's scope; otherwise stop and report. Never skip a check, weaken a test or add `eslint-disable` to get green: the checks are the merge gate in `docs/ARCHITECTURE.md`.

## 3. Review the branch

Launch the `fsd-reviewer` agent on `develop...HEAD`. Fix confirmed findings that are clearly right; list the rest for the user with your take on each. Re-run the affected checks after fixes.

## 4. Update the docs

Docs are in English. Read each file before editing and change only what this stage made untrue or incomplete:

- `docs/ROADMAP.md`: tick the stage's checkboxes, add ✅ to its heading, update the component porting table, and add, fix or strike through known issues the stage touched.
- `docs/ARCHITECTURE.md`: the "Current" slice map if new slices or segments appeared; data flow or conventions if they changed.
- `docs/DESIGN_SYSTEM.md`: the components table for new `shared/ui` components, recurring patterns for new visual states.
- `README.md` only if run instructions or the stack changed.

## 5. Commit, then push only when told

- Commit the doc changes separately: `docs: update docs for the <stage name> stage`.
- Conventional Commits for everything else.
- Husky runs lint-staged on commit. If the hook fails, fix the cause and commit again; never use `--no-verify`.
- Push only if the user asked for it in this conversation; otherwise stop after the commit and ask. Use `git push -u origin <branch>`, never force-push, and never push `develop` or `main`.

## 6. Draft the PR

The user opens the PR on GitHub themselves. Give them, in the chat, ready to paste:

1. The link `https://github.com/eegrishina/editorial-flow/compare/develop...<branch>?expand=1` (base `develop`).
2. The title in Conventional Commit style, like the earlier PRs: `feat: add UI kit, BookCard and /kit style guide`, `refactor(entities): split book flag into urgent and awaiting`.
3. The description as one markdown code block, so formatting survives copying. Follow the structure of the earlier PRs:

```markdown
<One or two sentences: what the PR does and why it lands now, in the context of the roadmap.>

Why:

- <The reasoning behind the change: the problem with the old shape or the gap it fills. One bullet per reason; skip "Why" only for purely mechanical stages.>

What's changed:

- **<Area>:** <change; use `code` for names, types and values>
- **<Area>:**
  - <sub-point when one area has several distinct changes>
  - <sub-point>
- **/kit:** <what can now be checked visually, if anything>
- **Docs:** <which docs changed and what about, e.g. "stage vs flags (ARCHITECTURE), roadmap">
```

Areas are the things a reviewer recognizes, not file paths: **Model**, **Mocks**, **API**, `**isUrgent**`, **BookCard**, **Board**, **/kit**, **Docs**. Explain the non-obvious *why* inside the bullet when it helps ("stays the single place that decides urgency, so it can become deadline-based later"). No checks list.

## 7. Report

Say whether the branch was pushed, anything left open (review findings, unchecked roadmap items), and the next stage from the roadmap.
