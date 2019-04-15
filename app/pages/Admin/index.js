// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import Header from 'components/Header/Admin';
import { logoutAdmin } from 'containers/App/sagas';
import Routes from './routes';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  sidebar: {
    width: 250,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  content: {
    flex: 1,
  },
});

type Props = {
  user: Object,
  location: Object,
  classes: Object,
  logoutAdmin: Function,
};

class Admin extends Component<Props> {
  render() {
    const {
      user,
      location: { pathname },
      classes,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.sidebar} />
        <div className={classes.content}>
          <Header
            user={user}
            pathname={pathname}
            logout={this.props.logoutAdmin}
          />
          <Routes />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'adminUser']),
});

const mapDispatchToProps = dispatch => ({
  logoutAdmin: () => dispatch(logoutAdmin()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Admin);
