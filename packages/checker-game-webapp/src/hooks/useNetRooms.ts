import { useEffect, useState } from 'react';
import { RoomsMessage, RoomPreview, SYNC_SERVER_ROOMS, LIST_ROOMS_REQUEST } from 'checker-transfer-contract';
import { useGlobalContext, useInvoke } from './index';

export const useNetRooms = (): RoomPreview[] => {
  const [rooms, setRooms] = useState<RoomPreview[]>([]);
  const { networkParam } = useGlobalContext();
  const invoke = useInvoke();

  useEffect(() => {
    if (!networkParam) {
      return;
    }

    invoke<{}, RoomsMessage>(LIST_ROOMS_REQUEST, {}).then(msg => {
      setRooms(msg.rooms);

      const socket = networkParam.socket;

      socket.on(SYNC_SERVER_ROOMS, (msg: RoomsMessage) => {
        setRooms(msg.rooms);
      });

      return (): void => {
        socket.removeEventListener(SYNC_SERVER_ROOMS);
        return;
      };
    });
  }, [networkParam, invoke]);

  return rooms;
};
