// @flow

import React, { Component, Fragment } from 'react';
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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ImageIcon from '@material-ui/icons/Image';

import { history } from 'components/ConnectedRouter';
import UserAvatar from 'components/UserAvatar';
import Badge from 'components/Badge';
import Icon from 'components/Icon';
import ConnectIcon from 'images/sprite/connect.svg';
import ConnectSentIcon from 'images/sprite/connect_sent.svg';
import ShareIcon from 'images/sprite/share.svg';
import { DisconnectMenu } from './disconnectMenu';
import { CoworkerMenu } from './coworkerMenu';
import { ConnectMenu } from './connectMenu';

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
  member: Object,
  badges: Object,
  openShareModal: Function,
  openPhotoModal: Function,
  connect: Function,
  isConnectionSent: boolean,
  classes: Object,
  connectionInformation: Object,
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
    const { isConnectionSent, currentUser } = this.props;
    const isBusiness = (currentUser && currentUser.get('isBusiness')) || false;
    if (!isConnectionSent) {
      if (isBusiness) {
        this.handleConnect({
          isCoworker: false,
        });
      } else {
        this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
      }
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
    const { currentUser, member } = this.props;
    const connectParams = {};

    connectParams.toUserId = member.get('id');
    connectParams.isCoworker = params.isCoworker;

    if (currentUser && currentUser.get('isBusiness')) {
      connectParams.connectionType = 'b2f';
      const businesses =
        currentUser.get('businesses') && currentUser.get('businesses').toJSON();
      connectParams.from = businesses[0].id;
    }

    if (currentUser && currentUser.get('id') !== member.get('id')) {
      this.props.connect(connectParams);
    } else {
      history.push('/');
    }
  };
  handleDisconnect = () => {
    const { member } = this.props;
    this.props.requestDeleteConnection(member.get('id'));
  };
  anchorEl: HTMLElement;
  displayConnectionState = () => {
    let status;
    const { isConnectionSent, connectionInformation } = this.props;
    if (
      connectionInformation &&
      connectionInformation.get('connectionType') === 'f2f'
    ) {
      if (connectionInformation.get('status') === 'CONNECTED') {
        if (connectionInformation.get('isCoworker') === true) {
          status = 'Coworker';
        } else {
          status = 'Connected';
        }
      } else if (connectionInformation.get('status') === 'PENDING') {
        status = 'Request Sent';
      }
    } else if (
      connectionInformation &&
      connectionInformation.get('connectionType') === 'b2f'
    ) {
      if (connectionInformation.get('status') === 'CONNECTED') {
        status = 'Connected';
      } else {
        status = 'Request Sent';
      }
    }
    if (isConnectionSent) status = 'Request Sent';
    return status;
  };
  render() {
    const {
      currentUser,
      member,
      badges,
      isConnectionSent,
      classes,
      connectionInformation,
    } = this.props;
    const { isMenuOpen } = this.state;
    const avatarImg = member.getIn(['profile', 'avatar']) || '';
    const isBusiness = (currentUser && currentUser.get('isBusiness')) || false;
    const connectionEstablished =
      connectionInformation &&
      ['CONNECTED', 'PENDING'].includes(connectionInformation.get('status'));
    const isCoWorker =
      connectionInformation && connectionInformation.get('isCoworker');
    const connected = connectionEstablished || isConnectionSent;
    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div
            className={classes.backgroundImage}
            style={{
              backgroundImage: `url('${member.getIn([
                'profile',
                'backgroundImage',
              ])}')`,
            }}
          >
            <div className={classes.overlay} />
          </div>
          {member.getIn(['profile', 'showImageLibrary']) && (
            <Fragment>
              <IconButton
                className={classes.imageButton}
                onClick={() => this.props.openPhotoModal('gallery')}
              >
                <ImageIcon />
              </IconButton>
              <IconButton
                className={classes.smallImageButton}
                onClick={() => history.push(`/f/${member.get('slug')}/gallery`)}
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
                              <DisconnectMenu
                                classes={classes}
                                onClick={() => this.handleDisconnect()}
                                member={member}
                              />
                            </MenuList>
                          )}
                        {connectionEstablished &&
                          !isCoWorker &&
                          !isBusiness && (
                            <MenuList className={classes.menuList}>
                              <CoworkerMenu
                                classes={classes}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.handleConnect({
                                    isCoworker: true,
                                  });
                                }}
                                member={member}
                              />
                              <DisconnectMenu
                                classes={classes}
                                onClick={() => this.handleDisconnect()}
                                member={member}
                              />
                            </MenuList>
                          )}
                        {connectionEstablished &&
                          isBusiness && (
                            <DisconnectMenu
                              classes={classes}
                              onClick={() => this.handleDisconnect()}
                              member={member}
                            />
                          )}
                        {!connectionEstablished &&
                          !isConnectionSent && (
                            <MenuList className={classes.menuList}>
                              <ConnectMenu
                                classes={classes}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.handleConnect({
                                    isCoworker: false,
                                  });
                                }}
                                member={member}
                              />
                              {!isBusiness && (
                                <CoworkerMenu
                                  classes={classes}
                                  onClick={e => {
                                    this.handleClose(e);
                                    this.handleConnect({
                                      isCoworker: true,
                                    });
                                  }}
                                  member={member}
                                />
                              )}
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
              {`${member.get('firstName') || ''} ${member.get('lastName') ||
                ''}`}
            </Typography>
            {member.getIn(['profile', 'location']) && (
              <Typography className={classes.location}>
                {member.getIn(['profile', 'location'])}
              </Typography>
            )}
          </Grid>
          {member.getIn(['profile', 'showBadges']) && (
            <Grid item className={classes.badgeSection}>
              <Grid container>
                {badges &&
                  badges.map(
                    badge =>
                      badge.get('earned') ? (
                        <Grid item key={generate()} md={6}>
                          <Badge badge={badge} user={member} />
                        </Grid>
                      ) : null
                  )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MemberProfileInfo);
