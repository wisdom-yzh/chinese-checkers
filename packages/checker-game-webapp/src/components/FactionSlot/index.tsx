import React, { FC, useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import { Slot, SlotType } from '../../hooks';

import './index.scss';
import { AIDifficulty } from '../../../../checker-ai/lib';
import { ClientStatus } from 'checker-transfer-contract';

export type FactionSlotProps = {
  index: number;
  onChangeSlot?: (slotType: SlotType, aiLevel?: AIDifficulty) => void;
} & Slot;

export const FactionSlot: FC<FactionSlotProps> = props => {
  const { index, aiLevel, playerName, slotType, onChangeSlot, status } = props || {};

  const id = useMemo(() => `faction-slot-${index}`, [index]);
  const showName = useMemo(() => {
    switch (slotType) {
      case 'empty':
        return '空';
      case 'ai':
        return {
          simple: '简单电脑',
          normal: '中等电脑',
          hard: '困难电脑',
        }[aiLevel || 'simple'];
      case 'myself':
        return '我';
      case 'player':
        return playerName || '网络玩家';
    }
  }, [aiLevel, playerName, slotType]);
  const showStatus = useMemo(() => (status === ClientStatus.Preparing ? '准备' : ''), [status]);

  return (
    <>
      <a className={`faction-slot ${id}`} data-tip data-for={id} data-event="click focus">
        {showName}
        <br />
        {showStatus}
      </a>
      {onChangeSlot && (
        <ReactTooltip id={id} place="bottom" type="dark" effect="solid" globalEventOff="click" clickable>
          <ul className="faction-slot-selector">
            <li onClick={(): void => onChangeSlot('empty')}>空</li>
            <li onClick={(): void => onChangeSlot('myself')}>我</li>
            <li onClick={(): void => onChangeSlot('ai', 'simple')}>简单电脑</li>
            <li onClick={(): void => onChangeSlot('ai', 'normal')}>中等电脑</li>
            <li onClick={(): void => onChangeSlot('ai', 'hard')}>困难电脑</li>
          </ul>
        </ReactTooltip>
      )}
    </>
  );
};
