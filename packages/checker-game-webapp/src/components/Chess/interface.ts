import { GameMode, Slot, ChessEvents } from '../../hooks';

export type ChessProps = ChessEvents & {
  mode: GameMode;
  slots: Slot[];
};
