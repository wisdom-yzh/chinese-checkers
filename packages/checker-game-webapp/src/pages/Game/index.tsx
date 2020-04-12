import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalContext, useGameStatus } from '../../hooks';
import Chess from '../../components/Chess';
import StepList from '../../components/StepList';

import './index.scss';
import { toast } from 'react-toastify';

const Game: FC = () => {
  const history = useHistory();
  const { gameMode, slots, networkParam } = useGlobalContext();
  const { status, actions, mention, onChessMove, onClick, onGameEnd, onGameStart, onGameWin } = useGameStatus();

  useEffect(() => {
    const backUrl = gameMode === 'network' ? '/network/rooms' : '/single/room';
    if (status === 'end') {
      toast.info('游戏结束,1s后自动返回...', {
        autoClose: 1000,
        hideProgressBar: true,
        position: 'top-center',
        onClose: () => history.replace(backUrl),
      });
    }
  }, [status, slots, gameMode, history]);

  return (
    <>
      <Chess
        mode={gameMode}
        slots={slots}
        onGameStart={onGameStart}
        onGameEnd={onGameEnd}
        onGameWin={onGameWin}
        onChessMove={onChessMove}
        onClick={onClick}
        socket={(networkParam && networkParam.socket) || undefined}
      />
      <div className="game-status-label">{mention}</div>
      <StepList steps={actions} />
    </>
  );
};

export default Game;
