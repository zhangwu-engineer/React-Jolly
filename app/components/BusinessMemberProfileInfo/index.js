// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import ShareIcon from 'images/sprite/share.svg';
import ConnectIcon from 'images/sprite/connect.svg';
import ConnectSentIcon from 'images/sprite/connect_sent.svg';

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
  classes: Object,
  business: Object,
  currentUser: Object,
  isConnectionSent: boolean,
  connectionInformation: Object,
  connect: Function,
};

type State = {};

class BusinessMemberProfileInfo extends Component<Props, State> {
  openUrl = url => {
    window.open(url, '_blank');
  };
  anchorEl: HTMLElement;
  displayConnectionState = () => {
    let status;
    const { isConnectionSent, connectionInformation } = this.props;

    if (connectionInformation) {
      if (connectionInformation.get('status') === 'CONNECTED') {
        status = 'Connected';
      } else if (connectionInformation.get('status') === 'PENDING') {
        status = 'Request Sent';
      }
    }

    if (isConnectionSent) status = 'Request Sent';
    return status;
  };
  handleToggle = () => {
    const { isConnectionSent } = this.props;
    if (!isConnectionSent) {
      this.handleConnect();
    }
  };
  handleConnect = () => {
    const { business, currentUser } = this.props;
    const connectParams = {};

    const toBusiness = business && business.get('id');
    const isBusiness = currentUser && currentUser.get('isBusiness');
    let foundSelfBusiness = null;

    if (isBusiness) {
      const businesses =
        currentUser &&
        currentUser.get('businesses') &&
        currentUser.get('businesses').toJSON();
      foundSelfBusiness = businesses.filter(
        b => b.get('id') === toBusiness.get('id')
      );
    }

    const isConnectable = !isBusiness || !foundSelfBusiness;

    if (isConnectable) {
      connectParams.connectionType = 'f2b';
      connectParams.to = toBusiness;
      this.props.connect(connectParams);
    } else {
      history.push('/');
    }
  };
  render() {
    const {
      classes,
      isConnectionSent,
      connectionInformation,
      business,
    } = this.props;

    const connectionEstablished =
      connectionInformation &&
      ['CONNECTED', 'PENDING'].includes(connectionInformation.get('status'));
    const connected = connectionEstablished || isConnectionSent;

    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div className={classes.backgroundImage}>
            <div className={classes.overlay} />
          </div>
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
              >
                <Icon
                  glyph={connected ? ConnectSentIcon : ConnectIcon}
                  width={23}
                  height={13}
                  className={classes.connectIcon}
                />
                {connected ? this.displayConnectionState() : 'Connect'}
              </Button>
            </Grid>
            <Grid item>
              <IconButton className={classes.shareButton}>
                <Icon glyph={ShareIcon} size={18} />
              </IconButton>
            </Grid>
          </Grid>
          <div className={classes.avatarContainer}>
            <UserAvatar className={classes.avatar} />
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
              {business && business.get('name')}
            </Typography>
            <Typography className={classes.location}>
              {business && business.get('category')}
              &nbsp;&sdot;&nbsp;
              {business && business.get('location')}
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(BusinessMemberProfileInfo);
