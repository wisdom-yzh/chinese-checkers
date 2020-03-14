import React, { FC, createContext, useContext } from 'react';
import { Slot } from './useSlots';

export type GameMode = 'single' | 'network';

export interface IGlobalContext {
  gameMode: GameMode;
  setGameMode(gameMode: GameMode): void;
  slots: Slot[];
  setSlots(slots: Slot[]): void;
}

const defaultGlobalContext: IGlobalContext = {
  gameMode: 'single',
  setGameMode(mode: GameMode) {
    this.gameMode = mode;
  },
  slots: [],
  setSlots(slots: Slot[]) {
    this.slots = slots;
  },
};

export const GlobalContext = createContext<IGlobalContext>(defaultGlobalContext);

export const GlobalContextProvider: FC = props => {
  return <GlobalContext.Provider value={defaultGlobalContext}>{(props || {}).children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): IGlobalContext => {
  return useContext(GlobalContext);
};
