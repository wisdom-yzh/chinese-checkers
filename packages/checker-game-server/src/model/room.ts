import { isUndefined } from 'util';
import { v4 as uuid } from 'uuid';
import { FactionIdentity, IGameModel, GameModel, Coordinate } from 'checker-model';
import {
  RoomsMessage,
  RoomDetailMessage,
  IPlayer,
  SYNC_ROOM_DETAIL,
  ClientStatus,
  GameStatusMessage,
  SYNC_GAME,
} from 'checker-transfer-contract';
import { Client } from './client';

export class Room {
  private id: string;
  private name: string;
  private gameModel: IGameModel;
  private master: Client;
  private clients: Record<FactionIdentity, Client>;
  private factions: FactionIdentity[];

  constructor(name: string, master: Client, masterFactionIdentity: FactionIdentity, factions: FactionIdentity[]) {
    this.id = uuid();
    this.name = name;
    this.master = master;
    this.factions = factions;
    this.gameModel = new GameModel(factions);
    this.clients = { [masterFactionIdentity]: master } as Record<FactionIdentity, Client>;
    this.master.setRoom(this, masterFactionIdentity);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  isPlaying(): boolean {
    return this.gameModel.getStatus() === 'running';
  }

  getFactions(): FactionIdentity[] {
    return this.factions;
  }

  getFreeFactions(): FactionIdentity[] {
    return this.factions.filter(factionIdentity => !this.clients[factionIdentity]);
  }

  getGameModel(): IGameModel {
    return this.gameModel;
  }

  getMaster(): Client {
    return this.master;
  }

  getClients(): Record<FactionIdentity, Client> {
    return this.clients;
  }

  addClient(factionIdentity: FactionIdentity, client: Client): boolean {
    if (!this.getFreeFactions().includes(factionIdentity)) {
      return false;
    }

    if (!isUndefined(this.clients[factionIdentity]) || !isUndefined(client.getRoom())) {
      return false;
    }

    if (this.factions.indexOf(factionIdentity) === -1) {
      return false;
    }

    this.clients[factionIdentity] = client;
    client.setRoom(this, factionIdentity);
    return true;
  }

  removeClient(factionIdentity: FactionIdentity): boolean {
    if (isUndefined(factionIdentity)) {
      return false;
    }

    if (this.master.getMyFactionIdentity() === factionIdentity) {
      const clientKeys = Object.keys(this.clients);
      this.master = this.clients[clientKeys[0]];
    }

    this.clients[factionIdentity].setRoom();
    delete this.clients[factionIdentity];
    return true;
  }

  getRoomDetailMessage(): RoomDetailMessage {
    const players: Record<FactionIdentity, IPlayer> = {} as Record<FactionIdentity, IPlayer>;
    const clients = this.getClients();
    for (const factionIdentity in clients) {
      const client = clients[factionIdentity];
      players[factionIdentity] = {
        id: client.getId(),
        status: client.getStatus(),
        isMaster: client.isMaster(),
      };
    }

    return {
      isProcessing: this.isPlaying(),
      players,
    };
  }

  boardcastRoomDetails(): void {
    const clients = this.getClients();
    const roomDetailMessage = this.getRoomDetailMessage();

    Object.keys(clients).forEach(key => {
      clients[key].sendMessage<RoomDetailMessage>(SYNC_ROOM_DETAIL, roomDetailMessage);
    });
  }

  boardcastGameStatus(from: Coordinate, to: Coordinate): void {
    const clients = this.getClients();
    Object.keys(clients).forEach(key => {
      clients[key].sendMessage<GameStatusMessage>(SYNC_GAME, {
        current: this.gameModel.getCurrentPlayer().faction.getId(),
        from,
        to,
      } as GameStatusMessage);
    });
  }

  start(): boolean {
    if (this.isPlaying()) {
      return false;
    }

    const clients = Object.values(this.clients);
    if (!clients.every(client => client.isMaster() || client.getStatus() === ClientStatus.Preparing)) {
      return false;
    }

    this.gameModel.reset(Object.keys(this.clients).map(Number) as FactionIdentity[]);
    if (!this.gameModel.start()) {
      return false;
    }

    clients.forEach(client => client.setStatus(ClientStatus.Gaming));
    return true;
  }
}

export class Rooms {
  private static rooms: Record<string, Room> = {};

  static createRoom(
    name: string,
    master: Client,
    masterFactionIdentity: FactionIdentity,
    factions: FactionIdentity[],
  ): Room {
    const room = new Room(name, master, masterFactionIdentity, factions);
    this.rooms[room.getId()] = room;
    return room;
  }

  static removeRoom(id: string): boolean {
    if (this.rooms[id]) {
      delete this.rooms[id];
      return true;
    }

    return false;
  }

  static getRoom(id: string): Room | undefined {
    return this.rooms[id];
  }

  static getRooms(): Room[] {
    return Object.values(this.rooms);
  }

  static getFreeRooms(): Room[] {
    return Object.values(this.rooms).filter(room => !room.isPlaying());
  }

  static getRoomsMessage(): RoomsMessage {
    return {
      rooms: this.getFreeRooms().map(room => ({
        id: room.getId(),
        name: room.getName(),
        freeFactions: room.getFreeFactions(),
      })),
    };
  }
}
