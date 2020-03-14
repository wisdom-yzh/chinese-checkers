import { FactionIdentity, MoveStep } from 'checker-model';

export interface IPredictor {
  predict(id: FactionIdentity): MoveStep | null;
}

export type AIDifficulty = 'simple' | 'normal' | 'hard';

export type MovePrediction = {
  step: MoveStep | null;
  score: number;
};
