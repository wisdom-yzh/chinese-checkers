import { FactionIdentity, MoveStep, GameModel, IFaction, IBoard } from 'checker-model';
import { IPredictor } from './types';

export abstract class AbstractPredictor implements IPredictor {
  private gameModel: GameModel;

  constructor(model: GameModel) {
    this.gameModel = model;
  }

  getGameModel(): GameModel {
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
