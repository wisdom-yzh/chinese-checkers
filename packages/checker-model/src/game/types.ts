import { IFaction, FactionIdentity } from '../faction';
import { IBoard } from '../board';

export type GameStatus = 'preparing' | 'running' | 'end';

export type PlayerStatus = 'playing' | 'win';

export type Player = {
  /**
   * current status of player
   */
  status: PlayerStatus;

  /**
   * player's faction properties
   */
  faction: IFaction;
};

export interface IGameModel {
  /**
   * reset and init the game
   */
  reset(factionIdentities: FactionIdentity[]): IGameModel;

  /**
   * reset by specialied faction
   */
  resetByFaction(factions: IFaction[]): IGameModel;

  /**
   * start the game
   */
  start(): boolean;

  /**
   * get current game status
   */
  getStatus(): GameStatus;

  /**
   * update current game status
   */
  updateStatus(): GameStatus;

  /**
   * rollback game status
   */
  rollbackByStep(step: number): boolean;

  /**
   * get current player
   */
  getCurrentPlayer(): Player;

  /**
   * get board
   */
  getBoard(): IBoard;

  /**
   * get player by faction id
   */
  getPlayerByFactionId(id: FactionIdentity): Player | undefined;
}
