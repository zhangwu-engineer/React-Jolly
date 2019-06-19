// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { history } from 'components/ConnectedRouter';
import BaseModal from 'components/BaseModal';
import Link from 'components/Link';

const styles = theme => ({
  modal: {
    width: 472,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 30px)',
    },
  },
  modalContainer: {
    padding: '40px 20px 30px 45px',
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
    fontWeight: 600,
    lineHeight: 1.63,
    letterSpacing: 0.4,
    color: '#3e3e3e',
  },
  hirerText: {
    marginBottom: 4,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.88,
    letterSpacing: 0.4,
    textTransform: 'none',
  },
  modalDescription: {
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
  hirerContent: {
    backgroundColor: theme.palette.common.lightBlue,
  },
  hirerContentSection: {
    padding: 30,
    textAlign: 'center',
  },
});

type Props = {
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
  handleHire: Function,
};

class OnboardingPositionSkipModal extends Component<Props> {
  handleSkip = () => {
    analytics.track('Onboarding Step Skipped', {
      page: 'ob/3',
    });
    history.push('/edit');
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
        <div className={classes.modalContainer}>
          <Typography
            variant="h6"
            component="h1"
            className={classes.modalTitle}
          >
            Sure you want to skip?
          </Typography>
          <Typography
            className={cx(classes.modalText, classes.modalDescription)}
            variant="body2"
            component="p"
          >
            Adding positions that you&apos;re avaialble for will help us match
            you with job opportunities!
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
                Add Positions
              </Button>
            </Grid>
          </Grid>
        </div>
        <div className={classes.hirerContent}>
          <Grid item xs={12} className={classes.hirerContentSection}>
            <Typography className={cx(classes.modalText, classes.hirerText)}>
              Not looking for work?
            </Typography>
            <Link className={classes.linkText} onClick={this.props.handleHire}>
              I want to hire event workers
            </Link>
          </Grid>
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(OnboardingPositionSkipModal);
