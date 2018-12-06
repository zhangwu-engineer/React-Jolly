// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import load from 'utils/load';

import { Route } from 'components/Routes';

const Home = load(() => import('pages/Home'));
const Welcome = load(() => import('pages/Welcome'));
const SignUp = load(() => import('pages/SignUp'));
const SignIn = load(() => import('pages/SignIn'));
const EmailSignIn = load(() => import('pages/EmailSignIn'));
const EmailVerification = load(() => import('pages/EmailVerification'));
const ForgotPassword = load(() => import('pages/ForgotPassword'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const Privacy = load(() => import('pages/Privacy'));
const User = load(() => import('pages/User'));
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
        <Route
          path="/email-verification/:token"
          render={props => <EmailVerification {...props} />}
        />
        <Route
          path="/forgot-password"
          render={props => <ForgotPassword {...props} />}
        />
        <Route
          path="/reset-password/:token"
          render={props => <ResetPassword {...props} />}
        />
        <Route
          path="/privacy-policy"
          render={props => <Privacy {...props} />}
        />
        <Route path="/f/:slug" render={props => <User {...props} />} />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
