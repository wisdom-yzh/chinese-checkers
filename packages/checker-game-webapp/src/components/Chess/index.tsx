import React, { FC, useRef, useEffect } from 'react';
import { ChessProps, SingleChessGame, NetChessGame } from './interface';

import './index.scss';

const Chess: FC<ChessProps> = props => {
  const { mode } = props || {};
  const chessRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chessRef.current === null) {
      return;
    }
    if (mode === 'single') {
      new SingleChessGame(chessRef.current, props).start();
    } else {
      new NetChessGame(chessRef.current, props).start();
    }
  }, [chessRef]);

  return <canvas ref={chessRef} className="chess" width={600} height={600} />;
};

export default Chess;
