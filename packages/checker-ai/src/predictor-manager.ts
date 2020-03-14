import { IGameModel } from 'checker-model';
import { SimplePredictor } from './simple-predictor';
import { MultiStepPredictor } from './multi-step-predictor';
import { MinMaxPredictor } from './minmax-predictor';
import { IPredictor, AIDifficulty } from './types';

export class PredictorManager {
  private predictors: Map<AIDifficulty, IPredictor> = new Map();
  private model: IGameModel;

  constructor(model: IGameModel) {
    this.model = model;
  }

  get(difficulty: AIDifficulty): IPredictor {
    if (!this.predictors.has(difficulty)) {
      const Predictor =
        difficulty === 'simple' ? SimplePredictor : difficulty === 'normal' ? MultiStepPredictor : MinMaxPredictor;
      this.predictors.set(difficulty, new Predictor(this.model));
    }

    return this.predictors.get(difficulty) as IPredictor;
  }
}
