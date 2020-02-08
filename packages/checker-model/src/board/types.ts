import { FactionIdentity } from '../faction';

export type Coordinate = {
  x: number;
  y: number;
};

export type MoveStep = {
  from: Coordinate;
  to: Coordinate;
  piece: IPiece;
};

export type SlotCategory = 0 | 1 | 2 | 'unavailable' | 'neutral';

export type Slot = {
  /**
   * chess piece
   */
  piece: null | IPiece;

  /**
   * slot category, empty /  faction's start point / faction's end point
   */
  slotCategory: SlotCategory;
};

export interface IPiece {
  /**
   * move a piece
   */
  moveTo(coordinate: Coordinate): boolean;

  /**
   * get faction id
   */
  getFactionId(): FactionIdentity | null;

  /**
   * get status
   */
  getStatus(): 'neutral' | 'start' | 'goal';

  /**
   * get current coordinate
   */
  getCoordinate(): Coordinate;
}

export interface IBoard {
  /**
   * get availale position
   */
  getAvailableJumpPosition(coordinate: Coordinate): Coordinate[];

  /**
   * move chess
   */
  move(from: Coordinate, to: Coordinate): boolean;

  /**
   * rollback last moving
   */
  rollback(): boolean;

  /**
   * put chess
   */
  put(piece: IPiece): boolean;

  /**
   * get chess by coordinate
   */
  get(coordinate: Coordinate): IPiece | null;

  /**
   * reset board
   */
  reset(): IBoard;

  /**
   * get move actions
   */
  getActionList(): MoveStep[];

  /**
   * get slot matrix
   */
  getSlotMatrix(): Slot[][];
}
