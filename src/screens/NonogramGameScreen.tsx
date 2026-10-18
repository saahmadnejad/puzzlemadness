import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NonogramBoard } from '../components/NonogramBoard';
import { isRTL } from '../i18n';
import { useDigitFormatter } from '../i18n/digits';
import { dailySeed } from '../puzzles/generator';
import { Nonogram, NonogramDifficulty, generateNonogram } from '../puzzles/nonogram';
import { createNonogramState, nonogramReducer } from '../state/nonogramReducer';
import { formatTime, useTimer } from '../state/useTimer';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NonogramGame'>;

function newNonogramFor(difficulty: NonogramDifficulty): Nonogram {
  const seed = difficulty === 'daily' ? dailySeed() : Math.floor(Math.random() * 0xffffffff);
  return generateNonogram(difficulty, seed);
}

export function NonogramGameScreen({ navigation, route }: Props) {
  const { difficulty } = route.params;
  const [gameId, setGameId] = useState(0);
  const [nonogram, setNonogram] = useState(() => newNonogramFor(difficulty));

  const startNewGame = () => {
    setNonogram(newNonogramFor(difficulty));
    setGameId(id => id + 1);
  };

  return (
    <NonogramSession
      key={`${difficulty}-${gameId}`}
      nonogram={nonogram}
      difficulty={difficulty}
      onBack={() => navigation.goBack()}
      onNewGame={startNewGame}
    />
  );
}

interface SessionProps {
  nonogram: Nonogram;
  difficulty: NonogramDifficulty;
  onBack: () => void;
  onNewGame: () => void;
}

function NonogramSession({ nonogram, difficulty, onBack, onNewGame }: SessionProps) {
  const { t, i18n } = useTranslation();
  const digits = useDigitFormatter();
  const rtl = isRTL(i18n.language);

  const [state, dispatch] = useReducer(nonogramReducer, nonogram, createNonogramState);
  const solved = state.status === 'solved';
  const elapsed = useTimer(!solved, `${nonogram.size}-${nonogram.solution[3]}`);
  const fillCount = useMemo(
    () => state.marks.filter(m => m === 1).length,
    [state.marks],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={[styles.back, rtl && styles.rtl]}>{t('game.back')}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, rtl && styles.rtl]}>
          {t(`games.nonogram.difficulties.${difficulty}.title`)}
        </Text>
        <Pressable onPress={onNewGame} hitSlop={12}>
          <Text style={[styles.newGame, rtl && styles.rtl]}>{t('game.new')}</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, rtl && styles.rtl]}>{t('game.time')}</Text>
          <Text style={[styles.statValue, rtl && styles.rtl]}>
            {digits(formatTime(elapsed))}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, rtl && styles.rtl]}>{t('game.filled')}</Text>
          <Text style={[styles.statValue, rtl && styles.rtl]}>{digits(fillCount)}</Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <NonogramBoard
          nonogram={nonogram}
          marks={state.marks}
          solved={solved}
          onCycle={cell => dispatch({ type: 'cycle', cell })}
        />
      </View>

      <Modal visible={solved} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={[styles.dialogTitle, rtl && styles.rtl]}>{t('game.solved')}</Text>
            <Text style={[styles.dialogLine, rtl && styles.rtl]}>
              {t('game.dialog.time', { value: digits(formatTime(elapsed)) })}
            </Text>
            <View style={styles.dialogButtons}>
              <Pressable
                style={[styles.dialogButton, styles.dialogButtonPrimary]}
                onPress={onNewGame}
              >
                <Text style={styles.dialogButtonTextPrimary}>{t('game.playAgain')}</Text>
              </Pressable>
              <Pressable style={styles.dialogButton} onPress={onBack}>
                <Text style={styles.dialogButtonText}>{t('game.home')}</Text>
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
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
  },
  newGame: {
    fontSize: 17,
    color: theme.colors.accent,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
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
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
    marginTop: 2,
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
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
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
    marginBottom: 12,
  },
  dialogLine: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
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
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
  },
  dialogButtonTextPrimary: {
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: '#ffffff',
  },
});
