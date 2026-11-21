import { drawPixelPerson, drawRoom, drawTimer, startLoop } from './common.js';

const EDGE = { left: 95, right: 865, top: 139, bottom: 430 };
const RADIUS = 17;

export function createRoofRush({ ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  let seconds = 60;
  let message = 'DASH INTO YOUR RIVAL NEAR THE EDGE';
  let messageTime = 2.5;
  const players = [
    { x: 275, y: 275, vx: 0, vy: 0, lives: 3, kos: 0, color: '#83e7d0', left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', dash: 'KeyE', facingX: 1, facingY: 0, dashCooldown: 0, dashTime: 0, dashWasDown: false, hitBy: null, hitTimer: 0, invulnerable: 0 },
    { x: 685, y: 275, vx: 0, vy: 0, lives: 3, kos: 0, color: '#fb806e', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', dash: 'Enter', facingX: -1, facingY: 0, dashCooldown: 0, dashTime: 0, dashWasDown: false, hitBy: null, hitTimer: 0, invulnerable: 0 }
  ];

  function paint() {
    drawRoom(ctx, '#172421');
    ctx.fillStyle = '#263b35'; ctx.fillRect(76, 82, 808, 366);
    ctx.strokeStyle = '#8eb9a5'; ctx.lineWidth = 4; ctx.strokeRect(76, 82, 808, 366);
    ctx.fillStyle = '#395249';
    for (let i = 0; i < 8; i++) ctx.fillRect(105 + i * 102, 100, 34, 14);
    ctx.fillStyle = '#c4d2ad'; ctx.font = '500 14px monospace'; ctx.textAlign = 'left'; ctx.fillText('NIGHT MARKET / ROOFTOP', 100, 128);
    ctx.fillStyle = '#182220'; ctx.fillRect(104, 146, 752, 2);
    ctx.fillStyle = '#f5f1df'; ctx.font = '500 20px monospace'; ctx.textAlign = 'left'; ctx.fillText(`P1  KOs ${players[0].kos}`, 112, 62);
    ctx.textAlign = 'right'; ctx.fillText(`P2  KOs ${players[1].kos}`, 848, 62);
    drawTimer(ctx, seconds);
    players.forEach((p, i) => {
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(p.x - 16, p.y + 24, 32, 5);
      if (p.invulnerable <= 0 || Math.floor(p.invulnerable * 12) % 2 === 0) drawPixelPerson(ctx, p.x, p.y, p.color, i ? -1 : 1);
      for (let heart = 0; heart < 3; heart++) {
        ctx.fillStyle = heart < p.lives ? p.color : '#3d4a42';
        ctx.fillRect((i ? 780 : 132) + heart * 22, 164, 13, 13);
      }
    });
    ctx.fillStyle = messageTime > 0 ? '#f6d879' : 'rgba(245,241,223,.68)';
    ctx.font = '12px monospace'; ctx.textAlign = 'center'; ctx.fillText(message, 480, 425);
  }

  function finish(winner) {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner, title: winner ? `PLAYER 0${winner} WINS` : 'ROOFTOP DRAW', copy: 'Three lives each. The last one on the roof takes it.' });
  }

  function knockOut(targetIndex) {
    const target = players[targetIndex];
    const rival = players[1 - targetIndex];
    target.lives--;
    rival.kos++;
    target.x = targetIndex === 0 ? 275 : 685;
    target.y = 275;
    target.vx = 0; target.vy = 0;
    target.hitBy = null; target.hitTimer = 0; target.dashTime = 0;
    target.invulnerable = 0.8;
    message = `PLAYER 0${1 - targetIndex + 1} KNOCKED PLAYER 0${targetIndex + 1} OFF`;
    messageTime = 1.4;
    if (target.lives <= 0) finish(1 - targetIndex + 1);
  }

  function update(dt) {
    if (finished) return;
    seconds = Math.max(0, seconds - dt);
    messageTime = Math.max(0, messageTime - dt);

    players.forEach((p) => {
      p.dashCooldown = Math.max(0, p.dashCooldown - dt);
      p.dashTime = Math.max(0, p.dashTime - dt);
      p.hitTimer = Math.max(0, p.hitTimer - dt);
      p.invulnerable = Math.max(0, p.invulnerable - dt);
      const xInput = Number(isDown(p.right)) - Number(isDown(p.left));
      const yInput = Number(isDown(p.down)) - Number(isDown(p.up));
      const inputLength = Math.hypot(xInput, yInput) || 1;
      const inputX = xInput / inputLength; const inputY = yInput / inputLength;
      if (xInput || yInput) { p.facingX = inputX; p.facingY = inputY; }
      p.vx = (p.vx + inputX * 500 * dt) * (xInput || yInput ? 0.985 : 0.9);
      p.vy = (p.vy + inputY * 500 * dt) * (xInput || yInput ? 0.985 : 0.9);
      const dashDown = isDown(p.dash);
      if (dashDown && !p.dashWasDown && p.dashCooldown <= 0 && p.invulnerable <= 0) {
        p.vx += p.facingX * 285;
        p.vy += p.facingY * 285;
        p.dashTime = 0.2;
        p.dashCooldown = 1.1;
      }
      p.dashWasDown = dashDown;
      const maxSpeed = p.dashTime > 0 ? 390 : 230;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > maxSpeed) { p.vx = p.vx / speed * maxSpeed; p.vy = p.vy / speed * maxSpeed; }
      p.x += p.vx * dt; p.y += p.vy * dt;
    });

    const a = players[0]; const b = players[1];
    const dx = b.x - a.x; const dy = b.y - a.y; const distance = Math.hypot(dx, dy);
    if (distance < RADIUS * 2 && distance > 0.001 && (a.invulnerable <= 0 || b.invulnerable <= 0)) {
      const nx = dx / distance; const ny = dy / distance;
      const overlap = RADIUS * 2 - distance;
      if (a.invulnerable <= 0) { a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5; }
      if (b.invulnerable <= 0) { b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5; }
      const approachSpeed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      const dashImpact = a.dashTime > 0 || b.dashTime > 0;
      if (approachSpeed < -18) {
        const impulse = -(1 + (dashImpact ? 0.7 : 0.35)) * approachSpeed * 0.5;
        if (a.invulnerable <= 0) { a.vx -= impulse * nx; a.vy -= impulse * ny; }
        if (b.invulnerable <= 0) { b.vx += impulse * nx; b.vy += impulse * ny; }
      }
      if (a.dashTime > 0 && b.invulnerable <= 0) {
        b.vx += nx * 190; b.vy += ny * 190; b.hitBy = 0; b.hitTimer = 0.9;
        a.dashTime = 0; message = 'CLEAN HIT — KEEP THEM OFF THE EDGE'; messageTime = 0.7;
      } else if (b.dashTime > 0 && a.invulnerable <= 0) {
        a.vx -= nx * 190; a.vy -= ny * 190; a.hitBy = 1; a.hitTimer = 0.9;
        b.dashTime = 0; message = 'CLEAN HIT — KEEP THEM OFF THE EDGE'; messageTime = 0.7;
      } else if (Math.abs(approachSpeed) > 135) {
        if (approachSpeed < 0) { b.hitBy = 0; b.hitTimer = 0.65; a.hitBy = 1; a.hitTimer = 0.65; }
      }
    }

    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const outside = p.x < EDGE.left || p.x > EDGE.right || p.y < EDGE.top || p.y > EDGE.bottom;
      if (outside && p.hitBy !== null && p.hitTimer > 0) { knockOut(i); if (finished) return; continue; }
      if (p.x < EDGE.left) { p.x = EDGE.left; p.vx = Math.max(0, p.vx) * 0.4; }
      if (p.x > EDGE.right) { p.x = EDGE.right; p.vx = Math.min(0, p.vx) * 0.4; }
      if (p.y < EDGE.top) { p.y = EDGE.top; p.vy = Math.max(0, p.vy) * 0.4; }
      if (p.y > EDGE.bottom) { p.y = EDGE.bottom; p.vy = Math.min(0, p.vy) * 0.4; }
    }

    if (seconds <= 0) finish(players[0].kos === players[1].kos ? 0 : players[0].kos > players[1].kos ? 1 : 2);
    paint();
  }

  return { getState(){return {seconds,players:players.map(p=>({...p})),finished};}, start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
