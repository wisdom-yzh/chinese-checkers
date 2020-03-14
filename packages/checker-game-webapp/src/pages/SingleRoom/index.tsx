import React, { FC, useCallback } from 'react';
import Room from '../../components/Room';
import { Slot, useGlobalContext } from '../../hooks';
import { useHistory } from 'react-router-dom';

const SingleRoom: FC = () => {
  const history = useHistory();
  const globalContext = useGlobalContext();

  const startGame = useCallback((slots: Slot[]) => {
    globalContext.setGameMode('single');
    globalContext.setSlots(slots);
    history.replace('/game');
  }, []);

  return <Room middleButtonText="开始" onMiddleButtonClick={startGame} />;
};

export default SingleRoom;
