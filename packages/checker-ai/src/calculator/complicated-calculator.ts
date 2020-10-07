import { MoveStep, IBoard, IFaction } from 'checker-model';
import { IScoreCalculator } from '../types';

export class ComplicatedCalculator implements IScoreCalculator {
  private board?: IBoard;
  private faction?: IFaction;

  updateBoardAndFaction(board: IBoard, faction: IFaction): void {
    this.board = board;
    this.faction = faction;
  }

  getScore(step: MoveStep): number {
    return 0;
  }
}
