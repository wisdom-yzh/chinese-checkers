import { Faction, FACTION_COORDINATES, mirrorFactionId } from '../src';

// eslint-disable-next-line
describe('faction', () => {
  it('create faction', () => {
    let faction = new Faction(0);
    expect(faction.getId()).toEqual(0);
    faction = new Faction(6);
    expect(faction.getId()).toEqual(0);
    faction = new Faction(8);
    expect(faction.getId()).toEqual(2);
  });

  it('start and goal pieces', () => {
    const faction = new Faction(0).initPieces();
    expect(faction.getStartCoordinates()).toEqual(FACTION_COORDINATES[faction.getId()]);
    expect(faction.getGoalCoordinates()).toEqual(FACTION_COORDINATES[mirrorFactionId(faction.getId())]);
    expect(faction.isStartCoordinate({ x: 0, y: 0 })).toBeFalsy();
    expect(faction.isGoalCoordinate({ x: 0, y: 0 })).toBeFalsy();
    expect(faction.isStartCoordinate({ x: 4, y: 0 })).toBeTruthy();
    expect(faction.isGoalCoordinate({ x: 12, y: 16 })).toBeTruthy();
    expect(faction.getPieces().map(piece => piece.getCoordinate())).toEqual(FACTION_COORDINATES[faction.getId()]);
  });

  it('check win', () => {
    const goalCoordinates = FACTION_COORDINATES[mirrorFactionId(0)];
    const faction = new Faction(0).initPieces(goalCoordinates);
    expect(faction.checkWin()).toBeTruthy();

    faction.reset();
    expect(faction.checkWin()).toBeFalsy();
  });
});
