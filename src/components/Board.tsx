import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDigitFormatter } from '../i18n/digits';
import { BOX, SIZE } from '../puzzles/generator';
import { GameState } from '../state/gameReducer';
import { theme } from '../theme';

interface Props {
  state: GameState;
  onSelect: (index: number) => void;
}

function Notes({ mask }: { mask: number }) {
  const digits = useDigitFormatter();
  return (
    <View style={styles.notesGrid}>
      {Array.from({ length: SIZE }, (_, i) => (
        <View key={i} style={styles.noteCell}>
          <Text style={styles.noteText}>{mask & (1 << i) ? digits(i + 1) : ''}</Text>
        </View>
      ))}
    </View>
  );
}

function Cell({ index, state, onSelect }: Props & { index: number }) {
  const digits = useDigitFormatter();
  const { values, notes, selected, puzzle, status } = state;
  const value = values[index];
  const isGiven = puzzle.givenCells[index];
  const isSelected = selected === index;
  const selectedValue = selected !== null ? values[selected] : 0;

  const inSelectedGroup =
    selected !== null &&
    !isSelected &&
    selectedValue !== 0 &&
    value === selectedValue &&
    peersOf(selected, index);

  const isWrong = !isGiven && value !== 0 && value !== puzzle.solution[index];

  const r = Math.floor(index / SIZE);
  const c = index % SIZE;

  return (
    <Pressable
      onPress={() => onSelect(index)}
      style={[
        styles.cell,
        c % BOX === 0 && c !== 0 && styles.borderLeftBold,
        r % BOX === 0 && r !== 0 && styles.borderTopBold,
        isSelected && styles.cellSelected,
        inSelectedGroup && styles.cellPeer,
        isWrong && status === 'playing' && styles.cellWrong,
      ]}
    >
      {value !== 0 ? (
        <Text
          style={[
            styles.value,
            isGiven ? styles.valueGiven : styles.valueUser,
            isWrong && status === 'playing' && styles.valueWrong,
          ]}
        >
          {digits(value)}
        </Text>
      ) : notes[index] ? (
        <Notes mask={notes[index]} />
      ) : null}
    </Pressable>
  );
}

/** True when `index` shares a row, column or box with `selected`. */
function peersOf(selected: number, index: number): boolean {
  const sr = Math.floor(selected / SIZE);
  const sc = selected % SIZE;
  const r = Math.floor(index / SIZE);
  const c = index % SIZE;
  if (sr === r || sc === c) {
    return true;
  }
  return (
    Math.floor(sr / BOX) === Math.floor(r / BOX) &&
    Math.floor(sc / BOX) === Math.floor(c / BOX)
  );
}

export function Board({ state, onSelect }: Props) {
  return (
    <View style={styles.board}>
      {Array.from({ length: SIZE * SIZE }, (_, i) => (
        <Cell key={i} index={i} state={state} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.borderBold,
    borderWidth: 3,
    borderColor: theme.colors.borderBold,
    borderRadius: 4,
  },
  cell: {
    width: `${100 / SIZE}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  borderTopBold: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.borderBold,
  },
  borderLeftBold: {
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.borderBold,
  },
  cellSelected: {
    backgroundColor: theme.colors.accentSoft,
  },
  cellPeer: {
    backgroundColor: theme.colors.highlight,
  },
  cellWrong: {
    backgroundColor: theme.colors.errorSoft,
  },
  value: {
    fontSize: theme.fontSize.cell,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
  },
  valueGiven: {
    color: theme.colors.given,
  },
  valueUser: {
    color: theme.colors.user,
  },
  valueWrong: {
    color: theme.colors.error,
  },
  notesGrid: {
    width: '90%',
    height: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteCell: {
    width: `${100 / 3}%`,
    height: `${100 / 3}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    fontSize: theme.fontSize.note,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
  },
});
