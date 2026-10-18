import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Nonogram, colLine, rowLine } from '../puzzles/nonogram';
import { NonogramMark, isLineComplete } from '../state/nonogramReducer';
import { useDigitFormatter } from '../i18n/digits';
import { theme } from '../theme';

interface Props {
  nonogram: Nonogram;
  marks: NonogramMark[];
  solved: boolean;
  onCycle: (cell: number) => void;
}

/**
 * Nonogram grid with row clues on the left and column clues on top.
 * Tap a cell to cycle: empty -> filled -> crossed -> empty.
 */
export function NonogramBoard({ nonogram, marks, solved, onCycle }: Props) {
  const digits = useDigitFormatter();
  const [width, setWidth] = useState(0);

  const { size } = nonogram;
  const clueW = width * 0.3;
  const gridW = width - clueW;
  const cell = size > 0 ? gridW / size : 0;

  const rowComplete = useMemo(
    () =>
      nonogram.rowRuns.map((runs, r) =>
        isLineComplete(marks, runs, Array.from({ length: size }, (_, c) => r * size + c)),
      ),
    [marks, nonogram, size],
  );
  const colComplete = useMemo(
    () =>
      nonogram.colRuns.map((runs, c) =>
        isLineComplete(marks, runs, Array.from({ length: size }, (_, r) => r * size + c)),
      ),
    [marks, nonogram, size],
  );

  // Keep maxRuns in state so cells can be measured before the first layout
  // pass renders the clue columns.
  const [maxRowRuns, setMaxRowRuns] = useState(1);
  const [maxColRuns, setMaxColRuns] = useState(1);
  useEffect(() => {
    setMaxRowRuns(Math.max(1, ...nonogram.rowRuns.map(r => r.length)));
    setMaxColRuns(Math.max(1, ...nonogram.colRuns.map(r => r.length)));
  }, [nonogram]);

  const clueFs = Math.max(6, Math.min(clueW / (maxRowRuns * 1.8), 11));
  const topFs = Math.max(6, Math.min(cell * 0.55, 11));
  const topH = maxColRuns * (topFs + 2) + 8;

  if (width === 0) {
    return <View style={styles.container} onLayout={e => setWidth(e.nativeEvent.layout.width)} />;
  }

  return (
    <View style={styles.container} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {/* Column clues */}
      <View style={styles.row}>
        <View style={{ width: clueW }} />
        <View style={[styles.topClues, { width: gridW, height: topH }]}>
          {nonogram.colRuns.map((runs, c) => (
            <View key={c} style={{ width: cell, alignItems: 'center' }}>
              {runs.map((r, i) => (
                <Text
                  key={i}
                  style={[
                    styles.clueText,
                    { fontSize: topFs, lineHeight: topFs + 2 },
                    colComplete[c] && styles.clueDone,
                  ]}
                >
                  {digits(r)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Grid with row clues */}
      <View style={styles.row}>
        <View style={{ width: clueW }}>
          {nonogram.rowRuns.map((runs, r) => (
            <View
              key={r}
              style={{
                height: cell,
                width: clueW,
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: 5,
              }}
            >
              <Text
                style={[
                  styles.clueText,
                  { fontSize: clueFs },
                  rowComplete[r] && styles.clueDone,
                ]}
                numberOfLines={1}
              >
                {runs.map(rn => digits(rn)).join(' ')}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ width: gridW, height: gridW }}>
          {Array.from({ length: size }, (_, r) => (
            <View key={r} style={{ flexDirection: 'row', height: cell }}>
              {Array.from({ length: size }, (_, c) => {
                const index = r * size + c;
                const mark = marks[index];
                return (
                  <Pressable
                    key={c}
                    onPress={() => onCycle(index)}
                    style={[
                      styles.cell,
                      { width: cell, height: cell },
                      (c + 1) % 5 === 0 && c !== size - 1 && styles.guideRight,
                      (r + 1) % 5 === 0 && r !== size - 1 && styles.guideBottom,
                      mark === 1 && (solved ? styles.solvedCell : styles.filledCell),
                    ]}
                  >
                    {mark === 2 && <Text style={[styles.cross, { fontSize: topFs }]}>✕</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  topClues: {
    flexDirection: 'row',
  },
  clueText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontWeight: 'normal',
  },
  clueDone: {
    color: theme.colors.textMuted,
    opacity: 0.5,
  },
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  guideRight: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.borderBold,
  },
  guideBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderBold,
  },
  filledCell: {
    backgroundColor: theme.colors.text,
  },
  solvedCell: {
    backgroundColor: theme.colors.success,
  },
  cross: {
    color: theme.colors.textMuted,
  },
});
