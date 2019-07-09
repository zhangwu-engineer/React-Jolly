// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import storage from 'store';
import { get } from 'lodash-es';
import { isMobile } from 'react-device-detect';

import { Route } from 'components/Routes';

type Props = {
  render: Function,
  renderMobile: Function,
  location?: Object,
};

class PrivateRoute extends Component<Props> {
  render() {
    const { render, renderMobile, ...rest } = this.props;
    const pathname = get(rest, ['location', 'pathname']);
    const isAdminPath = pathname.startsWith('/admin');
    const isAuthenticated = storage.get(isAdminPath ? 'adminUser' : 'user');
    const redirect = isAdminPath ? '/admin/signin' : '/sign-in';
    if (isAuthenticated) {
      return (
        <Route
          render={props =>
            renderMobile !== undefined && isMobile
              ? renderMobile(props)
              : render(props)
          }
          {...rest}
        />
      );
    }

    return (
      <Redirect
        to={{
          pathname: redirect,
          search: `?redirect=${pathname}`,
        }}
      />
    );
  }
}

export default PrivateRoute;
