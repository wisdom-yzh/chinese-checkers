import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useGlobalContext, useGameStatus } from '../../hooks';
import Chess from '../../components/Chess';
import StepList from '../../components/StepList';

import './index.scss';

const Game: FC = () => {
  const history = useHistory();
  const { gameMode, slots } = useGlobalContext();
  if (isEmpty(slots)) {
    history.replace('/');
  }

  const { status, actions, mention, onChessMove, onClick, onGameEnd, onGameStart, onGameWin } = useGameStatus();

  useEffect(() => {
    if (status === 'end') {
      window.alert('Game End');
      history.replace('/');
    }
  }, [status]);

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
      />
      <div className="game-status-label">{mention}</div>
      <StepList steps={actions} />
    </>
  );
};

export default Game;
