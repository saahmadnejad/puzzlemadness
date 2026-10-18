import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findBestLanguageTag } from 'react-native-localize';
import { fa } from './resources/fa';
import { en } from './resources/en';

export const LANGUAGE_KEY = '@sudoku/language';
export type Language = 'en' | 'fa';
export const SUPPORTED: Language[] = ['en', 'fa'];

/** RTL languages in this app. */
export const RTL_LANGUAGES: Language[] = ['fa'];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    // React Native already escapes; avoid double-escaping.
    escapeValue: false,
  },
});

/** Detect the device language, falling back to English. */
export function detectDeviceLanguage(): Language {
  const tag = findBestLanguageTag(SUPPORTED)?.languageTag;
  return (tag as Language) ?? 'en';
}

/** Load the persisted language choice (or device language) at startup. */
export async function initLanguage(): Promise<Language> {
  let lang: Language | null = null;
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored === 'en' || stored === 'fa') {
      lang = stored;
    }
  } catch {
    // Ignore storage errors; fall through to device detection.
  }
  const resolved = lang ?? detectDeviceLanguage();
  await i18n.changeLanguage(resolved);
  return resolved;
}

/** Switch language and persist the choice. */
export async function setLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as Language);
}

export default i18n;
