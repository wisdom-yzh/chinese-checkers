import { useState, useMemo } from 'react';
import { AIDifficulty } from 'checker-ai';
import { ClientStatus, RoomDetailMessage } from 'checker-transfer-contract';
import { FactionIdentity } from 'checker-model';
import { useGlobalContext } from './index';

export type SlotType = 'myself' | 'ai' | 'empty' | 'player';

export type Slot = {
  slotType: SlotType;
  playerName?: string;
  aiLevel?: AIDifficulty;
  status?: ClientStatus;
};

const initFactionProps = (myIndex: number): Slot[] =>
  [0, 1, 2, 3, 4, 5].map(index => {
    const slotType: SlotType = index === myIndex ? 'myself' : 'empty';
    return { slotType };
  });

type SetSlotType = (index: number, slotType: SlotType, aiLevel?: AIDifficulty, playerName?: string) => boolean;

export const useSlots = (): { slots: Slot[]; setSlot: SetSlotType } => {
  const [myIndex, setMyIndex] = useState<number>(3);
  const [slots, setSlots] = useState<Slot[]>(initFactionProps(myIndex));

  const setSlot: SetSlotType = (index: number, slotType: SlotType, aiLevel?: AIDifficulty, playerName?: string) => {
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

export const useNetSlots = (roomDetail: RoomDetailMessage | null): Slot[] => {
  const { networkRoomParam, setSlots } = useGlobalContext();

  return useMemo(() => {
    if (!networkRoomParam || !roomDetail) {
      return [];
    }

    const slots: Slot[] = [];
    for (let i = 0; i < 6; i++) {
      const player = roomDetail.players[i as FactionIdentity];
      if (!player) {
        slots.push({
          slotType: 'empty',
        });
      } else if (i === networkRoomParam.myFaction) {
        slots.push({
          slotType: 'myself',
          status: player.status,
        });
      } else {
        slots.push({
          slotType: 'player',
          status: player.status,
        });
      }
    }

    setSlots(slots);
    return slots;
  }, [roomDetail, networkRoomParam, setSlots]);
};
