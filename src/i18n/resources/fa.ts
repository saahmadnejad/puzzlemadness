import { Resources } from './en';

export const fa: Resources = {
  settings: {
    title: 'تنظیمات',
    language: 'زبان',
    about: 'درباره برنامه',
    version: 'نسخه {{version}}',
  },
  home: {
    title: 'دیوانه پازل',
    subtitle: 'پازل روزانه، سه سطح دشواری، بازی نامحدود',
    puzzles: {
      daily: {
        title: 'پازل روزانه',
        subtitle: 'پازل امروز — برای همه یکسان است',
      },
      easy: {
        title: 'آسان',
        subtitle: 'خانه‌های اولیه بیشتر، برای شروع‌کنندگان',
      },
      medium: {
        title: 'متوسط',
        subtitle: 'یک چالش متعادل',
      },
      hard: {
        title: 'سخت',
        subtitle: 'کمترین خانه اولیه — برای حرفه‌ای‌ها',
      },
    },
  },
  game: {
    back: 'بازگشت ‹',
    new: 'جدید ⟳',
    time: 'زمان',
    mistakes: 'اشتباهات',
    solved: 'حل شد! 🎉',
    playAgain: 'بازی دوباره',
    home: 'خانه',
    notes: '✏️ یادداشت',
    erase: '⌫ حذف',
    dialog: {
      time: 'زمان: {{value}}',
      mistakes: 'اشتباهات: {{value}}',
    },
  },
};
