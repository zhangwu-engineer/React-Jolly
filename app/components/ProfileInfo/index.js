// @flow

import React, { PureComponent } from 'react';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import CameraIcon from '@material-ui/icons/CameraAltOutlined';
import ImageIcon from '@material-ui/icons/Image';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';

import FacebookIcon from 'images/sprite/facebook.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';
import YoutubeIcon from 'images/sprite/youtube.svg';

const styles = theme => ({
  root: {},
  topSection: {
    position: 'relative',
  },
  addCoverButton: {
    position: 'absolute',
    top: 13,
    left: 18,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    padding: '10px 30px',
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      left: '15px',
      display: 'none',
    },
  },
  smallAddCoverButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: theme.palette.common.white,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'none',
    fontSize: 14,
    display: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      left: '15px',
      display: 'flex',
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
  shareButton: {
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '13px',
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
      left: '50%',
      bottom: '-47.5px',
      transform: 'translate(-50%)',
    },
  },
  avatar: {
    width: 150,
    height: 150,
    [theme.breakpoints.down('xs')]: {
      width: 95,
      height: 95,
    },
  },
  editAvatarButton: {
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.17)',
    bottom: 10,
    right: -10,
    padding: 13,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallEditAvatarButton: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    boxShadow: '0 2px 4px 0 rgba(187, 187, 187, 0.5)',
    bottom: '10px',
    right: 0,
    padding: 5,
    display: 'none',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
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
      height: '180px',
    },
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    paddingBottom: 20,
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 0,
    padding: '20px 25px',
  },
  editButtonBox: {
    marginRight: 10,
  },
  editButton: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    padding: '10px 38px',
    borderRadius: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallEditButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    display: 'none',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
    },
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
  bio: {
    fontSize: 18,
    marginLeft: 30,
    marginRight: 30,
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
  numberOfJobs: number,
  numberOfVerifications: number,
  numberOfEndorsements: number,
  classes: Object,
  openShareModal: Function,
  openPhotoModal: Function,
};

class ProfileInfo extends PureComponent<Props> {
  openUrl = url => {
    window.open(url, '_blank');
  };
  render() {
    const { user, classes } = this.props;
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
          <Button
            className={classes.addCoverButton}
            onClick={() => {
              this.props.openPhotoModal('backgroundImage');
            }}
          >
            {user.getIn(['profile', 'backgroundImage']) ? 'Change' : 'Add'}{' '}
            Cover Picture
          </Button>
          <Button
            className={classes.smallAddCoverButton}
            onClick={() => {
              history.push('/background-picture');
            }}
          >
            <CameraIcon />
            &nbsp;&nbsp;
            {user.getIn(['profile', 'backgroundImage']) ? 'Change' : 'Add'}{' '}
            cover
          </Button>
          <IconButton
            className={classes.imageButton}
            onClick={() => this.props.openPhotoModal('gallery')}
          >
            <ImageIcon />
          </IconButton>
          <IconButton
            className={classes.smallImageButton}
            onClick={() => {
              window.localStorage.setItem('privateGallery', 'yes');
              history.push(`/f/${user.get('slug')}/gallery`);
            }}
          >
            <ImageIcon />
          </IconButton>
          <Grid
            container
            justify="flex-end"
            alignItems="center"
            className={classes.editButtonContainer}
          >
            <Grid item className={classes.editButtonBox}>
              <Button
                className={classes.editButton}
                component={props => <Link to="/settings#general" {...props} />}
              >
                Edit Profile
              </Button>
              <Button
                className={classes.smallEditButton}
                component={props => <Link to="/settings" {...props} />}
              >
                Edit
              </Button>
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
            <IconButton
              className={classes.editAvatarButton}
              onClick={() => {
                this.props.openPhotoModal('avatar');
              }}
            >
              <EditIcon fontSize="medium" />
            </IconButton>
            <IconButton
              className={classes.smallEditAvatarButton}
              onClick={() => {
                history.push('/profile-picture');
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className={classes.bottomSection}>
          <Typography className={classes.username}>
            {`${user.get('firstName')} ${user.get('lastName')}`}
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
          <Typography className={classes.bio}>
            {user.getIn(['profile', 'bio'])
              ? user.getIn(['profile', 'bio'])
              : `Hi, I'm ${capitalize(user.get('firstName'))} ${capitalize(
                  user.get('lastName')
                )}...`}
          </Typography>
          <Grid container className={classes.socialButtons}>
            {user.getIn(['profile', 'facebook']) && (
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
            )}
            {user.getIn(['profile', 'twitter']) && (
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
            )}
            {user.getIn(['profile', 'linkedin']) && (
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() =>
                    this.openUrl(
                      `https://www.linkedin.com/in/${user.getIn([
                        'profile',
                        'linkedin',
                      ])}`
                    )
                  }
                >
                  <Icon glyph={LinkedInIcon} className={classes.icon} />
                </IconButton>
              </Grid>
            )}
            {user.getIn(['profile', 'youtube']) && (
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
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileInfo);
