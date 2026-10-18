import { Maze, canMove } from '../puzzles/maze';

export interface MazeState {
  maze: Maze;
  /** Cells the player's path currently covers, start first. */
  path: number[];
  status: 'playing' | 'solved';
}

export type MazeAction = { type: 'moveTo'; cell: number } | { type: 'restart' };

export function createMazeState(maze: Maze): MazeState {
  return { maze, path: [maze.start], status: 'playing' };
}

export function mazeReducer(state: MazeState, action: MazeAction): MazeState {
  switch (action.type) {
    case 'moveTo': {
      if (state.status === 'solved') {
        return state;
      }
      const { maze, path } = state;
      const head = path[path.length - 1];
      const cell = action.cell;
      if (cell === head) {
        return state;
      }
      // Dragging back onto the previous cell un-draws (backtrack).
      if (path.length > 1 && cell === path[path.length - 2]) {
        return { ...state, path: path.slice(0, -1) };
      }
      if (canMove(maze, head, cell)) {
        const next = [...path, cell];
        return {
          ...state,
          path: next,
          status: cell === maze.end ? 'solved' : 'playing',
        };
      }
      return state;
    }

    case 'restart':
      return createMazeState(state.maze);

    default:
      return state;
  }
}
