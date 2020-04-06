import express from 'express';
import { Request } from 'checker-transfer-contract';
import { Clients, Client } from '../model';

export default (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const params = req.body as Request<unknown>;
  const clientId = params.clientId;

  if (!clientId) {
    throw new Error('no client id');
  }

  const client = Clients.getClient(clientId);
  if (!client) {
    throw new Error('invalid client id');
  }

  req.client = client as Client;
  next();
};
