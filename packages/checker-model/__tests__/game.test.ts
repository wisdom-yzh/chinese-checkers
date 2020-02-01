import { GameModel, Faction, FACTION_COORDINATES } from '../src';

// eslint-disable-next-line
describe('game', () => {
  it('create GameModel', () => {
    const game = new GameModel([]);
    expect(game.getStatus()).toEqual('preparing');
    expect(game.updateStatus()).toEqual('preparing');
    expect(game.start()).toBeFalsy();

    game.reset([0]);
    expect(game.start()).toBeTruthy();
    expect(game.getCurrentPlayer()).toBe(game.getPlayerByFactionId(0));
    expect(game.getPlayerByFactionId(1)).toBeUndefined();

    const faction = new Faction(0).initPieces(FACTION_COORDINATES[3]);
    game.resetByFaction([faction]);
    expect(game.start()).toBeFalsy();
  });

  it('play game', () => {
    const game = new GameModel([0, 3]);
    game.start();
    game.getBoard().move({ x: 4, y: 3 }, { x: 5, y: 4 });
    game.updateStatus();
    expect(game.getCurrentPlayer().faction.getId()).toBe(3);
    game.getBoard().move({ x: 12, y: 13 }, { x: 11, y: 12 });
    game.updateStatus();
    expect(game.getCurrentPlayer().faction.getId()).toBe(0);
  });

  it('rollback', () => {
    const game = new GameModel([0, 1, 2, 3]);
    game.start();
    game.getBoard().move({ x: 4, y: 3 }, { x: 5, y: 4 });
    game.updateStatus();
    game.getBoard().move({ x: 3, y: 4 }, { x: 4, y: 4 });
    game.updateStatus();
    game.getBoard().move({ x: 7, y: 12 }, { x: 8, y: 12 });
    game.updateStatus();
    game.getBoard().move({ x: 12, y: 13 }, { x: 11, y: 12 });
    game.updateStatus();
    game.getBoard().move({ x: 4, y: 1 }, { x: 6, y: 5 });
    game.updateStatus();

    expect(game.getCurrentPlayer().faction.getId()).toBe(1);
    expect(game.rollbackByStep(6)).toBeFalsy();
    expect(game.rollbackByStep(3)).toBeTruthy();
    expect(game.getCurrentPlayer().faction.getId()).toBe(2);
    expect(game.getBoard().get({ x: 8, y: 12 })).toBeNull();
    expect(game.getBoard().get({ x: 11, y: 12 })).toBeNull();
    expect(game.getBoard().get({ x: 4, y: 4 })).not.toBeNull();
    expect(game.rollbackByStep(3)).toBeFalsy();
  });

  it('check winner', () => {
    const faction = new Faction(0).initPieces(FACTION_COORDINATES[3]);
    const game = new GameModel([]);
    faction.getPieces()[0].moveTo({ x: 8, y: 8 });
    game.resetByFaction([faction]);

    expect(game.start()).toBeTruthy();
    game.getBoard().move({ x: 8, y: 8 }, { x: 9, y: 13 });
    expect(game.updateStatus()).toEqual('end');
    expect(game.getCurrentPlayer().status).toEqual('win');
  });
});
