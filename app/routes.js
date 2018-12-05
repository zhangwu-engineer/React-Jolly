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
const ProfileGallery = load(() => import('pages/ProfileGallery'));
const Member = load(() => import('pages/Member'));
const MemberGallery = load(() => import('pages/MemberGallery'));
const Talent = load(() => import('pages/Talent'));
const PersonalInformation = load(() => import('pages/PersonalInformation'));
const Settings = load(() => import('pages/Settings'));
const AddWork = load(() => import('pages/Work'));
const EmailVerification = load(() => import('pages/EmailVerification'));
const ForgotPassword = load(() => import('pages/ForgotPassword'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const Mobile = load(() => import('pages/Mobile'));
const Privacy = load(() => import('pages/Privacy'));
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
        <PrivateRoute
          path="/f/:slug/edit/personal-information"
          render={props => <PersonalInformation {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/settings"
          render={props => <Settings {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/edit/avatar"
          render={props => <ProfileGallery {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/edit/background-image"
          render={props => <ProfileGallery {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/edit"
          render={props => <Profile {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/work"
          render={props => <Talent {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/mobile"
          render={props => <Mobile {...props} />}
        />
        <PrivateRoute
          path="/f/:slug/add"
          render={props => <AddWork {...props} />}
        />
        <Route
          path="/f/:slug/gallery"
          render={props => <MemberGallery {...props} />}
        />
        <Route path="/f/:slug" render={props => <Member {...props} />} />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
