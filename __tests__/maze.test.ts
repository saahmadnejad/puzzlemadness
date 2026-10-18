import { generateMaze, canMove, WALL_E, WALL_N, WALL_S, WALL_W } from '../src/puzzles/maze';
import { createMazeState, mazeReducer } from '../src/state/mazeReducer';

const maze = generateMaze('medium', 1234);

describe('generateMaze', () => {
  test('is deterministic for the same seed', () => {
    const a = generateMaze('hard', 42);
    const b = generateMaze('hard', 42);
    expect(a.walls).toEqual(b.walls);
  });

  test('carves exactly cells-1 openings (spanning tree)', () => {
    const openEdges = maze.walls.reduce((sum, w, i) => {
      let open = 0;
      if (i % maze.cols < maze.cols - 1 && (w & WALL_E) === 0) open++;
      if (Math.floor(i / maze.cols) < maze.rows - 1 && (w & WALL_S) === 0) open++;
      return sum + open;
    }, 0);
    expect(openEdges).toBe(maze.cols * maze.rows - 1);
  });

  test('every cell is reachable from the start', () => {
    const seen = new Set([maze.start]);
    const queue = [maze.start];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const next of [cur - 1, cur + 1, cur - maze.cols, cur + maze.cols]) {
        if (next >= 0 && next < maze.cols * maze.rows && !seen.has(next) && canMove(maze, cur, next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect(seen.size).toBe(maze.cols * maze.rows);
  });

  test('difficulty scales grid size', () => {
    expect(generateMaze('easy', 1).cols).toBeLessThan(generateMaze('hard', 1).cols);
  });
});

describe('mazeReducer', () => {
  const state = createMazeState(maze);

  test('path starts at the start cell', () => {
    expect(state.path).toEqual([maze.start]);
  });

  test('cannot move through a wall', () => {
    // Find a walled-off neighbor of the start.
    const blocked = [1, maze.cols].find(n => !canMove(maze, maze.start, n));
    expect(blocked).toBeDefined();
    const next = mazeReducer(state, { type: 'moveTo', cell: blocked! });
    expect(next.path).toEqual([maze.start]);
  });

  test('backtracking un-draws the path', () => {
    const open = [1, maze.cols].find(n => canMove(maze, maze.start, n))!;
    let s = mazeReducer(state, { type: 'moveTo', cell: open });
    expect(s.path).toEqual([maze.start, open]);
    s = mazeReducer(s, { type: 'moveTo', cell: maze.start });
    expect(s.path).toEqual([maze.start]);
  });

  test('reaching the end solves the maze', () => {
    // Walk the perfect maze with BFS to build the unique path.
    const prev = new Map<number, number>();
    const queue = [maze.start];
    const seen = new Set([maze.start]);
    while (queue.length && !seen.has(maze.end)) {
      const cur = queue.shift()!;
      for (const next of [cur - 1, cur + 1, cur - maze.cols, cur + maze.cols]) {
        if (
          next >= 0 &&
          next < maze.cols * maze.rows &&
          !seen.has(next) &&
          canMove(maze, cur, next)
        ) {
          seen.add(next);
          prev.set(next, cur);
          queue.push(next);
        }
      }
    }
    const route: number[] = [];
    for (let c: number | undefined = maze.end; c !== undefined; c = prev.get(c)) {
      route.unshift(c);
    }
    let s = state;
    for (const cell of route.slice(1)) {
      s = mazeReducer(s, { type: 'moveTo', cell });
    }
    expect(s.status).toBe('solved');
  });

  test('restart clears the path', () => {
    const open = [1, maze.cols].find(n => canMove(maze, maze.start, n))!;
    let s = mazeReducer(state, { type: 'moveTo', cell: open });
    s = mazeReducer(s, { type: 'restart' });
    expect(s.path).toEqual([maze.start]);
    expect(s.status).toBe('playing');
  });
});
