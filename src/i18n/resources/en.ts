export const en = {
  settings: {
    title: 'Settings',
    language: 'Language',
    about: 'About',
    version: 'Version {{version}}',
  },
  home: {
    title: 'Sudoku Madness',
    subtitle: 'Daily puzzle, three difficulties, unlimited play',
    puzzles: {
      daily: { title: 'Daily Puzzle', subtitle: "Today's puzzle — same for everyone" },
      easy: { title: 'Easy', subtitle: 'More clues, fewer techniques needed' },
      medium: { title: 'Medium', subtitle: 'A balanced challenge' },
      hard: { title: 'Hard', subtitle: 'Fewest clues — bring your A-game' },
    },
  },
  game: {
    back: '‹ Back',
    new: 'New ⟳',
    time: 'Time',
    mistakes: 'Mistakes',
    solved: 'Solved! 🎉',
    playAgain: 'Play again',
    home: 'Home',
    notes: '✏️ Notes',
    erase: '⌫ Erase',
    dialog: {
      time: 'Time: {{value}}',
      mistakes: 'Mistakes: {{value}}',
    },
  },
};

export type Resources = typeof en;
