import { createRoofRush } from './games/roof-rush.js';
import { createBentoBlitz } from './games/bento-blitz.js';
import { createStreetRally } from './games/street-rally.js';

export const games = [
  {
    id: 'roof-rush', number: '01', title: 'ROOF RUSH', subtitle: 'LAST ONE STANDING',
    description: 'Duck the chaos. Bump your rival. Keep your feet on the roof.',
    mode: 'VERSUS', time: '01 MIN', accent: 'coral', icon: '↯',
    instructions: 'P1: WASD to move · P2: arrow keys. Bump the other player off the rooftop. First to 3 knockouts wins.',
    controls: [{ name: 'PLAYER 01', keys: 'W A S D', side: 'cyan' }, { name: 'PLAYER 02', keys: '↑ ← ↓ →', side: 'coral' }],
    create: createRoofRush
  },
  {
    id: 'bento-blitz', number: '02', title: 'BENTO BLITZ', subtitle: 'KITCHEN ON FIRE',
    description: 'Two cooks, one tiny kitchen. Serve the orders before the bell.',
    mode: 'CO-OP', time: '02 MIN', accent: 'lime', icon: '✳',
    instructions: 'P1: WASD to move, E to pick up or serve. P2: arrow keys, Enter to pick up or serve. Work together to finish orders.',
    controls: [{ name: 'PLAYER 01', keys: 'W A S D + E', side: 'cyan' }, { name: 'PLAYER 02', keys: 'ARROWS + ↵', side: 'coral' }],
    create: createBentoBlitz
  },
  {
    id: 'street-rally', number: '03', title: 'STREET RALLY', subtitle: 'MIDNIGHT GRAND PRIX',
    description: 'Three laps, a tight corner, and absolutely no sportsmanship.',
    mode: 'RACE', time: '02 MIN', accent: 'violet', icon: '➜',
    instructions: 'P1: W to accelerate, A/D to change lanes. P2: ↑ to accelerate, ←/→ to change lanes. First to 3 laps wins.',
    controls: [{ name: 'PLAYER 01', keys: 'W A D', side: 'cyan' }, { name: 'PLAYER 02', keys: '↑ ← →', side: 'coral' }],
    create: createStreetRally
  }
];
