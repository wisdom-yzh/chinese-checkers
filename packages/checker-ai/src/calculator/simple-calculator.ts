import { MoveStep, IBoard, IFaction } from 'checker-model';
import { IScoreCalculator } from '../types';
import { stepDistance } from '../utils';

export class SimpleCalculator implements IScoreCalculator {
  private board?: IBoard;
  private faction?: IFaction;

  updateBoardAndFaction(board: IBoard, faction: IFaction): void {
    this.board = board;
    this.faction = faction;
  }

  getScore(step: MoveStep): number {
    if (this.faction?.checkWin()) {
      return +Infinity;
    }
    return stepDistance([(this.faction as IFaction).getGoalCoordinates()[0]], step.from, step.to);
  }
}
