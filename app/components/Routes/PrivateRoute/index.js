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

const userPrivateRoute = [
  '/edit/personal-information',
  '/edit/avatar',
  '/edit/background-image',
  '/edit',
  '/settings',
  '/work',
  '/mobile',
  '/add',
];

class PrivateRoute extends Component<Props> {
  render() {
    const { render, ...rest } = this.props;
    const pathname = get(rest, ['location', 'pathname']);
    const isAuthenticated = storage.get('user');
    let redirect = '/';
    let isRedirect = true;
    for (let i = 0; i < userPrivateRoute.length; i += 1) {
      if (pathname.indexOf(userPrivateRoute[i]) !== -1) {
        redirect = pathname.replace(userPrivateRoute[i], '');
        isRedirect = false;
        break;
      }
    }
    return (
      <Route
        render={props =>
          isAuthenticated ? (
            render(props)
          ) : (
            <Redirect
              to={
                isRedirect
                  ? {
                      pathname: redirect,
                      search: `?redirect=${pathname}`,
                    }
                  : {
                      pathname: redirect,
                    }
              }
            />
          )
        }
        {...rest}
      />
    );
  }
}

export default PrivateRoute;
