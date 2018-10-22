// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Link from 'components/Link';

import LogoWhite from 'images/logo-white.png';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    backgroundColor: theme.palette.primary.main,
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 5,
  },
  logo: {
    width: 70,
    height: 45,
  },
  desc: {
    color: '#9dbad6',
    fontWeight: 500,
  },
  btnSignIn: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    fontSize: 14,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
});

type Props = {
  user: Object,
  classes: Object,
  pathname: string,
  logout: Function,
};

type State = {
  open: boolean,
};

class Header extends Component<Props, State> {
  state = {
    open: false,
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };
  handleLogout = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false }, () => {
      this.props.logout();
    });
  };
  anchorEl: HTMLElement;
  render() {
    const { user, classes, pathname } = this.props;
    const { open } = this.state;
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Link to="/">
            <img className={classes.logo} src={LogoWhite} alt="logo" />
          </Link>
        </Grid>
        <Grid item>
          {user ? (
            <Fragment>
              <Button
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                aria-owns={open ? 'menu-list-grow' : null}
                aria-haspopup="true"
                onClick={this.handleToggle}
              >
                <Avatar className={classes.avatar}>
                  <AccountCircleIcon />
                </Avatar>
              </Button>
              <Popper
                open={open}
                anchorEl={this.anchorEl}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          <MenuItem onClick={this.handleClose}>
                            Profile
                          </MenuItem>
                          <MenuItem onClick={this.handleClose}>
                            Settings
                          </MenuItem>
                          <MenuItem onClick={this.handleLogout}>
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Fragment>
          ) : (
            <Typography className={classes.desc}>
              Already a user?{' '}
              <Link
                to={
                  pathname === '/email-sign-in'
                    ? '/freelancer-signup'
                    : '/sign-in'
                }
                className={classes.btnSignIn}
              >
                {pathname === '/email-sign-in' ? 'Sign Up' : 'Sign In'}
              </Link>
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
