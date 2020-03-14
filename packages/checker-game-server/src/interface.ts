import { FactionIdentity, IGameModel } from 'checker-model';
import { IListRoomsMessage, IRoomDetailMessage, IGameStatusMessage, ClientStatus } from 'checker-transfer-contract';

export interface IClient {
  getId(): string;

  isMaster(): boolean;

  getRoom(): IRoom | undefined;

  setRoom(room?: IRoom): void;

  getMyFactionIdentity(): FactionIdentity | undefined;

  getStatus(): ClientStatus;

  sendListRoomsMessage(rooms: IListRoomsMessage): void;

  sendRoomDetailMessage(detail: IRoomDetailMessage): void;

  sendGameStatusMessage(game: IGameStatusMessage): void;
}

export interface IRoom {
  getId(): string;

  getName(): string;

  isPlaying(): boolean;

  getFactions(): FactionIdentity[];

  getGameModel(): IGameModel;

  getMaster(): IClient;

  getClients(): Record<FactionIdentity, IClient>;

  addClient(factionIdentity: FactionIdentity, client: IClient): boolean;

  removeClient(factionIdentity: FactionIdentity): boolean;

  start(): boolean;
}
