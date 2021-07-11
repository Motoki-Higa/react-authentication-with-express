import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Public from './components/Public';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import Dashboard from './components/Dashboard';

// New import
import withContext from './Context';
import PrivateRoute from './PrivateRoute';

// Connect each component to context
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const DashboardWithContext = withContext(Dashboard);

const AuthWithContext = withContext(Authenticated);


export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={ Public } />
        <Route path="/signin" component={ UserSignInWithContext } />
        <Route path="/signup" component={ UserSignUpWithContext } />
        <Route path="/signout" component={ UserSignOutWithContext } />
        <PrivateRoute path="/authenticated" component={ AuthWithContext } />
        <Route path="/dashboard" component={ DashboardWithContext } />
        <Route component={ NotFound } />
      </Switch>
    </div>
  </Router>
);
