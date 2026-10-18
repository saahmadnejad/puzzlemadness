import { useTranslation } from 'react-i18next';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert Latin digits in a string to Persian digits. */
export function toPersianDigits(input: string): string {
  return input.replace(/[0-9]/g, d => FA_DIGITS[Number(d)]);
}

/**
 * Returns a formatter that localizes digits for the active language:
 * Persian digits for Farsi, Latin digits for English.
 */
export function useDigitFormatter(): (value: string | number) => string {
  const { i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  return (value: string | number): string =>
    isFa ? toPersianDigits(String(value)) : String(value);
}

/** Text direction for the active language. */
export function useWritingDirection(): 'ltr' | 'rtl' {
  const { i18n } = useTranslation();
  return i18n.language === 'fa' ? 'rtl' : 'ltr';
}
