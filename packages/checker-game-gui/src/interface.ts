import { FactionIdentity, Coordinate, MoveStep } from 'checker-model';
import { AIDifficulty } from 'checker-ai';

export type AIPlayer = {
  factionId: FactionIdentity;
  difficulty: AIDifficulty;
};

export interface ICheckerGameGui {
  start(): boolean;

  //  game events
  onClick(coord: Coordinate): void;
  onGameStart(): void;
  onGameEnd(): void;
  onGameWin(factionId: FactionIdentity): void;
  onChessMove(steps: MoveStep[]): void;
}

export interface ICheckerGameGuiProps {
  canvasElement: HTMLCanvasElement;
  players: FactionIdentity[];
  myFactionId: FactionIdentity;
  aiPlayers: AIPlayer[];
}
