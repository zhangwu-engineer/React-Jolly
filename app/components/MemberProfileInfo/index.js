// @flow

import React, { Component, Fragment } from 'react';
import { capitalize } from 'lodash-es';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItemText from '@material-ui/core/ListItemText';
import ImageIcon from '@material-ui/icons/Image';

import { history } from 'components/ConnectedRouter';
import UserAvatar from 'components/UserAvatar';
import Badge from 'components/Badge';
import Icon from 'components/Icon';
import ConnectIcon from 'images/sprite/connect.svg';
import ConnectSentIcon from 'images/sprite/connect_sent.svg';
import ShareIcon from 'images/sprite/share.svg';

const styles = theme => ({
  root: {},
  topSection: {
    position: 'relative',
  },
  imageButton: {
    position: 'absolute',
    top: 13,
    right: 25,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallImageButton: {
    position: 'absolute',
    top: 13,
    right: 25,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  avatarContainer: {
    position: 'absolute',
    left: 80,
    bottom: -40,
    padding: 5,
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      left: 25,
      bottom: -33,
    },
  },
  avatar: {
    width: 150,
    height: 150,
    [theme.breakpoints.down('xs')]: {
      width: 85,
      height: 85,
    },
  },
  backgroundImage: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    height: '258px',
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))',
    [theme.breakpoints.down('xs')]: {
      height: '168px',
    },
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    padding: '20px 25px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px',
      bottom: -44,
    },
  },
  connectButtonBox: {
    marginRight: 15,
  },
  connectButton: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    padding: '10px 30px 10px 20px',
    borderRadius: 0,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.14)',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  connectionSentButton: {
    backgroundColor: '#14a384',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#14a384',
    },
  },
  connectIcon: {
    marginRight: 5,
    position: 'relative',
    top: -1,
  },
  shareButton: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.15)',
    padding: 14,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    height: 170,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      padding: '50px 25px 25px 25px',
      height: 'auto',
    },
  },
  nameSection: {
    paddingLeft: 80,
    paddingTop: 15,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      textAlign: 'left',
      marginBottom: 25,
    },
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#2c2c2c',
  },
  location: {
    fontSize: 14,
    fontWeight: 600,
    color: '#696969',
  },
  menu: {
    width: 190,
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
  },
  menuItem: {
    paddingTop: 3,
    paddingBottom: 3,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0c74d4',
  },
  badgeSection: {
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
});

type Props = {
  currentUser: Object,
  user: Object,
  badges: Object,
  isConnectionSent: boolean,
  classes: Object,
  openShareModal: Function,
  openPhotoModal: Function,
  connect: Function,
  connectionInformation: string,
  requestDeleteConnection: Function,
};

type State = {
  isMenuOpen: boolean,
};

class MemberProfileInfo extends Component<Props, State> {
  state = {
    isMenuOpen: false,
  };
  handleToggle = () => {
    const { isConnectionSent } = this.props;
    if (!isConnectionSent) {
      this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
    }
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ isMenuOpen: false });
  };
  openUrl = url => {
    window.open(url, '_blank');
  };
  handleConnect = params => {
    const { currentUser, user } = this.props;
    if (currentUser && currentUser.get('id') !== user.get('id')) {
      this.props.connect(
        user.get('id'),
        params.isCoworker
      );
    } else {
      history.push('/freelancer-signup');
    }
  };
  handleDisconnect = () => {
    const { user } = this.props;
    this.props.requestDeleteConnection(user.get('id'));
  };
  anchorEl: HTMLElement;
  displayConnectionState = () => {
    const { isConnectionSent, connectionInformation } = this.props;
    if (connectionInformation === 'coworker') return 'Coworker';
    if (connectionInformation === 'generic') return 'Connected';
    if (isConnectionSent) return 'Request Sent';
    return '';
  };
  render() {
    const {
      user,
      badges,
      isConnectionSent,
      classes,
      connectionInformation,
    } = this.props;
    const { isMenuOpen } = this.state;
    const avatarImg = user.getIn(['profile', 'avatar']) || '';
    const connectionEstablished = ['coworker', 'generic'].includes(
      connectionInformation
    );
    const isCoWorker = connectionInformation === 'coworker';
    const connected = connectionEstablished || isConnectionSent;
    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div
            className={classes.backgroundImage}
            style={{
              backgroundImage: `url('${user.getIn([
                'profile',
                'backgroundImage',
              ])}')`,
            }}
          >
            <div className={classes.overlay} />
          </div>
          {user.getIn(['profile', 'showImageLibrary']) && (
            <Fragment>
              <IconButton
                className={classes.imageButton}
                onClick={() => this.props.openPhotoModal('gallery')}
              >
                <ImageIcon />
              </IconButton>
              <IconButton
                className={classes.smallImageButton}
                onClick={() => history.push(`/f/${user.get('slug')}/gallery`)}
              >
                <ImageIcon />
              </IconButton>
            </Fragment>
          )}
          <Grid
            container
            justify="flex-end"
            alignItems="center"
            className={classes.buttonContainer}
          >
            <Grid item className={classes.connectButtonBox}>
              <Button
                className={cx(classes.connectButton, {
                  [classes.connectionSentButton]: connected,
                })}
                onClick={this.handleToggle}
                buttonRef={node => {
                  this.anchorEl = node;
                }}
              >
                <Icon
                  glyph={connected ? ConnectSentIcon : ConnectIcon}
                  width={23}
                  height={13}
                  className={classes.connectIcon}
                />
                {connected ? this.displayConnectionState() : 'Connect'}
              </Button>
              <Popper
                open={isMenuOpen}
                anchorEl={this.anchorEl}
                transition
                placement="bottom-end"
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper square classes={{ root: classes.menu }}>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        {connectionEstablished &&
                          isCoWorker && (
                            <MenuList className={classes.menuList}>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={() => this.handleDisconnect()}
                              >
                                <ListItemText
                                  classes={{ primary: classes.menuItemText }}
                                  primary={`Disconnect from ${capitalize(
                                    user.get('firstName')
                                  )}`}
                                />
                              </MenuItem>
                            </MenuList>
                          )}
                        {connectionEstablished &&
                          !isCoWorker && (
                            <MenuList className={classes.menuList}>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.handleConnect({
                                    isCoworker: true,
                                  });
                                }}
                              >
                                <ListItemText
                                  classes={{ primary: classes.menuItemText }}
                                  primary={`I've worked with ${capitalize(
                                    user.get('firstName')
                                  )}`}
                                />
                              </MenuItem>
                            </MenuList>
                          )}
                        {!connectionEstablished &&
                          !isConnectionSent && (
                            <MenuList className={classes.menuList}>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.handleConnect({
                                    isCoworker: false,
                                  });
                                }}
                              >
                                <ListItemText
                                  classes={{ primary: classes.menuItemText }}
                                  primary={`Connect with ${capitalize(
                                    user.get('firstName')
                                  )}`}
                                />
                              </MenuItem>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.handleConnect({
                                    isCoworker: true,
                                  });
                                }}
                              >
                                <ListItemText
                                  classes={{ primary: classes.menuItemText }}
                                  primary={`I've worked with ${capitalize(
                                    user.get('firstName')
                                  )}`}
                                />
                              </MenuItem>
                            </MenuList>
                          )}
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Grid>
            <Grid item>
              <IconButton
                className={classes.shareButton}
                onClick={() => this.props.openShareModal('Top Profile')}
              >
                <Icon glyph={ShareIcon} size={18} />
              </IconButton>
            </Grid>
          </Grid>
          <div className={classes.avatarContainer}>
            <UserAvatar className={classes.avatar} src={avatarImg} />
          </div>
        </div>
        <Grid
          container
          className={classes.bottomSection}
          alignItems="center"
          justify="space-between"
        >
          <Grid item className={classes.nameSection}>
            <Typography className={classes.username}>
              {`${user.get('firstName') || ''} ${user.get('lastName') || ''}`}
            </Typography>
            {user.getIn(['profile', 'location']) && (
              <Typography className={classes.location}>
                {user.getIn(['profile', 'location'])}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.badgeSection}>
            <Grid container>
              {badges &&
                badges.map(
                  badge =>
                    badge.get('earned') ? (
                      <Grid item key={generate()} md={6}>
                        <Badge badge={badge} user={user} />
                      </Grid>
                    ) : null
                )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MemberProfileInfo);
