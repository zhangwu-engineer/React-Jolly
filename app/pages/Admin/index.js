// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

import { history } from 'components/ConnectedRouter';
import Header from 'components/Header/Admin';
import { requestAdminUser, logoutAdmin } from 'containers/App/sagas';
import Logo from 'images/logo.png';
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
  topline: {
    height: 70,
    backgroundColor: theme.palette.common.white,
    position: 'relative',
    boxShadow: '0 5px 19px 0 rgba(0, 0, 0, 0.07)',
    paddingLeft: 20,
    paddingTop: 10,
    [theme.breakpoints.down('xs')]: {
      height: 48,
      padding: 0,
    },
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    paddingLeft: 30,
  },
  menuItemText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#343434',
  },
  content: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
});

type Props = {
  user: Object,
  location: Object,
  classes: Object,
  requestAdminUser: Function,
  logoutAdmin: Function,
};

class Admin extends Component<Props> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestAdminUser();
    }
  }
  render() {
    const {
      user,
      location: { pathname },
      classes,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <div className={classes.topline}>
            <img src={Logo} alt="logo" />
          </div>
          <MenuList className={classes.menuList}>
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                history.push('/admin');
              }}
            >
              <ListItemText
                classes={{ primary: classes.menuItemText }}
                primary="Users"
              />
            </MenuItem>
          </MenuList>
        </div>
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
  requestAdminUser: () => dispatch(requestAdminUser()),
  logoutAdmin: () => dispatch(logoutAdmin()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Admin);
