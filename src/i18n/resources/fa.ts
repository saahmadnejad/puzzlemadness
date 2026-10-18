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
    subtitle: 'پازل‌های روزانه، سه سطح دشواری، بازی نامحدود',
    games: 'بازی‌ها',
  },
  games: {
    sudoku: {
      title: 'سودوکو',
      subtitle: 'پازل اعداد کلاسیک',
      difficulties: {
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
    maze: {
      title: 'هزارتو',
      subtitle: 'راهی از شروع تا پایان پیدا کن',
      difficulties: {
        daily: {
          title: 'هزارتوی روزانه',
          subtitle: 'هزارتوی امروز — برای همه یکسان است',
        },
        easy: {
          title: 'آسان',
          subtitle: 'شبکه کوچک برای گرم کردن',
        },
        medium: {
          title: 'متوسط',
          subtitle: 'شبکه بزرگ‌تر',
        },
        hard: {
          title: 'سخت',
          subtitle: 'شبکه خیلی بزرگ — موفق باشی!',
        },
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
