export const WIDTH = 960;
export const HEIGHT = 520;

let paused=false;
export function setPaused(value){paused=Boolean(value);}
export function startLoop(step) {
  let frame = 0;
  let previous = performance.now();
  let running = true;
  const tick = (now) => {
    if (!running) return;
    const dt = Math.min((now - previous) / 1000, 0.04);
    previous = now;
    if(!paused)step(dt, now / 1000);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => { running = false; cancelAnimationFrame(frame); };
}

export function drawRoom(ctx, color = '#142321') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(177, 236, 206, .045)';
  for (let x = 24; x < WIDTH; x += 48) for (let y = 24; y < HEIGHT; y += 48) ctx.fillRect(x, y, 2, 2);
}

export function drawPixelPerson(ctx, x, y, color, facing = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(facing, 1);
  ctx.fillStyle = '#101515'; ctx.fillRect(-13, 19, 11, 8); ctx.fillRect(3, 19, 11, 8);
  ctx.fillStyle = color; ctx.fillRect(-15, 0, 30, 19); ctx.fillRect(-11, -17, 22, 17);
  ctx.fillStyle = '#101515'; ctx.fillRect(1, -11, 5, 5);
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-9, 5, 5, 4);
  ctx.restore();
}

export function drawTimer(ctx, seconds, x = WIDTH / 2, y = 31) {
  ctx.fillStyle = '#101515'; ctx.fillRect(x - 52, y - 18, 104, 42);
  ctx.strokeStyle = '#f5f1df'; ctx.lineWidth = 2; ctx.strokeRect(x - 52, y - 18, 104, 42);
  ctx.fillStyle = '#f5f1df'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '500 21px monospace';
  ctx.fillText(`${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`, x, y + 2);
}
