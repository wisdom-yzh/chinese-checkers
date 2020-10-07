import { IGameModel } from 'checker-model';
import { SimplePredictor } from './simple-predictor';
import { MinMaxPredictor } from './minmax-predictor';
import { SimpleCalculator } from '../calculator';
import { IPredictor, AIDifficulty, IScoreCalculator } from '../types';

export class PredictorManager {
  private predictors: Map<AIDifficulty, IPredictor> = new Map();
  private calculator: IScoreCalculator;
  private model: IGameModel;

  constructor(model: IGameModel, calculator?: IScoreCalculator) {
    this.calculator = calculator || new SimpleCalculator();
    this.model = model;
    this.predictors.set('simple', new SimplePredictor(this.model, this.calculator));
    this.predictors.set('normal', new MinMaxPredictor(this.model, this.calculator, 3));
    this.predictors.set('hard', new MinMaxPredictor(this.model, this.calculator, 5));
  }

  get(difficulty: AIDifficulty): IPredictor {
    return this.predictors.get(difficulty) as IPredictor;
  }
}
