import { FactionIdentity } from 'checker-model';

export interface ICreateRoomMessage {
  name: string;
  myFaction: FactionIdentity;
  factions: FactionIdentity[];
}

export interface IJoinRoomMessage {
  id: string;
  myFaction: FactionIdentity;
}
