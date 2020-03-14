import { EventEmitter } from 'events';
import { isUndefined } from 'util';
import { v4 as uuid } from 'uuid';
import { IRoom, IClient } from '../interface';
import { FactionIdentity, IGameModel, GameModel } from 'checker-model';

export class Room extends EventEmitter implements IRoom {
  private id: string;
  private name: string;
  private gameModel: IGameModel;
  private master: IClient;
  private clients: Record<FactionIdentity, IClient>;
  private factions: FactionIdentity[];

  constructor(name: string, master: IClient, masterFactionIdentity: FactionIdentity, factions: FactionIdentity[]) {
    super();
    this.id = uuid();
    this.name = name;
    this.master = master;
    this.factions = factions;
    this.gameModel = new GameModel(factions);
    this.clients = { [masterFactionIdentity]: master } as Record<FactionIdentity, IClient>;
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

  getGameModel(): IGameModel {
    return this.gameModel;
  }

  getMaster(): IClient {
    return this.master;
  }

  getClients(): Record<FactionIdentity, IClient> {
    return this.clients;
  }

  addClient(factionIdentity: FactionIdentity, client: IClient): boolean {
    if (!isUndefined(this.clients[factionIdentity])) {
      return false;
    }

    if (this.factions.indexOf(factionIdentity) === -1) {
      return false;
    }

    this.clients[factionIdentity] = client;
    return true;
  }

  removeClient(factionIdentity: FactionIdentity): boolean {
    if (isUndefined(factionIdentity)) {
      return false;
    }

    delete this.clients[factionIdentity];

    if (this.master.getMyFactionIdentity() === factionIdentity) {
      const clientKeys = Object.keys(this.clients);
      this.master = this.clients[clientKeys[0]];
    }

    return true;
  }

  start(): boolean {
    if (this.isPlaying()) {
      return false;
    }

    return true;
  }
}
