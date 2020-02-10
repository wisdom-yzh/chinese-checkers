import { isEmpty, isEqual } from 'lodash-es';
import { GameModel, Coordinate, FactionIdentity, IPiece, MoveStep } from 'checker-model';
import { HTMLCanvas2d, CanvasEventHandler, CheckerView } from 'checker-view';
import { IPredictor, SimplePredictor } from 'checker-ai';
import { CheckerViewGui } from './checker-view-gui';

export class CheckerGameGui {
  private canvas: HTMLCanvas2d;
  private model?: GameModel;
  private view?: CheckerView<Coordinate, string>;
  private predictor?: IPredictor;

  private aiPlayers: FactionIdentity[] = [];

  private focus?: Coordinate;
  private mentions?: Coordinate[];

  private handler: CanvasEventHandler<Coordinate> = (coordinate: Coordinate) => {
    const model = this.model as GameModel;
    if (model.getStatus() === 'end' || this.aiPlayers.indexOf(model.getCurrentPlayer().faction.getId()) !== -1) {
      return;
    }

    if (!this.focus) {
      this.focusPiece(coordinate);
      return;
    }

    if (this.tryToMovePiece(coordinate)) {
      return this.updateState();
    }
  };

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new HTMLCanvas2d(canvasElement);
  }

  start(players: FactionIdentity[], aiPlayers: FactionIdentity[] = []): boolean {
    this.model = new GameModel(players);
    this.view = new CheckerViewGui(this.model.getBoard(), this.canvas);
    this.view.onClick(this.handler);

    this.aiPlayers = aiPlayers;
    if (!isEmpty(aiPlayers)) {
      this.predictor = new SimplePredictor(this.model);
    }

    if (!this.model.start()) {
      return false;
    }

    if (!this.view.render()) {
      return false;
    }

    window.alert('game start');
    return this.go();
  }

  private focusPiece(coord: Coordinate): boolean {
    const view = this.view as CheckerView<Coordinate, string>;
    const model = this.model as GameModel;

    if (!isEmpty(this.focus)) {
      if (isEqual(this.focus, coord)) {
        return true;
      }
      if (!view.setFocusStatus(this.focus as Coordinate, 'normal')) {
        return false;
      }
    }

    if (!view.setFocusStatus(coord, 'focus')) {
      return false;
    }
    this.focus = coord;

    if (!isEmpty(this.mentions)) {
      (this.mentions as Coordinate[]).forEach(mentionCoord => {
        view.setFocusStatus(mentionCoord, 'normal');
      });
    }

    const piece = model.getBoard().get(coord) as IPiece;
    if (piece !== null && piece.getFactionId() === model.getCurrentPlayer().faction.getId()) {
      this.mentions = model.getBoard().getAvailableJumpPosition(coord);

      this.mentions.forEach(mentionCoord => {
        view.setFocusStatus(mentionCoord, 'mention');
      });
    }

    return true;
  }

  private tryToMovePiece(coord: Coordinate): boolean {
    const mentions = this.mentions as Coordinate[];
    if (isEmpty(mentions) || mentions.find(mention => isEqual(mention, coord)) === undefined) {
      this.focusPiece(coord);
      return false;
    }

    const view = this.view as CheckerView<Coordinate, string>;
    const model = this.model as GameModel;
    model.getBoard().move(this.focus as Coordinate, coord);
    if (!view.updateProps(model.getBoard())) {
      return false;
    }

    this.focus = undefined;
    this.mentions = undefined;

    return view.render();
  }

  private go(): boolean {
    const model = this.model as GameModel;
    if (model.getStatus() === 'end') {
      window.alert('game end');
      return false;
    }

    const view = this.view as CheckerView<Coordinate, string>;
    const currentPlayer = model.getCurrentPlayer();
    const factionId = currentPlayer.faction.getId();
    if (this.aiPlayers.indexOf(factionId) !== -1) {
      setTimeout(() => {
        const { from, to } = (this.predictor as IPredictor).predict(factionId) as MoveStep;
        model.getBoard().move(from, to);
        view.updateProps(model.getBoard());
        view.render();
        this.updateState();
      }, 100);
    }

    return true;
  }

  private updateState(): boolean {
    const model = this.model as GameModel;

    if (model.getCurrentPlayer().faction.checkWin()) {
      window.alert(`${model.getCurrentPlayer().faction.getId()} wins`);
    }

    const gameStatus = model.updateStatus();
    if (gameStatus === 'end') {
      window.alert('game end');
      return true;
    }

    return this.go();
  }
}
