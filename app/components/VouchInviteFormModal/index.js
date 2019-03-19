// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  modal: {
    padding: 30,
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
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#313131',
    marginBottom: 15,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  },
  content: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
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
      display: 'none',
    },
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
        <Typography
          className={classes.title}
        >{`Have you been coworkers with ${capitalize(
          user && user.get('firstName')
        )}?`}</Typography>
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
            Connect
          </Button>
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

export default withStyles(styles)(VouchInviteFormModal);
