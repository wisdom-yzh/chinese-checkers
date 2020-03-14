import { useState } from 'react';
import { AIDifficulty } from 'checker-ai';

export type SlotType = 'myself' | 'ai' | 'empty' | 'player';

export type Slot = {
  slotType: SlotType;
  playerName?: string;
  aiLevel?: AIDifficulty;
};

const initFactionProps = (myIndex: number): Slot[] =>
  [0, 1, 2, 3, 4, 5].map(index => {
    const slotType: SlotType = index === myIndex ? 'myself' : 'empty';
    return { slotType };
  });

export const useSlots = () => {
  const [myIndex, setMyIndex] = useState<number>(3);
  const [slots, setSlots] = useState<Slot[]>(initFactionProps(myIndex));

  const setSlot = (index: number, slotType: SlotType, aiLevel?: AIDifficulty, playerName?: string): boolean => {
    if (index === myIndex) {
      return false;
    }

    const newSlots = Array.from(slots);
    const newSlot: Slot = {
      slotType,
      playerName,
      aiLevel: aiLevel,
    };

    if (slotType === 'myself') {
      newSlots[myIndex] = { slotType: 'empty' };
      setMyIndex(index);
    }

    newSlots[index] = newSlot;
    setSlots(newSlots);
    return true;
  };

  return { slots, setSlot };
};
