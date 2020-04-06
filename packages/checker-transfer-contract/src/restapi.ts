import { FactionIdentity, Coordinate } from 'checker-model';
import { Request, Response } from './base';
import { RoomsMessage, RoomDetailMessage } from './message';

// create room
export const CREATE_ROOM = '/room/create';
export type CreateRoomBean = {
  name: string;
  myFaction: FactionIdentity;
  factions: FactionIdentity[];
};
export type CreateRoomRequest = Request<CreateRoomBean>;
export type CreateRoomId = { roomId: string };
export type CreateRoomResponse = Response<CreateRoomId>;

// list rooms
export const LIST_ROOMS_REQUEST = '/room/list';
export type ListRoomRequest = Request<{}>;
export type ListRoomResponse = Response<RoomsMessage>;

// join room
export const JOIN_ROOM_REQUEST = '/room/join';
export type JoinRoomBean = {
  roomId: string;
  myFaction: FactionIdentity;
};
export type JoinRoomRequest = Request<JoinRoomBean>;
export type JoinRoomResponse = Response<RoomDetailMessage>;

// leave room
export const LEAVE_ROOM = '/room/leave';
export type LeaveRoomRequest = Request<{}>;
export type LeaveRoomReponse = Response<{}>;

// room detail
export const ROOM_DETAIL = '/room/detail';
export type RoomDetailRequest = Request<CreateRoomId>;
export type RoomDetailResponse = Response<RoomDetailMessage>;

// prepare game
export const PREPARE_GAME = '/game/prepare';
export type PrepareGameRequest = Request<{}>;
export type PrepareGameResponse = Response<{}>;

// start game
export const START_GAME = '/game/start';
export type StartGameRequest = Request<{}>;
export type StartGameResponse = Response<{}>;

export const GAME_STATUS = '/game/status';
export type GameStatus = {};
export type GameStatusRequest = Request<{}>;
export type GameStatusResponse = Response<GameStatus>;

// move a chess
export const MOVE_CHESS = '/game/move';
export type MoveChessBean = {
  from: Coordinate;
  to: Coordinate;
};
export type MoveChessRequest = Request<MoveChessBean>;
export type MoveChessResponse = Response<{}>;
