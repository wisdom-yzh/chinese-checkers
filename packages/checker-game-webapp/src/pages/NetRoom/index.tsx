import React, { FC, useCallback, useMemo, Dispatch } from 'react';
import { Redirect } from 'react-router-dom';
import { START_GAME, PREPARE_GAME, LEAVE_ROOM } from 'checker-transfer-contract';
import {
  useGlobalContext,
  NetworkRoomParamType,
  useNetSlots,
  useInvoke,
  useNetRoomDetail,
  GameMode,
} from '../../hooks';
import Room from '../../components/Room';

import './index.scss';

const useStartOrPrepare = (
  networkRoomParam: NetworkRoomParamType | null,
  setNetworkRoomParam: Dispatch<NetworkRoomParamType>,
  setGameMode: Dispatch<GameMode>,
): (() => void) => {
  const invoke = useInvoke();
  const start = useCallback(() => invoke(START_GAME, {}), [invoke]);
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
  }, [networkRoomParam, invoke, setNetworkRoomParam]);

  return useCallback(() => {
    if (networkRoomParam) {
      networkRoomParam.iAmMaster ? start() : prepare();
      setGameMode('network');
    }
  }, [networkRoomParam, prepare, start, setGameMode]);
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
  const startOrPrepare = useStartOrPrepare(networkRoomParam, setNetworkRoomParam, setGameMode);
  const middleButtonText = useMiddleButtonText(networkRoomParam);
  const invoke = useInvoke();

  const leave = useCallback(() => {
    invoke(LEAVE_ROOM, {}).then(() => {
      setNetworkRoomParam(null);
    });
  }, [setNetworkRoomParam, invoke]);

  return !networkParam ? (
    <Redirect to="/network/connect" />
  ) : !networkRoomParam ? (
    <Redirect to="/network/rooms" />
  ) : netRoomDetail && netRoomDetail.isProcessing ? (
    <Redirect to="/game" />
  ) : (
    <>
      <div className="netroom-leave" onClick={leave}>
        离开房间
      </div>
      <Room middleButtonText={middleButtonText} onMiddleButtonClick={startOrPrepare} slots={slots} />
    </>
  );
};

export default NetRoom;
