import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Home, SingleRoom, Game, NetConnection, NetRoomList, NetRoom } from './pages';
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
            <Route path="/network/connect">
              <NetConnection />
            </Route>
            <Route path="/network/rooms">
              <NetRoomList />
            </Route>
            <Route path="/network/room/:id">
              <NetRoom />
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
      <ToastContainer />
    </div>
  );
};

export default App;
