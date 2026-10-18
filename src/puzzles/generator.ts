import { hashString, mulberry32, randInt, shuffle } from './rng';

export const SIZE = 9;
export const BOX = 3;
export const CELLS = SIZE * SIZE;

export type Difficulty = 'easy' | 'medium' | 'hard' | 'daily';

export interface Puzzle {
  /** 81 entries, 0 = empty. The clue cells. */
  givens: number[];
  /** Complete solution grid, 81 entries. */
  solution: number[];
  /** Indexes into givens that are clues. */
  givenCells: boolean[];
  difficulty: Difficulty;
}

type Grid = number[];

const idx = (r: number, c: number) => r * SIZE + c;

function isSafe(grid: Grid, pos: number, v: number): boolean {
  const r = Math.floor(pos / SIZE);
  const c = pos % SIZE;
  for (let i = 0; i < SIZE; i++) {
    if (grid[idx(r, i)] === v || grid[idx(i, c)] === v) {
      return false;
    }
  }
  const br = Math.floor(r / BOX) * BOX;
  const bc = Math.floor(c / BOX) * BOX;
  for (let i = 0; i < BOX; i++) {
    for (let j = 0; j < BOX; j++) {
      if (grid[idx(br + i, bc + j)] === v) {
        return false;
      }
    }
  }
  return true;
}

/** Count solutions up to `limit` using backtracking. */
function countSolutions(grid: Grid, limit: number): number {
  // Find the empty cell with fewest candidates (MRV) for speed.
  let bestPos = -1;
  let bestCands: number[] | null = null;
  for (let p = 0; p < CELLS; p++) {
    if (grid[p] !== 0) {
      continue;
    }
    const cands: number[] = [];
    for (let v = 1; v <= SIZE; v++) {
      if (isSafe(grid, p, v)) {
        cands.push(v);
      }
    }
    if (cands.length === 0) {
      return 0;
    }
    if (!bestCands || cands.length < bestCands.length) {
      bestPos = p;
      bestCands = cands;
      if (cands.length === 1) {
        break;
      }
    }
  }
  if (bestPos === -1) {
    return 1; // full grid
  }
  let total = 0;
  for (const v of bestCands!) {
    grid[bestPos] = v;
    total += countSolutions(grid, limit - total);
    if (total >= limit) {
      grid[bestPos] = 0;
      return total;
    }
  }
  grid[bestPos] = 0;
  return total;
}

function hasUniqueSolution(grid: Grid): boolean {
  return countSolutions(grid.slice(), 2) === 1;
}

function generateSolution(rng: () => number): Grid {
  const grid: Grid = new Array(CELLS).fill(0);
  const fill = (pos: number): boolean => {
    if (pos === CELLS) {
      return true;
    }
    for (const v of shuffle(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rng,
    )) {
      if (isSafe(grid, pos, v)) {
        grid[pos] = v;
        if (fill(pos + 1)) {
          return true;
        }
        grid[pos] = 0;
      }
    }
    return false;
  };
  fill(0);
  return grid;
}

/**
 * Target clue counts per difficulty. Harder puzzles have fewer clues and
 * require more advanced techniques (v1 approximates difficulty by clue count).
 */
const TARGET_CLUES: Record<Exclude<Difficulty, 'daily'>, number> = {
  easy: 40,
  medium: 33,
  hard: 27,
};

interface GenerateOptions {
  difficulty: Difficulty;
  /** Seed for determinism (e.g. daily puzzle). Omitted = random. */
  seed?: number;
}

export function generatePuzzle(opts: GenerateOptions): Puzzle {
  const seed = opts.seed ?? Math.floor(Math.random() * 0xffffffff);
  const rng = mulberry32(seed);
  const solution = generateSolution(rng);

  const target =
    opts.difficulty === 'daily'
      ? TARGET_CLUES.medium
      : TARGET_CLUES[opts.difficulty];

  const givens = solution.slice();
  const order = shuffle(
    Array.from({ length: CELLS }, (_, i) => i),
    rng,
  );
  let clues = CELLS;
  for (const pos of order) {
    if (clues <= target) {
      break;
    }
    const saved = givens[pos];
    givens[pos] = 0;
    if (hasUniqueSolution(givens)) {
      clues--;
    } else {
      givens[pos] = saved;
    }
  }

  return {
    givens,
    solution,
    givenCells: givens.map(v => v !== 0),
    difficulty: opts.difficulty,
  };
}

/** Deterministic seed for today's puzzle, same for everyone. */
export function dailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return hashString(`puzzlemadness-daily-${y}-${m}-${d}`);
}

/** Generate the daily puzzle for a given date. */
export function generateDailyPuzzle(date: Date = new Date()): Puzzle {
  return generatePuzzle({ difficulty: 'daily', seed: dailySeed(date) });
}

/** Peers of a cell: same row, column or box (excluding itself). */
export function peers(pos: number): number[] {
  const r = Math.floor(pos / SIZE);
  const c = pos % SIZE;
  const out = new Set<number>();
  for (let i = 0; i < SIZE; i++) {
    if (i !== c) out.add(idx(r, i));
    if (i !== r) out.add(idx(i, c));
  }
  const br = Math.floor(r / BOX) * BOX;
  const bc = Math.floor(c / BOX) * BOX;
  for (let i = 0; i < BOX; i++) {
    for (let j = 0; j < BOX; j++) {
      const p = idx(br + i, bc + j);
      if (p !== pos) out.add(p);
    }
  }
  return Array.from(out);
}

/** Random unused seed helper kept for future variants. */
export function randomSeed(): number {
  return randInt(Math.random, 0xffffffff);
}
