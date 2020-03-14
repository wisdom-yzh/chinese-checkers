import React, { FC } from 'react';
import { FactionSlot } from '../FactionSlot';
import { useSlots, Slot } from '../../hooks';

import './index.scss';

interface IRoomProps {
  middleButtonText: string;
  onMiddleButtonClick: (slots: Slot[]) => void;
}

const Room: FC<IRoomProps> = props => {
  const { onMiddleButtonClick, middleButtonText } = props || {};
  const { slots, setSlot } = useSlots();

  return (
    <div className="room">
      <div className="room-middle" onClick={(): void => onMiddleButtonClick(slots)}>
        {middleButtonText}
      </div>
      {slots.map((slot, index) => (
        <FactionSlot key={index} index={index} {...slot} onChangeSlot={setSlot.bind(null, index)} />
      ))}
    </div>
  );
};

export default Room;
