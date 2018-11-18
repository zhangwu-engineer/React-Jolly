// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import CameraIcon from '@material-ui/icons/CameraAltOutlined';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import { history } from 'components/ConnectedRouter';
import PhotoModal from 'components/PhotoModal';
import Link from 'components/Link';
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
  files: Object,
  classes: Object,
  uploadPhoto: Function,
  updateUser: Function,
  openShareModal: Function,
};

type State = {
  type: string,
  isOpen: boolean,
};

class ProfileInfo extends Component<Props, State> {
  state = {
    type: '',
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
    const { isOpen, type } = this.state;
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
          <Button
            className={classes.addCoverButton}
            onClick={() => {
              this.setState({ type: 'backgroundImage', isOpen: true });
            }}
          >
            <CameraIcon />
            &nbsp;&nbsp;
            {user.getIn(['profile', 'backgroundImage']) ? 'Change' : 'Add'}{' '}
            cover
          </Button>
          <Button
            className={classes.smallAddCoverButton}
            onClick={() => {
              history.push(`/f/${user.get('slug')}/edit/background-image`);
            }}
          >
            <CameraIcon />
            &nbsp;&nbsp;
            {user.getIn(['profile', 'backgroundImage']) ? 'Change' : 'Add'}{' '}
            cover
          </Button>
          <IconButton
            className={classes.shareButton}
            onClick={this.props.openShareModal}
          >
            <ShareIcon />
          </IconButton>
          <div className={classes.avatarContainer}>
            <Avatar className={classes.avatar} src={avatarImg} />
            <IconButton
              className={classes.editAvatarButton}
              onClick={() => {
                this.setState({ type: 'avatar', isOpen: true });
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              className={classes.smallEditAvatarButton}
              onClick={() => {
                history.push(`/f/${user.get('slug')}/edit/avatar`);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className={classes.bottomSection}>
          <Grid
            container
            justify="flex-end"
            className={classes.editButtonContainer}
          >
            <Grid item>
              <Button
                className={classes.editButton}
                component={props => (
                  <Link
                    to={`/f/${user.get('slug')}/edit/personal-information`}
                    {...props}
                  />
                )}
              >
                <EditIcon />
                &nbsp;Edit Personal Information
              </Button>
              <Button
                className={classes.smallEditButton}
                component={props => (
                  <Link
                    to={`/f/${user.get('slug')}/edit/personal-information`}
                    {...props}
                  />
                )}
              >
                <EditIcon />
                &nbsp;Edit
              </Button>
            </Grid>
          </Grid>
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
          <Divider className={classes.divider} />
          <Typography className={classes.bio}>
            {user.getIn(['profile', 'bio'])
              ? user.getIn(['profile', 'bio'])
              : `Hey, I am ${user.get('firstName')} ${user.get('lastName')}...`}
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
        </div>
        <PhotoModal
          user={user}
          type={type}
          files={files}
          isOpen={isOpen}
          onCloseModal={this.closeModal}
          uploadPhoto={this.props.uploadPhoto}
          updateUser={this.props.updateUser}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ProfileInfo);
