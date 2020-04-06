import React, { FC, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FactionIdentity } from 'checker-model';
import {
  CreateRoomBean,
  CreateRoomId,
  CREATE_ROOM,
  JoinRoomBean,
  RoomDetailMessage,
  JOIN_ROOM_REQUEST,
} from 'checker-transfer-contract';
import {
  useGlobalContext,
  useInvoke,
  useNetRooms,
  NetworkParamType,
  NetworkRoomParamType,
  useConnectToServer,
} from '../../hooks';
import NetRoomPreview from '../../components/NetRoomPreview';
import NetRoomCreator from '../../components/NetRoomCreator';

import './index.scss';

type TInvoke = ReturnType<typeof useInvoke>;

const useRedirect = (networkParam: NetworkParamType | null, networkRoomParam: NetworkRoomParamType | null): void => {
  const history = useHistory();
  useEffect(() => {
    if (!networkParam) {
      history.replace('/network/connect');
    } else if (networkRoomParam) {
      history.replace(`/network/room/${networkRoomParam.roomId}`);
    }
  }, [networkParam, networkRoomParam]);
};

// eslint-disable-next-line
const NetRoomList: FC = () => {
  const { networkParam, networkRoomParam, setNetworkRoomParam } = useGlobalContext();
  const invoke = useInvoke();
  const netRooms = useNetRooms();
  const { disconnect } = useConnectToServer();

  useRedirect(networkParam, networkRoomParam);

  const createRoom = useCallback((name: string): void => {
    invoke<CreateRoomBean, CreateRoomId>(CREATE_ROOM, {
      factions: [0, 1, 2, 3, 4, 5],
      myFaction: 3,
      name,
    }).then(res => {
      setNetworkRoomParam({
        iAmMaster: true,
        myFaction: 3,
        roomId: res.roomId,
      } as NetworkRoomParamType);
    });
  }, []);

  const joinRoom = useCallback(
    (roomId: string, myFaction: FactionIdentity): void => {
      invoke<JoinRoomBean, RoomDetailMessage>(JOIN_ROOM_REQUEST, {
        myFaction,
        roomId,
      }).then(() => {
        setNetworkRoomParam({
          iAmMaster: false,
          myFaction,
          roomId,
        } as NetworkRoomParamType);
      });
    },
    [invoke],
  );

  return (
    <>
      <div className="netroom-container">
        {netRooms.map((room, index) => (
          <NetRoomPreview key={index} roomInfo={room} onClickFreeSlot={joinRoom} />
        ))}
      </div>
      <NetRoomCreator onCreateRoom={createRoom} onDisconnect={disconnect} />
    </>
  );
};

export default NetRoomList;
