import React, { FC } from 'react';
import { AIDifficulty } from 'checker-ai';
import { FactionSlot } from '../FactionSlot';
import { Slot, SlotType } from '../../hooks';

import './index.scss';

interface IRoomProps {
  middleButtonText: string;
  onMiddleButtonClick: (slots: Slot[]) => void;
  slots: Slot[];
  setSlot?: (index: number, slotType: SlotType, aiLevel?: AIDifficulty, playerName?: string) => boolean;
}

const Room: FC<IRoomProps> = props => {
  const { onMiddleButtonClick, middleButtonText, slots, setSlot } = props || {};

  return (
    <div className="room">
      <div className="room-middle" onClick={(): void => onMiddleButtonClick(slots)}>
        {middleButtonText}
      </div>
      {slots.map((slot, index) => (
        <FactionSlot
          key={index}
          index={index}
          {...slot}
          onChangeSlot={setSlot ? setSlot.bind(null, index) : undefined}
        />
      ))}
    </div>
  );
};

export default Room;
