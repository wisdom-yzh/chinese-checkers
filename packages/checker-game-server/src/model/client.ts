import { isUndefined } from 'util';
import { Socket } from 'socket.io';
import { FactionIdentity } from 'checker-model';
import { ClientStatus, SYNC_CLIENT, SyncClient, SYNC_SERVER_ROOMS, RoomsMessage } from 'checker-transfer-contract';
import { Room, Rooms } from './room';

export class Client {
  private id: string;
  private socket: Socket;
  private room?: Room;
  private factionIdentity?: FactionIdentity;
  private status: ClientStatus;

  constructor(socket: Socket) {
    this.socket = socket;
    this.id = this.socket.id;
    this.status = ClientStatus.Free;
    this.syncClientMessage();
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

  setStatus(status: ClientStatus): void {
    this.status = status;
  }

  getId(): string {
    return this.id;
  }

  getRoom(): Room | undefined {
    return this.room;
  }

  setRoom(room?: Room, factionIdentity?: FactionIdentity): void {
    this.room = room;
    this.factionIdentity = factionIdentity;
    this.status = ClientStatus.Free;
  }

  getMyFactionIdentity(): FactionIdentity | undefined {
    return this.factionIdentity;
  }

  setMyFactionIdentity(identity: FactionIdentity | undefined): void {
    this.factionIdentity = identity;
  }

  prepare(): boolean {
    if (this.status === ClientStatus.Free) {
      this.status = ClientStatus.Preparing;
      return true;
    }
    return false;
  }

  syncClientMessage(): void {
    this.socket.emit(SYNC_CLIENT, { id: this.socket.id } as SyncClient);
  }

  sendMessage<T>(msg: string, data: T): void {
    this.socket.emit(msg, data);
  }
}

export class Clients {
  private static clients: Record<string, Client> = {};

  static addClient(socket: Socket): Client {
    const id = socket.id;

    if (this.clients[id]) {
      return this.clients[id];
    }

    this.clients[id] = new Client(socket);
    socket.on('disconnect', () => this.removeClient(socket.id));
    return this.clients[id];
  }

  static removeClient(id: string): boolean {
    if (!this.clients[id]) {
      return false;
    }

    const client = this.clients[id];
    const room = client.getRoom();
    if (room) {
      const faction = client.getMyFactionIdentity() as FactionIdentity;
      room.removeClient(faction);
      const otherClients = Object.values(room.getClients());
      if (otherClients.length) {
        room.boardcastRoomDetails();
      } else {
        Rooms.removeRoom(room.getId());
      }

      this.broadcastRooms();
    }

    delete this.clients[id];
    return true;
  }

  static getClient(id: string): Client | undefined {
    return this.clients[id];
  }

  static getAllClients(): Client[] {
    return Object.values(this.clients);
  }

  static broadcast<T>(msg: string, data: T): void {
    this.getAllClients().forEach(client => client.sendMessage<T>(msg, data));
  }

  static broadcastRooms(): void {
    const rooms = Rooms.getRoomsMessage();
    this.broadcast<RoomsMessage>(SYNC_SERVER_ROOMS, rooms);
  }
}
