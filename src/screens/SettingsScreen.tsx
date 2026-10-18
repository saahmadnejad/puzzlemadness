import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES, isRTL, setLanguage } from '../i18n';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, rtl && styles.rtl]}>{t('game.back')}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, rtl && styles.rtl]}>{t('settings.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.sectionTitle, rtl && styles.rtl]}>
          {t('settings.language')}
        </Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => {
            const active = i18n.language === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[
                  styles.row,
                  index > 0 && styles.rowDivider,
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[styles.rowLabel, rtl && styles.rtl, active && styles.rowLabelActive]}>
                  {lang.label}
                </Text>
                {active && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, rtl && styles.rtl, styles.aboutTitle]}>
          {t('settings.about')}
        </Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.rowValue, rtl && styles.rtl]}>
              {t('settings.version', { version: '1.0.0' })}
            </Text>
          </View>
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
  sectionTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  aboutTitle: {
    marginTop: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  rowLabel: {
    fontSize: 17,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
  },
  rowLabelActive: {
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.accent,
  },
  rowValue: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
  },
  check: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '700',
  },
});
