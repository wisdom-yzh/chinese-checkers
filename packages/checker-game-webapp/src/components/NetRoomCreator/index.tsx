import React, { FC, useState, ChangeEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import './index.scss';

type NetRoomCreatorProps = {
  onCreateRoom(name: string): void;
  onDisconnect(): void;
};

const NetRoomCreator: FC<NetRoomCreatorProps> = props => {
  const [inputName, setInputName] = useState<string>('');
  const { onCreateRoom, onDisconnect } = props || {};

  const onClickBtn = useCallback((): void => {
    if (!inputName) {
      toast.warn('房间名不能为空', {
        autoClose: 1000,
        hideProgressBar: true,
        position: 'top-center',
      });
      return;
    }
    onCreateRoom(inputName);
  }, [inputName]);

  return (
    <div className="netroom-create">
      <label>
        房间名:
        <input
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setInputName(e.target.value)}
          value={inputName}
        />
      </label>
      <a className="netroom-create-btn" onClick={onClickBtn}>
        新建房间
      </a>
      <a className="netroom-create-btn disconnect" onClick={onDisconnect}>
        断开连接
      </a>
    </div>
  );
};

export default NetRoomCreator;
