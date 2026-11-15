import { createRoofRush } from './games/roof-rush.js';
import { createBentoBlitz } from './games/bento-blitz.js';
import { createStreetRally } from './games/street-rally.js';

export const games = [
  {
    id: 'roof-rush', number: '01', title: 'ROOF RUSH', subtitle: 'LAST ONE STANDING',
    description: 'Duck the chaos. Bump your rival. Keep your feet on the roof.',
    mode: 'VERSUS', time: '01 MIN', accent: 'coral', icon: '↯',
    instructions: 'P1: WASD to move, E to dash. P2: arrow keys, Enter to dash. Walking stops at the roof edge; dash into your rival to knock them off. First to 3 knockouts wins.',
    controls: [{ name: 'PLAYER 01', keys: 'W A S D + E', side: 'cyan' }, { name: 'PLAYER 02', keys: 'ARROWS + ↵', side: 'coral' }],
    create: createRoofRush
  },
  {
    id: 'bento-blitz', number: '02', title: 'BENTO BLITZ', subtitle: 'KITCHEN ON FIRE',
    description: 'Two cooks, one tiny kitchen. Serve the orders before the bell.',
    mode: 'CO-OP', time: '02 MIN', accent: 'lime', icon: '✳',
    instructions: 'P1 stays left: WASD to move, E to pick up, drop, or deliver a base. P2 stays right: arrows to move, Enter to handle toppings. Each cook must deliver one correct ingredient for every order.',
    controls: [{ name: 'PLAYER 01', keys: 'W A S D + E', side: 'cyan' }, { name: 'PLAYER 02', keys: 'ARROWS + ↵', side: 'coral' }],
    create: createBentoBlitz
  },
  {
    id: 'street-rally', number: '03', title: 'STREET RALLY', subtitle: 'MIDNIGHT GRAND PRIX',
    description: 'Three laps, a tight corner, and absolutely no sportsmanship.',
    mode: 'RACE', time: '02 MIN', accent: 'violet', icon: '➜',
    instructions: 'P1: hold W to accelerate, A/D to steer. P2: hold ↑ to accelerate, ←/→ to steer. Dodge the roadblocks, take the inside line, and bump your rival. First to 3 laps wins.',
    controls: [{ name: 'PLAYER 01', keys: 'W A D', side: 'cyan' }, { name: 'PLAYER 02', keys: '↑ ← →', side: 'coral' }],
    create: createStreetRally
  }
];
