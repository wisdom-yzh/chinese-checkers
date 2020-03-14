import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

const Home: FC = () => {
  return (
    <div className="home">
      <p className="home-title">Chinese Checker</p>
      <section>
        <Link to="/single/room">单人游戏</Link>
        <Link to="/network/connect">网络对战</Link>
      </section>
    </div>
  );
};

export default Home;
