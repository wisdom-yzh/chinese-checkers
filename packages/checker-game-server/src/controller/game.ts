import express from 'express';
import {
  PREPARE_GAME,
  START_GAME,
  MOVE_CHESS,
  ClientStatus,
  PrepareGameResponse,
  STATUS_OK,
  StartGameResponse,
  MoveChessRequest,
  MoveChessResponse,
} from 'checker-transfer-contract';
import { Clients } from '../model';

export const game = express.Router();

game.post(PREPARE_GAME, (req, res): void => {
  if (req.client.isMaster()) {
    throw new Error('client is master');
  }

  if (req.client.getStatus() === ClientStatus.Preparing) {
    throw new Error('prepared');
  }

  const room = req.client.getRoom();
  if (!room) {
    throw new Error('not in a room');
  }

  req.client.prepare();
  room.boardcastRoomDetails();
  res.json({
    code: STATUS_OK,
    message: '',
    data: {},
  } as PrepareGameResponse);
});

game.post(START_GAME, (req, res): void => {
  if (!req.client.isMaster()) {
    throw new Error('only master can start game');
  }

  const room = req.client.getRoom();
  if (!room) {
    throw new Error('not in a room');
  }

  if (room.isPlaying()) {
    throw new Error('is playing');
  }

  if (!room.start()) {
    throw new Error('fail to start game, everyone prepared?');
  }

  room.boardcastRoomDetails();
  Clients.broadcastRooms();
  res.json({
    code: STATUS_OK,
    message: '',
    data: {},
  } as StartGameResponse);
});

game.post(MOVE_CHESS, (req, res): void => {
  const room = req.client.getRoom();
  if (!room) {
    throw new Error('not in a room');
  }

  const gameModel = room.getGameModel();
  if (gameModel.getStatus() !== 'running') {
    throw new Error('game is not running');
  }

  if (
    gameModel.getCurrentPlayer().faction.getId() !== req.client.getMyFactionIdentity() ||
    gameModel.getCurrentPlayer().status === 'win'
  ) {
    throw new Error("it's not your turn");
  }

  const params = req.body as MoveChessRequest;
  const { from, to } = params.data;
  gameModel.getBoard().move(from, to);
  room.boardcastGameStatus(from, to);

  gameModel.updateStatus();

  res.json({
    code: STATUS_OK,
    data: {},
    message: '',
  } as MoveChessResponse);
});
