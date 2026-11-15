const KEY = 'two-gamers-stats-v1';

export function readStats() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { points: 0, matches: 0, wins: 0 };
  } catch {
    return { points: 0, matches: 0, wins: 0 };
  }
}

export function saveMatch(winner) {
  const stats = readStats();
  stats.matches += 1;
  stats.points += winner ? 25 : 10;
  if (winner === 1) stats.wins += 1;
  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}
