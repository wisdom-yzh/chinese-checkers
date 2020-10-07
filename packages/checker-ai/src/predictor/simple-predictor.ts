import { isEmpty, sample } from 'lodash-es';
import { FactionIdentity, MoveStep, IGameModel, IFaction } from 'checker-model';
import { AbstractPredictor } from './abstract-predictor';
import { IScoreCalculator } from '../types';
import { generateStepsForBoard } from '../utils';

export class SimplePredictor extends AbstractPredictor {
  constructor(model: IGameModel, calculator: IScoreCalculator) {
    super(model, calculator);
  }

  predict(id: FactionIdentity): MoveStep | null {
    const faction = this.getFactionById(id) as IFaction;
    if (isEmpty(faction)) {
      return null;
    }

    this.getCalculator().updateBoardAndFaction(this.getBoard(), faction);

    const steps = generateStepsForBoard(this.getBoard(), faction);
    let maxSteps: MoveStep[] = [];
    let maxScore = -1000;

    steps.forEach(step => {
      const score = this.getCalculator().getScore(step);
      if (score > maxScore) {
        maxScore = score;
        maxSteps = [step];
      } else if (score === maxScore) {
        maxSteps.push(step);
      }
    });

    return sample<MoveStep>(maxSteps) as MoveStep;
  }
}
