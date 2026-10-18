import {
  SIZE,
  generateDailyPuzzle,
  generatePuzzle,
  peers,
} from '../src/puzzles/generator';

const validSolution = (solution: number[]): boolean => {
  const unitOk = (cells: number[]) => {
    const set = new Set(cells);
    return set.size === SIZE;
  };
  for (let r = 0; r < SIZE; r++) {
    if (!unitOk(Array.from({ length: SIZE }, (_, c) => solution[r * SIZE + c]))) {
      return false;
    }
  }
  for (let c = 0; c < SIZE; c++) {
    if (!unitOk(Array.from({ length: SIZE }, (_, r) => solution[r * SIZE + c]))) {
      return false;
    }
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells: number[] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cells.push(solution[(br * 3 + i) * SIZE + bc * 3 + j]);
        }
      }
      if (!unitOk(cells)) {
        return false;
      }
    }
  }
  return true;
};

describe('generatePuzzle', () => {
  jest.setTimeout(30000);

  test('produces a valid solved grid', () => {
    const puzzle = generatePuzzle({ difficulty: 'easy' });
    expect(validSolution(puzzle.solution)).toBe(true);
  });

  test('clues are a subset of the solution', () => {
    const puzzle = generatePuzzle({ difficulty: 'medium' });
    for (let i = 0; i < puzzle.givens.length; i++) {
      if (puzzle.givens[i] !== 0) {
        expect(puzzle.givens[i]).toBe(puzzle.solution[i]);
      }
    }
  });

  test.each([
    ['easy', 36, 44],
    ['medium', 29, 36],
    ['hard', 24, 30],
  ] as const)('%s puzzles have plausible clue counts', (difficulty, min, max) => {
    const puzzle = generatePuzzle({ difficulty });
    const clues = puzzle.givens.filter(v => v !== 0).length;
    expect(clues).toBeGreaterThanOrEqual(min);
    expect(clues).toBeLessThanOrEqual(max);
  });

  test('same seed produces the same puzzle', () => {
    const a = generatePuzzle({ difficulty: 'hard', seed: 12345 });
    const b = generatePuzzle({ difficulty: 'hard', seed: 12345 });
    expect(a.givens).toEqual(b.givens);
    expect(a.solution).toEqual(b.solution);
  });

  test('daily puzzle is deterministic for a date', () => {
    const date = new Date(2026, 9, 18);
    const a = generateDailyPuzzle(date);
    const b = generateDailyPuzzle(date);
    expect(a.givens).toEqual(b.givens);
  });
});

describe('peers', () => {
  test('a cell has 20 peers', () => {
    expect(peers(40)).toHaveLength(20);
  });

  test('peers exclude the cell itself', () => {
    expect(peers(0)).not.toContain(0);
  });
});
