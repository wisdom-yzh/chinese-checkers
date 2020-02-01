import { Coordinate } from './board';

export const LEFT_TOP: Coordinate = { x: 0, y: 0 };
export const RIGHT_BOTTOM: Coordinate = { x: 16, y: 16 };
export const MATRIX_SIZE = 17;
export const FACTION_SIZE = 6;

export const VALID_COORDINATES = [
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [0, 12],
  [1, 12],
  [2, 12],
  [3, 12],
  [4, 12],
  [4, 13],
  [4, 14],
  [4, 15],
  [4, 16],
  [9, 12],
  [10, 12],
  [11, 12],
  [12, 12],
];

export const FACTION_COORDINATES: Coordinate[][] = [
  [
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 4, y: 3 },
    { x: 5, y: 3 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
  ],
  [
    { x: 0, y: 4 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 6 },
    { x: 3, y: 6 },
    { x: 3, y: 7 },
  ],
  [
    { x: 4, y: 9 },
    { x: 4, y: 10 },
    { x: 4, y: 11 },
    { x: 4, y: 12 },
    { x: 5, y: 10 },
    { x: 5, y: 11 },
    { x: 5, y: 12 },
    { x: 6, y: 11 },
    { x: 6, y: 12 },
    { x: 7, y: 12 },
  ],
  [
    { x: 9, y: 13 },
    { x: 10, y: 13 },
    { x: 11, y: 13 },
    { x: 12, y: 13 },
    { x: 10, y: 14 },
    { x: 11, y: 14 },
    { x: 12, y: 14 },
    { x: 11, y: 15 },
    { x: 12, y: 15 },
    { x: 12, y: 16 },
  ],
  [
    { x: 13, y: 12 },
    { x: 14, y: 12 },
    { x: 15, y: 12 },
    { x: 16, y: 12 },
    { x: 13, y: 11 },
    { x: 14, y: 11 },
    { x: 15, y: 11 },
    { x: 13, y: 10 },
    { x: 14, y: 10 },
    { x: 13, y: 9 },
  ],
  [
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 11, y: 4 },
    { x: 12, y: 4 },
    { x: 10, y: 5 },
    { x: 11, y: 5 },
    { x: 12, y: 5 },
    { x: 11, y: 6 },
    { x: 12, y: 6 },
    { x: 12, y: 7 },
  ],
];

export const MOVE_DIRECTIONS: Coordinate[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];