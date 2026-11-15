import { drawPixelPerson, drawRoom, drawTimer, startLoop } from './common.js';

export function createRoofRush({ canvas, ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  let seconds = 60;
  const players = [
    { x: 275, y: 275, vx: 0, vy: 0, score: 0, color: '#83e7d0', left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS' },
    { x: 685, y: 275, vx: 0, vy: 0, score: 0, color: '#fb806e', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' }
  ];

  function paint() {
    drawRoom(ctx, '#172421');
    ctx.fillStyle = '#263b35'; ctx.fillRect(76, 82, 808, 366);
    ctx.strokeStyle = '#8eb9a5'; ctx.lineWidth = 4; ctx.strokeRect(76, 82, 808, 366);
    ctx.fillStyle = '#395249';
    for (let i = 0; i < 8; i++) ctx.fillRect(105 + i * 102, 100, 34, 14);
    ctx.fillStyle = '#c4d2ad'; ctx.font = '500 14px monospace'; ctx.textAlign = 'left'; ctx.fillText('NIGHT MARKET / ROOFTOP', 100, 128);
    ctx.fillStyle = '#182220'; ctx.fillRect(104, 146, 752, 2);
    ctx.fillStyle = '#f5f1df'; ctx.font = '500 23px monospace'; ctx.textAlign = 'left'; ctx.fillText(`P1  ${players[0].score}`, 112, 62);
    ctx.textAlign = 'right'; ctx.fillText(`P2  ${players[1].score}`, 848, 62);
    drawTimer(ctx, seconds);
    players.forEach((p, i) => {
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(p.x - 16, p.y + 24, 32, 5);
      drawPixelPerson(ctx, p.x, p.y, p.color, i ? -1 : 1);
      for (let heart = 0; heart < 3 - p.score; heart++) {
        ctx.fillStyle = p.color; ctx.fillRect((i ? 780 : 132) + heart * 22, 164, 13, 13);
      }
    });
    ctx.fillStyle = 'rgba(245,241,223,.65)'; ctx.font = '12px monospace'; ctx.textAlign = 'center'; ctx.fillText('BUMP YOUR RIVAL OFF THE ROOF', 480, 425);
  }

  function finish(winner) {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner, title: winner ? `PLAYER 0${winner} WINS` : 'A ROOFTOP STALEMATE', copy: 'That was a close one. Rematch?' });
  }

  function update(dt) {
    seconds = Math.max(0, seconds - dt);
    for (const p of players) {
      const ax = Number(isDown(p.right)) - Number(isDown(p.left));
      const ay = Number(isDown(p.down)) - Number(isDown(p.up));
      p.vx = (p.vx + ax * 570 * dt) * (ax ? 0.985 : 0.91);
      p.vy = (p.vy + ay * 570 * dt) * (ay ? 0.985 : 0.91);
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 255) { p.vx = p.vx / speed * 255; p.vy = p.vy / speed * 255; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 95 || p.x > 865 || p.y < 139 || p.y > 430) { p.score++; p.x = p.x < 480 ? 275 : 685; p.y = 275; p.vx = 0; p.vy = 0; }
      if (p.score >= 3) finish(p === players[0] ? 2 : 1);
    }
    const dx = players[1].x - players[0].x; const dy = players[1].y - players[0].y; const distance = Math.hypot(dx, dy);
    if (distance < 34 && distance > 0) {
      const force = 310;
      players[0].vx -= dx / distance * force * dt; players[0].vy -= dy / distance * force * dt;
      players[1].vx += dx / distance * force * dt; players[1].vy += dy / distance * force * dt;
    }
    if (seconds <= 0) finish(players[0].score === players[1].score ? 0 : players[0].score < players[1].score ? 1 : 2);
    paint();
  }

  return { start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
