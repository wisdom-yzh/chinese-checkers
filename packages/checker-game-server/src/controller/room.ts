import express from 'express';
import {
  JOIN_ROOM_REQUEST,
  JoinRoomRequest,
  LEAVE_ROOM,
  CREATE_ROOM,
  JoinRoomResponse,
  STATUS_OK,
  CreateRoomRequest,
  CreateRoomResponse,
  LeaveRoomReponse,
  LIST_ROOMS_REQUEST,
  ListRoomResponse,
  ROOM_DETAIL,
  RoomDetailRequest,
  RoomDetailResponse,
} from 'checker-transfer-contract';
import { FactionIdentity } from 'checker-model';
import { Rooms, Clients } from '../model';

export const room = express.Router();

room.post(LIST_ROOMS_REQUEST, (req, res): void => {
  res.json({
    code: STATUS_OK,
    message: '',
    data: Rooms.getRoomsMessage(),
  } as ListRoomResponse);
});

room.post(ROOM_DETAIL, (req, res): void => {
  const params = req.body as RoomDetailRequest;
  const { roomId } = params.data;
  const room = Rooms.getRoom(roomId);

  if (!room) {
    throw new Error('room not exist');
  }

  res.json({
    code: STATUS_OK,
    message: '',
    data: room.getRoomDetailMessage(),
  } as RoomDetailResponse);
});

room.post(JOIN_ROOM_REQUEST, (req, res): void => {
  const params = req.body as JoinRoomRequest;
  const { roomId, myFaction } = params.data;
  const room = Rooms.getRoom(roomId);

  if (!room) {
    throw new Error('room not exist');
  }

  if (!room.addClient(myFaction, req.client)) {
    throw new Error('join room error');
  }

  room.boardcastRoomDetails();
  Clients.broadcastRooms();

  res.json({
    code: STATUS_OK,
    message: '',
    data: room.getRoomDetailMessage(),
  } as JoinRoomResponse);
});

room.post(CREATE_ROOM, (req, res) => {
  const params = req.body as CreateRoomRequest;
  const { factions, myFaction, name } = params.data;
  const room = Rooms.createRoom(name, req.client, myFaction, factions);

  Clients.broadcastRooms();

  res.json({
    code: STATUS_OK,
    message: '',
    data: {
      roomId: room.getId(),
    },
  } as CreateRoomResponse);
});

room.post(LEAVE_ROOM, (req, res) => {
  const room = req.client.getRoom();
  if (!room) {
    throw new Error('client is not in room');
  }

  const faction = req.client.getMyFactionIdentity() as FactionIdentity;
  if (!room.removeClient(faction)) {
    throw new Error('client cant match faction identity');
  }

  const otherClients = Object.values(room.getClients());
  if (otherClients.length) {
    room.boardcastRoomDetails();
  } else {
    Rooms.removeRoom(room.getId());
  }

  Clients.broadcastRooms();

  res.json({
    code: STATUS_OK,
    message: '',
    data: {},
  } as LeaveRoomReponse);
});
