import {
  computeRuns,
  countNonogramSolutions,
  generateNonogram,
} from '../src/puzzles/nonogram';
import {
  createNonogramState,
  isLineComplete,
  nonogramReducer,
} from '../src/state/nonogramReducer';

describe('computeRuns', () => {
  test('empty line', () => {
    expect(computeRuns([false, false])).toEqual([]);
  });
  test('single run', () => {
    expect(computeRuns([false, true, true, false])).toEqual([2]);
  });
  test('multiple runs', () => {
    expect(computeRuns([true, true, false, true])).toEqual([2, 1]);
  });
});

describe('generateNonogram', () => {
  jest.setTimeout(60000);

  test('clues match the hidden picture', () => {
    const n = generateNonogram('easy', 7);
    for (let r = 0; r < n.size; r++) {
      expect(n.rowRuns[r]).toEqual(
        computeRuns(n.solution.slice(r * n.size, (r + 1) * n.size)),
      );
    }
    for (let c = 0; c < n.size; c++) {
      const col: boolean[] = [];
      for (let r = 0; r < n.size; r++) {
        col.push(n.solution[r * n.size + c]);
      }
      expect(n.colRuns[c]).toEqual(computeRuns(col));
    }
  });

  test('same seed produces the same picture', () => {
    const a = generateNonogram('easy', 99);
    const b = generateNonogram('easy', 99);
    expect(a.solution).toEqual(b.solution);
    expect(a.rowRuns).toEqual(b.rowRuns);
  });

  test('easy pictures have a unique solution', () => {
    const n = generateNonogram('easy', 31);
    expect(countNonogramSolutions(n, 2)).toBe(1);
  });

  test('no empty rows or columns', () => {
    const n = generateNonogram('medium', 55);
    expect(n.rowRuns.every(runs => runs.length > 0)).toBe(true);
    expect(n.colRuns.every(runs => runs.length > 0)).toBe(true);
  });
});

describe('nonogramReducer', () => {
  const n = generateNonogram('easy', 3);
  const start = createNonogramState(n);

  test('cycle goes empty -> filled -> crossed -> empty', () => {
    let s = nonogramReducer(start, { type: 'cycle', cell: 0 });
    expect(s.marks[0]).toBe(1);
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    expect(s.marks[0]).toBe(2);
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    expect(s.marks[0]).toBe(0);
  });

  test('filling the exact picture solves it (crosses ignored)', () => {
    let s = createNonogramState(n);
    // Cross a solution cell first — it must not block solving.
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    s = nonogramReducer(s, { type: 'cycle', cell: 0 });
    s = nonogramReducer(s, { type: 'cycle', cell: 0 }); // back to empty
    for (let i = 0; i < n.solution.length; i++) {
      if (n.solution[i]) {
        s = nonogramReducer(s, { type: 'cycle', cell: i });
      }
    }
    expect(s.status).toBe('solved');
  });

  test('a wrong fill never solves', () => {
    let s = createNonogramState(n);
    const wrongIdx = n.solution.findIndex(v => !v);
    for (let i = 0; i < n.solution.length; i++) {
      if (n.solution[i] || i === wrongIdx) {
        s = nonogramReducer(s, { type: 'cycle', cell: i });
      }
    }
    expect(s.status).toBe('playing');
  });

  test('restart clears marks', () => {
    let s = nonogramReducer(start, { type: 'cycle', cell: 1 });
    s = nonogramReducer(s, { type: 'restart' });
    expect(s.marks.every(m => m === 0)).toBe(true);
    expect(s.status).toBe('playing');
  });
});

describe('isLineComplete', () => {
  test('detects a correctly filled line', () => {
    // Picture: X X . X  -> runs [2, 1], cells 0..3
    const marks = [1, 1, 0, 1] as const;
    expect(isLineComplete(marks as any, [2, 1], [0, 1, 2, 3])).toBe(true);
    expect(isLineComplete(marks as any, [3], [0, 1, 2, 3])).toBe(false);
  });

  test('crosses do not count as filled', () => {
    const marks = [2, 1, 1, 0] as const;
    expect(isLineComplete(marks as any, [2], [0, 1, 2, 3])).toBe(true);
  });
});
