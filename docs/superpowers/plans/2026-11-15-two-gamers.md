# Two Gamers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, public, locally playable three-game arcade starter with a clean path to online rooms.

**Architecture:** Responsive static app with HTML/CSS/JavaScript modules, shared catalog and match shell, and independent Canvas 2D games. GitHub Actions builds the static site for Pages; networking is explicitly deferred until a transport backend exists.

**Tech Stack:** Node.js, Vite, HTML, CSS, JavaScript modules, Canvas 2D, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-15-two-gamers-design.md`

## Global Constraints

- Keep guest play available without registration.
- First-release matches must be under five minutes.
- Preserve mobile and desktop input paths.
- Do not represent local play as online multiplayer.
- Do not copy unlicensed assets or game source.

---

### Task 1: Create the app shell and visual system

**Files:** `package.json`, `index.html`, `src/main.js`, `src/styles.css`, `vite.config.js`

- [ ] Create a Vite static app with `npm run dev` and `npm run build`.
- [ ] Build the home screen with brand, game cards, local-play callout, and footer.
- [ ] Add responsive styles, keyboard focus, reduced-motion rules, and canvas stage shell.
- [ ] Run a production build.

### Task 2: Add shared catalog and match lifecycle

**Files:** `src/catalog.js`, `src/ui.js`, `src/storage.js`, `src/main.js`

- [ ] Add catalog entries with title, runtime, mode, controls, and module factory.
- [ ] Implement launch, pause, result, replay, and home transitions.
- [ ] Persist local wins and completed matches without account registration.
- [ ] Run a production build and manually verify transitions.

### Task 3: Implement Roof Rush

**Files:** `src/games/roof-rush.js`

- [ ] Implement deterministic local input, movement, hazards, timer, hearts, and win condition.
- [ ] Draw a small original pixel-style arena on Canvas 2D.
- [ ] Add touch controls and cleanup through the common game interface.
- [ ] Play a full match and confirm result/replay.

### Task 4: Implement Bento Blitz

**Files:** `src/games/bento-blitz.js`

- [ ] Implement a shared order queue, two player stations, ingredient actions, scoring, and timer.
- [ ] Draw an original compact kitchen scene with clear current order feedback.
- [ ] Add touch controls and cleanup through the common game interface.
- [ ] Play a full match and confirm cooperative result/replay.

### Task 5: Implement Street Rally

**Files:** `src/games/street-rally.js`

- [ ] Implement two player steering, three-lap timing, track boundaries, and finish ranking.
- [ ] Draw an original top-down pixel-style track with lap indicators.
- [ ] Add touch controls and cleanup through the common game interface.
- [ ] Play a full match and confirm result/replay.

### Task 6: Add public repo docs and Pages deployment

**Files:** `README.md`, `.gitignore`, `.github/workflows/pages.yml`

- [ ] Document prerequisites, local run, controls, game roadmap, and current online-play limits.
- [ ] Add a Pages workflow that builds and deploys `dist/` on the default branch.
- [ ] Verify a clean build and inspect the final staged changes.
- [ ] Create the public `two-gamers` repository and push the app.
