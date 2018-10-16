// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';
import { withRouter } from 'react-router';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';
import { history } from 'components/ConnectedRouter';

import injectSagas from 'utils/injectSagas';

import ModalContainer from 'containers/Modal';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';

import saga, {
  reducer,
  logout,
  requestUser,
  openNavbar,
  closeNavbar,
  requestGlobalSearch,
  openModal,
  closeModal,
  requestRegisterEmail,
  requestLogin,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  requestUser: Function,
  openNavbar: Function,
  closeNavbar: Function,
  globalSearchFilter: Map<*, *>,
  globalSearchData: Map<string, Object>,
  isGlobalSearchLoading: boolean,
  navbarOpen: boolean,
  requestGlobalSearch: Function,
  openModal: Function,
  closeModal: Function,
  requestRegisterEmail: Function,
  requestLogin: Function,
  modal: string,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestUser();
    }
    if (this.props.location.pathname === '/') {
      history.push('/freelancer-signup');
    }
  }
  render() {
    const {
      user,
      globalSearchData,
      globalSearchFilter,
      isGlobalSearchLoading,
      navbarOpen,
      modal,
      location: { pathname },
    } = this.props;

    return (
      <div>
        <PageMeta />
        <Switch>
          <Route path="/freelancer-signup" />
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
                globalSearchData={globalSearchData}
                globalSearchFilter={globalSearchFilter}
                isGlobalSearchLoading={isGlobalSearchLoading}
                navbarOpen={navbarOpen}
                requestGlobalSearch={this.props.requestGlobalSearch}
                openModal={this.props.openModal}
              />
            )}
          />
        </Switch>

        <Routes />

        <Switch>
          <Route path="/freelancer-signup" />
          <Route path="/" render={() => <Footer />} />
        </Switch>
        <ModalContainer
          modal={modal}
          openModal={this.props.openModal}
          onCloseModal={this.props.closeModal}
          requestRegisterEmail={this.props.requestRegisterEmail}
          requestLogin={this.props.requestLogin}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
  globalSearchFilter: state.getIn(['app', 'globalSearch', 'filter']),
  globalSearchData: state.getIn(['app', 'globalSearch', 'data']),
  isGlobalSearchLoading: state.getIn(['app', 'globalSearch', 'isLoading']),
  modal: state.getIn(['app', 'modal']),
});

const mapDispatchToProps = dispatch => ({
  logout: type => dispatch(logout(type)),
  replace: path => dispatch(replace(path)),
  requestUser: type => dispatch(requestUser(type)),
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
  requestGlobalSearch: (path, value) =>
    dispatch(requestGlobalSearch(path, value)),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal()),
  requestRegisterEmail: email => dispatch(requestRegisterEmail(email)),
  requestLogin: payload => dispatch(requestLogin(payload)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
