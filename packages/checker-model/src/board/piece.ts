import { cloneDeep } from 'lodash-es';
import { IPiece, Coordinate } from './types';
import { checkBoardRange } from '../utils';
import { IFaction, FactionIdentity } from '../faction';

export class Piece implements IPiece {
  /**
   * piece status
   */
  private status: 'neutral' | 'start' | 'goal' = 'neutral';

  /**
   * location of board
   */
  private coordinate: Coordinate = { x: 0, y: 0 };

  /**
   * belongs to which faction
   */
  private faction?: IFaction;

  constructor(coordinate: Coordinate, faction?: IFaction) {
    if (!checkBoardRange(coordinate)) {
      throw new Error('out of board range');
    }
    this.faction = faction;
    this.coordinate.x = coordinate.x;
    this.coordinate.y = coordinate.y;
    this.updateStatus();
  }

  getFactionId(): FactionIdentity | null {
    return this.faction ? this.faction.getId() : null;
  }

  moveTo(coordinate: Coordinate): boolean {
    if (!checkBoardRange(coordinate)) {
      return false;
    }

    this.coordinate.x = coordinate.x;
    this.coordinate.y = coordinate.y;
    this.updateStatus();
    return true;
  }

  getStatus(): 'neutral' | 'start' | 'goal' {
    return this.status;
  }

  getCoordinate(): Coordinate {
    return cloneDeep(this.coordinate);
  }

  private updateStatus(): void {
    if (typeof this.faction === 'undefined') {
      this.status = 'neutral';
    } else if (this.faction.isGoalCoordinate(this.coordinate)) {
      this.status = 'goal';
    } else if (this.faction.isStartCoordinate(this.coordinate)) {
      this.status = 'start';
    } else {
      this.status = 'neutral';
    }
  }
}
