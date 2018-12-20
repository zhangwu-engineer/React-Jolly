// @flow

import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import Icon from 'components/Icon';

import LogoWhite from 'images/logo-white.png';
import UserIcon from 'images/sprite/user.svg';
import SettingsIcon from 'images/sprite/settings.svg';
import LogoutIcon from 'images/sprite/logout.svg';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    backgroundColor: theme.palette.primary.main,
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 5,
    color: theme.palette.common.white,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      height: 48,
      padding: 0,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  centerLogoContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  hiddenOnSmallDevice: {
    [theme.breakpoints.down('xs')]: {
      display: 'none !important',
    },
  },
  shownOnSmallDevice: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex !important',
    },
  },
  logo: {
    width: 70,
    height: 45,
    [theme.breakpoints.down('xs')]: {
      width: 46,
      height: 30,
    },
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    display: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
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
  menuTop: {
    padding: '30px 40px 20px 30px',
  },
  menuAvatar: {
    width: 54,
    height: 54,
    marginRight: 15,
    backgroundColor: theme.palette.common.gray,
  },
  menuName: {
    textTransform: 'capitalize',
  },
  menuButton: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '&:active': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileMenuButton: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    display: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '&:active': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      height: 48,
      width: 48,
      display: 'inline-flex',
    },
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    paddingLeft: 30,
  },
  menuItemIcon: {
    margin: 0,
  },
  menuItemText: {
    fontSize: 16,
    color: '#424242',
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
  side: boolean,
};

class Header extends Component<Props, State> {
  state = {
    open: false,
    side: false,
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
      history.push('/sign-in');
    });
  };
  toggleDrawer = open => () => {
    this.setState({
      side: open,
    });
  };
  anchorEl: HTMLElement;
  renderMenu = () => {
    const { user, classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.menuTop}>
          <Grid item>
            <Avatar
              className={classes.menuAvatar}
              src={user.getIn(['profile', 'avatar'])}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" className={classes.menuName}>
              {`${user.get('firstName')} ${user.get('lastName')}`}
            </Typography>
            <Typography>{user.getIn(['profile', 'location'])}</Typography>
          </Grid>
        </Grid>
        <MenuList className={classes.menuList}>
          <MenuItem
            className={classes.menuItem}
            onClick={e => {
              this.handleClose(e);
              history.push(`/f/${user.get('slug')}/edit`);
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <Icon glyph={UserIcon} size={18} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="Profile"
            />
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            onClick={e => {
              this.handleClose(e);
              history.push(`/f/${user.get('slug')}/settings`);
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <Icon glyph={SettingsIcon} size={18} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="Settings"
            />
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={this.handleLogout}>
            <ListItemIcon className={classes.menuItemIcon}>
              <Icon glyph={LogoutIcon} size={18} />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              inset
              primary="Log out"
            />
          </MenuItem>
        </MenuList>
      </Fragment>
    );
  };
  render() {
    const { user, classes, pathname } = this.props;
    const { open, side } = this.state;
    const hideLogo = pathname.includes('/f/');
    const hideTopRightButtons =
      pathname.includes('/settings') ||
      pathname.includes('/personal-information') ||
      pathname.includes('/work');
    let title = '';
    if (pathname.includes('/settings')) {
      title = 'Settings';
    } else if (pathname.includes('/personal-information')) {
      title = 'Profile Information';
    } else if (pathname.includes('/work')) {
      title = 'Talents & Rates';
    }
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Link
            to="/"
            className={cx(classes.logoContainer, {
              [classes.centerLogoContainer]:
                user ||
                pathname.includes('/email-sign-in') ||
                pathname.includes('/forgot-password') ||
                pathname.includes('/reset-password') ||
                pathname.includes('/email-verification') ||
                pathname.includes('/privacy-policy') ||
                pathname.includes('/freelancer-signup-2'),
              [classes.hiddenOnSmallDevice]: hideLogo,
            })}
          >
            <img className={classes.logo} src={LogoWhite} alt="logo" />
          </Link>
          <Button
            className={cx(classes.backButton, {
              [classes.shownOnSmallDevice]:
                pathname.includes('/email-sign-in') ||
                pathname.includes('/forgot-password') ||
                pathname.includes('/reset-password') ||
                pathname.includes('/privacy-policy') ||
                pathname.includes('/freelancer-signup-2'),
            })}
            onClick={() => {
              if (pathname.includes('/email-sign-in')) {
                history.replace('/sign-in');
              } else if (pathname.includes('/freelancer-signup-2')) {
                history.replace('/freelancer-signup');
              } else if (pathname.includes('/forgot-password')) {
                history.replace('/email-sign-in');
              } else if (pathname.includes('/reset-password')) {
                history.replace('/email-sign-in');
              } else if (pathname.includes('/privacy-policy')) {
                history.replace('/freelancer-signup-2');
              }
            }}
          >
            <ArrowBackIcon />
          </Button>
          {user && (
            <Button
              className={cx(classes.backButton, {
                [classes.shownOnSmallDevice]: hideTopRightButtons,
              })}
              component={props => (
                <Link to={`/f/${user.get('slug')}/edit`} {...props} />
              )}
            >
              <ArrowBackIcon />
              &nbsp;&nbsp;&nbsp;
              {title}
            </Button>
          )}
        </Grid>
        <Grid item>
          {user ? (
            <Fragment>
              <Button
                className={cx({
                  [classes.hiddenOnSmallDevice]: hideTopRightButtons,
                })}
                onClick={() => {
                  history.push(`/f/${user.get('slug')}/edit`);
                }}
              >
                <Avatar className={classes.avatar}>
                  <AccountCircleIcon />
                </Avatar>
              </Button>
              <Button
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                onClick={this.handleToggle}
                color="inherit"
                variant="fab"
                className={classes.menuButton}
              >
                <MenuIcon />
              </Button>
              <Button
                onClick={this.toggleDrawer(true)}
                color="inherit"
                variant="fab"
                className={cx(classes.mobileMenuButton, {
                  [classes.hiddenOnSmallDevice]: hideTopRightButtons,
                })}
              >
                <MenuIcon />
              </Button>
              <Popper
                open={open}
                anchorEl={this.anchorEl}
                transition
                placement="bottom-end"
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        {this.renderMenu()}
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
              <Drawer
                anchor="right"
                open={side}
                onClose={this.toggleDrawer(false)}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer(false)}
                  onKeyDown={this.toggleDrawer(false)}
                >
                  {this.renderMenu()}
                </div>
              </Drawer>
            </Fragment>
          ) : (
            <Typography
              className={cx(classes.desc, {
                [classes.hiddenOnSmallDevice]:
                  pathname.includes('/email-sign-in') ||
                  pathname.includes('/forgot-password') ||
                  pathname.includes('/reset-password') ||
                  pathname.includes('/email-verification') ||
                  pathname.includes('/privacy-policy') ||
                  pathname.includes('/freelancer-signup-2'),
              })}
            >
              {pathname === '/email-sign-in'
                ? 'No account yet? '
                : 'Already a user? '}
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
