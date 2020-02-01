import { checkBoardRange, ChessBoard, Piece, Faction, Coordinate } from '../src';

// eslint-disable-next-line
describe('board', () => {
  it('valid range', () => {
    expect(checkBoardRange({ x: 0, y: -1 })).toBeFalsy();
    expect(checkBoardRange({ x: -1, y: 0 })).toBeFalsy();
    expect(checkBoardRange({ x: 20, y: 0 })).toBeFalsy();
    expect(checkBoardRange({ x: 20, y: 20 })).toBeFalsy();
    expect(checkBoardRange({ x: 0, y: 0 })).toBeFalsy();
    expect(checkBoardRange({ x: 16, y: 16 })).toBeFalsy();
    expect(checkBoardRange({ x: 4, y: 4 })).toBeTruthy();
  });

  it('empty board', () => {
    const board = new ChessBoard([]);
    expect(board.getActionList().length).toEqual(0);

    const mat = board.getSlotMatrix();
    expect(mat[0][0].slotCategory).toEqual('unavailable');
    expect(mat[16][16].slotCategory).toEqual('unavailable');
    expect(mat[4][4].slotCategory).toEqual('neutral');
    expect(mat[0][4].slotCategory).toEqual(0);
    expect(mat[4][0].slotCategory).toEqual(1);
    expect(mat[12][4].slotCategory).toEqual(2);
    expect(mat[16][12].slotCategory).toEqual(0);
    expect(mat[12][16].slotCategory).toEqual(1);
    expect(mat[4][12].slotCategory).toEqual(2);
  });

  it('put neutral chess', () => {
    const board = new ChessBoard([]);
    expect(board.put(new Piece({ x: 4, y: 0 }))).toBeTruthy();
    expect(board.put(new Piece({ x: 4, y: 0 }))).toBeFalsy();

    const mat = board.getSlotMatrix();
    expect(mat[0][4].piece).not.toBeNull();
  });

  it('move neutral chess', () => {
    const board = new ChessBoard([]);
    board.put(new Piece({ x: 4, y: 0 }));
    board.put(new Piece({ x: 12, y: 16 }));

    expect(board.get({ x: 4, y: 0 })).not.toBeNull();
    expect(board.move({ x: 4, y: 0 }, { x: 5, y: 0 })).toBeFalsy();
    expect(board.move({ x: 4, y: 0 }, { x: 8, y: 8 })).toBeTruthy();
    expect(board.move({ x: 4, y: 0 }, { x: 8, y: 8 })).toBeFalsy();
    expect(board.get({ x: 4, y: 0 })).toBeNull();

    expect(board.move({ x: 12, y: 16 }, { x: 8, y: 8 })).toBeFalsy();
    expect(board.get({ x: 8, y: 8 })).not.toBeNull();

    const piece = board.get({ x: 8, y: 8 }) as Piece;
    expect(piece.getCoordinate()).toEqual({ x: 8, y: 8 });

    expect(board.getActionList()).toEqual([{ from: { x: 4, y: 0 }, to: { x: 8, y: 8 }, piece }]);
  });

  it('rollback', () => {
    const board = new ChessBoard([]);
    board.put(new Piece({ x: 4, y: 0 }));

    expect(board.rollback()).toBeFalsy();
    expect(board.move({ x: 4, y: 0 }, { x: 8, y: 8 })).toBeTruthy();
    expect(board.get({ x: 4, y: 0 })).toBeNull();
    expect(board.get({ x: 8, y: 8 })).not.toBeNull();
    expect(board.getActionList().length).toEqual(1);
    expect(board.move({ x: 8, y: 8 }, { x: 9, y: 9 })).toBeTruthy();
    expect(board.getActionList().length).toEqual(2);
    expect(board.get({ x: 9, y: 9 })).not.toBeNull();
    expect(board.rollback());
    expect(board.get({ x: 8, y: 8 })).not.toBeNull();
    expect(board.rollback());
    expect(board.get({ x: 8, y: 8 })).toBeNull();
    expect(board.get({ x: 4, y: 0 })).not.toBeNull();
  });

  it('init faction chesses', () => {
    const faction = new Faction(0).initPieces();
    const board = new ChessBoard([faction]);

    expect(board.get({ x: 4, y: 0 })).not.toBeNull();
    expect(board.get({ x: 4, y: 1 })).not.toBeNull();

    faction.reset().addPiece({ x: 8, y: 8 });
    board.reset();

    expect(board.get({ x: 4, y: 0 })).toBeNull();
    expect(board.get({ x: 8, y: 8 })).not.toBeNull();
  });

  it('get available jump position', () => {
    const sortFn = (a: Coordinate, b: Coordinate): number => a.x * 17 + a.y - (b.x * 17 + b.y);
    const board = new ChessBoard([]);

    expect(board.getAvailableJumpPosition({ x: 100, y: 100 }).sort(sortFn)).toEqual([]);
    expect(board.getAvailableJumpPosition({ x: 4, y: 0 }).sort(sortFn)).toEqual([
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ]);
    expect(board.getAvailableJumpPosition({ x: 8, y: 8 }).sort(sortFn)).toEqual([
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 7 },
      { x: 8, y: 9 },
      { x: 9, y: 8 },
      { x: 9, y: 9 },
    ]);

    board.put(new Piece({ x: 4, y: 1 }));
    board.put(new Piece({ x: 5, y: 1 }));
    expect(board.getAvailableJumpPosition({ x: 4, y: 0 }).sort(sortFn)).toEqual([
      { x: 4, y: 2 },
      { x: 6, y: 2 },
    ]);

    board.put(new Piece({ x: 4, y: 2 }));
    board.put(new Piece({ x: 6, y: 2 }));
    expect(board.getAvailableJumpPosition({ x: 4, y: 0 }).sort(sortFn)).toEqual([]);

    board.reset();
    board.put(new Piece({ x: 4, y: 1 }));
    board.put(new Piece({ x: 5, y: 1 }));
    board.put(new Piece({ x: 5, y: 3 }));
    board.put(new Piece({ x: 6, y: 3 }));
    board.put(new Piece({ x: 4, y: 4 }));
    board.put(new Piece({ x: 8, y: 4 }));
    expect(board.getAvailableJumpPosition({ x: 5, y: 2 }).sort(sortFn)).toEqual([
      { x: 3, y: 4 },
      { x: 4, y: 2 },
      { x: 5, y: 4 },
      { x: 6, y: 2 },
      { x: 7, y: 4 },
      { x: 9, y: 4 },
    ]);
  });
});
