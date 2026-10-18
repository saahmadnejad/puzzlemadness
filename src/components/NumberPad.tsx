import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDigitFormatter } from '../i18n/digits';
import { SIZE } from '../puzzles/generator';
import { theme } from '../theme';

interface Props {
  notesMode: boolean;
  disabled: boolean;
  onInput: (value: number) => void;
  onErase: () => void;
  onToggleNotes: () => void;
}

export function NumberPad({ notesMode, disabled, onInput, onErase, onToggleNotes }: Props) {
  const { t } = useTranslation();
  const digits = useDigitFormatter();
  return (
    <View style={styles.pad}>
      <View style={styles.keys}>
        {Array.from({ length: SIZE }, (_, i) => i + 1).map(n => (
          <Pressable
            key={n}
            style={[styles.key, disabled && styles.keyDisabled]}
            onPress={() => onInput(n)}
            disabled={disabled}
          >
            <Text style={[styles.keyText, disabled && styles.keyTextDisabled]}>
              {digits(n)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.action, notesMode && styles.actionActive]} onPress={onToggleNotes}>
          <Text style={[styles.actionText, notesMode && styles.actionTextActive]}>
            {t('game.notes')}
          </Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onErase}>
          <Text style={styles.actionText}>{t('game.erase')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    width: '100%',
    gap: 10,
  },
  keys: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    width: '10%',
    aspectRatio: 0.75,
    maxWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.padKey,
    borderRadius: 8,
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    fontSize: theme.fontSize.pad,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
  },
  keyTextDisabled: {
    color: theme.colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  action: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.padKey,
    borderRadius: 8,
  },
  actionActive: {
    backgroundColor: theme.colors.accent,
  },
  actionText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    fontWeight: 'normal',
    color: theme.colors.text,
  },
  actionTextActive: {
    color: '#ffffff',
  },
});
