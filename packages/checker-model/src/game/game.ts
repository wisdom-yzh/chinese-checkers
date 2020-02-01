import { isEmpty } from 'lodash';
import { IGameModel, GameStatus, Player } from './types';
import { IBoard, ChessBoard, MoveStep } from '../board';
import { Faction, FactionIdentity, IFaction } from '../faction';

export class GameModel implements IGameModel {
  /**
   * game board
   */
  private board: IBoard = new ChessBoard([]);

  /**
   * player list
   */
  private players: Player[] = [];

  /**
   * current player
   */
  private currentPlayerIndex = 0;

  /**
   * total game status
   */
  private status: GameStatus = 'preparing';

  constructor(factionIdentities: FactionIdentity[]) {
    this.reset(factionIdentities);
  }

  reset(factionIdentities: FactionIdentity[]): IGameModel {
    this.players = factionIdentities.map<Player>(id => ({
      status: 'playing',
      faction: new Faction(id).initPieces(),
    }));
    this.board = new ChessBoard(this.players.map(player => player.faction));
    this.status = 'preparing';
    return this;
  }

  resetByFaction(faction: IFaction[]): IGameModel {
    this.players = faction.map<Player>(faction => ({
      status: 'playing',
      faction,
    }));
    this.board = new ChessBoard(this.players.map(player => player.faction));
    this.status = 'preparing';
    return this;
  }

  start(): boolean {
    this.players.forEach(player => this.updatePlayerStatus(player));
    if (this.status !== 'preparing' || isEmpty(this.players) || this.allPlayersEnding()) {
      return false;
    }
    this.status = 'running';
    return true;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  getBoard(): IBoard {
    return this.board;
  }

  updateStatus(): GameStatus {
    if (this.status !== 'running') {
      return this.status;
    }

    this.updatePlayerStatus();

    if (this.allPlayersEnding()) {
      return 'end';
    }

    this.cyclePlayer();
    return 'running';
  }

  rollbackByStep(step: number): boolean {
    const actionList = this.board.getActionList() as MoveStep[];
    if (this.status !== 'running' || isEmpty(actionList) || step < 0 || step > actionList.length) {
      return false;
    }

    for (let i = 0; i < step; i++) {
      this.board.rollback();
    }

    const lastFactionId = actionList[actionList.length - step].piece.getFactionId() as FactionIdentity;
    this.currentPlayerIndex = this.players.findIndex(player => player.faction.getId() === lastFactionId);
    this.players.forEach(player => this.updatePlayerStatus(player));
    return true;
  }

  getPlayerByFactionId(id: FactionIdentity): Player | undefined {
    return this.players.find(player => player.faction.getId() === id);
  }

  private cyclePlayer(): void {
    let nextPlayer: number;

    do {
      nextPlayer = (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.players[nextPlayer].status === 'win');

    this.currentPlayerIndex = nextPlayer;
  }

  private allPlayersEnding(): boolean {
    return this.players.find(player => player.status === 'playing') === undefined;
  }

  private updatePlayerStatus(player?: Player): void {
    if (typeof player === 'undefined') {
      player = this.players[this.currentPlayerIndex];
    }
    player.status = player.faction.checkWin() ? 'win' : 'playing';
  }
}
