import { cloneDeep } from 'lodash';
import { IBoard, Slot, Coordinate, MoveStep, SlotCategory, IPiece } from './types';
import { IFaction } from '../faction';
import { MATRIX_SIZE, FACTION_SIZE, FACTION_COORDINATES, MOVE_DIRECTIONS } from '../constants';
import { checkBoardRange } from '../utils';

export class ChessBoard implements IBoard {
  /**
   * board storage
   */
  private slots: Slot[][] = [];

  /**
   * all players
   */
  private factions: IFaction[] = [];

  /**
   * move actions
   */
  private actions: MoveStep[] = [];

  constructor(factions: IFaction[]) {
    this.factions = factions;
    this.reset();
  }

  reset(): IBoard {
    this.actions = [];
    this.initBoard();
    this.initFactionPieces();
    return this;
  }

  move(from: Coordinate, to: Coordinate): boolean {
    if (this.slots[from.y][from.x].piece === null || this.slots[to.y][to.x].piece !== null) {
      return false;
    }
    const piece = this.get(from) as IPiece;
    if (!piece.moveTo(to)) {
      return false;
    }

    this.slots[from.y][from.x].piece = null;
    this.slots[to.y][to.x].piece = piece;
    this.actions.push({ from, to, piece });
    return true;
  }

  rollback(): boolean {
    if (!this.actions.length) {
      return false;
    }

    const { from, to, piece } = this.actions.pop() as MoveStep;
    piece.moveTo(from);
    this.slots[to.y][to.x].piece = null;
    this.slots[from.y][from.x].piece = piece;
    return true;
  }

  put(piece: IPiece): boolean {
    const coordinate = piece.getCoordinate();
    const { x, y } = coordinate;
    if (!checkBoardRange(coordinate) || this.slots[y][x].piece !== null) {
      return false;
    }

    this.slots[y][x].piece = piece;
    return true;
  }

  get(coordinate: Coordinate): IPiece | null {
    if (!checkBoardRange(coordinate)) {
      return null;
    }
    return this.slots[coordinate.y][coordinate.x].piece;
  }

  getActionList(): MoveStep[] {
    return cloneDeep(this.actions);
  }

  getSlotMatrix(): Slot[][] {
    return cloneDeep(this.slots);
  }

  getAvailableJumpPosition(coordinate: Coordinate): Coordinate[] {
    if (!checkBoardRange(coordinate)) {
      return [];
    }

    return [...this.searchNeighbourPosition(coordinate), ...this.bfsSearchJumpPosition(coordinate)];
  }

  private initBoard(): void {
    this.slots = [];

    for (let y = 0; y < MATRIX_SIZE; y++) {
      const row: Slot[] = [];
      for (let x = 0; x < MATRIX_SIZE; x++) {
        row.push({
          piece: null,
          slotCategory: checkBoardRange({ x, y }) ? 'neutral' : 'unavailable',
        });
      }
      this.slots.push(row);
    }

    FACTION_COORDINATES.forEach((coordinates, index) => {
      index = index % (FACTION_SIZE / 2);
      (coordinates as Coordinate[]).forEach(coordinate => {
        const { x, y } = coordinate;
        this.slots[y][x].slotCategory = index as SlotCategory;
      });
    });
  }

  private initFactionPieces(): void {
    this.factions.forEach(faction => {
      faction.getPieces().forEach(piece => this.put(piece));
    });
  }

  private searchNeighbourPosition(coordinate: Coordinate): Coordinate[] {
    const neighbours: Coordinate[] = [];
    const { x, y } = coordinate;

    MOVE_DIRECTIONS.forEach(d => {
      const neighbour = { x: x + d.x, y: y + d.y };
      if (checkBoardRange(neighbour) && this.get(neighbour) === null) {
        neighbours.push(neighbour);
      }
    });

    return neighbours;
  }

  private bfsSearchJumpPosition(coordinate: Coordinate): Coordinate[] {
    const q: Coordinate[] = [coordinate];
    let head = 0;

    while (head < q.length) {
      const front = q[head++];

      this.wanderAround(front).forEach(coord => {
        if (q.find(c => c.x === coord.x && c.y === coord.y) === undefined) {
          q.push(coord);
        }
      });
    }

    return q.slice(1);
  }

  private wanderAround(coordinate: Coordinate): Coordinate[] {
    const around: Coordinate[] = [];

    MOVE_DIRECTIONS.forEach(d => {
      const { x, y } = coordinate;
      const neighbour = { x: x + d.x, y: y + d.y };
      const neighbour2 = { x: x + d.x * 2, y: y + d.y * 2 };

      if (this.get(neighbour) !== null && checkBoardRange(neighbour2) && this.get(neighbour2) === null) {
        around.push(neighbour2);
      }
    });

    return around;
  }
}
