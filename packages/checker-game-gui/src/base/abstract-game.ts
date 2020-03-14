import { isEmpty, isEqual, isUndefined } from 'lodash-es';
import { GameModel, Coordinate, FactionIdentity, IPiece, MoveStep } from 'checker-model';
import { HTMLCanvas2d, CanvasEventHandler, CheckerView } from 'checker-view';
import { CheckerViewGui } from './checker-view-gui';
import { ICheckerGameGui, ICheckerGameGuiProps, AIPlayer } from '../interface';

export abstract class AbstractCheckerGameGui implements ICheckerGameGui {
  protected model: GameModel;

  private canvas: HTMLCanvas2d;
  private view: CheckerView<Coordinate, string>;

  protected myFactionId: FactionIdentity;
  protected aiPlayers: AIPlayer[];

  private focus?: Coordinate;
  private mentions?: Coordinate[];

  abstract onClick(coord: Coordinate): void;
  abstract onGameStart(): void;
  abstract onGameEnd(): void;
  abstract onGameWin(factionId: FactionIdentity): void;
  abstract onChessMove(steps: MoveStep[]): void;

  constructor(props: ICheckerGameGuiProps) {
    const { canvasElement, aiPlayers, players, myFactionId } = props;
    this.canvas = new HTMLCanvas2d(canvasElement);
    this.aiPlayers = aiPlayers;
    this.myFactionId = myFactionId;
    this.model = new GameModel(players);
    this.view = new CheckerViewGui(this.model.getBoard(), this.canvas);
    this.view.onClick(this.handler);
  }

  start(): boolean {
    if (!this.model.start()) {
      return false;
    }

    if (!this.view.render()) {
      return false;
    }

    this.onGameStart();
    this.go();
    return true;
  }

  private go(): void {
    // check whether current player wins
    if (this.isCurrentPlayerWins()) {
      this.onGameWin(this.model.getCurrentPlayer().faction.getId());
    }

    // check whether game ends
    if (this.model.getStatus() === 'end') {
      this.onGameEnd();
      return;
    }

    // check whether it's my turn
    if (this.isMyTurn()) {
      return;
    }

    this.moveByOthers()
      .then(moveStep => this.move(moveStep))
      .then(() => this.go());
  }

  private move(moveStep: MoveStep): boolean {
    const { from, to } = moveStep;

    // update checker model and checker view
    if (!this.model.getBoard().move(from, to) || !this.view.updateProps(this.model.getBoard()) || !this.view.render()) {
      return false;
    }

    this.onChessMove(this.model.getBoard().getActionList());
    this.model.updateStatus();
    return true;
  }

  protected moveByMyself(to: Coordinate): Promise<MoveStep> {
    const from = this.focus as Coordinate;
    this.focus = undefined;
    this.mentions = undefined;
    return Promise.resolve({ from, to, piece: this.model.getBoard().get(from) as IPiece });
  }

  protected abstract moveByOthers(): Promise<MoveStep>;

  protected isMyTurn(): boolean {
    return this.model.getCurrentPlayer().faction.getId() === this.myFactionId;
  }

  protected isCurrentPlayerWins(): boolean {
    return this.model.getCurrentPlayer().faction.checkWin();
  }

  private handler: CanvasEventHandler<Coordinate> = (coordinate: Coordinate) => {
    if (this.model.getStatus() !== 'running' || !this.isMyTurn()) {
      return;
    }

    this.onClick(coordinate);

    if (isUndefined(this.focus)) {
      this.setFocus(coordinate);
      return;
    }

    if (isEqual(this.focus, coordinate)) {
      return;
    }

    const mentions = this.mentions as Coordinate[];
    if (isEmpty(mentions) || mentions.find(mention => isEqual(mention, coordinate)) === undefined) {
      this.removeFocusAndMentions() && this.setFocus(coordinate);
      return;
    }

    return this.moveByMyself(coordinate)
      .then(moveStep => this.move(moveStep))
      .then(() => this.go());
  };

  private setFocus(coord: Coordinate): boolean {
    const view = this.view as CheckerView<Coordinate, string>;
    const model = this.model as GameModel;

    // adding focus
    if (!view.setFocusStatus(coord, 'focus')) {
      return false;
    }
    this.focus = coord;

    // adding mentions
    const piece = model.getBoard().get(coord) as IPiece;
    if (piece !== null && piece.getFactionId() === model.getCurrentPlayer().faction.getId()) {
      this.mentions = model.getBoard().getAvailableJumpPosition(coord);
      this.mentions.forEach(mentionCoord => {
        view.setFocusStatus(mentionCoord, 'mention');
      });
    }

    return true;
  }

  private removeFocusAndMentions(): boolean {
    const view = this.view as CheckerView<Coordinate, string>;

    let status = view.setFocusStatus(this.focus as Coordinate, 'normal');
    this.focus = undefined;

    if (!isEmpty(this.mentions)) {
      (this.mentions as Coordinate[]).forEach(mentionCoord => {
        status = status && view.setFocusStatus(mentionCoord, 'normal');
      });
      this.mentions = undefined;
    }

    return status;
  }
}
