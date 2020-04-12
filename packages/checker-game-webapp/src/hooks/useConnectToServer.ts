import { useCallback } from 'react';
import io from 'socket.io-client';
import { SOCKET_PATH, SYNC_CLIENT, SyncClient } from 'checker-transfer-contract';
import { useGlobalContext } from '../hooks';
import { toast } from 'react-toastify';

interface IConnection {
  connect(server: string): Promise<void>;
  disconnect(): void;
}

// eslint-disable-next-line
export const useConnectToServer = (): IConnection => {
  const globalContext = useGlobalContext();

  const connect = (server: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const socket = io(server, {
        path: SOCKET_PATH,
      });
      const timeout = setTimeout(() => {
        socket.close();
        reject();
      }, 5000);

      socket.on(SYNC_CLIENT, (data: SyncClient) => {
        globalContext.setNetworkParam({
          clientId: data.id,
          server: server,
          socket,
        });
        clearTimeout(timeout);
        resolve();
      });

      socket.on('disconnect', () => {
        globalContext.setNetworkParam(null);
        globalContext.setNetworkRoomParam(null);
        toast.info('连接已断开', {
          autoClose: 1000,
          hideProgressBar: true,
          position: 'top-center',
        });
        socket.close();
      });
      socket.connect();
    });

  const disconnect = useCallback((): void => {
    const { networkParam, setNetworkParam } = globalContext;
    if (!networkParam) {
      return;
    }
    networkParam.socket.disconnect();
    setNetworkParam(null);
  }, [globalContext]);

  return { connect, disconnect };
};
