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

- **Roof Rush** — versus rooftop arena. Move with WASD or arrow keys, then dash with E or Enter to knock a rival off near the edge. Walking into the edge stops you.
- **Bento Blitz** — two-cook kitchen rush. P1 handles the left counter with WASD + E; P2 handles the right with arrows + Enter. Each cook must deliver one matching ingredient per order.
- **Street Rally** — three-lap arcade race. Hold W or ↑ to accelerate, steer with A/D or ←/→, dodge roadblocks, and bump a rival who shares your lane.

Touch controls are included for phones and tablets. Match points are saved in the current browser without an account.

## Online play

This first version is local multiplayer on one device. Network rooms, accounts, global leaderboards, and tournaments need a hosted multiplayer service and are not enabled yet. The game modules use a shared lifecycle so an online transport can be added without changing the game catalog.

## Deploy

The `main` branch has a GitHub Actions workflow that builds and publishes the static site to GitHub Pages. In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** if Pages is not already enabled. The public demo URL will be `https://shalombaby666.github.io/two-gamers/` after the first successful deployment.

## Project notes

See [the design](docs/superpowers/specs/2026-11-15-two-gamers-design.md) and [implementation plan](docs/superpowers/plans/2026-11-15-two-gamers.md). All artwork is drawn in CSS or Canvas for this prototype.

## Обновление 21 ноября 2026
Добавлены пауза по P и кнопке, автопауза при потере фокуса, независимое управление несколькими касаниями и обновление таймера. Повреждённая статистика не ломает запуск. Проверены движение, выбивание на крыше, победа в гонке, приготовление заказа и завершение раундов.
