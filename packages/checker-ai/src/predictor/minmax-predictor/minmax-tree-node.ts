import { IBoard, MoveStep } from 'checker-model';
import { MovePrediction } from '../../types';

export type MinMax = 'min' | 'max';

export type MinMaxTreeNode = {
  board: IBoard;
  boardScore: number;
  minOrMax: MinMax;
  alpha: number;
  beta: number;
  score: number;
  steps: MoveStep[];
  stepToWin: number;
};

export const createMinMaxTreeRoot = (board: IBoard): MinMaxTreeNode => ({
  board,
  boardScore: 0,
  minOrMax: 'max',
  alpha: -Infinity,
  beta: +Infinity,
  score: -Infinity,
  steps: [],
  stepToWin: +Infinity,
});

export const createMinMaxNodeByMovePrediction = (
  parent: MinMaxTreeNode,
  prediction: MovePrediction,
): MinMaxTreeNode => {
  const node: MinMaxTreeNode = {
    board: parent.board,
    boardScore: prediction.score === +Infinity ? +Infinity : parent.boardScore + prediction.score,
    minOrMax: parent.minOrMax === 'max' ? 'min' : 'max',
    alpha: parent.alpha,
    beta: parent.beta,
    score: 0,
    steps: [],
    stepToWin: +Infinity,
  };

  node.score = node.minOrMax === 'max' ? -Infinity : +Infinity;
  return node;
};
