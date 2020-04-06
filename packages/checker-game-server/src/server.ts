import * as http from 'http';
import express from 'express';
import cors from 'cors';
import socketio, { Socket } from 'socket.io';
import { SOCKET_PATH } from 'checker-transfer-contract';
import { auth, error } from './middleware';
import { game, room } from './controller';
import { Clients, Client, Room } from './model';

export class Server {
  private app: express.Application;
  private server: http.Server;
  private io: socketio.Server;

  private clients: Record<string, Client> = {};
  private rooms: Record<string, Room> = {};

  constructor() {
    // init http server
    this.app = express();
    this.middlewares.forEach(middleware => this.app.use(middleware));
    this.server = http.createServer(this.app);

    // init websocket server
    this.io = socketio.listen(this.server, { origins: '*:*', path: SOCKET_PATH });
    this.io.on('connection', (socket: Socket) => Clients.addClient(socket));
  }

  private get middlewares(): express.NextFunction[] {
    return [cors(), express.json(), auth, room, game, error];
  }

  start(port?: number): void {
    const PORT = (port as number) || Number(process.env.PORT) || 58000;
    this.server.listen(PORT);
    console.log(`listen to ${PORT}`);
  }
}
