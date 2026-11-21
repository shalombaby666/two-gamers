const KEY = 'two-gamers-stats-v1';

export function readStats() {
  try {
    const data=JSON.parse(localStorage.getItem(KEY));return Object.fromEntries(['points','matches','wins'].map(k=>[k,Number.isSafeInteger(data?.[k])&&data[k]>=0?data[k]:0]));
  } catch {
    return { points: 0, matches: 0, wins: 0 };
  }
}

export function saveMatch(winner) {
  const stats = readStats();
  stats.matches += 1;
  stats.points += winner ? 25 : 10;
  if (winner === 1) stats.wins += 1;
  try{localStorage.setItem(KEY, JSON.stringify(stats));}catch{}
  return stats;
}
