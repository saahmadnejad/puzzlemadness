import { en } from '../src/i18n/resources/en';
import { fa } from '../src/i18n/resources/fa';
import { toPersianDigits } from '../src/i18n/digits';
import { LANGUAGES, SUPPORTED_LANGUAGE_CODES } from '../src/i18n/languages';

type StringLeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${StringLeafPaths<T[K]>}`;
}[keyof T & string];

const flattenKeys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'string'
      ? [`${prefix}${k}`]
      : flattenKeys(v, `${prefix}${k}.`),
  );

describe('i18n resources', () => {
  test('fa has the same keys as en', () => {
    const enKeys = flattenKeys(en).sort();
    const faKeys = flattenKeys(fa).sort();
    expect(faKeys).toEqual(enKeys);
  });

  test('no translation is empty', () => {
    const checkEmpty = (obj: object): string[] =>
      Object.values(obj).flatMap(v =>
        typeof v === 'string' ? (v.trim() === '' ? ['empty'] : []) : checkEmpty(v),
      );
    expect(checkEmpty(fa)).toEqual([]);
  });
});

describe('language registry', () => {
  test('codes are unique and non-empty labels', () => {
    const codes = LANGUAGES.map(l => l.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const l of LANGUAGES) {
      expect(l.label.trim()).not.toBe('');
    }
  });

  test('supported codes mirror the registry', () => {
    expect(SUPPORTED_LANGUAGE_CODES).toEqual(LANGUAGES.map(l => l.code));
  });
});

describe('toPersianDigits', () => {
  test('converts latin digits', () => {
    expect(toPersianDigits('12:34')).toBe('۱۲:۳۴');
  });

  test('leaves non-digits untouched', () => {
    expect(toPersianDigits('Solved! 🎉')).toBe('Solved! 🎉');
  });

  test('converts zero and mixed text', () => {
    expect(toPersianDigits('0 mistakes')).toBe('۰ mistakes');
  });
});
