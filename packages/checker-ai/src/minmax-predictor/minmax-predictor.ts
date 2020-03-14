import { sample, isUndefined, isNull } from 'lodash-es';
import { IGameModel, FactionIdentity, IFaction, MoveStep, IBoard, Player, mirrorFactionId } from 'checker-model';
import { SimplePredictor } from '../simple-predictor';
import { stepDistance } from '../utils';
import { MinMaxTreeNode, createMinMaxTreeRoot, createMinMaxNodeByMovePrediction } from './minmax-tree-node';
import { MovePrediction } from '../types';

export class MinMaxPredictor extends SimplePredictor {
  private maxDepth: number;
  private faction?: IFaction;
  private mirrorFaction?: IFaction;

  constructor(model: IGameModel, maxDepth = 5) {
    super(model);
    this.maxDepth = maxDepth;
  }

  predict(id: FactionIdentity): MoveStep | null {
    const mirrorPlayer = this.getGameModel().getPlayerByFactionId(mirrorFactionId(id) as FactionIdentity) as Player;
    if (isUndefined(mirrorPlayer) || mirrorPlayer.status === 'win') {
      return super.predict(id);
    }

    this.faction = (this.getGameModel().getPlayerByFactionId(id) as Player).faction;
    this.mirrorFaction = mirrorPlayer.faction;
    return this.minmaxPredict();
  }

  private minmaxPredict(): MoveStep | null {
    const treeRoot = createMinMaxTreeRoot(this.getBoard());
    this.dfsPredict(0, treeRoot);
    return sample<MoveStep>(treeRoot.steps) as MoveStep;
  }

  private dfsPredict(depth: number, root: MinMaxTreeNode): void {
    const faction = this.getCurrentFaction(depth);

    if (depth === this.maxDepth) {
      root.score = root.boardScore;
      return;
    }

    const steps = this.generateStepsForBoard(root.board, faction);

    for (const step of steps) {
      const prediction = this.createPredictionFromStep(faction, step);
      if (isNull(prediction)) {
        continue;
      }

      const child = createMinMaxNodeByMovePrediction(root, prediction);
      this.dfsPredict(depth + 1, child);
      this.updateMinOrMaxScore(root, child, step);

      root.board.rollback();

      if (root.alpha > root.beta) {
        break;
      }
    }
  }

  private updateMinOrMaxScore(root: MinMaxTreeNode, child: MinMaxTreeNode, step: MoveStep): void {
    if (child.score === root.score) {
      root.steps.push(step);
    } else if (root.minOrMax === 'max' && child.score > root.score) {
      root.steps = [step];
      root.alpha = root.score = child.score;
    } else if (root.minOrMax === 'min' && child.score < root.score) {
      root.steps = [step];
      root.beta = root.score = child.score;
    }
  }

  private generateStepsForBoard(board: IBoard, faction: IFaction): MoveStep[] {
    const steps: MoveStep[] = [];

    faction.getPieces().forEach(piece => {
      const from = piece.getCoordinate();
      const goals = board.getAvailableJumpPosition(from);
      goals.forEach(to => {
        steps.push({ from, to, piece });
      });
    });
    return steps;
  }

  private getCurrentFaction(depth: number): IFaction {
    return (depth % 2 === 0 ? this.faction : this.mirrorFaction) as IFaction;
  }

  private createPredictionFromStep(faction: IFaction, step: MoveStep): MovePrediction | null {
    const { from, to } = step;
    const stepDist = stepDistance([faction.getGoalCoordinates()[0]], from, to);

    if (stepDist < -1) {
      return null;
    }

    let score = 0;
    if (faction === this.faction) {
      score = faction.checkWin() ? +Infinity : stepDist;
    }
    return { step, score };
  }
}
