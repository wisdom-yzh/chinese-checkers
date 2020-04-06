import React, { FC, useState, ChangeEvent, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useGlobalContext, useConnectToServer } from '../../hooks';

import './index.scss';

// eslint-disable-next-line
const NetConnection: FC = () => {
  const history = useHistory();
  const globalContext = useGlobalContext();
  const [inputServer, setInputServer] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('Connect');
  const { connect } = useConnectToServer();
  const connectToServer = useCallback(() => {
    setButtonText('Connecting');
    connect(inputServer)
      .then(() => {
        toast.info('连接成功', {
          autoClose: 1000,
          hideProgressBar: true,
          position: 'top-center',
        });
      })
      .catch(() => {
        toast.warn('连接失败', {
          autoClose: 1000,
          hideProgressBar: true,
          position: 'top-center',
        });
      })
      .then(() => {
        setButtonText('Connect');
      });
  }, [inputServer]);

  useEffect(() => {
    if (globalContext.networkParam) {
      history.replace('/network/rooms');
    }
  }, [globalContext.networkParam]);

  return (
    <div className="net-connection">
      <label className="net-connection-input">
        连接服务器 http://
        <input
          type="text"
          value={inputServer}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            setInputServer(e.target.value);
          }}
        />
      </label>
      <div className="net-connection-button" onClick={connectToServer}>
        {buttonText}
      </div>
    </div>
  );
};

export default NetConnection;
