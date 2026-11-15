import { drawRoom, startLoop } from './common.js';

const hazards = [
  { progress: 0.16, lane: -0.78 },
  { progress: 0.39, lane: 0.72 },
  { progress: 0.64, lane: -0.12 },
  { progress: 0.86, lane: 0.78 }
];

export function createStreetRally({ ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  let elapsed = 0;
  let seconds = 120;
  let message = 'HOLD ACCELERATE / DODGE THE ROADBLOCKS';
  let messageTime = 2.8;
  const players = [
    { progress: 0, lane: -0.8, speed: 0, color: '#83e7d0', accelerate: 'KeyW', left: 'KeyA', right: 'KeyD', laps: 0, bumpCooldown: 0, hitHazards: new Set() },
    { progress: 0, lane: 0.8, speed: 0, color: '#fb806e', accelerate: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight', laps: 0, bumpCooldown: 0, hitHazards: new Set() }
  ];

  function drawTrackPoint(progress, lane) {
    const angle = progress * Math.PI * 2 - Math.PI / 2;
    const rx = 270 + lane * 28;
    const ry = 152 + lane * 18;
    return { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry, angle };
  }

  function paint() {
    drawRoom(ctx, '#191d29');
    ctx.save(); ctx.translate(480, 285);
    ctx.fillStyle = '#344150'; ctx.beginPath(); ctx.ellipse(0, 0, 332, 202, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#192a25'; ctx.beginPath(); ctx.ellipse(0, 0, 208, 104, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e3d9be'; ctx.lineWidth = 3;
    ctx.setLineDash([18, 14]);
    for (const lane of [-0.33, 0.33]) { ctx.beginPath(); ctx.ellipse(0, 0, 270 + lane * 28, 152 + lane * 18, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f5f1df'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, -164); ctx.stroke();
    ctx.fillStyle = '#60725d'; ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.fillText('INSIDE LINE = SHORTER', 0, 6);

    hazards.forEach((hazard) => {
      const point = drawTrackPoint(hazard.progress, hazard.lane);
      ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.angle + Math.PI / 2);
      ctx.fillStyle = '#161a1e'; ctx.fillRect(-11, -11, 22, 22);
      ctx.fillStyle = '#f3c66b'; ctx.fillRect(-8, -8, 16, 16);
      ctx.fillStyle = '#20262a'; ctx.fillRect(-2, -8, 4, 16);
      ctx.restore();
    });

    players.forEach((p, i) => {
      const point = drawTrackPoint(p.progress, p.lane);
      ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.angle + Math.PI / 2);
      ctx.fillStyle = '#101515'; ctx.fillRect(-19, -13, 40, 27);
      ctx.fillStyle = p.color; ctx.fillRect(-16, -15, 32, 24);
      ctx.fillStyle = '#e9ece3'; ctx.fillRect(-11, -11, 7, 5); ctx.fillRect(4, -11, 7, 5);
      ctx.fillStyle = '#17201c'; ctx.fillRect(-12, 5, 6, 5); ctx.fillRect(6, 5, 6, 5);
      ctx.restore();
    });
    ctx.restore();

    ctx.fillStyle = '#f5f1df'; ctx.textAlign = 'center'; ctx.font = '500 19px monospace'; ctx.fillText('MIDNIGHT GRAND PRIX', 480, 42);
    ctx.font = '12px monospace'; ctx.fillStyle = '#aeb6aa';
    ctx.fillText(`TIME  ${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${Math.floor(elapsed % 60).toString().padStart(2, '0')}`, 480, 69);
    players.forEach((p, i) => {
      ctx.textAlign = i === 0 ? 'left' : 'right'; ctx.fillStyle = p.color; ctx.font = '500 14px monospace';
      const x = i === 0 ? 52 : 908;
      ctx.fillText(`P${i + 1}   ${Math.round(p.speed * 18)} KM/H   ${Math.min(3, p.laps)}/3 LAPS`, x, 49);
    });
    ctx.textAlign = 'center'; ctx.fillStyle = messageTime > 0 ? '#f6d879' : '#aeb6aa'; ctx.font = '11px monospace';
    ctx.fillText(messageTime > 0 ? message : 'LEFT / RIGHT TO CHANGE LINE  ·  DODGE / BUMP TO PASS', 480, 500);
  }

  function finish(winner) {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner, title: winner ? `PLAYER 0${winner} WINS` : 'PHOTO FINISH', copy: 'Three laps. Better line, better timing.' });
  }

  function crosses(prev, next, target) {
    return next < 1 ? target > prev && target <= next : target > prev || target <= next - 1;
  }

  function update(dt) {
    if (finished) return;
    elapsed += dt;
    seconds = Math.max(0, seconds - dt);
    messageTime = Math.max(0, messageTime - dt);
    for (const p of players) {
      p.bumpCooldown = Math.max(0, p.bumpCooldown - dt);
      const oldProgress = p.progress;
      const throttle = isDown(p.accelerate);
      p.speed = Math.max(0, Math.min(8.5, p.speed + (throttle ? 6.2 : -4.4) * dt));
      if (isDown(p.left)) p.lane = Math.max(-1, p.lane - 1.9 * dt);
      if (isDown(p.right)) p.lane = Math.min(1, p.lane + 1.9 * dt);

      const insideLength = 222;
      const lapLength = insideLength + (p.lane + 1) * 18;
      const advance = p.speed * dt / lapLength;
      const nextProgress = p.progress + advance;
      const lapForHazards = p.laps;
      hazards.forEach((hazard, index) => {
        const key = `${lapForHazards}:${index}`;
        if (p.hitHazards.has(key) || !crosses(oldProgress, nextProgress, hazard.progress)) return;
        p.hitHazards.add(key);
        if (Math.abs(p.lane - hazard.lane) < 0.31) {
          p.speed *= 0.38;
          p.lane = Math.max(-1, Math.min(1, p.lane + (p.lane <= hazard.lane ? -0.16 : 0.16)));
          message = `ROADBLOCK! PLAYER ${players.indexOf(p) + 1} LOST SPEED`;
          messageTime = 1.1;
        }
      });

      p.progress = nextProgress;
      if (p.progress >= 1) { p.progress -= 1; p.laps++; }
    }

    const gap = Math.abs(players[0].progress - players[1].progress);
    const sameSection = Math.min(gap, 1 - gap) < 0.013;
    const sameLane = Math.abs(players[0].lane - players[1].lane) < 0.36;
    if (sameSection && sameLane && players.every((p) => p.bumpCooldown <= 0)) {
      const attacker = players[0].speed >= players[1].speed ? 0 : 1;
      const target = 1 - attacker;
      players[target].speed *= 0.62;
      players[target].lane = Math.max(-1, Math.min(1, players[target].lane + (players[target].lane <= players[attacker].lane ? -0.32 : 0.32)));
      players[attacker].speed *= 0.88;
      players[0].bumpCooldown = 0.8; players[1].bumpCooldown = 0.8;
      message = `DOOR BANG! PLAYER 0${attacker + 1} BUMPED THE RIVAL`;
      messageTime = 1.1;
    }

    const winner = players.findIndex((p) => p.laps >= 3);
    if (winner !== -1) { finish(winner + 1); return; }
    if (seconds <= 0) {
      const p1Distance = players[0].laps + players[0].progress;
      const p2Distance = players[1].laps + players[1].progress;
      finish(Math.abs(p1Distance - p2Distance) < 0.001 ? 0 : p1Distance > p2Distance ? 1 : 2);
      return;
    }
    paint();
  }

  return { start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
