import { drawRoom, startLoop } from './common.js';

export function createStreetRally({ canvas, ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  const players = [
    { progress: 0, lane: -1, color: '#83e7d0', accelerate: 'KeyW', left: 'KeyA', right: 'KeyD', speed: 0.16, laps: 0 },
    { progress: 0, lane: 1, color: '#fb806e', accelerate: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight', speed: 0.16, laps: 0 }
  ];
  const length = Math.PI * 2;
  let elapsed = 0;

  function paint() {
    drawRoom(ctx, '#191d29');
    ctx.save(); ctx.translate(480, 282);
    ctx.fillStyle = '#283342'; ctx.beginPath(); ctx.ellipse(0, 0, 332, 202, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#192a25'; ctx.beginPath(); ctx.ellipse(0, 0, 208, 104, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e3d9be'; ctx.lineWidth = 3; ctx.setLineDash([17, 15]); ctx.beginPath(); ctx.ellipse(0, 0, 270, 152, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#f5f1df'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, -162); ctx.stroke();
    ctx.fillStyle = 'rgba(131,231,208,.1)'; ctx.fillRect(-82, -46, 164, 92);
    players.forEach((p, i) => {
      const angle = p.progress * length - Math.PI / 2;
      const rx = 270 + p.lane * 23; const ry = 152 + p.lane * 23;
      const x = Math.cos(angle) * rx; const y = Math.sin(angle) * ry;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2); ctx.fillStyle = '#101515'; ctx.fillRect(-18, -13, 40, 25); ctx.fillStyle = p.color; ctx.fillRect(-15, -14, 30, 22); ctx.fillStyle = '#e9ece3'; ctx.fillRect(-10, -10, 7, 5); ctx.fillRect(3, -10, 7, 5); ctx.restore();
      ctx.fillStyle = p.color; ctx.font = '500 13px monospace'; ctx.fillText(`P${i + 1} / LAP ${p.laps + 1}`, x - 27, y + 29);
    });
    ctx.restore();
    ctx.fillStyle = '#f5f1df'; ctx.textAlign = 'center'; ctx.font = '500 19px monospace'; ctx.fillText('MIDNIGHT GRAND PRIX', 480, 48);
    ctx.font = '12px monospace'; ctx.fillStyle = '#aeb6aa'; ctx.fillText(`TIME  ${Math.floor(elapsed / 60).toString().padStart(2,'0')}:${Math.floor(elapsed % 60).toString().padStart(2,'0')}`, 480, 77);
    ctx.textAlign = 'left'; ctx.fillStyle = players[0].color; ctx.fillText(`P1   ${Math.min(3, players[0].laps)} / 3 LAPS`, 52, 51);
    ctx.textAlign = 'right'; ctx.fillStyle = players[1].color; ctx.fillText(`P2   ${Math.min(3, players[1].laps)} / 3 LAPS`, 908, 51);
    ctx.textAlign = 'center'; ctx.fillStyle = '#aeb6aa'; ctx.fillText('SHIFT LANES TO PASS · HOLD ACCELERATE', 480, 500);
  }

  function finish(winner) {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner, title: `PLAYER 0${winner} WINS`, copy: 'Three laps. One driver on top.' });
  }

  function update(dt) {
    elapsed += dt;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const accelerating = isDown(p.accelerate);
      p.speed += ((accelerating ? 0.19 : 0.12) - p.speed) * dt * 1.5;
      if (isDown(p.left)) p.lane = Math.max(-1, p.lane - dt * 2.5);
      if (isDown(p.right)) p.lane = Math.min(1, p.lane + dt * 2.5);
      p.progress += p.speed * dt / 9;
      if (p.progress >= 1) { p.progress -= 1; p.laps++; if (p.laps >= 3) finish(i + 1); }
    }
    paint();
  }

  return { start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
