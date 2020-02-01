import { Coordinate } from './board';
import { VALID_COORDINATES, FACTION_SIZE } from './constants';

export const checkBoardRange = (coordinate: Coordinate): boolean => {
  const { x, y } = coordinate;
  const min = 0;
  const max = VALID_COORDINATES.length - 1;

  if (x < min || x > max || y < min || y > max) {
    return false;
  }

  const [leftValidX, rightValidX] = VALID_COORDINATES[y];
  return x >= leftValidX && x <= rightValidX;
};

export const mirrorFactionId = (id: number): number => (id + 3) % FACTION_SIZE;
