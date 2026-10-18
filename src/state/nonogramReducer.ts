import { Nonogram } from '../puzzles/nonogram';

/** Cell marks: 0 = empty, 1 = filled, 2 = crossed out. */
export type NonogramMark = 0 | 1 | 2;

export interface NonogramState {
  nonogram: Nonogram;
  marks: NonogramMark[];
  status: 'playing' | 'solved';
}

export type NonogramAction = { type: 'cycle'; cell: number } | { type: 'restart' };

export function createNonogramState(nonogram: Nonogram): NonogramState {
  return {
    nonogram,
    marks: new Array(nonogram.size * nonogram.size).fill(0),
    status: 'playing',
  };
}

function isSolved(marks: NonogramMark[], solution: boolean[]): boolean {
  for (let i = 0; i < marks.length; i++) {
    // Crosses are notes only; they don't affect the solution check.
    if ((marks[i] === 1) !== solution[i]) {
      return false;
    }
  }
  return true;
}

export function nonogramReducer(state: NonogramState, action: NonogramAction): NonogramState {
  switch (action.type) {
    case 'cycle': {
      if (state.status === 'solved') {
        return state;
      }
      const marks = state.marks.slice();
      marks[action.cell] = ((marks[action.cell] + 1) % 3) as NonogramMark;
      const status = isSolved(marks, state.nonogram.solution) ? 'solved' : 'playing';
      return { ...state, marks, status };
    }

    case 'restart':
      return createNonogramState(state.nonogram);

    default:
      return state;
  }
}

/**
 * True when a clue line is fully and correctly placed: the run-length
 * encoding of the line's filled cells equals the clue exactly.
 */
export function isLineComplete(
  marks: NonogramMark[],
  clueRuns: number[],
  cells: number[],
): boolean {
  const runs: number[] = [];
  let current = 0;
  for (const index of cells) {
    if (marks[index] === 1) {
      current++;
    } else if (current > 0) {
      runs.push(current);
      current = 0;
    }
  }
  if (current > 0) {
    runs.push(current);
  }
  return runs.length === clueRuns.length && runs.every((r, i) => r === clueRuns[i]);
}
