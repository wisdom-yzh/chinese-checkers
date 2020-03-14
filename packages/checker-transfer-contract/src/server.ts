import { FactionIdentity, MoveStep } from 'checker-model';

export enum ClientStatus {
  Free = 0,
  Preparing = 1,
  Gaming = 2,
}

export interface IRoomBasicInfo {
  id: string;
  name: string;
  freeFactions: FactionIdentity[];
}

export interface IListRoomsMessage {
  rooms: IRoomBasicInfo[];
}

export interface IPlayer {
  id: string;
  status: ClientStatus;
  isMaster: boolean;
}

export interface IRoomDetailMessage {
  players: Record<FactionIdentity, IPlayer>;
  isProcessing: boolean;
}

export interface IGameStatusMessage {
  current: FactionIdentity;
  step: MoveStep;
}
