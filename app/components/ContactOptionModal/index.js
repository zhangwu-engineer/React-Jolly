// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextSMSIcon from '@material-ui/icons/Textsms';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

import BaseModal from 'components/BaseModal';

const styles = theme => ({
  modal: {
    padding: '30px 30px 70px 30px',
    width: 430,
    [theme.breakpoints.down('xs')]: {
      width: 350,
      padding: '15px 15px 35px 15px',
    },
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 2px 4px 0 rgba(187, 187, 187, 0.5)',
    margin: '0 auto 10px auto',
    [theme.breakpoints.down('xs')]: {
      width: 54,
      height: 54,
    },
  },
  avatar: {
    width: 54,
    height: 54,
    [theme.breakpoints.down('xs')]: {
      width: 50,
      height: 50,
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
  button: {
    color: '#3c3e43',
    fontSize: 14,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    '& svg': {
      color: '#b3b9bf',
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white,
    },
    '&:hover svg': {
      color: theme.palette.primary.main,
    },
  },
});

type Props = {
  data: Object,
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
};

class ContactOptionModal extends Component<Props> {
  share = () => {};
  closeModal = () => {
    this.props.onCloseModal();
  };
  sendEmail = () => {
    const { data } = this.props;
    window.location.href = `mailto:${data.get('email')}`;
  };
  render() {
    const { data, classes, isOpen } = this.props;
    const showEmail = data.getIn(['profile', 'receiveEmail']);
    const showSMS = data.getIn(['profile', 'receiveSMS']);
    const showCall = data.getIn(['profile', 'receiveCall']);
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <Typography variant="h6" component="h1" className={classes.title}>
          Contact
        </Typography>
        <div className={classes.avatarContainer}>
          <Avatar
            className={classes.avatar}
            src={data.getIn(['profile', 'avatar'])}
          />
        </div>
        <Typography variant="h6" component="h1" className={classes.name}>
          {`${data.get('firstName')} ${data.get('lastName')}`}
        </Typography>
        <Grid container justify="center" spacing={8}>
          {showSMS && (
            <Grid item>
              <Button className={classes.button}>
                <TextSMSIcon />
                &nbsp;Text
              </Button>
            </Grid>
          )}
          {showEmail && (
            <Grid item>
              <Button className={classes.button} onClick={this.sendEmail}>
                <EmailIcon />
                &nbsp;Email
              </Button>
            </Grid>
          )}
          {showCall && (
            <Grid item>
              <Button className={classes.button}>
                <PhoneIcon />
                &nbsp;Call
              </Button>
            </Grid>
          )}
        </Grid>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(ContactOptionModal);
