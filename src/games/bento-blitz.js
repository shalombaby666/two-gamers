import { drawRoom, drawTimer, startLoop } from './common.js';

const ingredients = [
  { id: 'rice', name: 'RICE', color: '#f1e9cf', side: 1 },
  { id: 'salmon', name: 'SALMON', color: '#ff8b70', side: 1 },
  { id: 'cucumber', name: 'CUCUMBER', color: '#9dd86b', side: 2 },
  { id: 'egg', name: 'EGG', color: '#ffd66e', side: 2 }
];

const orders = [
  ['rice', 'cucumber'], ['salmon', 'egg'], ['rice', 'egg'], ['salmon', 'cucumber']
];

export function createBentoBlitz({ ctx, isDown, onFinish }) {
  let stopLoop = () => {};
  let finished = false;
  let seconds = 120;
  let score = 0;
  let orderIndex = 0;
  let combo = 0;
  let feedback = 'COOK 01: BASE  ·  COOK 02: TOPPING';
  let feedbackTime = 3;
  const players = [
    { id: 1, x: 238, y: 345, color: '#83e7d0', side: 1, up: 'KeyW', left: 'KeyA', down: 'KeyS', right: 'KeyD', action: 'KeyE', cooldown: 0, actionWasDown: false },
    { id: 2, x: 722, y: 345, color: '#fb806e', side: 2, up: 'ArrowUp', left: 'ArrowLeft', down: 'ArrowDown', right: 'ArrowRight', action: 'Enter', cooldown: 0, actionWasDown: false }
  ];
  const stations = [
    { x: 148, y: 188, id: 'rice' }, { x: 326, y: 188, id: 'salmon' },
    { x: 634, y: 188, id: 'cucumber' }, { x: 812, y: 188, id: 'egg' }
  ];
  const collected = [];

  function currentOrder() { return orders[orderIndex % orders.length]; }
  function say(text, time = 1.1) { feedback = text; feedbackTime = time; }

  function paint() {
    drawRoom(ctx, '#202219');
    ctx.fillStyle = '#343b2c'; ctx.fillRect(80, 95, 800, 352);
    ctx.strokeStyle = '#9dae79'; ctx.lineWidth = 4; ctx.strokeRect(80, 95, 800, 352);
    ctx.fillStyle = 'rgba(131,231,208,.07)'; ctx.fillRect(84, 130, 366, 310);
    ctx.fillStyle = 'rgba(251,128,110,.07)'; ctx.fillRect(510, 130, 366, 310);
    ctx.fillStyle = '#c5c79c'; ctx.font = '500 13px monospace'; ctx.textAlign = 'center';
    ctx.fillText('COOK 01 / BASE', 267, 116); ctx.fillText('COOK 02 / TOPPING', 693, 116);
    ctx.fillStyle = '#20241d'; ctx.fillRect(110, 238, 740, 94);

    stations.forEach((station) => {
      const item = ingredients.find((ingredient) => ingredient.id === station.id);
      ctx.fillStyle = '#17201c'; ctx.fillRect(station.x - 54, station.y - 39, 108, 76);
      ctx.fillStyle = item.color; ctx.fillRect(station.x - 15, station.y - 17, 30, 30);
      ctx.fillStyle = '#f5f1df'; ctx.font = '11px monospace'; ctx.fillText(item.name, station.x, station.y + 55);
    });

    ctx.fillStyle = '#f5f1df'; ctx.font = '500 13px monospace'; ctx.textAlign = 'left'; ctx.fillText(`SERVED  ${score}`, 126, 69);
    ctx.fillStyle = '#b1b8a7'; ctx.font = '11px monospace'; ctx.textAlign = 'right'; ctx.fillText(`STREAK  ${combo}`, 834, 69);
    drawTimer(ctx, seconds, 480, 31);

    ctx.fillStyle = '#171d18'; ctx.fillRect(320, 352, 320, 72);
    ctx.fillStyle = '#d8dfc2'; ctx.font = '11px monospace'; ctx.fillText('ORDER UP / BOTH COOKS DELIVER', 480, 367);
    const required = currentOrder();
    required.forEach((id, index) => {
      const ingredient = ingredients.find((entry) => entry.id === id);
      const delivered = collected.some((entry) => entry.id === id);
      ctx.fillStyle = delivered ? ingredient.color : '#303a30';
      ctx.fillRect(455 + index * 48, 382, 27, 23);
      ctx.strokeStyle = ingredient.color; ctx.lineWidth = 2; ctx.strokeRect(455 + index * 48, 382, 27, 23);
    });

    players.forEach((p) => {
      ctx.fillStyle = p.color; ctx.fillRect(p.x - 13, p.y - 18, 26, 32);
      ctx.fillStyle = '#111713'; ctx.fillRect(p.x - 5, p.y - 11, 4, 4); ctx.fillRect(p.x + 3, p.y - 11, 4, 4);
      if (p.holding) { const ingredient = ingredients.find((entry) => entry.id === p.holding); ctx.fillStyle = ingredient.color; ctx.fillRect(p.x - 8, p.y - 33, 16, 12); }
    });
    ctx.fillStyle = feedbackTime > 0 ? '#f6d879' : '#f5f1df';
    ctx.font = '12px monospace'; ctx.fillText(feedbackTime > 0 ? feedback : `${score} ORDERS / KEEP THE LINE MOVING`, 480, 475);
  }

  function interact(p) {
    const actionDown = isDown(p.action);
    if (!actionDown) { p.actionWasDown = false; return; }
    if (p.cooldown > 0 || p.actionWasDown) return;
    p.actionWasDown = true;
    p.cooldown = 0.28;
    const station = stations.find((spot) => {
      const item = ingredients.find((entry) => entry.id === spot.id);
      return item.side === p.side && Math.hypot(p.x - spot.x, p.y - spot.y) < 68;
    });
    if (station) {
      if (p.holding) { p.holding = null; say(`COOK 0${p.id} PUT IT BACK`); }
      else { p.holding = station.id; say(`COOK 0${p.id} PICKED UP ${station.id.toUpperCase()}`); }
      return;
    }

    const atTray = p.y > 325 && (p.side === 1 ? p.x >= 390 : p.x <= 570);
    if (!atTray || !p.holding) return;
    const recipe = currentOrder();
    const alreadyDelivered = collected.some((entry) => entry.id === p.holding);
    if (!recipe.includes(p.holding) || alreadyDelivered) {
      p.holding = null; seconds = Math.max(0, seconds - 4); combo = 0;
      say('WRONG INGREDIENT / 4 SECONDS LOST');
      return;
    }
    collected.push({ id: p.holding, player: p.id });
    p.holding = null;
    if (collected.length === recipe.length) {
      score++; combo++;
      orderIndex++;
      collected.length = 0;
      say(combo > 1 ? `ORDER UP / ${combo} IN A ROW!` : 'ORDER UP / NICE TEAMWORK!', 1.4);
    } else {
      say(`COOK 0${p.id} DELIVERED / PARTNER, YOUR TURN`, 1.2);
    }
  }

  function finish() {
    if (finished) return;
    finished = true; stopLoop();
    onFinish({ winner: 0, title: `${score} ORDER${score === 1 ? '' : 'S'} SERVED`, copy: combo ? `${combo} order streak. The kitchen made it.` : 'The kitchen closed. Try a better rhythm together.' });
  }

  function update(dt) {
    if (finished) return;
    seconds = Math.max(0, seconds - dt);
    feedbackTime = Math.max(0, feedbackTime - dt);
    for (const p of players) {
      p.cooldown = Math.max(0, p.cooldown - dt);
      const dx = Number(isDown(p.right)) - Number(isDown(p.left));
      const dy = Number(isDown(p.down)) - Number(isDown(p.up));
      const inputLength = Math.hypot(dx, dy) || 1;
      const minX = p.side === 1 ? 104 : 510;
      const maxX = p.side === 1 ? 450 : 856;
      p.x = Math.max(minX, Math.min(maxX, p.x + dx / inputLength * 220 * dt));
      p.y = Math.max(140, Math.min(426, p.y + dy / inputLength * 220 * dt));
      interact(p);
    }
    if (seconds <= 0) { finish(); return; }
    paint();
  }

  return { start() { paint(); stopLoop = startLoop(update); }, destroy() { finished = true; stopLoop(); } };
}
