import React, { useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, View, Text } from 'react-native';
import { Maze, WALL_E, WALL_N, WALL_S, WALL_W, canMove } from '../puzzles/maze';
import { theme } from '../theme';

interface Props {
  maze: Maze;
  path: number[];
  solved: boolean;
  onMove: (cell: number) => void;
}

/**
 * Renders the maze grid and turns drag gestures into path moves.
 * The path is drawn as highlighted cells; dragging back over the
 * previous cell un-draws it, dragging over your own path rewinds to it.
 */
export function MazeBoard({ maze, path, solved, onMove }: Props) {
  const pathSet = useMemo(() => new Set(path), [path]);
  const head = path[path.length - 1];

  // Latest-value refs so the (stable) PanResponder always sees fresh props.
  const mazeRef = useRef(maze);
  mazeRef.current = maze;
  const headRef = useRef(head);
  headRef.current = head;
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const lastCellRef = useRef(head);

  const cellFromTouch = (locationX: number, locationY: number, width: number): number | null => {
    const m = mazeRef.current;
    const cellSize = width / m.cols;
    const col = Math.floor(locationX / cellSize);
    const row = Math.floor(locationY / cellSize);
    if (col < 0 || col >= m.cols || row < 0 || row >= m.rows) {
      return null;
    }
    return row * m.cols + col;
  };

  const moveTo = (locationX: number, locationY: number, width: number) => {
    const target = cellFromTouch(locationX, locationY, width);
    if (target === null || target === lastCellRef.current) {
      return;
    }
    // Step one cell at a time toward the target so fast swipes still trace
    // a valid path instead of jumping over walls.
    let cur = lastCellRef.current;
    const m = mazeRef.current;
    const curR = Math.floor(cur / m.cols);
    const curC = cur % m.cols;
    const targetR = Math.floor(target / m.cols);
    const targetC = target % m.cols;
    const stepR = Math.sign(targetR - curR);
    const stepC = Math.sign(targetC - curC);
    // Prefer the direction that closes the bigger gap.
    const tryOrder: number[][] =
      Math.abs(targetR - curR) >= Math.abs(targetC - curC)
        ? [[stepR, 0], [0, stepC]]
        : [[0, stepC], [stepR, 0]];
    for (const [dr, dc] of tryOrder) {
      if (dr === 0 && dc === 0) {
        continue;
      }
      const next = (curR + dr) * m.cols + (curC + dc);
      if (canMove(m, cur, next)) {
        cur = next;
        lastCellRef.current = next;
        onMoveRef.current(next);
      }
    }
  };

  const widthRef = useRef(0);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: evt => {
          lastCellRef.current = headRef.current;
          moveTo(evt.nativeEvent.locationX, evt.nativeEvent.locationY, widthRef.current);
        },
        onPanResponderMove: evt => {
          moveTo(evt.nativeEvent.locationX, evt.nativeEvent.locationY, widthRef.current);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <View
      style={styles.board}
      onLayout={e => {
        widthRef.current = e.nativeEvent.layout.width;
      }}
      {...pan.panHandlers}
    >
      {Array.from({ length: maze.rows }, (_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: maze.cols }, (_, c) => {
            const index = r * maze.cols + c;
            const walls = maze.walls[index];
            const isPath = pathSet.has(index);
            const isHead = index === head && !solved;
            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  (walls & WALL_N) !== 0 && styles.wallTop,
                  (walls & WALL_W) !== 0 && styles.wallLeft,
                  c === maze.cols - 1 && (walls & WALL_E) !== 0 && styles.wallRight,
                  r === maze.rows - 1 && (walls & WALL_S) !== 0 && styles.wallBottom,
                  isPath && styles.pathCell,
                  isHead && styles.headCell,
                ]}
              >
                {index === maze.end && <Text style={styles.marker}>🏁</Text>}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.borderBold,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallTop: {
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.borderBold,
  },
  wallLeft: {
    borderLeftWidth: 1.5,
    borderLeftColor: theme.colors.borderBold,
  },
  wallRight: {
    borderRightWidth: 1.5,
    borderRightColor: theme.colors.borderBold,
  },
  wallBottom: {
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.borderBold,
  },
  pathCell: {
    backgroundColor: theme.colors.accentSoft,
  },
  headCell: {
    backgroundColor: theme.colors.accent,
  },
  marker: {
    fontSize: 11,
  },
});
