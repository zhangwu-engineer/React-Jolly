// @flow

import React, { Component } from 'react';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
    },
  },
  content: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '20px 25px',
    },
  },
  avatar: {
    height: 96,
    width: 96,
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
    [theme.breakpoints.down('xs')]: {
      padding: '11px 30px',
      fontWeight: 600,
    },
  },
});

type Props = {
  user: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  onInvite: Function,
};

class VouchInviteFormModal extends Component<Props> {
  closeModal = () => {
    this.props.onCloseModal();
  };
  handleInvite = () => {
    const { user } = this.props;
    this.props.onInvite(user);
  };
  render() {
    const { user, isOpen, classes } = this.props;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <div className={classes.content}>
          <UserAvatar
            className={classes.avatar}
            src={user && user.getIn(['profile', 'avatar'])}
            alt={user && user.get('firstName')}
          />
          <div className={classes.userInfo}>
            <Typography className={classes.name}>
              {`${capitalize(user && user.get('firstName'))} ${capitalize(
                user && user.get('lastName')
              )}`}
            </Typography>
            <a
              href={`/f/${user && user.get('slug')}`}
              target="_blank"
              className={classes.link}
            >
              See Profile
            </a>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.inviteButton}
            onClick={this.handleInvite}
          >
            Invite
          </Button>
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(VouchInviteFormModal);
