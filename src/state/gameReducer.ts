import { CELLS, Difficulty, Puzzle, peers } from '../puzzles/generator';

export type GameStatus = 'playing' | 'solved';

export interface GameState {
  puzzle: Puzzle;
  /** Current player values per cell, 0 = empty. */
  values: number[];
  /** Pencil-note candidates as a bitmask (bit n-1 = candidate n). */
  notes: number[];
  selected: number | null;
  notesMode: boolean;
  mistakes: number;
  status: GameStatus;
}

export type GameAction =
  | { type: 'select'; index: number }
  | { type: 'input'; value: number }
  | { type: 'erase' }
  | { type: 'toggleNotesMode' }
  | { type: 'restart' };

export function createInitialState(puzzle: Puzzle): GameState {
  return {
    puzzle,
    values: puzzle.givens.slice(),
    notes: new Array(CELLS).fill(0),
    selected: null,
    notesMode: false,
    mistakes: 0,
    status: 'playing',
  };
}

function isSolved(values: number[], solution: number[]): boolean {
  for (let i = 0; i < CELLS; i++) {
    if (values[i] !== solution[i]) {
      return false;
    }
  }
  return true;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'select':
      return { ...state, selected: action.index };

    case 'toggleNotesMode':
      return { ...state, notesMode: !state.notesMode };

    case 'erase': {
      const pos = state.selected;
      if (pos === null || state.puzzle.givenCells[pos]) {
        return state;
      }
      const values = state.values.slice();
      const notes = state.notes.slice();
      values[pos] = 0;
      notes[pos] = 0;
      return { ...state, values, notes };
    }

    case 'input': {
      const pos = state.selected;
      if (pos === null || state.puzzle.givenCells[pos] || state.status === 'solved') {
        return state;
      }

      if (state.notesMode) {
        // Toggle the candidate in the selected cell; clear value if present.
        const notes = state.notes.slice();
        const values = state.values.slice();
        values[pos] = 0;
        notes[pos] ^= 1 << (action.value - 1);
        return { ...state, values, notes };
      }

      const values = state.values.slice();
      const notes = state.notes.slice();
      const newValue = values[pos] === action.value ? 0 : action.value;
      values[pos] = newValue;

      if (newValue !== 0) {
        // Place the number and clear matching notes from peers.
        for (const p of peers(pos)) {
          notes[p] &= ~(1 << (newValue - 1));
        }
        const wrong = newValue !== state.puzzle.solution[pos];
        if (!isSolved(values, state.puzzle.solution)) {
          return {
            ...state,
            values,
            notes,
            mistakes: state.mistakes + (wrong ? 1 : 0),
            status: 'playing',
          };
        }
        return {
          ...state,
          values,
          notes,
          mistakes: state.mistakes + (wrong ? 1 : 0),
          status: 'solved',
        };
      }
      return { ...state, values, notes };
    }

    case 'restart':
      return createInitialState(state.puzzle);

    default:
      return state;
  }
}
