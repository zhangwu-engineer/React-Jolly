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
const EmailVerification = load(() => import('pages/EmailVerification'));
const ForgotPassword = load(() => import('pages/ForgotPassword'));
const ResetPassword = load(() => import('pages/ResetPassword'));
const Privacy = load(() => import('pages/Privacy'));
const Profile = load(() => import('pages/Profile'));
const AddWork = load(() => import('pages/AddWork'));
const User = load(() => import('pages/User'));
const ProfileGallery = load(() => import('pages/ProfileGallery'));
const Settings = load(() => import('pages/Settings'));
const GeneralSettings = load(() => import('pages/Settings/General'));
const ProfileSettings = load(() => import('pages/Settings/Profile'));
const Mobile = load(() => import('pages/Mobile'));
const Roles = load(() => import('pages/Roles'));
const ObPage1 = load(() => import('pages/Ob/Page1'));
const ObPage2 = load(() => import('pages/Ob/Page2'));
const ObPage3 = load(() => import('pages/Ob/Page3'));
const Network = load(() => import('pages/Network'));
const NetworkBusinesses = load(() => import('pages/Network/Businesses'));
const Coworkers = load(() => import('pages/Network/Coworkers'));
const NetworkInvite = load(() => import('pages/Network/Invite'));
const Feed = load(() => import('pages/Feed'));
const AdminLogin = load(() => import('pages/Admin/Login'));
const Admin = load(() => import('pages/Admin'));
const FourOfour = load(() => import('pages/404'));
const Business = load(() => import('pages/Business'));
const BusinessNetwork = load(() => import('pages/BusinessNetwork'));

class Routes extends Component<{}> {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          path="/business-signup-2"
          render={props => <SignUp {...props} />}
        />
        <Route
          path="/business-signup"
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
          exact
          path="/b/network"
          render={props => <BusinessNetwork {...props} />}
        />
        <Route path="/b/:slug" render={props => <Business {...props} />} />
        <Route path="/f/:slug" render={props => <User {...props} />} />
        <PrivateRoute
          exact
          path="/ob/1"
          render={props => <ObPage1 {...props} />}
        />
        <PrivateRoute
          exact
          path="/ob/2"
          render={props => <ObPage2 {...props} />}
        />
        <PrivateRoute
          exact
          path="/ob/3"
          render={props => <ObPage3 {...props} />}
        />
        <PrivateRoute
          exact
          path="/edit"
          render={props => <Profile {...props} />}
        />
        <PrivateRoute path="/add" render={props => <AddWork {...props} />} />
        <PrivateRoute
          exact
          path="/profile-picture"
          render={props => <ProfileGallery {...props} />}
        />
        <PrivateRoute
          exact
          path="/background-picture"
          render={props => <ProfileGallery {...props} />}
        />
        <PrivateRoute
          exact
          path="/settings/general"
          render={props => <GeneralSettings {...props} />}
        />
        <PrivateRoute
          exact
          path="/settings/profile"
          render={props => <ProfileSettings {...props} />}
        />
        <PrivateRoute
          exact
          path="/settings"
          render={props => <Settings {...props} />}
        />
        <PrivateRoute path="/mobile" render={props => <Mobile {...props} />} />
        <PrivateRoute
          path="/types-of-work"
          render={props => <Roles {...props} />}
        />
        <PrivateRoute
          exact
          path="/network"
          render={props => <Network {...props} />}
        />
        <PrivateRoute
          exact
          path="/network/businesses"
          render={props => <NetworkBusinesses {...props} />}
        />
        <PrivateRoute
          exact
          path="/network/connections"
          render={props => <Coworkers {...props} />}
        />
        <PrivateRoute
          exact
          path="/network/invite"
          render={props => <NetworkInvite {...props} />}
        />
        <PrivateRoute
          exact
          path="/feed"
          render={props => <Feed {...props} />}
        />
        <Route
          exact
          path="/admin/signin"
          render={props => <AdminLogin {...props} />}
        />
        <PrivateRoute path="/admin" render={props => <Admin {...props} />} />
        <Route render={props => <FourOfour {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
