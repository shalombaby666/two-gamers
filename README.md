# Two Gamers

**Tiny games. Big rivalries.** A browser arcade of fast original games for two players on one screen.

## Play locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To build the static site:

```bash
npm run build
npm run preview
```

## Games

- **Roof Rush** — versus rooftop arena. Move with WASD and arrow keys. Bump your rival off the roof.
- **Bento Blitz** — cooperative kitchen rush. Move with WASD and arrows; P1 uses E and P2 uses Enter to pick up ingredients and serve orders.
- **Street Rally** — three-lap arcade race. P1 accelerates with W and changes lanes with A/D; P2 uses ↑ and ←/→.

Touch controls are included for phones and tablets. Match points are saved in the current browser without an account.

## Online play

This first version is local multiplayer on one device. Network rooms, accounts, global leaderboards, and tournaments need a hosted multiplayer service and are not enabled yet. The game modules use a shared lifecycle so an online transport can be added without changing the game catalog.

## Deploy

The `main` branch has a GitHub Actions workflow that builds and publishes the static site to GitHub Pages. In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** if Pages is not already enabled. The public demo URL will be `https://shalombaby666.github.io/two-gamers/` after the first successful deployment.

## Project notes

See [the design](docs/superpowers/specs/2026-11-15-two-gamers-design.md) and [implementation plan](docs/superpowers/plans/2026-11-15-two-gamers.md). All artwork is drawn in CSS or Canvas for this prototype.
