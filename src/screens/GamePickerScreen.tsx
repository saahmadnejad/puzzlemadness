import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isRTL } from '../i18n';
import { GAMES } from '../games/registry';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'GamePicker'>;

const DIFFICULTIES = ['daily', 'easy', 'medium', 'hard'] as const;

export function GamePickerScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation();
  const { game } = route.params;
  const info = GAMES.find(g => g.id === game)!;
  const rtl = isRTL(i18n.language);

  const openGame = (difficulty: (typeof DIFFICULTIES)[number]) => {
    switch (game) {
      case 'sudoku':
        navigation.navigate('Game', { difficulty });
        break;
      case 'maze':
        navigation.navigate('MazeGame', { difficulty });
        break;
      case 'nonogram':
        navigation.navigate('NonogramGame', { difficulty });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, rtl && styles.rtl]}>{t('game.back')}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, rtl && styles.rtl]}>
          {t(`games.${game}.title`)}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.gameEmoji]}>{info.emoji}</Text>

        <View style={styles.cards}>
          {DIFFICULTIES.map(difficulty => (
            <Pressable
              key={difficulty}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => openGame(difficulty)}
            >
              <Text style={[styles.cardTitle, rtl && styles.rtl]}>
                {t(`games.${game}.difficulties.${difficulty}.title`)}
              </Text>
              <Text style={[styles.cardSubtitle, rtl && styles.rtl]}>
                {t(`games.${game}.difficulties.${difficulty}.subtitle`)}
              </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerSpacer: {
    width: 60,
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
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  container: {
    padding: 20,
  },
  gameEmoji: {
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 20,
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
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
