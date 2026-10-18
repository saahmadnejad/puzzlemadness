# Sudoku Madness

A React Native (TypeScript) puzzle super app inspired by [puzzlemadness.co.uk](https://puzzlemadness.co.uk/) — fully offline, no backend. Games so far: **Sudoku**, **Maze** and **Nonogram**.

## Features (v1)

- **Super-app shell** — home lists games from a registry (`src/games/registry.ts`); each game has a difficulty picker with a daily option. Adding a game = registry entry + resources + screen
- **Sudoku** — Easy / Medium / Hard + daily puzzle, on-device generator with uniqueness check, pencil notes, error highlighting, mistake counter, timer
- **Maze** — Easy / Medium / Hard + daily maze, drag your finger to draw the path (backtracking supported), timer
- **Nonogram** — Easy (10×10) / Medium (15×15) / Hard (20×20) + daily, tap to cycle fill/cross, row & column clues that dim when completed, hidden-picture generator with a unique-solution solver
- **Daily puzzles** — deterministic per date, same for every player (seeded PRNG), no server needed
- **i18n** — English and Farsi (فارسی) driven by a language registry (code, native label, RTL, digit style), persisted language switcher in Settings, Persian digits (۰–۹), Vazir font

## Getting started

```bash
npm install
npx react-native run-android   # or run-ios on macOS
```

## Tests

```bash
npm test
```

## Project structure

```
src/
  games/
    registry.ts      # game list shown on the home screen
  i18n/
    index.ts          # i18next setup, locale detection, persistence
    languages.ts      # language registry (code, label, rtl, digit style)
    digits.ts         # Persian digit formatting helpers
    resources/        # en.ts, fa.ts (typed, key-parity tested)
  puzzles/
    rng.ts          # seeded PRNG (mulberry32) + helpers
    generator.ts    # solution solver, puzzle generator, daily seed
  state/
    gameReducer.ts  # pure game logic (select/input/notes/erase/solve)
    useTimer.ts     # elapsed-time hook
  components/
    Board.tsx       # 9×9 grid rendering
    NumberPad.tsx   # digits + notes toggle + erase
  screens/
    HomeScreen.tsx  # difficulty picker
    GameScreen.tsx  # game session + win dialog
  theme.ts
  types.ts
```

## How generation works

1. A full solution grid is built with randomized backtracking.
2. Clues are removed one at a time (in seeded random order); a removal is kept only if the puzzle still has a **unique solution** (checked with a count-limited MRV backtracker).
3. Difficulty is approximated by target clue count: easy ≈ 40, medium ≈ 33, hard ≈ 27.

The daily puzzle uses `seed = hash("puzzlemadness-daily-YYYY-MM-DD")`, so it's identical for everyone and requires no server.

## Roadmap ideas (matching the site)

- Sudoku variants (jigsaw, killer, X) reusing the same grid engine
- Difficulty based on solving techniques instead of clue count
- Streaks & stats (AsyncStorage)
- More puzzle types (nonograms, kakuro, futoshiki…)
