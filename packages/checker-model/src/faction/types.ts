import { Coordinate, IPiece } from '../board';

export type FactionIdentity = 0 | 1 | 2 | 3 | 4 | 5;

export interface IFaction {
  /**
   * get current faction id
   */
  getId(): FactionIdentity;

  /**
   * reset the faction
   */
  reset(): IFaction;

  /**
   * check whether the faction wins
   */
  checkWin(): boolean;

  /**
   * add a chess piece to faction
   */
  addPiece(coordinate: Coordinate): IFaction;

  /**
   * init pieces by faction
   */
  initPieces(coordinate?: Coordinate[]): IFaction;

  /**
   * get pieces
   */
  getPieces(): IPiece[];

  /**
   * get goal points
   */
  getStartCoordinates(): Coordinate[];

  /**
   * get start points
   */
  getGoalCoordinates(): Coordinate[];

  /**
   * check whether coordinate is the goal point
   */
  isStartCoordinate(coordinate: Coordinate): boolean;

  /**
   * check whether coordinate is the start point
   */
  isGoalCoordinate(coordinate: Coordinate): boolean;
}
