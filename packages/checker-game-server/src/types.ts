import 'express';
import { Client } from './model';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  export interface Request {
    client: Client;
  }
}

declare module 'express' {
  // eslint-disable-next-line
  export interface Request {
    client: Client;
  }
}
