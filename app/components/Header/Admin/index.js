// @flow

import React, { Component, Fragment } from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';

import LogoutIcon from 'images/sprite/logout.svg';
import EmptyAvatar from 'images/sprite/empty_avatar.svg';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
    position: 'relative',
    boxShadow: '0 5px 19px 0 rgba(0, 0, 0, 0.07)',
    [theme.breakpoints.down('xs')]: {
      height: 48,
      padding: 0,
    },
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
  avatar: {
    backgroundColor: theme.palette.common.white,
    border: '2px solid #ffffff',
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
      margin: 0,
    },
  },
  emptyAvatar: {
    marginRight: 10,
    width: 40,
    height: 40,
    backgroundColor: theme.palette.common.white,
    border: '2px solid #ffffff',
    borderRadius: 40,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
      margin: 0,
    },
  },
  menu: {
    boxShadow: '0 5px 19px 0 rgba(0, 0, 0, 0.07)',
  },
  menuTop: {
    padding: 25,
    backgroundColor: '#f2f9ff',
  },
  menuAvatar: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#343434',
    textTransform: 'capitalize',
  },
  createAccountButton: {
    fontSize: 14,
    fontWeight: 600,
    padding: 0,
    textTransform: 'capitalize',
  },
  location: {
    fontSize: 12,
    color: '#323232',
  },
  menuBottom: {
    padding: '40px 20px 0px 20px',
    minWidth: 247,
    [theme.breakpoints.down('xs')]: {
      minWidth: 285,
    },
  },
  joinButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 10,
  },
  signInButton: {
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  learnButtonWrapper: {
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  learnButton: {
    marginTop: 20,
  },
  menuButton: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    padding: 0,
    paddingLeft: 25,
    paddingRight: 40,
    height: 70,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&:active': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileMenuButton: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    display: 'none',
    padding: 0,
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
  noPadding: {
    padding: 0,
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
    fontSize: 14,
    fontWeight: 600,
    color: '#343434',
  },
  hide: {
    display: 'none',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

type Props = {
  user: Object,
  work: ?Object,
  classes: Object,
  pathname: string,
  logout: Function,
};

type State = {
  open: boolean,
  side: boolean,
};

class AdminHeader extends Component<Props, State> {
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
      history.push('/admin/signin');
    });
  };
  toggleDrawer = open => () => {
    this.setState({
      side: open,
    });
  };
  anchorEl: HTMLElement;
  renderMenu = () => {
    const { classes } = this.props;
    return (
      <Fragment>
        <MenuList className={classes.menuList}>
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
    const { user, classes } = this.props;
    const { open, side } = this.state;
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item />
        <Grid item>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            onClick={this.handleToggle}
            color="inherit"
            className={classes.menuButton}
          >
            {user ? (
              <Fragment>
                {user.getIn(['profile', 'avatar']) ? (
                  <Avatar
                    src={user.getIn(['profile', 'avatar'])}
                    className={classes.avatar}
                  />
                ) : (
                  <Icon glyph={EmptyAvatar} className={classes.emptyAvatar} />
                )}
                <Typography className={classes.name}>
                  {`${user.get('firstName')} ${user
                    .get('lastName')
                    .charAt(0)}.`}
                </Typography>
              </Fragment>
            ) : (
              <MenuIcon />
            )}
          </Button>
          <Popper
            open={open}
            anchorEl={this.anchorEl}
            transition
            placement="bottom-end"
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper square classes={{ root: classes.menu }}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    {this.renderMenu()}
                  </ClickAwayListener>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Button
            onClick={this.toggleDrawer(true)}
            color="inherit"
            className={classes.mobileMenuButton}
          >
            {user ? (
              <React.Fragment>
                {user.getIn(['profile', 'avatar']) ? (
                  <Avatar
                    src={user.getIn(['profile', 'avatar'])}
                    className={classes.avatar}
                  />
                ) : (
                  <Icon glyph={EmptyAvatar} className={classes.emptyAvatar} />
                )}
              </React.Fragment>
            ) : (
              <MenuIcon />
            )}
          </Button>
          <Drawer anchor="right" open={side} onClose={this.toggleDrawer(false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer(false)}
              onKeyDown={this.toggleDrawer(false)}
            >
              {this.renderMenu()}
            </div>
          </Drawer>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(AdminHeader);
