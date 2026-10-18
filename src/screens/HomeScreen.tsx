import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty } from '../puzzles/generator';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const OPTIONS: { difficulty: Difficulty; title: string; subtitle: string }[] = [
  { difficulty: 'daily', title: 'Daily Puzzle', subtitle: "Today's puzzle — same for everyone" },
  { difficulty: 'easy', title: 'Easy', subtitle: 'More clues, few techniques needed' },
  { difficulty: 'medium', title: 'Medium', subtitle: 'A balanced challenge' },
  { difficulty: 'hard', title: 'Hard', subtitle: 'Fewest clues — bring your A-game' },
];

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sudoku Madness</Text>
        <Text style={styles.subtitle}>Daily sudoku, three difficulties, unlimited play</Text>
        <View style={styles.cards}>
          {OPTIONS.map(opt => (
            <Pressable
              key={opt.difficulty}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('Game', { difficulty: opt.difficulty })}
            >
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginTop: 6,
    marginBottom: 24,
  },
  cards: {
    gap: 14,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    backgroundColor: theme.colors.accentSoft,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
