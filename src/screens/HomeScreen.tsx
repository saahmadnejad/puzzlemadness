import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isRTL } from '../i18n';
import { Difficulty } from '../puzzles/generator';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const OPTIONS: Difficulty[] = ['daily', 'easy', 'medium', 'hard'];

export function HomeScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.title, rtl && styles.rtl]}>{t('home.title')}</Text>
            <Text style={[styles.subtitle, rtl && styles.rtl]}>{t('home.subtitle')}</Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            hitSlop={12}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        <View style={styles.cards}>
          {OPTIONS.map(difficulty => (
            <Pressable
              key={difficulty}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('Game', { difficulty })}
            >
              <Text style={[styles.cardTitle, rtl && styles.rtl]}>
                {t(`home.puzzles.${difficulty}.title`)}
              </Text>
              <Text style={[styles.cardSubtitle, rtl && styles.rtl]}>
                {t(`home.puzzles.${difficulty}.subtitle`)}
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
  container: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
    marginTop: 6,
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  settingsButton: {
    marginTop: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
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
