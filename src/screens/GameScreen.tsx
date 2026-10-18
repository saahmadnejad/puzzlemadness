import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useReducer, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board } from '../components/Board';
import { NumberPad } from '../components/NumberPad';
import {
  Difficulty,
  Puzzle,
  generateDailyPuzzle,
  generatePuzzle,
} from '../puzzles/generator';
import { createInitialState, gameReducer } from '../state/gameReducer';
import { formatTime, useTimer } from '../state/useTimer';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const LABELS: Record<Difficulty, string> = {
  daily: 'Daily Puzzle',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

function newPuzzleFor(difficulty: Difficulty): Puzzle {
  return difficulty === 'daily'
    ? generateDailyPuzzle()
    : generatePuzzle({ difficulty });
}

export function GameScreen({ navigation, route }: Props) {
  const { difficulty } = route.params;
  const [gameId, setGameId] = useState(0);
  const [puzzle, setPuzzle] = useState(() => newPuzzleFor(difficulty));

  const startNewGame = () => {
    setPuzzle(newPuzzleFor(difficulty));
    setGameId(id => id + 1);
  };

  return (
    <GameSession
      key={`${difficulty}-${gameId}`}
      puzzle={puzzle}
      label={LABELS[difficulty] ?? difficulty}
      onBack={() => navigation.goBack()}
      onNewGame={startNewGame}
    />
  );
}

interface SessionProps {
  puzzle: Puzzle;
  label: string;
  onBack: () => void;
  onNewGame: () => void;
}

function GameSession({ puzzle, label, onBack, onNewGame }: SessionProps) {
  const [state, dispatch] = useReducer(gameReducer, puzzle, createInitialState);
  const solved = state.status === 'solved';
  const elapsed = useTimer(!solved, String(puzzle.givens[0]) + puzzle.givens[40]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{label}</Text>
        <Pressable onPress={onNewGame} hitSlop={12}>
          <Text style={styles.newGame}>New ⟳</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(elapsed)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Mistakes</Text>
          <Text style={[styles.statValue, state.mistakes > 0 && styles.statValueBad]}>
            {state.mistakes}
          </Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <Board state={state} onSelect={index => dispatch({ type: 'select', index })} />
      </View>

      <View style={styles.padWrap}>
        <NumberPad
          notesMode={state.notesMode}
          disabled={state.selected === null || solved}
          onInput={value => dispatch({ type: 'input', value })}
          onErase={() => dispatch({ type: 'erase' })}
          onToggleNotes={() => dispatch({ type: 'toggleNotesMode' })}
        />
      </View>

      <Modal visible={solved} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Solved! 🎉</Text>
            <Text style={styles.dialogLine}>Time: {formatTime(elapsed)}</Text>
            <Text style={styles.dialogLine}>Mistakes: {state.mistakes}</Text>
            <View style={styles.dialogButtons}>
              <Pressable
                style={[styles.dialogButton, styles.dialogButtonPrimary]}
                onPress={onNewGame}
              >
                <Text style={styles.dialogButtonTextPrimary}>Play again</Text>
              </Pressable>
              <Pressable style={styles.dialogButton} onPress={onBack}>
                <Text style={styles.dialogButtonText}>Home</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  back: {
    fontSize: 17,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  newGame: {
    fontSize: 17,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  statValueBad: {
    color: theme.colors.error,
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  padWrap: {
    padding: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
  },
  dialogLine: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  dialogButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.padKey,
  },
  dialogButtonPrimary: {
    backgroundColor: theme.colors.accent,
  },
  dialogButtonText: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  dialogButtonTextPrimary: {
    fontWeight: '700',
    color: '#ffffff',
  },
});
