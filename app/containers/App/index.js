// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import { withRouter } from 'react-router';
import { Switch } from 'react-router-dom';
import { fromJS } from 'immutable';
import { Route } from 'components/Routes';
import { history } from 'components/ConnectedRouter';
import injectSagas from 'utils/injectSagas';
import Intercom from 'react-intercom';
import CONFIG from 'conf';
import { capitalize } from 'lodash-es';

import Header from 'components/Header';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';

import saga, {
  reducer,
  logout,
  requestUser,
  openNavbar,
  closeNavbar,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  requestUser: Function,
  openNavbar: Function,
  closeNavbar: Function,
  navbarOpen: boolean,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestUser();
    }
    if (this.props.location.pathname === '/') {
      if (user) {
        history.push(`/f/${user.get('slug')}`);
      } else {
        history.push('/freelancer-signup');
      }
    }
  }
  componentDidUpdate(prevProps: Props) {
    const { user, location } = this.props;
    if (location.pathname === '/' && !user) {
      history.push('/sign-in');
    } else if (location.pathname === '/' && user) {
      history.push(`/f/${user.get('slug')}`);
    }
    if (location.pathname.startsWith('/f/')) {
      analytics.page('User Profile', {
        viewer:
          user &&
          user.get('slug') ===
            prevProps.location.pathname.split('/').slice(-1)[0]
            ? 'this-user'
            : 'other-user',
      });
    } else if (prevProps.location.pathname !== location.pathname) {
      analytics.page(location.pathname);
    }
    if (user) {
      analytics.identify(user.get('id'), {
        full_name: `${user.get('firstName')} ${user.get('lastName')}`,
        email: user.get('email'),
        distance: user.getIn(['profile', 'distance']),
        linkedin: user.getIn(['profile', 'linkedin']),
        twitter: user.getIn(['profile', 'twitter']),
        location: user.getIn(['profile', 'location']),
        youtube: user.getIn(['profile', 'youtube']),
        facebook: user.getIn(['profile', 'facebook']),
        phone: user.getIn(['profile', 'phone']),
        bio: user.getIn(['profile', 'bio']),
        background_picture: user.getIn(['profile', 'backgroundImage']),
        profile_picture: user.getIn(['profile', 'avatar']),
        source: user.get('source'),
        cred_count: user.getIn(['profile', 'cred']),
      });
    }
  }
  intercomUserParams = user => {
    if (user) {
      return {
        email: user.get('email'),
        created_at: (+new Date(user.get('date_created')) / 1000).toFixed(0),
        name: capitalize(`${user.get('firstName')} ${user.get('lastName')}`),
      };
    }
    return {};
  };
  render() {
    const {
      user,
      navbarOpen,
      location: { pathname },
    } = this.props;
    const data = fromJS({
      title: 'Jolly | The Event Freelancer Network',
      description:
        'Jolly is a new platform to help event freelancers grow their reputation, find work and network with fellow hustlers like them.',
    });
    const ogImage =
      'https://s3-us-west-2.amazonaws.com/jolly-images/preview.jpg';
    return (
      <React.Fragment>
        <PageMeta data={data} ogImage={ogImage} />
        <Switch>
          <Route path="/freelancer-signup" />
          <Route path="/sign-in" />
          <Route path="/profile-picture" />
          <Route path="/background-picture" />
          <Route path="/f/:slug/gallery" />
          <Route path="/add" />
          <Route path="/f/:slug/e/:eventSlug" />
          <Route path="/admin" />
          <Route
            path="/"
            render={() => (
              <Header
                user={user}
                logout={this.props.logout}
                openNavbar={this.props.openNavbar}
                closeNavbar={this.props.closeNavbar}
                replace={this.props.replace}
                pathname={pathname}
                navbarOpen={navbarOpen}
              />
            )}
          />
        </Switch>
        <Intercom
          appID={CONFIG.INTERCOM.APP_ID}
          {...this.intercomUserParams(user)}
        />
        <Routes />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  replace: path => dispatch(replace(path)),
  requestUser: () => dispatch(requestUser()),
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
