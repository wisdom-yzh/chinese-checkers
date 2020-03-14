import * as http from 'http';
import socketio, { Socket, ServerOptions } from 'socket.io';
import { FactionIdentity } from 'checker-model';
import { IClient, IRoom } from './interface';
import { Client } from './model';

export class Server {
  private server: http.Server;
  private io: socketio.Server;

  private clients: Record<string, IClient> = {};
  private rooms: Record<string, IRoom> = {};

  constructor(options?: ServerOptions) {
    this.server = http.createServer();
    this.io = socketio.listen(this.server, options || { origins: '*:*', path: '/sync' });
    this.io.on('connection', (socket: Socket) => this.createNewClient(socket));
  }

  start(port?: number): void {
    const PORT = (port as number) || Number(process.env.PORT) || 58000;
    this.server.listen(PORT);
    console.log(`listen to ${PORT}`);
  }

  private createNewClient(socket: Socket): void {
    const client = new Client(socket);
    client.on('connect', this.onClientConnect);
    client.on('disconnect', this.onClientDisconnect);
    client.on('create', this.onCreateRoom);
    client.on('join', this.onJoinRoom);
    client.on('leave', this.onLeaveRoom);
  }

  private onClientConnect = (client: IClient): void => {
    this.clients[client.getId()] = client;
  };

  private onClientDisconnect = (clientId: string): void => {
    delete this.clients[clientId];
  };

  private onCreateRoom = (clientId: string, room: IRoom): void => {
    const client = this.clients[clientId];
    const roomId = room.getId();

    this.rooms[roomId] = room;
    client.setRoom(room);
  };

  private onJoinRoom = (clientId: string, roomId: string, faction: FactionIdentity): void => {
    const room = this.rooms[roomId];
    const client = this.clients[clientId];

    if (!room.addClient(faction, client)) {
      return;
    }
    client.setRoom(room);
  };

  private onLeaveRoom = (clientId: string, roomId: string): void => {
    const room = this.rooms[roomId];
    const client = this.clients[clientId];
    const factionIdentity = client.getMyFactionIdentity() as FactionIdentity;

    if (!room.removeClient(factionIdentity)) {
      return;
    }

    client.setRoom(undefined);

    if (Object.keys(room.getClients()).length === 0) {
      delete this.rooms[room.getId()];
    }
  };
}
