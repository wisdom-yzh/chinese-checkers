import { useState } from 'react';
import { FactionIdentity, MoveStep, Coordinate, GameStatus } from 'checker-model';

export type ChessEvents = {
  onClick(coord: Coordinate): void;
  onGameStart(): void;
  onGameEnd(): void;
  onGameWin(factionId: FactionIdentity): void;
  onChessMove(steps: MoveStep[]): void;
};

export interface IGameStatus {
  status: GameStatus;
  mention: string;
  actions: MoveStep[];
}

// eslint-disable-next-line
export const useGameStatus = (): IGameStatus & ChessEvents => {
  const [status, setStatus] = useState<GameStatus>('preparing');
  const [mention, setMention] = useState<string>('Ready');
  const [actions, setActions] = useState<MoveStep[]>([]);

  const onClick = (coordinate: Coordinate): void => {
    setMention(`You have clicked on (${coordinate.x}, ${coordinate.y})`);
  };

  const onGameStart = (): void => {
    setStatus('running');
    setMention('Game Start~');
  };

  const onGameEnd = (): void => {
    setStatus('end');
    setMention('Game Over~');
  };

  const onGameWin = (factionIdentity: FactionIdentity): void => {
    setMention(`Player ${factionIdentity} has reached the goal!`);
  };

  const onChessMove = (steps: MoveStep[]): void => {
    const moveStep = steps[steps.length - 1];
    const faction = moveStep.piece.getFactionId();
    const { from, to } = moveStep;
    const mention = `Player ${faction}: (${from.x}, ${from.y}) -> (${to.x}, ${to.y})`;

    setMention(mention);
    setActions(steps);
  };

  return {
    status,
    mention,
    actions,
    onChessMove,
    onClick,
    onGameEnd,
    onGameStart,
    onGameWin,
  };
};
