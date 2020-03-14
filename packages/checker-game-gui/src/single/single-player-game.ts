import { isUndefined } from 'lodash-es';
import { MoveStep } from 'checker-model';
import { PredictorManager } from 'checker-ai';
import { AbstractCheckerGameGui } from '../base';
import { ICheckerGameGuiProps } from '../interface';

export abstract class SinglePlayerCheckerGameGui extends AbstractCheckerGameGui {
  private predictors: PredictorManager;

  constructor(props: ICheckerGameGuiProps) {
    super(props);
    this.predictors = new PredictorManager(this.model);
  }

  protected moveByOthers(): Promise<MoveStep> {
    const factionId = this.model.getCurrentPlayer().faction.getId();
    const currentAiPlayer = this.aiPlayers.find(ai => ai.factionId === factionId);
    const difficulty = isUndefined(currentAiPlayer) ? 'simple' : currentAiPlayer.difficulty;
    const predictor = this.predictors.get(difficulty);

    return new Promise(resolve => setTimeout(() => resolve(predictor.predict(factionId) as MoveStep), 500));
  }
}
