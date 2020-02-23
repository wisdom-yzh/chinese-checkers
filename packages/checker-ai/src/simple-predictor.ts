import { isEmpty } from 'lodash-es';
import { FactionIdentity, MoveStep, IGameModel, IFaction, Coordinate, IPiece } from 'checker-model';
import { AbstractPredictor } from './abstract-predictor';
import { MovePrediction } from './types';
import { minDistanceFromGoal, stepDistance } from './utils';

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
    maxPrediction = this.getOuterPieceMaxStep(faction, emptyGoals, outer, maxPrediction);
    maxPrediction = this.getInnerPieceMaxStep(goals[0], inner, maxPrediction);

    return maxPrediction.step;
  }

  protected groupPieceByGoal(faction: IFaction): { inner: IPiece[]; outer: IPiece[] } {
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

  private getInnerPieceMaxStep(goal: Coordinate, pieces: IPiece[], initial: MovePrediction): MovePrediction {
    const board = this.getBoard();

    pieces.forEach(piece => {
      const from = piece.getCoordinate();
      board.getAvailableJumpPosition(from).forEach(to => {
        const stepDist = stepDistance([goal], from, to);
        if (initial.step === null || stepDist > initial.score) {
          initial.step = { from, to, piece };
          initial.score = stepDist;
        }
      });
    });

    return initial;
  }

  private getOuterPieceMaxStep(
    faction: IFaction,
    goals: Coordinate[],
    pieces: IPiece[],
    initial: MovePrediction,
  ): MovePrediction {
    const board = this.getBoard();

    pieces.forEach(piece => {
      const from = piece.getCoordinate();
      board.getAvailableJumpPosition(from).forEach(to => {
        let stepDist = stepDistance(goals, from, to);

        if (faction.isGoalCoordinate(to)) {
          stepDist += 10 - minDistanceFromGoal(to, [faction.getGoalCoordinates()[0]]);
        }
        if (initial.step === null || stepDist > initial.score) {
          initial.step = { from, to, piece };
          initial.score = stepDist;
        }
      });
    });

    return initial;
  }
}
