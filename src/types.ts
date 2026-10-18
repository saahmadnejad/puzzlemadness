import { Difficulty } from './puzzles/generator';

export type RootStackParamList = {
  Home: undefined;
  Game: { difficulty: Difficulty };
  Settings: undefined;
};
