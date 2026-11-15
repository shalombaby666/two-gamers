# Two Gamers — Product and Technical Design

## Goal

Build a browser-first, responsive arcade for quick two-player games. Players can start without an account, play together on one device, earn match points, and later invite a friend online. The first public release is an honest, playable local prototype; online rooms and persistent profiles are follow-on milestones.

## Product direction

The site uses a pixel-art night arcade traveling between fictionalized cultural locations. Locations are visual settings, not caricatures or national teams. The interface stays readable and playful: dark ink background, warm paper panels, bright cyan and coral accents, chunky pixel details, concise instructions, and visible round timers.

The product promise is “choose a game, understand it in seconds, finish a match in under five minutes.” Guests can play immediately. Accounts only become useful when saving cross-device history, ratings, and tournament records.

## First release scope

- Responsive home screen with a featured game, three game cards, mode labels, short instructions, and a visible local-play path.
- Three original playable local mini-games: Roof Rush (versus arena survival), Bento Blitz (co-op order rush), Street Rally (short race).
- Shared match shell: countdown or objective, round result, scores, replay, keyboard and touch controls.
- Local score summary stored in the browser; guest play does not require registration.
- GitHub Pages workflow so the public repository can host a working static demo.
- A documented multiplayer adapter boundary for adding a room-code network transport later.

## Explicitly deferred

- Remote rooms and matchmaking. Those need signaling/relay hosting, reconnect behavior, and adversarial validation; a static GitHub Pages site alone cannot provide them.
- Registration, cloud profiles, global leaderboards, tournaments, chat, and monetization.
- Copying third-party game code, artwork, audio, names, or levels. Game mechanics may inspire original implementations; reused assets need a suitable license.

## Gameplay

All first-release games are short, keyboard-friendly, and fit a single canvas. Roof Rush uses WASD versus arrow keys; players stop at the roof edge, and a dash collision can knock a rival off. Bento Blitz gives each cook a side of the counter and requires one correct ingredient from each side for every order. Street Rally uses throttle and lane steering on a looping track, with hazards and car-to-car bumps that change speed and position. Each round shows controls before play and offers replay without returning to the home screen.

## Architecture

Use a dependency-light static web app: semantic HTML, CSS, and native JavaScript modules with Canvas 2D rendering. The shell owns navigation, catalog metadata, match lifecycle, sound preference, local score persistence, and accessible instructions. Each game module owns its state, input mapping, update loop, render function, result, and cleanup. The interface contract is `createGame({ canvas, players, onFinish }) -> { start(), destroy() }`.

Networking is a later transport implementing the same input/event boundary. For latency-sensitive gameplay, the server must ultimately validate authoritative game state and match results. Do not imply that static hosting alone supports online play.

## Hosting and run path

The repo will contain a no-build static app. `npm run dev` serves the demo locally using Vite; `npm run build` verifies and emits `dist/`. GitHub Actions builds `dist/` and deploys it to GitHub Pages. The first deployment is public if repository settings allow Pages. No secrets or user data are needed for the local prototype.

## Accessibility and input

Provide visible keyboard hints, strong focus states, text labels in addition to icons, reduced-motion support, and touch buttons that work on narrow screens. The local two-player touch layout must allow two people to play across one phone or tablet screen; desktop uses WASD and arrow keys. Pause/replay controls remain operable without a mouse.

## Success criteria

- The homepage clearly explains local two-player play and has a working launch action for every game.
- Each game reaches a visible round result and can be replayed.
- The UI works at phone and desktop widths.
- A clean checkout can start locally and produce a Pages-ready build.
- The public README explains setup, current limitations, and where to try the demo.
