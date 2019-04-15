// @flow

import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'components/Routes';

import load from 'utils/load';

const User = load(() => import('./User'));

type Props = {
  url: string,
};

class Routes extends Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route exact path={url} render={props => <User {...props} />} />
      </Switch>
    );
  }
}

export default Routes;
