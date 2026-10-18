import { mulberry32, randInt } from './rng';

/** Wall bits per cell. */
export const WALL_N = 1;
export const WALL_E = 2;
export const WALL_S = 4;
export const WALL_W = 8;

export type MazeDifficulty = 'daily' | 'easy' | 'medium' | 'hard';

export interface Maze {
  cols: number;
  rows: number;
  /** Bitmask of walls per cell (index = row * cols + col). */
  walls: number[];
  start: number;
  end: number;
  difficulty: MazeDifficulty;
}

const SIZES: Record<Exclude<MazeDifficulty, 'daily'>, number> = {
  easy: 10,
  medium: 14,
  hard: 18,
};

export function generateMaze(
  difficulty: MazeDifficulty,
  seed: number,
): Maze {
  const rng = mulberry32(seed);
  const size = difficulty === 'daily' ? SIZES.medium : SIZES[difficulty];
  const cols = size;
  const rows = size;
  const count = cols * rows;

  // Start with every wall up, then carve with a randomized DFS
  // (recursive backtracker) — produces a "perfect" maze with exactly one
  // path between any two cells.
  const walls = new Array(count).fill(WALL_N | WALL_E | WALL_S | WALL_W);
  const visited = new Array(count).fill(false);
  const stack: number[] = [0];
  visited[0] = true;

  const neighbors = (cell: number): { cell: number; wall: number; opposite: number }[] => {
    const r = Math.floor(cell / cols);
    const c = cell % cols;
    const out: { cell: number; wall: number; opposite: number }[] = [];
    if (r > 0) out.push({ cell: cell - cols, wall: WALL_N, opposite: WALL_S });
    if (c < cols - 1) out.push({ cell: cell + 1, wall: WALL_E, opposite: WALL_W });
    if (r < rows - 1) out.push({ cell: cell + cols, wall: WALL_S, opposite: WALL_N });
    if (c > 0) out.push({ cell: cell - 1, wall: WALL_W, opposite: WALL_E });
    return out;
  };

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const options = neighbors(current).filter(n => !visited[n.cell]);
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const pick = options[randInt(rng, options.length)];
    walls[current] &= ~pick.wall;
    walls[pick.cell] &= ~pick.opposite;
    visited[pick.cell] = true;
    stack.push(pick.cell);
  }

  return { cols, rows, walls, start: 0, end: count - 1, difficulty };
}

/** True when two adjacent cells are connected (no wall between them). */
export function canMove(maze: Maze, from: number, to: number): boolean {
  if (to < 0 || to >= maze.cols * maze.rows) {
    return false;
  }
  const fr = Math.floor(from / maze.cols);
  const fc = from % maze.cols;
  const tr = Math.floor(to / maze.cols);
  const tc = to % maze.cols;
  const dr = tr - fr;
  const dc = tc - fc;
  if (Math.abs(dr) + Math.abs(dc) !== 1) {
    return false;
  }
  if (dr === -1) {
    return (maze.walls[from] & WALL_N) === 0;
  }
  if (dr === 1) {
    return (maze.walls[from] & WALL_S) === 0;
  }
  if (dc === 1) {
    return (maze.walls[from] & WALL_E) === 0;
  }
  return (maze.walls[from] & WALL_W) === 0;
}
