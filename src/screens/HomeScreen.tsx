import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Language, isRTL, setLanguage } from '../i18n';
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
          <View style={styles.langSwitch}>
            {(['en', 'fa'] as Language[]).map(lang => (
              <Pressable
                key={lang}
                style={[styles.langPill, i18n.language === lang && styles.langPillActive]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langPillText,
                    i18n.language === lang && styles.langPillTextActive,
                  ]}
                >
                  {lang === 'en' ? 'EN' : 'فا'}
                </Text>
              </Pressable>
            ))}
          </View>
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
  langSwitch: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: theme.colors.padKey,
    borderRadius: 8,
    padding: 3,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  langPillActive: {
    backgroundColor: theme.colors.accent,
  },
  langPillText: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.textMuted,
  },
  langPillTextActive: {
    color: '#ffffff',
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
