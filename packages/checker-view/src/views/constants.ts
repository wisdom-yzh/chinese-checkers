import { SlotCategory, FactionIdentity } from 'checker-model';
import {
  COLOR_NEUTRAL,
  COLOR_SLOT_1,
  COLOR_SLOT_2,
  COLOR_SLOT_3,
  COLOR_PIECE_1,
  COLOR_PIECE_2,
  COLOR_PIECE_3,
  COLOR_PIECE_4,
  COLOR_PIECE_5,
  COLOR_PIECE_6,
  COLOR_FOCUS,
  COLOR_MENTION,
} from '../canvas/constants';
import { FocusStatus } from './types';

export const R_MAX = 18;
export const R_FOCUS = 15;
export const R_SLOT = 12;
export const R_PIECE = 9;

export const SLOT_COLOR_DICT: Record<SlotCategory, number> = {
  unavailable: -1,
  neutral: COLOR_NEUTRAL,
  0: COLOR_SLOT_1,
  1: COLOR_SLOT_2,
  2: COLOR_SLOT_3,
};

export const STATUS_COLOR_DICT: Record<FocusStatus, number> = {
  normal: -1,
  focus: COLOR_FOCUS,
  mention: COLOR_MENTION,
};

export const PIECE_COLOR_DICT: Record<FactionIdentity, number> = {
  0: COLOR_PIECE_1,
  1: COLOR_PIECE_2,
  2: COLOR_PIECE_3,
  3: COLOR_PIECE_4,
  4: COLOR_PIECE_5,
  5: COLOR_PIECE_6,
};
