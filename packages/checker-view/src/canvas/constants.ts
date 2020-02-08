import { Coordinate, MATRIX_SIZE } from 'checker-model';
import { Scale } from './types';
import { Pallete } from './pallete';

export const COLOR_NEUTRAL = 0;
export const COLOR_SLOT_1 = 1;
export const COLOR_SLOT_2 = 2;
export const COLOR_SLOT_3 = 3;
export const COLOR_PIECE_1 = 4;
export const COLOR_PIECE_2 = 5;
export const COLOR_PIECE_3 = 6;
export const COLOR_PIECE_4 = 7;
export const COLOR_PIECE_5 = 8;
export const COLOR_PIECE_6 = 9;
export const COLOR_PIECE_OBSTACLE = 10;
export const COLOR_FOCUS = 11;
export const COLOR_MENTION = 12;
export const COLOR_CLEAR = 13;

export const COLOR_SCHEMA = {
  [COLOR_CLEAR]: 'White',
  [COLOR_NEUTRAL]: 'Black',
  [COLOR_SLOT_1]: 'Chartreuse',
  [COLOR_SLOT_2]: 'Coral',
  [COLOR_SLOT_3]: 'CornflowerBlue',
  [COLOR_PIECE_1]: 'Cyan',
  [COLOR_PIECE_2]: 'DarkKhaki',
  [COLOR_PIECE_3]: 'DarkOliveGreen',
  [COLOR_PIECE_4]: 'DarkOrchid',
  [COLOR_PIECE_5]: 'DarkSeaGreen',
  [COLOR_PIECE_6]: 'DeepPink',
  [COLOR_PIECE_OBSTACLE]: 'Gray',
  [COLOR_FOCUS]: 'YellowGreen',
  [COLOR_MENTION]: 'Plum',
};

export const DEFAULT_SCALE2D: Scale<Coordinate> = {
  leftTop: { x: 0, y: 0 },
  rightBottom: { x: MATRIX_SIZE - 1, y: MATRIX_SIZE - 1 },
};

export const DEFAULT_PALLETE = new Pallete();

export const OFFSET_COORDINATE = { x: 3, y: 1 };

export const LINE_WIDTH = 5;

export const COMPOSITION_TYPE = 'source-over';
