import { GameId } from './games/registry';
import { Difficulty } from './puzzles/generator';
import { MazeDifficulty } from './puzzles/maze';
import { NonogramDifficulty } from './puzzles/nonogram';

export type { GameId };

export type RootStackParamList = {
  Home: undefined;
  GamePicker: { game: GameId };
  Game: { difficulty: Difficulty };
  MazeGame: { difficulty: MazeDifficulty };
  NonogramGame: { difficulty: NonogramDifficulty };
  Settings: undefined;
};
