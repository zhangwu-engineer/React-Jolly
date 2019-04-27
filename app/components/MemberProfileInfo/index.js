// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import ImageIcon from '@material-ui/icons/Image';

import { history } from 'components/ConnectedRouter';
import PhotoModal from 'components/PhotoModal';
import UserAvatar from 'components/UserAvatar';

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
    },
  },
  connectButtonBox: {
    marginRight: 10,
  },
  connectButton: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    padding: '10px 38px',
    borderRadius: 0,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.14)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  shareButton: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    height: 170,
  },
  nameSection: {
    paddingLeft: 80,
    paddingTop: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#2c2c2c',
  },
  distance: {
    fontSize: 14,
    fontWeight: 600,
    color: '#696969',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    fontWeight: 600,
    color: '#696969',
    textAlign: 'center',
  },
});

type Props = {
  user: Object,
  files: Object,
  classes: Object,
  openShareModal: Function,
};

type State = {
  isOpen: boolean,
};

class MemberProfileInfo extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  openUrl = url => {
    window.open(url, '_blank');
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { user, files, classes } = this.props;
    const { isOpen } = this.state;
    const avatarImg = user.getIn(['profile', 'avatar']) || '';
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
                onClick={() => this.setState({ isOpen: true })}
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
              <Button className={classes.connectButton}>Connect</Button>
            </Grid>
            <Grid item>
              <IconButton
                className={classes.shareButton}
                onClick={() => this.props.openShareModal('Top Profile')}
              >
                <ShareIcon />
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
            {user.getIn(['profile', 'distance']) && (
              <Typography className={classes.distance}>
                {`Works within ${user.getIn(['profile', 'distance'])} miles of`}
              </Typography>
            )}
            {user.getIn(['profile', 'location']) && (
              <Typography className={classes.location}>
                {user.getIn(['profile', 'location'])}
              </Typography>
            )}
          </Grid>
          <Grid item className={classes.badgeSection} />
        </Grid>
        <PhotoModal
          user={user}
          files={files}
          isOpen={isOpen}
          onCloseModal={this.closeModal}
        />
      </div>
    );
  }
}

export default withStyles(styles)(MemberProfileInfo);
