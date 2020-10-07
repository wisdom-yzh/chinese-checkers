import { FactionIdentity, MoveStep, IFaction, IBoard } from 'checker-model';

export interface IPredictor {
  predict(id: FactionIdentity): MoveStep | null;
}

export interface IScoreCalculator {
  updateBoardAndFaction(board: IBoard, faction: IFaction): void;
  getScore(step: MoveStep): number;
}

export type AIDifficulty = 'simple' | 'normal' | 'hard';

export type MovePrediction = {
  step: MoveStep | null;
  score: number;
};
