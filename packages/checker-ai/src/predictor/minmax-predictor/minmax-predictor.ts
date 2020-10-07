import { sample, isUndefined, isNull } from 'lodash-es';
import { IGameModel, FactionIdentity, IFaction, MoveStep, Player, mirrorFactionId } from 'checker-model';
import { SimplePredictor } from '../simple-predictor';
import { generateStepsForBoard } from '../../utils';
import { MinMaxTreeNode, createMinMaxTreeRoot, createMinMaxNodeByMovePrediction } from './minmax-tree-node';
import { MovePrediction, IScoreCalculator } from '../../types';

export class MinMaxPredictor extends SimplePredictor {
  private maxDepth: number;
  private faction?: IFaction;
  private mirrorFaction?: IFaction;

  constructor(model: IGameModel, calculator: IScoreCalculator, maxDepth = 5) {
    super(model, calculator);
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
    if (depth === this.maxDepth) {
      root.score = root.boardScore;
      return;
    }

    const faction = this.getCurrentFaction(depth);
    const steps = generateStepsForBoard(root.board, faction);
    this.getCalculator().updateBoardAndFaction(root.board, faction);

    for (const step of steps) {
      root.board.move(step.from, step.to);

      const prediction = this.createPredictionFromStep(faction, step);
      if (isNull(prediction)) {
        root.board.rollback();
        continue;
      }

      const child = createMinMaxNodeByMovePrediction(root, prediction);
      if (prediction.score !== +Infinity) {
        this.dfsPredict(depth + 1, child);
      } else {
        child.stepToWin = depth;
      }

      this.updateMinOrMaxScore(root, child, step);
      root.board.rollback();

      if (root.alpha > root.beta) {
        break;
      }
    }
  }

  private updateMinOrMaxScore(root: MinMaxTreeNode, child: MinMaxTreeNode, step: MoveStep): void {
    // checking min steps to win
    if (child.stepToWin !== +Infinity) {
      if (root.stepToWin > child.stepToWin) {
        root.stepToWin = child.stepToWin;
        root.steps = [step];
      }
      return;
    }

    // checking max/min score
    if (root.stepToWin === +Infinity) {
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
  }

  private getCurrentFaction(depth: number): IFaction {
    return (depth % 2 === 0 ? this.faction : this.mirrorFaction) as IFaction;
  }

  private createPredictionFromStep(faction: IFaction, step: MoveStep): MovePrediction | null {
    const score = faction === this.faction ? this.getCalculator().getScore(step) : 0;
    if (score < -1) {
      return null;
    }
    return { step, score };
  }
}
