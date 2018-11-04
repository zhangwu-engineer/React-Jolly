// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route, PrivateRoute } from 'components/Routes';

const Home = load(() => import('pages/Home'));
const Welcome = load(() => import('pages/Welcome'));
const SignUp = load(() => import('pages/SignUp'));
const SignIn = load(() => import('pages/SignIn'));
const EmailSignIn = load(() => import('pages/EmailSignIn'));
const Profile = load(() => import('pages/Profile'));
const Member = load(() => import('pages/Member'));
const Talent = load(() => import('pages/Talent'));
const PersonalInformation = load(() => import('pages/PersonalInformation'));
const FourOfour = load(() => import('pages/404'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          path="/freelancer-signup-2"
          render={props => <SignUp {...props} />}
        />
        <Route
          path="/freelancer-signup"
          render={props => <Welcome {...props} />}
        />
        <Route path="/sign-in" render={props => <SignIn {...props} />} />
        <Route
          path="/email-sign-in"
          render={props => <EmailSignIn {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/edit/personal-information"
          render={props => <PersonalInformation {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/edit"
          render={props => <Profile {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/work"
          render={props => <Talent {...props} />}
        />
        <PrivateRoute path="/f/:slug" render={props => <Member {...props} />} />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
