import { FactionIdentity, MoveStep, IGameModel, IFaction, IBoard } from 'checker-model';
import { IPredictor, IScoreCalculator } from '../types';

export abstract class AbstractPredictor implements IPredictor {
  private gameModel: IGameModel;
  private calculator: IScoreCalculator;

  constructor(model: IGameModel, calculator: IScoreCalculator) {
    this.gameModel = model;
    this.calculator = calculator;
  }

  getCalculator(): IScoreCalculator {
    return this.calculator;
  }

  getGameModel(): IGameModel {
    return this.gameModel;
  }

  getBoard(): IBoard {
    return this.gameModel.getBoard();
  }

  getFactionById(id: FactionIdentity): IFaction | undefined {
    const player = this.gameModel.getPlayerByFactionId(id);
    if (typeof player === 'undefined') {
      return undefined;
    }
    return player.faction;
  }

  abstract predict(id: FactionIdentity): MoveStep | null;
}
