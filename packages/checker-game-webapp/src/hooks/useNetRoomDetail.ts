import { useEffect, useState } from 'react';
import { isUndefined } from 'lodash-es';
import { RoomDetailMessage, ROOM_DETAIL, CreateRoomId, SYNC_ROOM_DETAIL } from 'checker-transfer-contract';
import { useGlobalContext, useInvoke } from './index';
import { NetworkRoomParamType } from './useGlobalContext';

export const useNetRoomDetail = (): RoomDetailMessage | null => {
  const [detail, setDetail] = useState<RoomDetailMessage | null>(null);
  const { networkParam, networkRoomParam, setNetworkRoomParam } = useGlobalContext();
  const invoke = useInvoke();

  useEffect(() => {
    if (!networkParam || !networkRoomParam || !networkRoomParam.roomId) {
      return;
    }

    invoke<CreateRoomId, RoomDetailMessage>(ROOM_DETAIL, { roomId: networkRoomParam.roomId })
      .then(msg => {
        setDetail(msg);

        const socket = networkParam.socket;
        socket.on(SYNC_ROOM_DETAIL, (msg: RoomDetailMessage) => {
          setDetail(msg);
        });

        return (): void => {
          socket.removeEventListener(SYNC_ROOM_DETAIL);
          return;
        };
      })
      .catch(() => {
        setNetworkRoomParam(null);
      });
  }, [networkRoomParam, invoke, setNetworkRoomParam, networkParam]);

  useEffect(() => {
    const { myFaction, iAmMaster } = networkRoomParam || {};
    if (detail && detail.players && !isUndefined(myFaction) && detail.players[myFaction]) {
      if (detail.players[myFaction].isMaster !== iAmMaster) {
        setNetworkRoomParam({
          ...networkRoomParam,
          iAmMaster: detail.players[myFaction].isMaster,
        } as NetworkRoomParamType);
      }
    }
  }, [detail, networkRoomParam, setNetworkRoomParam]);

  return detail;
};
