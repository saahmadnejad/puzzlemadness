import { generatePuzzle } from '../src/puzzles/generator';
import { createInitialState, gameReducer } from '../src/state/gameReducer';

const puzzle = generatePuzzle({ difficulty: 'hard', seed: 42 });
const firstEmpty = puzzle.givens.findIndex(v => v === 0);

const start = () => {
  let state = createInitialState(puzzle);
  state = gameReducer(state, { type: 'select', index: firstEmpty });
  return state;
};

describe('gameReducer', () => {
  test('placing the correct solution value sets the cell', () => {
    const state = gameReducer(start(), {
      type: 'input',
      value: puzzle.solution[firstEmpty],
    });
    expect(state.values[firstEmpty]).toBe(puzzle.solution[firstEmpty]);
    expect(state.mistakes).toBe(0);
  });

  test('placing a wrong value increments mistakes', () => {
    const wrong = (puzzle.solution[firstEmpty] % 9) + 1;
    const state = gameReducer(start(), { type: 'input', value: wrong });
    expect(state.mistakes).toBe(1);
  });

  test('tapping the same number again clears the cell', () => {
    let state = gameReducer(start(), {
      type: 'input',
      value: puzzle.solution[firstEmpty],
    });
    state = gameReducer(state, { type: 'input', value: puzzle.solution[firstEmpty] });
    expect(state.values[firstEmpty]).toBe(0);
  });

  test('givens cannot be selected-then-overwritten', () => {
    let state = createInitialState(puzzle);
    const givenIdx = puzzle.givenCells.findIndex(Boolean);
    state = gameReducer(state, { type: 'select', index: givenIdx });
    state = gameReducer(state, { type: 'input', value: 1 });
    expect(state.values[givenIdx]).toBe(puzzle.givens[givenIdx]);
  });

  test('notes mode toggles candidates without setting a value', () => {
    let state = gameReducer(start(), { type: 'toggleNotesMode' });
    state = gameReducer(state, { type: 'input', value: 7 });
    expect(state.values[firstEmpty]).toBe(0);
    expect(state.notes[firstEmpty] & (1 << 6)).toBeTruthy();
  });

  test('placing a value clears that candidate from peer notes', () => {
    // Note candidate 5 in the selected cell...
    let state = gameReducer(start(), { type: 'toggleNotesMode' });
    state = gameReducer(state, { type: 'input', value: 5 });
    expect(state.notes[firstEmpty] & (1 << 4)).toBeTruthy();
    // ...then place a real 5 in a row-mate; the note should be cleared.
    state = gameReducer(state, { type: 'toggleNotesMode' });
    const peerInRow = Math.floor(firstEmpty / 9) * 9 + ((firstEmpty % 9 + 1) % 9);
    state = gameReducer(state, { type: 'select', index: peerInRow });
    state = gameReducer(state, { type: 'input', value: 5 });
    expect(state.notes[firstEmpty] & (1 << 4)).toBe(0);
  });

  test('erasing clears value and notes of selected cell', () => {
    let state = gameReducer(start(), { type: 'toggleNotesMode' });
    state = gameReducer(state, { type: 'input', value: 3 });
    state = gameReducer(state, { type: 'toggleNotesMode' });
    state = gameReducer(state, { type: 'erase' });
    expect(state.values[firstEmpty]).toBe(0);
    expect(state.notes[firstEmpty]).toBe(0);
  });

  test('solving the whole grid marks the game as solved', () => {
    let state = createInitialState(puzzle);
    for (let i = 0; i < 81; i++) {
      if (!puzzle.givenCells[i]) {
        state = gameReducer(state, { type: 'select', index: i });
        state = gameReducer(state, { type: 'input', value: puzzle.solution[i] });
      }
    }
    expect(state.status).toBe('solved');
  });

  test('restart resets to the initial state', () => {
    const state = gameReducer(start(), { type: 'restart' });
    expect(state.values).toEqual(puzzle.givens);
    expect(state.mistakes).toBe(0);
    expect(state.selected).toBeNull();
  });
});
