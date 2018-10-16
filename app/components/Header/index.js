// @flow

import * as React from 'react';

import './styles.scss';

type Props = {
  user: Object,
  logout: Function,
  pathname: string,
  openModal: Function,
};

class Header extends React.Component<Props> {
  render() {
    return <div className="header">Header</div>;
  }
}

export default Header;
