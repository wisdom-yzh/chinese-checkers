import { MoveStep, IBoard, IFaction, IPiece, Coordinate } from 'checker-model';
import { IScoreCalculator } from '../types';
import { stepDistance, minDistanceFromGoal } from '../utils';

export class InOutCalculator implements IScoreCalculator {
  private board?: IBoard;
  private faction?: IFaction;
  private emptyGoals: Coordinate[] = [];

  updateBoardAndFaction(board: IBoard, faction: IFaction): void {
    this.board = board;
    this.faction = faction;
    this.getEmptyGoals();
  }

  getScore(step: MoveStep): number {
    return this.isInnerPiece(step.from) ? this.getInnerPieceMaxStep(step) : this.getOuterPieceMaxStep(step);
  }

  private getInnerPieceMaxStep(step: MoveStep): number {
    return stepDistance([(this.faction as IFaction).getGoalCoordinates()[0]], step.from, step.to);
  }

  private getOuterPieceMaxStep(step: MoveStep): number {
    const { from, to } = step;
    let stepDist = stepDistance(this.emptyGoals, from, to);

    if (this.faction?.isGoalCoordinate(to)) {
      stepDist += 10 - minDistanceFromGoal(to, [this.faction?.getGoalCoordinates()[0]]);
    }
    return stepDist;
  }

  private isInnerPiece(coord: Coordinate): boolean {
    return this.faction?.isGoalCoordinate(coord) || false;
  }

  private getEmptyGoals(): Coordinate[] {
    const goals = this.faction?.getGoalCoordinates() || [];

    this.emptyGoals = goals.filter(goal => {
      const piece = this.board?.get(goal) as IPiece;
      return piece === null || piece.getFactionId() !== this.faction?.getId();
    });

    return this.emptyGoals;
  }
}
