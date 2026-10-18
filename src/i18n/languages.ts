export type Language = 'en' | 'fa';

export interface LanguageInfo {
  code: Language;
  /** Displayed in the language picker, in the language's own script. */
  label: string;
  rtl: boolean;
  /** Digit shapes used when rendering numbers. */
  digits: 'latin' | 'persian';
}

/**
 * Registry of supported languages. To add a language:
 *  1. add its code here,
 *  2. add a typed resource file in src/i18n/resources and register it
 *     in src/i18n/index.ts.
 */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', rtl: false, digits: 'latin' },
  { code: 'fa', label: 'فارسی', rtl: true, digits: 'persian' },
];

export const SUPPORTED_LANGUAGE_CODES: Language[] = LANGUAGES.map(l => l.code);

export function languageInfo(code: string): LanguageInfo {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
}

export function isRTL(code: string): boolean {
  return languageInfo(code).rtl;
}
