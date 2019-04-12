// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'components/Routes';
import storage from 'store';
import { get } from 'lodash-es';

type Props = {
  render: Function,
  location?: Object,
};

class PrivateRoute extends Component<Props> {
  render() {
    const { render, ...rest } = this.props;
    const pathname = get(rest, ['location', 'pathname']);
    const isAdminPath = pathname.startsWith('/admin');
    const isAuthenticated = storage.get(isAdminPath ? 'adminUser' : 'user');
    const redirect = isAdminPath ? '/admin/signin' : '/sign-in';
    return (
      <Route
        render={props =>
          isAuthenticated ? (
            render(props)
          ) : (
            <Redirect
              to={{
                pathname: redirect,
                search: `?redirect=${pathname}`,
              }}
            />
          )
        }
        {...rest}
      />
    );
  }
}

export default PrivateRoute;
