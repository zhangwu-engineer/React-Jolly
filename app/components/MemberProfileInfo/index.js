// @flow

import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import Icon from 'components/Icon';

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
  addCoverButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: theme.palette.common.white,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'none',
    fontSize: 14,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  },
  shareButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    color: theme.palette.common.white,
  },
  avatarContainer: {
    position: 'absolute',
    left: 30,
    bottom: -60,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  editAvatarButton: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    boxShadow: '0 2px 4px 0 rgba(187, 187, 187, 0.5)',
    bottom: '10px',
    right: 0,
    padding: 5,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  overlay: {
    height: '342px',
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))',
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    paddingBottom: 20,
    paddingTop: 80,
  },
  editButtonContainer: {
    padding: '20px',
  },
  editButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  username: {
    fontSize: 24,
    fontWeight: 500,
    textTransform: 'capitalize',
    marginLeft: 30,
  },
  distance: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
  },
  location: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
  bio: {
    fontSize: 18,
    marginLeft: 30,
    marginBottom: 20,
  },
  socialButtons: {
    marginLeft: 30,
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
  classes: Object,
};

class MemberProfileInfo extends Component<Props> {
  openUrl = url => {
    window.open(url, '_blank');
  };
  render() {
    const { user, classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div>
            <div className={classes.overlay} />
          </div>
          <IconButton className={classes.shareButton}>
            <ShareIcon />
          </IconButton>
          <div className={classes.avatarContainer}>
            <Avatar className={classes.avatar} src={EmptyAvatarImg} />
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
      </div>
    );
  }
}

export default withStyles(styles)(MemberProfileInfo);
