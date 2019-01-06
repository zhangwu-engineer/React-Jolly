// @flow

import React, { Component } from 'react';
import storage from 'store';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
    marginBottom: 20,
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
  endorseButton: {
    textTransform: 'capitalize',
  },
  checkLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: '#4a4a4a',
  },
  checkboxChecked: {
    color: theme.palette.common.green,
  },
  checkbox: {
    marginRight: 0,
    marginBottom: 40,
  },
});

type Props = {
  classes: Object,
  username: string,
  isOpen: boolean,
  onCloseModal: Function,
  onSave: Function,
};

type State = {
  agree: boolean,
};

class EndorsementModal extends Component<Props, State> {
  state = {
    agree: false,
  };
  closeModal = () => {
    this.setState(
      {
        agree: false,
      },
      () => {
        this.props.onCloseModal();
      }
    );
  };
  handleChange = event => {
    this.setState({ agree: event.target.checked });
  };
  render() {
    const { classes, username, isOpen } = this.props;
    const { agree } = this.state;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <Typography variant="h6" component="h1" className={classes.modalTitle}>
          Important!
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
        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={this.handleChange}
              value="agree"
              color="default"
              classes={{
                checked: classes.checkboxChecked,
              }}
            />
          }
          classes={{
            root: classes.checkbox,
            label: classes.checkLabel,
          }}
          label="I understand, don't show this again"
        />
        <Grid container justify="space-between">
          <Grid item>
            <Button
              size="large"
              onClick={this.closeModal}
              className={classes.endorseButton}
            >
              Go Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => {
                if (agree) {
                  storage.set('hideEndorsementModal', true);
                }
                this.closeModal();
                this.props.onSave();
              }}
              className={classes.endorseButton}
            >
              {`Endorse ${username}`}
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

export default withStyles(styles)(EndorsementModal);
