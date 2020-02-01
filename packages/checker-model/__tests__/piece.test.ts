import { Piece, Faction } from '../src';

describe('piece', () => {
  it('create piece', () => {
    const piece = new Piece({ x: 8, y: 8 });
    expect(piece).not.toBeNull();
    expect(piece.getCoordinate()).toEqual({ x: 8, y: 8 });
    expect(piece.getFactionId()).toBeNull();

    const faction = new Faction(0).addPiece({ x: 8, y: 8 });
    const pieceByFaction = faction.getPieces()[0];
    expect(pieceByFaction.getFactionId()).toEqual(0);
  });

  it('piece status', () => {
    const piece = new Piece({ x: 8, y: 8 });
    expect(piece.getStatus()).toEqual('neutral');
    piece.moveTo({ x: 4, y: 0 });
    expect(piece.getStatus()).toEqual('neutral');

    const faction = new Faction(0).addPiece({ x: 8, y: 8 });
    const pieceByFaction = faction.getPieces()[0];
    expect(pieceByFaction.getStatus()).toEqual('neutral');
    pieceByFaction.moveTo({ x: 4, y: 0 });
    expect(pieceByFaction.getStatus()).toEqual('start');
    pieceByFaction.moveTo({ x: 12, y: 16 });
    expect(pieceByFaction.getStatus()).toEqual('goal');
    pieceByFaction.moveTo({ x: 8, y: 8 });
    expect(pieceByFaction.getStatus()).toEqual('neutral');
  });
});
