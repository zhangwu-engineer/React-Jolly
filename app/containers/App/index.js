// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import { withRouter } from 'react-router';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';
import { history } from 'components/ConnectedRouter';

import injectSagas from 'utils/injectSagas';

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
        history.push(`/f/${user.get('slug')}/edit`);
      } else {
        history.push('/freelancer-signup');
      }
    }
  }
  componentDidUpdate() {
    if (this.props.location.pathname === '/' && !this.props.user) {
      history.push('/freelancer-signup');
    }
  }
  render() {
    const {
      user,
      navbarOpen,
      location: { pathname },
    } = this.props;
    return (
      <div>
        <PageMeta />
        <Switch>
          <Route path="/freelancer-signup" />
          <Route path="/sign-in" />
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
        <Routes />
      </div>
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
