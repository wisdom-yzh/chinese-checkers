import React, { FC, useCallback } from 'react';
import Room from '../../components/Room';
import { Slot, useGlobalContext, useSlots } from '../../hooks';
import { useHistory } from 'react-router-dom';

const SingleRoom: FC = () => {
  const history = useHistory();
  const { setSlots, setGameMode } = useGlobalContext();
  const { slots, setSlot } = useSlots();

  const startGame = useCallback(
    (slots: Slot[]) => {
      setGameMode('single');
      setSlots(slots);
      history.replace('/game');
    },
    [history, setGameMode, setSlots],
  );

  return <Room middleButtonText="开始" onMiddleButtonClick={startGame} slots={slots} setSlot={setSlot} />;
};

export default SingleRoom;
