import { GameMode, Slot, ChessEvents } from '../../hooks';

export * from './SingleChessGame';
export * from './NetChessGame';

export type ChessProps = ChessEvents & {
  mode: GameMode;
  slots: Slot[];
  socket?: SocketIOClient.Socket;
};
