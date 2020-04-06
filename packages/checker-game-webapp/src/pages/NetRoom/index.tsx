import React, { FC, useEffect, useCallback, useMemo, Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import { START_GAME, PREPARE_GAME, LEAVE_ROOM, RoomDetailMessage } from 'checker-transfer-contract';
import {
  NetworkParamType,
  useGlobalContext,
  NetworkRoomParamType,
  useNetSlots,
  useInvoke,
  useNetRoomDetail,
} from '../../hooks';
import Room from '../../components/Room';

import './index.scss';

const useRedirect = (
  networkParam: NetworkParamType | null,
  networkRoomParam: NetworkRoomParamType | null,
  netRoomDetail: RoomDetailMessage | null,
): void => {
  const history = useHistory();
  useEffect(() => {
    if (!networkParam) {
      history.replace('/network/connect');
    } else if (!networkRoomParam) {
      history.replace('/network/rooms');
    } else if (netRoomDetail && netRoomDetail.isProcessing) {
      history.replace('/game');
    }
  }, [networkParam, networkRoomParam, netRoomDetail]);
};

const useStartOrPrepare = (
  networkRoomParam: NetworkRoomParamType | null,
  setNetworkRoomParam: Dispatch<NetworkRoomParamType>,
): (() => void) => {
  const invoke = useInvoke();
  const start = useCallback(() => invoke(START_GAME, {}), []);
  const prepare = useCallback(() => {
    if ((networkRoomParam || {}).isPrepared) {
      return;
    }
    invoke(PREPARE_GAME, '/').then(() => {
      setNetworkRoomParam({
        ...networkRoomParam,
        isPrepared: true,
      } as NetworkRoomParamType);
    });
  }, [networkRoomParam]);

  return useCallback(() => {
    if (networkRoomParam) {
      networkRoomParam.iAmMaster ? start() : prepare();
    }
  }, [networkRoomParam]);
};

const useMiddleButtonText = (networkRoomParam: NetworkRoomParamType | null): string => {
  return useMemo(() => {
    if (!networkRoomParam) {
      return '';
    }
    const { iAmMaster, isPrepared } = networkRoomParam as NetworkRoomParamType;
    if (iAmMaster) {
      return '开始';
    } else if (isPrepared) {
      return '已准备';
    } else {
      return '准备';
    }
  }, [networkRoomParam]);
};

const NetRoom: FC = () => {
  const { networkParam, networkRoomParam, setNetworkRoomParam, setGameMode } = useGlobalContext();
  const netRoomDetail = useNetRoomDetail();
  const slots = useNetSlots(netRoomDetail);
  const startOrPrepare = useStartOrPrepare(networkRoomParam, setNetworkRoomParam);
  const middleButtonText = useMiddleButtonText(networkRoomParam);
  const invoke = useInvoke();

  useRedirect(networkParam, networkRoomParam, netRoomDetail);
  setGameMode('network');

  const leave = useCallback(() => {
    invoke(LEAVE_ROOM, {}).then(() => {
      setNetworkRoomParam(null);
    });
  }, []);

  return (
    <>
      <div className="netroom-leave" onClick={leave}>
        离开房间
      </div>
      <Room middleButtonText={middleButtonText} onMiddleButtonClick={startOrPrepare} slots={slots} />
    </>
  );
};

export default NetRoom;
