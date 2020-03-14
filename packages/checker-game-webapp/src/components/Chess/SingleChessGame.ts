import { FactionIdentity, MoveStep, Coordinate } from 'checker-model';
import { SinglePlayerCheckerGameGui, ICheckerGameGuiProps, AIPlayer } from 'checker-game-gui/lib';
import { ChessProps } from './interface';
import { ChessEvents } from '../../hooks';

const convert = (canvas: HTMLCanvasElement, chessProps: ChessProps): ICheckerGameGuiProps => {
  const players: FactionIdentity[] = [];
  const aiPlayers: AIPlayer[] = [];
  let myFactionId: FactionIdentity = 0;

  chessProps.slots.forEach((slot, index) => {
    const slotType = slot.slotType;
    if (slotType === 'empty') {
      return;
    }
    if (slotType === 'myself') {
      myFactionId = index as FactionIdentity;
    } else {
      // ai
      aiPlayers.push({
        factionId: index as FactionIdentity,
        difficulty: slot.aiLevel || 'simple',
      });
    }
    players.push(index as FactionIdentity);
  });

  const props: ICheckerGameGuiProps = {
    canvasElement: canvas,
    players,
    aiPlayers,
    myFactionId,
  };

  return props;
};

export class SingleChessGame extends SinglePlayerCheckerGameGui {
  private events: ChessEvents;

  constructor(canvas: HTMLCanvasElement, props: ChessProps) {
    super(convert(canvas, props));
    this.events = {
      onChessMove: props.onChessMove,
      onClick: props.onClick,
      onGameEnd: props.onGameEnd,
      onGameStart: props.onGameStart,
      onGameWin: props.onGameWin,
    };
  }

  onClick(coord: Coordinate): void {
    this.events.onClick(coord);
  }

  onGameStart(): void {
    this.events.onGameStart();
  }

  onGameEnd(): void {
    this.events.onGameEnd();
  }

  onGameWin(factionId: FactionIdentity): void {
    this.events.onGameWin(factionId);
  }

  onChessMove(steps: MoveStep[]): void {
    this.events.onChessMove(steps);
  }
}
