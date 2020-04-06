import { FactionIdentity, Coordinate } from 'checker-model';

export const SYNC_CLIENT = 'client';
export type SyncClient = {
  id: string;
};

export const SYNC_SERVER_ROOMS = 'rooms';
export type RoomPreview = {
  id: string;
  name: string;
  freeFactions: FactionIdentity[];
};
export type RoomsMessage = {
  rooms: RoomPreview[];
};

export const SYNC_ROOM_DETAIL = 'detail';
export enum ClientStatus {
  Free = 0,
  Preparing = 1,
  Gaming = 2,
}
export interface IPlayer {
  id: string;
  status: ClientStatus;
  isMaster: boolean;
}
export type RoomDetailMessage = {
  players: Record<FactionIdentity, IPlayer>;
  isProcessing: boolean;
};

export const SYNC_GAME = 'game';
export type GameStatusMessage = {
  current: FactionIdentity;
  from: Coordinate;
  to: Coordinate;
};
