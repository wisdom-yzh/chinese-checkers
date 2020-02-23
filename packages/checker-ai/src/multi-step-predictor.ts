import { cloneDeep, sample, isEmpty, maxBy } from 'lodash-es';
import { IGameModel, FactionIdentity, IPiece, IFaction, MoveStep, IBoard, Coordinate, Player } from 'checker-model';
import { SimplePredictor } from './simple-predictor';
import { MovePrediction } from './types';
import { minDistanceFromGoal, stepDistance } from './utils';

export class MultiStepPredictor extends SimplePredictor {
  private maxDepth: number;

  constructor(model: IGameModel, maxDepth = 3) {
    super(model);
    this.maxDepth = maxDepth;
  }

  predict(id: FactionIdentity): MoveStep | null {
    const predictMoveSteps: MovePrediction[] = this.dfsGetMaxScoreStep(id, this.getGameModel(), 0);
    if (isEmpty(predictMoveSteps)) {
      return null;
    }
    console.log(predictMoveSteps);
    return (sample<MovePrediction>(predictMoveSteps) as MovePrediction).step as MoveStep;
  }

  private dfsGetMaxScoreStep(id: FactionIdentity, gameModel: IGameModel, currentDepth: number): MovePrediction[] {
    const { faction } = gameModel.getPlayerByFactionId(id) as Player;
    const predictions = this.getPredictionsOfEveryPiece(faction, gameModel.getBoard());
    const maxScore = this.getMaxScoreFromPredictions(predictions);

    if (
      currentDepth < this.maxDepth &&
      faction.getPieces().filter(piece => piece.getStatus() === 'goal').length < 6 &&
      maxScore < 6
    ) {
      predictions.forEach(prediction => {
        const { from, to } = prediction.step as MoveStep;
        const model = cloneDeep(gameModel);
        model.getBoard().move(from, to);
        prediction.score += this.getMaxScoreFromPredictions(this.dfsGetMaxScoreStep(id, model, currentDepth + 1));
      });
    }

    return this.getPredictionsOfMaxScore(predictions);
  }

  private getPredictionsOfEveryPiece(faction: IFaction, board: IBoard): MovePrediction[] {
    const goals = faction.getGoalCoordinates();
    const emptyGoals = goals.filter(goal => {
      const piece = board.get(goal) as IPiece;
      return piece === null || piece.getFactionId() !== faction.getId();
    });

    const { inner, outer } = this.groupPieceByGoal(faction);
    const predictions = this.insertOuterPiecePredictions(faction, board, emptyGoals, outer);
    return isEmpty(predictions) ? this.insertInnerPiecePredictions(faction, board, goals[0], inner) : predictions;
  }

  private getPredictionsOfMaxScore(predictions: MovePrediction[]): MovePrediction[] {
    if (isEmpty(predictions)) {
      return [];
    }
    const maxScore = this.getMaxScoreFromPredictions(predictions);
    return predictions.filter(predict => predict.score === maxScore);
  }

  private getMaxScoreFromPredictions(predictions: MovePrediction[]): number {
    if (isEmpty(predictions)) {
      return 0;
    }
    return (maxBy<MovePrediction>(predictions, 'score') as MovePrediction).score;
  }

  private insertOuterPiecePredictions(
    faction: IFaction,
    board: IBoard,
    goals: Coordinate[],
    pieces: IPiece[],
  ): MovePrediction[] {
    let predictions: MovePrediction[] = [];
    const countOfHomePiece = faction.getPieces().filter(piece => faction.isStartCoordinate(piece.getCoordinate()))
      .length;

    pieces.forEach(piece => {
      const predictionsOfCurrentPiece: MovePrediction[] = [];
      const from = piece.getCoordinate();
      board.getAvailableJumpPosition(from).forEach(to => {
        let stepDist = stepDistance(goals, from, to);
        if (faction.isGoalCoordinate(to)) {
          stepDist += 10 - minDistanceFromGoal(to, [faction.getGoalCoordinates()[0]]);
        }
        if (countOfHomePiece <= 3 && faction.isStartCoordinate(from)) {
          stepDist += 6;
        }
        predictionsOfCurrentPiece.push({
          score: stepDist,
          step: { from, to, piece },
        });
      });

      predictions = predictions.concat(this.getPredictionsOfMaxScore(predictionsOfCurrentPiece));
    });

    return predictions.filter(predict => predict.score > 0);
  }

  private insertInnerPiecePredictions(
    faction: IFaction,
    board: IBoard,
    goal: Coordinate,
    pieces: IPiece[],
  ): MovePrediction[] {
    const predictions: MovePrediction[] = [];

    pieces.forEach(piece => {
      const from = piece.getCoordinate();
      board.getAvailableJumpPosition(from).forEach(to => {
        const stepDist = stepDistance([goal], from, to);
        predictions.push({
          step: { from, to, piece },
          score: stepDist,
        });
      });
    });

    return predictions;
  }
}
