import { mulberry32 } from './rng';

export type NonogramDifficulty = 'daily' | 'easy' | 'medium' | 'hard';

export interface Nonogram {
  size: number;
  /** Runs of filled cells per row. */
  rowRuns: number[][];
  /** Runs of filled cells per column. */
  colRuns: number[][];
  /** The hidden picture, row-major; true = filled. */
  solution: boolean[];
  difficulty: NonogramDifficulty;
}

const SIZES: Record<Exclude<NonogramDifficulty, 'daily'>, number> = {
  easy: 10,
  medium: 15,
  hard: 20,
};

/** Compute the run-length encoding of a line of booleans. */
export function computeRuns(line: boolean[]): number[] {
  const runs: number[] = [];
  let current = 0;
  for (const filled of line) {
    if (filled) {
      current++;
    } else if (current > 0) {
      runs.push(current);
      current = 0;
    }
  }
  if (current > 0) {
    runs.push(current);
  }
  return runs;
}

export function rowLine(nonogram: Nonogram, row: number): boolean[] {
  return nonogram.solution.slice(row * nonogram.size, (row + 1) * nonogram.size);
}

export function colLine(nonogram: Nonogram, col: number): boolean[] {
  const out: boolean[] = [];
  for (let r = 0; r < nonogram.size; r++) {
    out.push(nonogram.solution[r * nonogram.size + col]);
  }
  return out;
}

/** Per-column constraint tracker used by the solver. */
interface ColState {
  run: number;
  len: number;
  inRun: boolean;
}

function stepCol(state: ColState, runs: number[], filled: boolean): ColState | null {
  if (filled) {
    if (state.run >= runs.length) {
      return null;
    }
    const len = state.len + 1;
    if (len > runs[state.run]) {
      return null;
    }
    return { run: state.run, len, inRun: true };
  }
  if (state.inRun) {
    if (state.len !== runs[state.run]) {
      return null;
    }
    return { run: state.run + 1, len: 0, inRun: false };
  }
  return state;
}

function colFinished(state: ColState, runs: number[]): boolean {
  if (state.inRun) {
    return state.len === runs[state.run] && state.run + 1 === runs.length;
  }
  return state.run === runs.length;
}

/** Enumerate every boolean pattern of `width` with the given runs. */
function enumerateRowPatterns(runs: number[], width: number, emit: (pattern: boolean[]) => boolean): void {
  const pattern = new Array<boolean>(width).fill(false);
  const place = (runIdx: number, pos: number): void => {
    if (runIdx === runs.length) {
      emit(pattern.slice());
      return;
    }
    const run = runs[runIdx];
    const minRemaining = runs.slice(runIdx + 1).reduce((a, b) => a + b, 0) + (runs.length - runIdx - 1);
    const maxStart = width - minRemaining - run;
    for (let start = pos; start <= maxStart; start++) {
      for (let i = 0; i < start; i++) {
        pattern[pos + i] = false;
      }
      for (let i = 0; i < run; i++) {
        pattern[start + i] = true;
      }
      place(runIdx + 1, start + run + 1);
      for (let i = start; i < width; i++) {
        pattern[i] = false;
      }
    }
  };
  if (runs.length === 0) {
    emit(pattern.slice());
    return;
  }
  place(0, 0);
}

/**
 * Count solutions up to `limit`. `budget` caps the work for big grids;
 * when exhausted, whatever was counted so far is returned (best effort).
 */
export function countNonogramSolutions(nonogram: Nonogram, limit = 2, budget = 200000): number {
  const { size, rowRuns, colRuns } = nonogram;
  let count = 0;
  let remaining = budget;

  const solveRow = (row: number, colStates: ColState[]): boolean => {
    if (remaining-- <= 0) {
      return true; // stop early
    }
    if (row === size) {
      if (colStates.every((s, c) => colFinished(s, colRuns[c]))) {
        count++;
        return count >= limit;
      }
      return false;
    }
    let stop = false;
    enumerateRowPatterns(rowRuns[row], size, pattern => {
      if (stop) {
        return true; // abort enumeration
      }
      const next: ColState[] = [];
      for (let c = 0; c < size; c++) {
        const stepped = stepCol(colStates[c], colRuns[c], pattern[c]);
        if (stepped === null) {
          return false; // reject this pattern
        }
        next.push(stepped);
      }
      stop = solveRow(row + 1, next);
      return stop;
    });
    return stop;
  };

  const initial = colRuns.map(() => ({ run: 0, len: 0, inRun: false }));
  solveRow(0, initial);
  return count;
}

/**
 * Generate a nonogram. Pictures are random balanced patterns; we retry
 * (with different randomness) until the picture has a unique solution,
 * falling back to the last attempt if the budget runs out.
 */
export function generateNonogram(
  difficulty: NonogramDifficulty,
  seed: number,
): Nonogram {
  const rng = mulberry32(seed);
  const size = difficulty === 'daily' ? SIZES.medium : SIZES[difficulty];

  const build = (density: number): Nonogram => {
    const solution: boolean[] = [];
    for (let i = 0; i < size * size; i++) {
      solution.push(rng() < density);
    }
    const rowRuns: number[][] = [];
    const colRuns: number[][] = [];
    for (let r = 0; r < size; r++) {
      rowRuns.push(computeRuns(solution.slice(r * size, (r + 1) * size)));
    }
    for (let c = 0; c < size; c++) {
      const line: boolean[] = [];
      for (let r = 0; r < size; r++) {
        line.push(solution[r * size + c]);
      }
      colRuns.push(computeRuns(line));
    }
    return { size, rowRuns, colRuns, solution, difficulty };
  };

  let last = build(0.5);
  for (let attempt = 0; attempt < 8; attempt++) {
    last = build(0.45 + rng() * 0.15);
    // Skip degenerate pictures with empty rows/columns.
    if (last.rowRuns.some(r => r.length === 0) || last.colRuns.some(c => c.length === 0)) {
      continue;
    }
    if (countNonogramSolutions(last, 2, 150000) === 1) {
      return last;
    }
  }
  return last;
}
