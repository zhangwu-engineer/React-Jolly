// @flow

import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import ShareIcon from 'images/sprite/share.svg';

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
    cursor: 'pointer',
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
    top: 13,
    left: 18,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'none',
    fontSize: 14,
    display: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      left: '15px',
      display: 'flex',
    },
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
  shareButton: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.15)',
    padding: 14,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    color: theme.palette.primary.main,
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
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.17)',
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
  editButtonContainer: {
    position: 'absolute',
    bottom: 0,
    padding: '20px 25px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px',
      bottom: -44,
    },
  },
  editButtonBox: {
    marginRight: 10,
  },
  editButton: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    fontWeight: 600,
    padding: '10px 38px',
    borderRadius: 0,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallEditButton: {
    color: theme.palette.primary.main,
    textTransform: 'none',
    backgroundColor: theme.palette.common.white,
    display: 'none',
    borderRadius: 0,
    fontWeight: 600,
    boxShadow: '0 2px 11px 0 rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
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
  badgeSection: {
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
});

type Props = {
  user: Object,
  business: Object,
  classes: Object,
};

class BusinessProfileInfo extends PureComponent<Props> {
  openUrl = url => {
    window.open(url, '_blank');
  };
  render() {
    const { user, business, classes } = this.props;
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
          <Grid
            container
            justify="flex-end"
            alignItems="center"
            className={classes.editButtonContainer}
          >
            <Grid item className={classes.editButtonBox}>
              <Button className={classes.editButton}>Edit</Button>
              <Button className={classes.smallEditButton}>Edit</Button>
            </Grid>
            <Grid item>
              <IconButton className={classes.shareButton}>
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
              {business && business.name}
            </Typography>
            <Typography className={classes.location}>
              {business && business.category}
              &nbsp;&sdot;&nbsp;
              {business && business.location}
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(BusinessProfileInfo);
