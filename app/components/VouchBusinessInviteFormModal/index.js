// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  modal: {
    width: 581,
    borderRadius: '0px !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
      padding: '20px 25px',
    },
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.4,
    color: '#404040',
    marginBottom: 15,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  },
  profile: {
    padding: 30,
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    padding: 30,
    backgroundColor: theme.palette.common.lightBlue,
  },
  avatar: {
    height: 96,
    width: 96,
    backgroundColor: '#8eb4db',
    fontSize: 30,
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      height: 65,
      width: 65,
    },
  },
  userInfo: {
    paddingLeft: 25,
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 12,
    },
  },
  name: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.6,
    color: '#555555',
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.6,
    textDecoration: 'none',
    textTransform: 'none',
  },
  inviteButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '20px 70px',
    borderRadius: 0,
    boxShadow: 'none',
    float: 'right',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 30px',
      fontWeight: 600,
      display: 'none',
    },
  },
  inviteButtonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  inviteSmallButton: {
    display: 'none',
    width: '100%',
    marginTop: 15,
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
      padding: 20,
    },
  },
});

type Props = {
  business: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  onInvite: Function,
};

class VouchBusinessInviteFormModal extends Component<Props, State> {
  closeModal = () => {
    this.props.onCloseModal();
  };
  handleInvite = () => {
    const { business } = this.props;
    this.props.onInvite(business);
  };
  render() {
    const { business, isOpen, classes } = this.props;
    const businessName = business && business.get('name');

    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <div className={classes.profile}>
          <UserAvatar className={classes.avatar} content={businessName} />
          <div className={classes.userInfo}>
            <Typography className={classes.name}>{businessName}</Typography>
            <a
              href={`/b/${business && business.get('slug')}`}
              target="_blank"
              className={classes.link}
            >
              See Profile
            </a>
          </div>
        </div>
        <div className={classes.content}>
          <Grid item xs={12}>
            <Typography className={classes.title}>
              {`Connect with ${businessName}`}
            </Typography>
          </Grid>
          <div className={classes.inviteButtonWrapper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.inviteButton}
              onClick={this.handleInvite}
            >
              Connect
            </Button>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={cx(classes.inviteButton, classes.inviteSmallButton)}
          onClick={this.handleInvite}
        >
          Connect
        </Button>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(VouchBusinessInviteFormModal);
