// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import CredIcon from 'images/sprite/cred_filled.svg';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    top: '96px !important',
    transform: 'translateX(-50%) !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
      height: '100%',
    },
  },
  blueLine: {
    backgroundColor: theme.palette.primary.main,
    height: 10,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  content: {
    position: 'relative',
    padding: 30,
    maxHeight: '100vh',
    overflow: 'scroll',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
    },
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#464646',
    marginBottom: 15,
  },
  stats: {
    borderTop: '1px solid #f1f1f1',
    borderBottom: '1px solid #f1f1f1',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 30,
  },
  avatar: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  nameWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e1e24',
  },
  cred: {
    fontSize: 14,
    color: '#6f6f73',
  },
  desc: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2b2b2b',
    marginBottom: 20,
  },
  createPostButton: {
    borderRadius: 0,
    fontWeight: 700,
    textTransform: 'none',
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    paddingLeft: 46,
    paddingRight: 46,
    marginBottom: 25,
    '&:hover': {
      borderWidth: 2,
    },
  },
  closeButton: {
    position: 'absolute',
    padding: 5,
    right: 10,
    top: 10,
  },
  descWrapper: {
    backgroundColor: '#f1f1f1',
    padding: '25px 20px',
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 13,
    fontWeight: 500,
    color: '#7f7f7f',
    marginBottom: 10,
  },
});

type Props = {
  user: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  openPostModal: Function,
};

class UserCredModal extends Component<Props> {
  onPostClick = () => {
    this.props.onCloseModal();
    this.props.openPostModal();
  };
  render() {
    const { user, isOpen, classes } = this.props;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={classes.blueLine} />
        <div className={classes.content}>
          <IconButton
            className={classes.closeButton}
            onClick={this.props.onCloseModal}
          >
            <ClearIcon />
          </IconButton>
          <Typography className={classes.title}>Cred</Typography>
          <Grid container alignItems="center" className={classes.stats}>
            <Grid item>
              <UserAvatar
                src={user.getIn(['profile', 'avatar'])}
                className={classes.avatar}
              />
            </Grid>
            <Grid item className={classes.nameWrapper}>
              <Typography className={classes.name}>You</Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Icon glyph={CredIcon} />
                </Grid>
                <Grid item>
                  <Typography className={classes.cred}>
                    {user.getIn(['profile', 'cred'])}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className={classes.descWrapper}>
            <Typography className={classes.title}>What&apos;s this?</Typography>
            <Typography className={classes.text}>
              Increase your cred by helping your fellow event freelancers: share
              knowledge, answer questions, or comment in the feed. Soon, you’ll
              be able to see how you stack up against other helpful freelancers
              in your city.
            </Typography>
          </div>
          <Typography className={classes.desc} align="center">
            Build your cred by helping
            <br />
            your community
          </Typography>
          <Grid container justify="center">
            <Grid item>
              <Button
                className={classes.createPostButton}
                variant="outlined"
                color="primary"
                size="large"
                onClick={this.onPostClick}
              >
                Post
              </Button>
            </Grid>
          </Grid>
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(UserCredModal);
