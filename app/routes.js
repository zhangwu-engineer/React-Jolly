// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route } from 'components/Routes';

const Home = load(() => import('pages/Home'));
const Welcome = load(() => import('pages/Welcome'));
const SignUp = load(() => import('pages/SignUp'));
const FourOfour = load(() => import('pages/404'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          exact
          path="/freelancer-signup-2"
          render={props => <SignUp {...props} />}
        />
        <Route
          exact
          path="/freelancer-signup"
          render={props => <Welcome {...props} />}
        />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
