export type GameId = 'sudoku' | 'maze' | 'nonogram';

export interface GameInfo {
  id: GameId;
  /** Emoji used as the game icon. */
  emoji: string;
}

/**
 * Registry of games in the super app. To add a game:
 *  1. add its id here,
 *  2. add `games.<id>` resources in src/i18n/resources,
 *  3. register a picker target + game screen in App.tsx / types.ts.
 */
export const GAMES: GameInfo[] = [
  { id: 'sudoku', emoji: '🔢' },
  { id: 'maze', emoji: '🌀' },
  { id: 'nonogram', emoji: '🖼️' },
];
