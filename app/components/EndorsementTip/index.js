// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

import BaseModal from 'components/BaseModal';

const styles = theme => ({
  modal: {
    padding: 25,
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 50px)',
    },
  },
  modalTitle: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 30,
    '& span': {
      fontWeight: 'bold',
    },
  },
  closeButton: {
    position: 'absolute',
    right: -15,
    top: -50,
    color: theme.palette.common.white,
  },
});

type Props = {
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
};

class EndorsementTip extends Component<Props> {
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
        <Typography variant="h6" component="h1" className={classes.modalTitle}>
          Endorsement Rules
        </Typography>
        <Typography component="p" className={classes.modalText}>
          <span>
            {`You can only endorse one coworker on this job for each quality.`}
          </span>
          {` Make sure this is the coworker you want to endorse as Most Skilled.`}
        </Typography>
        <Typography component="p" className={classes.modalText}>
          {`Also, once you’ve endorsed someone, `}
          <span>you cannot change your endorsement.</span>
        </Typography>
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={this.closeModal}
            >
              Okay
            </Button>
          </Grid>
        </Grid>
        <IconButton
          className={classes.closeButton}
          color="default"
          onClick={this.closeModal}
        >
          <ClearIcon />
        </IconButton>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(EndorsementTip);
