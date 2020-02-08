import { isEmpty } from 'lodash-es';
import { IFaction, FactionIdentity } from './types';
import { IPiece, Coordinate, Piece } from '../board';
import { FACTION_COORDINATES } from '../constants';
import { mirrorFactionId } from '../utils';

export class Faction implements IFaction {
  private id: FactionIdentity;

  private pieces: IPiece[] = [];

  constructor(id: number) {
    this.id = (id % 6) as FactionIdentity;
    this.reset();
  }

  reset(): IFaction {
    this.pieces = [];
    return this;
  }

  initPieces(coordinates?: Coordinate[]): IFaction {
    this.reset();
    const coords = isEmpty(coordinates) ? this.getStartCoordinates() : coordinates;
    (coords as Coordinate[]).forEach(coordinate => this.addPiece(coordinate));
    return this;
  }

  addPiece(coordinate: Coordinate): IFaction {
    this.pieces.push(new Piece(coordinate, this));
    return this;
  }

  checkWin(): boolean {
    if (!this.pieces.length) {
      return false;
    }
    return this.pieces.filter(piece => piece.getStatus() === 'goal').length === this.pieces.length;
  }

  getPieces(): IPiece[] {
    return this.pieces;
  }

  getId(): FactionIdentity {
    return this.id;
  }

  getStartCoordinates(): Coordinate[] {
    return FACTION_COORDINATES[this.id];
  }

  getGoalCoordinates(): Coordinate[] {
    return FACTION_COORDINATES[mirrorFactionId(this.id)];
  }

  isStartCoordinate(coordinate: Coordinate): boolean {
    const { x, y } = coordinate;
    return this.getStartCoordinates().find(item => item.x === x && item.y === y) !== undefined;
  }

  isGoalCoordinate(coordinate: Coordinate): boolean {
    const { x, y } = coordinate;
    return this.getGoalCoordinates().find(item => item.x === x && item.y === y) !== undefined;
  }
}
