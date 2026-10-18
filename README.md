# Sudoku Madness

A bare React Native (TypeScript) sudoku app inspired by [puzzlemadness.co.uk](https://puzzlemadness.co.uk/) — daily puzzle, three difficulties, fully offline.

## Features (v1)

- **Classic 9×9 sudoku** with Easy / Medium / Hard difficulties
- **Daily puzzle** — deterministic per date, same for every player (seeded PRNG)
- **On-device generator** — no backend; puzzles are generated locally with a uniqueness check
- **Core play** — cell/peer highlighting, pencil notes (auto-cleared from peers), erase, error highlighting, mistake counter, timer, solved dialog
- **i18n** — English and Farsi (فارسی) with a persisted in-app language switcher, RTL text alignment, Persian digits (۰–۹) everywhere numbers appear, and the Vazir font for both languages
- Unlimited "New game" per difficulty

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
  i18n/
    index.ts          # i18next setup, locale detection, persistence
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
