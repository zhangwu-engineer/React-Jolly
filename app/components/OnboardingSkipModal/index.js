// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { history } from 'components/ConnectedRouter';
import BaseModal from 'components/BaseModal';

const styles = theme => ({
  modal: {
    padding: '40px 20px 30px 45px',
    width: 472,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 30px)',
    },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#3e3e3e',
    marginBottom: 25,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.63,
    letterSpacing: 0.4,
    color: '#3e3e3e',
    marginBottom: 50,
    maxWidth: 378,
  },
  skipButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '18px 30px',
  },
  findButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '18px 40px',
    borderRadius: 0,
  },
});

type Props = {
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
};

class OnboardingSkipModal extends Component<Props> {
  handleSkip = () => {
    analytics.track('Onboarding Step Skipped', {
      page: '/ob/2',
    });
    history.push('/ob/3');
  };
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
        shouldCloseOnOverlayClick={false}
      >
        <Typography variant="h6" component="h1" className={classes.modalTitle}>
          Sure you want to skip?
        </Typography>
        <Typography className={classes.modalText} variant="body2" component="p">
          Finding people you’ve worked with is is the best way to get started
          with Jolly. It will help you build your reputation, improve your
          network and find more jobs.
        </Typography>
        <Grid container justify="flex-end" alignItems="center">
          <Grid item>
            <Button
              className={classes.skipButton}
              color="primary"
              onClick={this.handleSkip}
            >
              Skip this Step
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={classes.findButton}
              variant="contained"
              color="primary"
              onClick={this.props.onCloseModal}
            >
              Find Coworkers
            </Button>
          </Grid>
        </Grid>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(OnboardingSkipModal);
