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

import EmptyAvatarImg from 'images/empty_avatar.png';

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
    marginBottom: 20,
  },
  bio: {
    fontSize: 18,
    marginTop: 20,
    marginLeft: 30,
  },
});

type Props = {
  user: Object,
  classes: Object,
};

class ProfileInfo extends Component<Props> {
  render() {
    const { user, classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div>
            <div className={classes.overlay} />
          </div>
          <Button className={classes.addCoverButton}>
            <CameraIcon />
            &nbsp;&nbsp;Add cover
          </Button>
          <IconButton className={classes.shareButton}>
            <ShareIcon />
          </IconButton>
          <div className={classes.avatarContainer}>
            <Avatar className={classes.avatar} src={EmptyAvatarImg} />
            <IconButton className={classes.editAvatarButton}>
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
              <Button className={classes.editButton}>
                <EditIcon />
                &nbsp;Edit Personal Information
              </Button>
            </Grid>
          </Grid>
          <Typography className={classes.username}>
            {`${user.get('firstName')} ${user.get('lastName')}`}
          </Typography>
          <Divider />
          <Typography className={classes.bio}>
            {`Hey, I am ${user.get('firstName')} ${user.get('lastName')}...`}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileInfo);
