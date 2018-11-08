// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextSMSIcon from '@material-ui/icons/Textsms';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

import BaseModal from 'components/BaseModal';

const styles = theme => ({
  modal: {
    padding: '30px 30px 70px 30px',
    width: 430,
  },
  title: {
    marginBottom: 30,
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
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
};

class ContactOptionModal extends Component<Props> {
  share = () => {};
  closeModal = () => {
    this.props.onCloseModal();
  };
  render() {
    const { classes, isOpen } = this.props;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <Typography variant="h6" component="h1" className={classes.title}>
          Contact Options
        </Typography>
        <Grid container justify="space-between">
          <Grid item>
            <Button className={classes.button}>
              <TextSMSIcon />
              &nbsp;Text
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.button}>
              <EmailIcon />
              &nbsp;Email
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.button}>
              <PhoneIcon />
              &nbsp;Call
            </Button>
          </Grid>
        </Grid>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(ContactOptionModal);
