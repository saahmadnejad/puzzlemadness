export const en = {
  settings: {
    title: 'Settings',
    language: 'Language',
    about: 'About',
    version: 'Version {{version}}',
  },
  home: {
    title: 'Sudoku Madness',
    subtitle: 'Daily puzzles, three difficulties, unlimited play',
    games: 'Games',
  },
  games: {
    sudoku: {
      title: 'Sudoku',
      subtitle: 'Classic number puzzle',
      difficulties: {
        daily: { title: 'Daily Puzzle', subtitle: "Today's puzzle — same for everyone" },
        easy: { title: 'Easy', subtitle: 'More clues, fewer techniques needed' },
        medium: { title: 'Medium', subtitle: 'A balanced challenge' },
        hard: { title: 'Hard', subtitle: 'Fewest clues — bring your A-game' },
      },
    },
    maze: {
      title: 'Maze',
      subtitle: 'Find the way from start to finish',
      difficulties: {
        daily: { title: 'Daily Maze', subtitle: "Today's maze — same for everyone" },
        easy: { title: 'Easy', subtitle: 'A small grid to warm up' },
        medium: { title: 'Medium', subtitle: 'A bigger grid' },
        hard: { title: 'Hard', subtitle: 'A big grid — good luck!' },
      },
    },
    nonogram: {
      title: 'Nonogram',
      subtitle: 'Follow the numbers to reveal the hidden picture',
      difficulties: {
        daily: { title: 'Daily Nonogram', subtitle: "Today's picture — same for everyone" },
        easy: { title: 'Easy', subtitle: 'A 10×10 picture' },
        medium: { title: 'Medium', subtitle: 'A 15×15 picture' },
        hard: { title: 'Hard', subtitle: 'A 20×20 picture — a big one!' },
      },
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
    filled: 'Filled',
    dialog: {
      time: 'Time: {{value}}',
      mistakes: 'Mistakes: {{value}}',
    },
  },
};

export type Resources = typeof en;
