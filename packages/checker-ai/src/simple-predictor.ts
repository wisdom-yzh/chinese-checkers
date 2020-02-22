import { isEmpty } from 'lodash-es';
import { FactionIdentity, MoveStep, IGameModel, IFaction, Coordinate, IPiece } from 'checker-model';
import { AbstractPredictor } from './abstract-predictor';
import { MovePrediction } from './types';

const dist = (a: Coordinate, b: Coordinate): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export class SimplePredictor extends AbstractPredictor {
  constructor(model: IGameModel) {
    super(model);
  }

  predict(id: FactionIdentity): MoveStep | null {
    const faction = this.getFactionById(id) as IFaction;
    if (isEmpty(faction)) {
      return null;
    }

    const { inner, outer } = this.groupPieceByGoal(faction);
    const goals = faction.getGoalCoordinates();
    const emptyGoals = goals.filter(goal => {
      const piece = this.getBoard().get(goal) as IPiece;
      return piece === null || piece.getFactionId() !== id;
    });

    let maxPrediction: MovePrediction = { score: -1000, step: null };
    maxPrediction = this.getPieceMaxStep(emptyGoals, outer, maxPrediction);
    maxPrediction = this.getPieceMaxStep([goals[0]], inner, maxPrediction);

    return maxPrediction.step;
  }

  private groupPieceByGoal(faction: IFaction): { inner: IPiece[]; outer: IPiece[] } {
    const inner: IPiece[] = [],
      outer: IPiece[] = [];

    faction.getPieces().forEach(piece => {
      if (piece.getStatus() === 'goal') {
        inner.push(piece);
      } else {
        outer.push(piece);
      }
    });

    return { inner, outer };
  }

  private getPieceMaxStep(goals: Coordinate[], pieces: IPiece[], initial: MovePrediction): MovePrediction {
    const board = this.getBoard();

    pieces.forEach(piece => {
      const from = piece.getCoordinate();
      board.getAvailableJumpPosition(from).forEach(to => {
        const stepDistance = this.stepDistance(goals, from, to);
        if (initial.step === null || stepDistance > initial.score) {
          initial.step = {
            from,
            to,
            piece,
          };
          initial.score = stepDistance;
        }
      });
    });

    return initial;
  }

  private stepDistance(goals: Coordinate[], from: Coordinate, to: Coordinate): number {
    return this.minDistanceFromGoal(from, goals) - this.minDistanceFromGoal(to, goals);
  }

  private minDistanceFromGoal(point: Coordinate, goals: Coordinate[]): number {
    let minDist = 0xff;

    goals.forEach(goal => {
      minDist = Math.min(minDist, dist(goal, point));
    });

    return minDist;
  }
}
