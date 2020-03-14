import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, SingleRoom, Game } from './pages';
import { GlobalContextProvider } from './hooks';

import './styles/index.scss';

const App: FC = () => {
  return (
    <div className="layout">
      <GlobalContextProvider>
        <Router>
          <Switch>
            <Route path="/single/room">
              <SingleRoom />
            </Route>
            <Route path="/game">
              <Game />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </GlobalContextProvider>
    </div>
  );
};

export default App;
