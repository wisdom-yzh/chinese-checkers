import React, { FC, useEffect, useRef } from 'react';
import { MoveStep } from 'checker-model';

import './index.scss';

const StepList: FC<{ steps: MoveStep[] }> = props => {
  const { steps } = props || {};
  const contentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (contentRef.current !== null) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div className="step-list">
      <div className="step-list-title">行棋记录</div>
      <ul className="step-list-content" ref={contentRef}>
        {steps.map((step, index) => {
          const faction = step.piece.getFactionId();
          const { from, to } = step;
          return <li key={index}>{`Player ${faction} | (${from.x}, ${from.y}) -> (${to.x}, ${to.y})`}</li>;
        })}
      </ul>
    </div>
  );
};

export default StepList;
