// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import { withRouter, matchPath } from 'react-router';
import { Switch } from 'react-router-dom';
import { fromJS } from 'immutable';
import { capitalize } from 'lodash-es';
import { Route } from 'components/Routes';
import { history } from 'components/ConnectedRouter';
import injectSagas from 'utils/injectSagas';
import Intercom from 'react-intercom';
import CONFIG from 'conf';

import Header from 'components/Header';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';
import saga, {
  reducer,
  logout,
  requestUser,
  openNavbar,
  closeNavbar,
  requestBusinessProfile,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  business: Object,
  logout: Function,
  replace: Function,
  requestUser: Function,
  openNavbar: Function,
  closeNavbar: Function,
  requestBusinessProfile: Function,
  navbarOpen: boolean,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const {
      user,
      location: { pathname },
    } = this.props;

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
    if (location.pathname.startsWith('/f/')) {
      analytics.page('User Profile', {
        viewer:
          user && user.get('slug') === location.pathname.split('/').slice(-1)[0]
            ? 'this-user'
            : 'other-user',
      });
    } else {
      analytics.page(location.pathname);

      const matchBusiness = matchPath(pathname, {
        path: '/b/:slug',
      });
      if (matchBusiness) {
        const {
          params: { slug },
        } = matchBusiness;
        if (slug !== 'network') {
          this.props.requestBusinessProfile(slug);
        }
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
    if (prevProps && prevProps.location.pathname !== location.pathname) {
      if (location.pathname.startsWith('/f/')) {
        analytics.page('User Profile', {
          viewer:
            user &&
            user.get('slug') === location.pathname.split('/').slice(-1)[0]
              ? 'this-user'
              : 'other-user',
        });
      } else {
        analytics.page(location.pathname);
      }
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
        returning_user: user.get('loginCount') > 0 ? 1 : 0,
        created_at: user.get('date_created'),
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
      business,
      navbarOpen,
      location: { pathname },
    } = this.props;

    const matchBusiness = matchPath(pathname, {
      path: '/b/:slug',
    });

    let data = fromJS({
      title: 'Jolly | The Event Freelancer Network',
      description:
        'Jolly is a new platform to help event freelancers grow their reputation, find work and network with fellow hustlers like them.',
    });

    if (matchBusiness) {
      const businesses =
        user && user.get('businesses') && user.get('businesses').toJSON();
      const currentBusinessName = businesses && businesses[0].name;

      const businessName = business.get('name')
        ? business.get('name')
        : currentBusinessName;

      data = fromJS({
        title: `${businessName} | JollyHQ Network`,
        description: `${businessName}’s profile on Jolly - the professional social network for events businesses and freelancers.`,
      });
    }
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
  business: state.getIn(['app', 'businessData']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  replace: path => dispatch(replace(path)),
  requestUser: () => dispatch(requestUser()),
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
  requestBusinessProfile: slug => dispatch(requestBusinessProfile(slug)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
