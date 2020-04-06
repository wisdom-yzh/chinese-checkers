import React, { SFC, useCallback } from 'react';
import { FactionIdentity } from 'checker-model';
import { RoomPreview } from 'checker-transfer-contract';

import './index.scss';

type NetRoomPreviewProps = {
  onClickFreeSlot(roomId: string, factionId: FactionIdentity): void;
  roomInfo: RoomPreview;
};

const NetRoomPreview: SFC<NetRoomPreviewProps> = props => {
  const factions: FactionIdentity[] = [0, 1, 2, 3, 4, 5];
  const { onClickFreeSlot, roomInfo } = props || {};

  const onClickSlot = useCallback((factionId: FactionIdentity) => {
    if (roomInfo.freeFactions.includes(factionId)) {
      onClickFreeSlot(roomInfo.id, factionId);
    }
  }, []);

  return (
    <div className="net-room-preview">
      <div className="net-room-preview-name">
        <div className="net-room-preview-name-title">房间:</div>
        <div className="net-room-preview-name-content">{roomInfo.name}</div>
      </div>
      <div className="net-room-preview-factions">
        {factions.map((factionId, index) => (
          <div
            key={factionId}
            onClick={(): void => onClickSlot(factionId)}
            className={
              roomInfo.freeFactions.includes(factionId)
                ? 'net-room-preview-factions-free'
                : 'net-room-preview-factions-filled'
            }
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetRoomPreview;
