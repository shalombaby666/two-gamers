import { drawRoom, drawTimer, startLoop } from './common.js';

const ingredients = [
  { id: 'rice', name: 'RICE', color: '#f1e9cf' },
  { id: 'salmon', name: 'SALMON', color: '#ff8b70' },
  { id: 'cucumber', name: 'CUCUMBER', color: '#9dd86b' },
  { id: 'egg', name: 'EGG', color: '#ffd66e' }
];

export function createBentoBlitz({ canvas, ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  let seconds = 120;
  let score = 0;
  let orderIndex = 0;
  let feedback = 'BUILD THE ORDER TOGETHER';
  let feedbackTime = 2.2;
  const orders = [['rice', 'salmon'], ['rice', 'egg', 'cucumber'], ['rice', 'cucumber'], ['rice', 'salmon', 'egg'], ['rice', 'egg']];
  const players = [
    { x: 232, y: 340, color: '#83e7d0', up: 'KeyW', left: 'KeyA', down: 'KeyS', right: 'KeyD', action: 'KeyE', cooldown: 0 },
    { x: 728, y: 340, color: '#fb806e', up: 'ArrowUp', left: 'ArrowLeft', down: 'ArrowDown', right: 'ArrowRight', action: 'Enter', cooldown: 0 }
  ];
  const stations = [
    { x: 148, y: 188, id: 'rice' }, { x: 326, y: 188, id: 'salmon' },
    { x: 634, y: 188, id: 'cucumber' }, { x: 812, y: 188, id: 'egg' }
  ];
  const collected = [];

  function currentOrder() { return orders[orderIndex % orders.length]; }
  function paint() {
    drawRoom(ctx, '#202219');
    ctx.fillStyle = '#343b2c'; ctx.fillRect(80, 95, 800, 352);
    ctx.strokeStyle = '#9dae79'; ctx.lineWidth = 4; ctx.strokeRect(80, 95, 800, 352);
    ctx.fillStyle = '#20241d'; ctx.fillRect(110, 238, 740, 94);
    ctx.fillStyle = '#c5c79c'; ctx.font = '500 14px monospace'; ctx.textAlign = 'center'; ctx.fillText('INGREDIENT STATIONS', 480, 115);
    stations.forEach((station) => {
      const item = ingredients.find((ingredient) => ingredient.id === station.id);
      ctx.fillStyle = '#17201c'; ctx.fillRect(station.x - 54, station.y - 39, 108, 76);
      ctx.fillStyle = item.color; ctx.fillRect(station.x - 15, station.y - 17, 30, 30);
      ctx.fillStyle = '#f5f1df'; ctx.font = '11px monospace'; ctx.fillText(item.name, station.x, station.y + 55);
    });
    ctx.fillStyle = '#f5f1df'; ctx.font = '500 20px monospace'; ctx.fillText(`SERVED  ${score}`, 480, 67);
    drawTimer(ctx, seconds, 480, 31);
    ctx.fillStyle = '#171d18'; ctx.fillRect(320, 352, 320, 72);
    ctx.fillStyle = '#d8dfc2'; ctx.font = '11px monospace'; ctx.fillText('ORDER UP', 480, 367);
    currentOrder().forEach((id, index) => {
      const item = ingredients.find((ingredient) => ingredient.id === id);
      ctx.fillStyle = item.color; ctx.fillRect(410 + index * 48, 382, 27, 23);
    });
    collected.forEach((id, index) => {
      const item = ingredients.find((ingredient) => ingredient.id === id);
      ctx.fillStyle = item.color; ctx.fillRect(440 + index * 32, 280, 22, 22);
    });
    players.forEach((p) => {
      ctx.fillStyle = p.color; ctx.fillRect(p.x - 13, p.y - 18, 26, 32); ctx.fillStyle = '#111713'; ctx.fillRect(p.x - 5, p.y - 11, 4, 4); ctx.fillRect(p.x + 3, p.y - 11, 4, 4);
      if (p.holding) { const item = ingredients.find((ingredient) => ingredient.id === p.holding); ctx.fillStyle = item.color; ctx.fillRect(p.x - 8, p.y - 33, 16, 12); }
    });
    ctx.fillStyle = '#f5f1df'; ctx.font = '12px monospace'; ctx.fillText(feedback, 480, 475);
  }

  function tryAction(p) {
    if (p.cooldown > 0 || !isDown(p.action)) return;
    p.cooldown = 0.24;
    const station = stations.find((spot) => Math.hypot(p.x - spot.x, p.y - spot.y) < 68);
    if (station && !p.holding) {
      p.holding = station.id;
      feedback = `${station.id.toUpperCase()} PICKED UP`;
      feedbackTime = 1;
      return;
    }
    const serving = p.x > 385 && p.x < 575 && p.y > 320;
    if (serving && p.holding) {
      collected.push(p.holding); p.holding = null;
      feedback = 'NICE — KEEP GOING'; feedbackTime = 0.8;
      if (collected.length >= currentOrder().length) {
        const correct = currentOrder().every((item, index) => item === collected[index]);
        if (correct) { score++; orderIndex++; feedback = 'ORDER COMPLETE!'; }
        else { feedback = 'WRONG ORDER — TRY AGAIN'; }
        collected.length = 0; feedbackTime = 1.2;
      }
    }
  }

  function finish() {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner: 0, title: `${score} ORDER${score === 1 ? '' : 'S'} SERVED`, copy: 'The kitchen survived. Nice teamwork.' });
  }

  function update(dt) {
    seconds = Math.max(0, seconds - dt); feedbackTime -= dt;
    if (feedbackTime <= 0) feedback = `${score} ORDERS / STAY IN SYNC`;
    for (const p of players) {
      p.cooldown = Math.max(0, p.cooldown - dt);
      const dx = Number(isDown(p.right)) - Number(isDown(p.left)); const dy = Number(isDown(p.down)) - Number(isDown(p.up));
      p.x = Math.max(104, Math.min(856, p.x + dx * 210 * dt));
      p.y = Math.max(140, Math.min(426, p.y + dy * 210 * dt));
      tryAction(p);
    }
    if (seconds <= 0) finish();
    paint();
  }

  return { start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
