import { EventEmitter } from 'events';
import { isUndefined } from 'util';
import { Socket } from 'socket.io';
import { FactionIdentity } from 'checker-model';
import {
  ICreateRoomMessage,
  IJoinRoomMessage,
  IListRoomsMessage,
  IRoomDetailMessage,
  ClientStatus,
  IGameStatusMessage,
} from 'checker-transfer-contract';
import { IClient, IRoom } from '../interface';
import { Room } from './room';

export class Client extends EventEmitter implements IClient {
  private id: string;
  private socket: Socket;
  private room?: IRoom;
  private factionIdentity?: FactionIdentity;
  private status: ClientStatus;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.id = this.socket.id;
    this.status = ClientStatus.Free;
    this.init();
  }

  private init(): void {
    this.socket.on('create', () => this.onCreateRoom);
    this.socket.on('join', () => this.onJoinRoom);
    this.socket.on('start', () => this.onStartGame);
    this.socket.on('prepare', () => this.onPrepareGame);
    this.socket.on('disconnect', () => this.emit('disconnect', this.id));

    process.nextTick(() => this.emit('connect', this));
  }

  isMaster(): boolean {
    if (isUndefined(this.room)) {
      return false;
    }

    return this === this.room.getMaster();
  }

  getStatus(): ClientStatus {
    return this.status;
  }

  getId(): string {
    return this.id;
  }

  getRoom(): IRoom | undefined {
    return this.room;
  }

  setRoom(room?: IRoom): void {
    this.room = room;
    this.status = ClientStatus.Free;
  }

  getMyFactionIdentity(): FactionIdentity | undefined {
    return this.factionIdentity;
  }

  sendListRoomsMessage(rooms: IListRoomsMessage): void {
    this.socket.emit('rooms', rooms);
  }

  sendRoomDetailMessage(detail: IRoomDetailMessage): void {
    this.socket.emit('detail', detail);
  }

  sendGameStatusMessage(game: IGameStatusMessage): void {
    this.socket.emit('game', game);
  }

  private onCreateRoom = (req: ICreateRoomMessage): void => {
    const room = new Room(req.name, this, req.myFaction, req.factions);
    this.factionIdentity = req.myFaction;
    this.emit('create', this.id, room);
  };

  private onJoinRoom = (req: IJoinRoomMessage): void => {
    if (this.room) {
      return;
    }
    this.factionIdentity = req.myFaction;
    this.emit('join', req.id, req.myFaction);
  };

  private onLeaveRoom = (): void => {
    this.emit('leave', this.id, this.room);
  };

  private onPrepareGame = (): void => {
    this.status = ClientStatus.Preparing;
  };

  private onStartGame = (): void => {
    if (!this.isMaster()) {
      return;
    }

    (this.room as IRoom).start();
  };
}
