import React, { FC, createContext, useContext, useState, Dispatch } from 'react';
import { Slot } from './useSlots';
import { FactionIdentity } from 'checker-model';

export type GameMode = 'single' | 'network';

export type NetworkParamType = {
  server: string;
  clientId: string;
  socket: SocketIOClient.Socket;
};

export type NetworkRoomParamType = {
  roomId: string;
  myFaction: FactionIdentity;
  iAmMaster: boolean;
  isPrepared?: boolean;
};

export type GlobalContextType = {
  gameMode: GameMode;
  setGameMode: Dispatch<GameMode>;
  slots: Slot[];
  setSlots: Dispatch<Slot[]>;
  networkParam: NetworkParamType | null;
  setNetworkParam: Dispatch<NetworkParamType | null>;
  networkRoomParam: NetworkRoomParamType | null;
  setNetworkRoomParam: Dispatch<NetworkRoomParamType | null>;
};

const defaultGlobalContext: GlobalContextType = {
  gameMode: 'single',
  setGameMode: () => void 0,
  slots: [],
  setSlots: () => void 0,
  networkParam: null,
  setNetworkParam: () => void 0,
  networkRoomParam: null,
  setNetworkRoomParam: () => void 0,
};

export const GlobalContext = createContext<GlobalContextType>(defaultGlobalContext);

export const GlobalContextProvider: FC = props => {
  const [networkParam, setNetworkParam] = useState<NetworkParamType | null>(null);
  const [networkRoomParam, setNetworkRoomParam] = useState<NetworkRoomParamType | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [slots, setSlots] = useState<Slot[]>([]);
  const context = {
    ...defaultGlobalContext,
    gameMode,
    setGameMode,
    slots,
    setSlots,
    networkParam,
    setNetworkParam,
    networkRoomParam,
    setNetworkRoomParam,
  };
  return <GlobalContext.Provider value={context}>{(props || {}).children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): GlobalContextType => {
  return useContext(GlobalContext);
};
