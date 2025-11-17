export interface Target {
  id: number;
  x: number;
  y: number;
  radius: number;
  spawnTime: number;
}

export type GameStatus = 'start' | 'playing' | 'summary';

export interface GameStats {
  hits: number;
  misses: number;
  totalShots: number;
  reactionTimes: number[];
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}
