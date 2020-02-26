import { isEmpty, isEqual } from 'lodash-es';
import { GameModel, Coordinate, FactionIdentity, IPiece, MoveStep } from 'checker-model';
import { HTMLCanvas2d, CanvasEventHandler, CheckerView } from 'checker-view';
import { IPredictor, MinMaxPredictor as Predictor } from 'checker-ai';
import { CheckerViewGui } from './checker-view-gui';

export class CheckerGameGui {
  private canvas: HTMLCanvas2d;
  private model?: GameModel;
  private view?: CheckerView<Coordinate, string>;
  private predictor?: IPredictor;
  private currentPredictor?: IPredictor;

  private aiPlayers: FactionIdentity[] = [];

  private focus?: Coordinate;
  private mentions?: Coordinate[];

  private handler: CanvasEventHandler<Coordinate> = (coordinate: Coordinate) => {
    const model = this.model as GameModel;
    if (model.getStatus() === 'end' || this.aiPlayers.indexOf(model.getCurrentPlayer().faction.getId()) !== -1) {
      return;
    }

    if (!this.focus) {
      return this.setFocus(coordinate);
    }

    if (isEqual(this.focus, coordinate)) {
      return true;
    }

    const mentions = this.mentions as Coordinate[];
    if (isEmpty(mentions) || mentions.find(mention => isEqual(mention, coordinate)) === undefined) {
      return this.removeFocusAndMentions() && this.setFocus(coordinate);
    }

    return this.moveByPlayer(coordinate);
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
      this.predictor = new Predictor(this.model);
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

  private go(): boolean {
    const model = this.model as GameModel;
    if (model.getStatus() === 'end') {
      window.alert('game end');
      return false;
    }

    const currentPlayer = model.getCurrentPlayer();
    const factionId = currentPlayer.faction.getId();
    if (this.aiPlayers.indexOf(factionId) !== -1) {
      this.moveByAIPlayer(factionId);
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

  private moveByPlayer(coord: Coordinate): boolean {
    const from = this.focus as Coordinate;

    this.focus = undefined;
    this.mentions = undefined;

    return this.movePieceAndRender(from, coord);
  }

  private moveByAIPlayer(factionId: FactionIdentity, timeout = 1000): void {
    setTimeout(() => {
      const { from, to } = (this.predictor as IPredictor).predict(factionId) as MoveStep;
      this.movePieceAndRender(from, to);
    }, timeout);
  }

  private movePieceAndRender(from: Coordinate, to: Coordinate): boolean {
    const model = this.model as GameModel;
    const view = this.view as CheckerView<Coordinate, string>;

    if (!model.getBoard().move(from, to) || !view.updateProps(model.getBoard()) || !view.render()) {
      return false;
    }

    return this.updateState();
  }
}
