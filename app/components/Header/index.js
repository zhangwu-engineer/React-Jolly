// @flow

import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import { capitalize } from 'lodash-es';
import { matchPath } from 'react-router';
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
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';

import { history } from 'components/ConnectedRouter';
import UserAvatar from 'components/UserAvatar';
import Link from 'components/Link';
import Icon from 'components/Icon';
import BusinessSidebar from 'components/BusinessSidebar';

import LogoWhite from 'images/logo-white.png';
import SettingsIcon from 'images/sprite/settings.svg';
import LogoutIcon from 'images/sprite/logout.svg';
import People from 'images/sprite/people_outline.svg';
import HomeIcon from 'images/sprite/home.svg';
import ContactIcon from 'images/sprite/contact.svg';
import EmptyAvatar from 'images/sprite/empty_avatar.svg';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      height: 48,
      padding: 0,
    },
  },
  logoContainer: {
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
      display: 'none',
    },
  },
  logoText: {
    color: theme.palette.common.white,
    fontSize: 20,
    fontWeight: 600,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    display: 'none',
    fontSize: 14,
    fontWeight: 600,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
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
    backgroundColor: theme.palette.common.white,
    border: '2px solid #ffffff',
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
      margin: 0,
    },
  },
  businessAvatar: {
    width: 40,
    height: 40,
    margin: '0 auto',
    backgroundColor: theme.palette.primary.main,
    border: '2px solid #ffffff',
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
      paddingTop: 1,
      fontSize: 14,
    },
  },
  topMenuAvatar: {
    width: 30,
    height: 30,
    paddingTop: 1,
    fontWeight: 600,
    fontSize: 13,
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
    padding: '20px 25px',
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
  menuDivider: {
    height: 1,
  },
  dividedSection: {
    padding: '16px 0px',
  },
  dividedBusinesses: {
    padding: '15px 30px 5px 30px',
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
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    padding: 0,
    paddingLeft: 25,
    paddingRight: 40,
    height: 70,
    '&:hover': {
      backgroundColor: '#083f76',
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
  link: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'none',
    textDecoration: 'none',
  },
  hide: {
    display: 'none',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.common.white,
    textTransform: 'capitalize',
  },
  feedButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 48,
      width: 48,
    },
  },
  businessButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    height: 70,
    width: 70,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 48,
      width: 48,
      marginRight: 5,
    },
  },
  networkButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 48,
      width: 48,
      marginRight: 5,
    },
  },
  businessSidebarButton: {
    display: 'none',
    [theme.breakpoints.down('lg')]: {
      display: 'block',
    },
  },
  businessInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
});

type Props = {
  user: Object,
  work: ?Object,
  classes: Object,
  pathname: string,
  logout: Function,
  match: Object,
};

type State = {
  open: boolean,
  side: boolean,
  businessSide: boolean,
};

class Header extends Component<Props, State> {
  state = {
    open: false,
    side: false,
    businessSide: false,
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
  toggleBusinessSideDrawer = open => () => {
    this.setState({
      businessSide: open,
    });
  };
  anchorEl: HTMLElement;
  renderMenu = () => {
    const { user, classes } = this.props;
    const isBusiness = user && user.get('isBusiness');
    const businesses = user && user.get('businesses');
    const nameLength = user
      ? user.get('firstName').length + user.get('lastName').length
      : 0;
    return (
      <Fragment>
        <Grid container className={classes.menuTop} alignItems="center">
          <Grid item>
            {user && user.getIn(['profile', 'avatar']) ? (
              <Avatar
                className={classes.menuAvatar}
                src={user && user.getIn(['profile', 'avatar'])}
              />
            ) : (
              <Icon glyph={EmptyAvatar} className={classes.menuAvatar} />
            )}
          </Grid>
          <Grid item>
            {user ? (
              <Typography variant="h6" className={classes.menuName}>
                {nameLength > 10
                  ? `${user.get('firstName')} ${user
                      .get('lastName')
                      .charAt(0)}.`
                  : `${user.get('firstName')} ${user.get('lastName')}`}
              </Typography>
            ) : (
              <Typography variant="h6" className={classes.menuName}>
                Your Profile
              </Typography>
            )}
            {user ? (
              <Link
                className={classes.link}
                onClick={e => {
                  this.handleClose(e);
                  history.push(`/edit`);
                }}
              >
                View My Profile
              </Link>
            ) : (
              <Button
                color="primary"
                component={props => <Link to="/freelancer-signup" {...props} />}
                className={classes.createAccountButton}
              >
                Create Account
              </Button>
            )}
          </Grid>
        </Grid>
        {user ? (
          <div>
            <MenuList className={classes.menuList}>
              <MenuItem
                className={classes.menuItem}
                onClick={e => {
                  this.handleClose(e);
                  history.push('/settings');
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <Icon glyph={SettingsIcon} size={18} />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.menuItemText }}
                  primary="Edit Profile &amp; Settings"
                />
              </MenuItem>
              <MenuItem
                className={classes.menuItem}
                onClick={e => {
                  this.handleClose(e);
                  window.open('https://www.joinjolly.com/contact', '_blank');
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <Icon glyph={ContactIcon} size={18} />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.menuItemText }}
                  primary="Contact"
                />
              </MenuItem>
              <MenuItem
                className={classes.menuItem}
                onClick={this.handleLogout}
              >
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
            {isBusiness && (
              <Grid className={classes.dividedSection}>
                <Divider className={classes.menuDivider} />
                <Grid className={classes.dividedBusinesses}>
                  <Typography
                    classes={{ primary: classes.menuItemText }}
                    color="textSecondary"
                    display="block"
                    variant="caption"
                  >
                    Businesses
                  </Typography>
                </Grid>
                <MenuList id="menu-list">
                  {this.renderBusinesses(businesses, classes)}
                </MenuList>
              </Grid>
            )}
          </div>
        ) : (
          <div className={classes.menuBottom}>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.joinButton}
                  onClick={() => history.push('/freelancer-signup')}
                >
                  Join Jolly
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  fullWidth
                  className={cx(classes.joinButton, classes.signInButton)}
                  onClick={() => history.push('/sign-in')}
                >
                  or Sign In
                </Button>
              </Grid>
            </Grid>
            <Grid container className={classes.learnButtonWrapper}>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  fullWidth
                  className={cx(
                    classes.joinButton,
                    classes.signInButton,
                    classes.learnButton
                  )}
                  href="https://www.joinjolly.com"
                >
                  Learn More About Jolly
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </Fragment>
    );
  };
  renderBusinesses(businesses, classes) {
    let items = null;
    if (businesses)
      items = businesses.toJSON().map(b => (
        <MenuItem
          className={classes.menuItem}
          onClick={() => history.push(`/b/${b.slug}`)}
          key={b.id}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <UserAvatar
              className={`${classes.businessAvatar} ${classes.topMenuAvatar}`}
              content={b && b.name}
            />
          </ListItemIcon>
          <ListItemText
            className={classes.menuItemText}
            inset
            primary={b.name}
          />
        </MenuItem>
      ));
    return items;
  }
  render() {
    const { user, work, classes, pathname } = this.props;
    const { open, side, businessSide } = this.state;
    const workDetailBack =
      user && work && user.get('slug') !== work.getIn(['user', 'slug'])
        ? `${capitalize(work.getIn(['user', 'firstName']))} ${capitalize(
            work.getIn(['user', 'lastName']).charAt(0)
          )}.`
        : '';
    const match = matchPath(pathname, {
      path: '/f/:slug',
    });
    const isProfilePage = match && match.isExact && user;
    const workDetailMatch = matchPath(pathname, {
      path: '/f/:slug/e/:eventSlug',
    });

    const matchBusiness = matchPath(pathname, {
      path: '/b/:slug',
    });

    let isPrivateBusinessPage = false;
    let currentBusiness = null;
    if (matchBusiness) {
      const {
        params: { slug },
      } = matchBusiness;
      const isBusinessUser = user && user.get('isBusiness');
      const businesses = user && user.get('businesses');
      const isBusinessPage = matchBusiness && matchBusiness.isExact;
      currentBusiness = businesses
        .toJSON()
        .find(element => element.slug === slug);
      isPrivateBusinessPage =
        isBusinessUser && isBusinessPage && currentBusiness;
    }

    const isWorkDetailPage = workDetailMatch && workDetailMatch.isExact;
    const showFeedButton =
      isProfilePage ||
      isWorkDetailPage ||
      pathname.includes('/edit') ||
      pathname.includes('/network') ||
      pathname.includes('/feed') ||
      pathname.includes('/settings');
    const hideTopRightButtons =
      pathname.includes('/types-of-work') ||
      (pathname.includes('/e/') && pathname.includes('work'));
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        {isPrivateBusinessPage && (
          <Grid item>
            <Button
              onClick={this.toggleBusinessSideDrawer(true)}
              color="inherit"
              className={`${classes.businessSidebarButton} ${
                classes.businessButton
              }`}
            >
              <Fragment>
                <UserAvatar
                  className={classes.businessAvatar}
                  content={currentBusiness && currentBusiness.name}
                />
              </Fragment>
            </Button>
          </Grid>
        )}
        <Link
          className={classes.logoContainer}
          onClick={() => {
            if (!pathname.includes('/ob')) {
              history.push('/');
            }
          }}
        >
          <img className={classes.logo} src={LogoWhite} alt="logo" />
          <Typography className={classes.logoText}>J</Typography>
        </Link>
        <Grid item>
          <Button
            className={cx(classes.backButton, {
              [classes.shownOnSmallDevice]:
                pathname.includes('/email-sign-in') ||
                pathname.includes('/forgot-password') ||
                pathname.includes('/reset-password') ||
                pathname.includes('/privacy-policy') ||
                pathname.includes('/freelancer-signup-2') ||
                hideTopRightButtons,
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
              } else if (
                pathname.includes('/settings/general') ||
                pathname.includes('/settings/profile')
              ) {
                history.push('/settings');
              } else if (pathname.includes('/e/') && work) {
                if (user && user.get('slug') === work.getIn(['user', 'slug'])) {
                  history.push('/edit');
                } else {
                  history.push(`/f/${work.getIn(['user', 'slug'])}`);
                }
              } else {
                history.push('/edit');
              }
            }}
          >
            <ArrowBackIcon />
            &nbsp;&nbsp;&nbsp;
            <Typography className={classes.backButtonText}>
              {workDetailBack}
            </Typography>
          </Button>
          {showFeedButton && (
            <Link to="/feed" className={classes.feedButton}>
              <Icon glyph={HomeIcon} size={30} />
            </Link>
          )}
        </Grid>
        <Grid
          item
          className={cx({
            [classes.hide]: pathname.includes('/ob'),
          })}
        >
          <Grid container alignItems="center">
            {user && (
              <Grid item>
                <Link to="/network" className={classes.networkButton}>
                  <Icon glyph={People} size={30} />
                </Link>
              </Grid>
            )}
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
                      <Icon
                        glyph={EmptyAvatar}
                        className={classes.emptyAvatar}
                      />
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
                      <Icon
                        glyph={EmptyAvatar}
                        className={classes.emptyAvatar}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <MenuIcon />
                )}
              </Button>
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
              <Drawer
                anchor="left"
                open={businessSide}
                onClose={this.toggleBusinessSideDrawer(false)}
              >
                <BusinessSidebar business={currentBusiness} colorfulSideTop />
              </Drawer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
