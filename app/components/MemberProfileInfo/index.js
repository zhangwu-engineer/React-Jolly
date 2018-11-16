// @flow

import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';
import PhotoModal from 'components/PhotoModal';

import EmptyAvatarImg from 'images/empty_avatar.png';
import FacebookIcon from 'images/sprite/facebook.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';
import YoutubeIcon from 'images/sprite/youtube.svg';

const styles = theme => ({
  root: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  },
  topSection: {
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '13px',
    },
  },
  imageButton: {
    position: 'absolute',
    top: 30,
    right: 60,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '53px',
      display: 'none',
    },
  },
  smallImageButton: {
    position: 'absolute',
    top: 30,
    right: 60,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '53px',
      display: 'flex',
    },
  },
  avatarContainer: {
    position: 'absolute',
    left: 30,
    bottom: -60,
    padding: 3,
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 2px 4px 0 rgba(187, 187, 187, 0.5)',
    [theme.breakpoints.down('xs')]: {
      left: '50%',
      bottom: '-47.5px',
      transform: 'translate(-50%)',
    },
  },
  avatar: {
    width: 120,
    height: 120,
    [theme.breakpoints.down('xs')]: {
      width: 95,
      height: 95,
    },
  },
  backgroundImage: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    height: '342px',
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))',
    [theme.breakpoints.down('xs')]: {
      height: '180px',
    },
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    paddingBottom: 20,
    paddingTop: 80,
  },
  username: {
    fontSize: 24,
    fontWeight: 500,
    textTransform: 'capitalize',
    marginLeft: 30,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  distance: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  location: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  bio: {
    fontSize: 18,
    marginLeft: 30,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      marginTop: 20,
    },
  },
  socialButtons: {
    marginLeft: 30,
    marginRight: 30,
    width: 'auto',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  iconButton: {
    '&:hover svg': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  icon: {
    color: '#b3b9bf',
    fill: '#b3b9bf',
  },
});

type Props = {
  user: Object,
  files: Object,
  classes: Object,
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
    const avatarImg = user.getIn(['profile', 'avatar']) || EmptyAvatarImg;
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
          <IconButton className={classes.shareButton}>
            <ShareIcon />
          </IconButton>
          <div className={classes.avatarContainer}>
            <Avatar className={classes.avatar} src={avatarImg} />
          </div>
        </div>
        <div className={classes.bottomSection}>
          <Typography className={classes.username}>
            {`${user.get('firstName')} ${user.get('lastName')}`}
          </Typography>
          {user.getIn(['profile', 'distance']) && (
            <Typography className={classes.distance}>
              {`Works within ${user.getIn(['profile', 'distance'])} of`}
            </Typography>
          )}
          {user.getIn(['profile', 'location']) && (
            <Typography className={classes.location}>
              {user.getIn(['profile', 'location'])}
            </Typography>
          )}
          {user.getIn(['profile', 'bio']) && (
            <Fragment>
              <Divider className={classes.divider} />
              <Typography className={classes.bio}>
                {user.getIn(['profile', 'bio'])
                  ? user.getIn(['profile', 'bio'])
                  : `Hey, I am ${user.get('firstName')} ${user.get(
                      'lastName'
                    )}...`}
              </Typography>
              <Grid container className={classes.socialButtons}>
                <Grid item>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() =>
                      this.openUrl(
                        `https://www.facebook.com/${user.getIn([
                          'profile',
                          'facebook',
                        ])}`
                      )
                    }
                  >
                    <Icon glyph={FacebookIcon} className={classes.icon} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() =>
                      this.openUrl(
                        `https://www.twitter.com/${user.getIn([
                          'profile',
                          'twitter',
                        ])}`
                      )
                    }
                  >
                    <Icon glyph={TwitterIcon} className={classes.icon} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() =>
                      this.openUrl(
                        `https://www.linkedin.com/${user.getIn([
                          'profile',
                          'linkedin',
                        ])}`
                      )
                    }
                  >
                    <Icon glyph={LinkedInIcon} className={classes.icon} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() =>
                      this.openUrl(
                        `https://www.youtube.com/${user.getIn([
                          'profile',
                          'youtube',
                        ])}`
                      )
                    }
                  >
                    <Icon glyph={YoutubeIcon} className={classes.icon} />
                  </IconButton>
                </Grid>
              </Grid>
            </Fragment>
          )}
        </div>
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
