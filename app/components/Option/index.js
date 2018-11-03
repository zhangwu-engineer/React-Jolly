// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import BaseModal from 'components/BaseModal';

const styles = theme => ({
  root: {
    marginBottom: 15,
  },
  labelField: {
    fontSize: 18,
    letterSpacing: '0.5px',
    color: '#4a4a4a',
  },
  blueText: {
    fontSize: 16,
    letterSpacing: '0.5px',
    color: '#0076d7',
    marginBottom: 15,
    cursor: 'pointer',
  },
  checkboxRoot: {
    color: '#dadada',
  },
  checkboxChecked: {
    color: theme.palette.common.green,
  },
  modal: {
    width: 320,
    padding: 30,
  },
  modalContent: {
    color: '#8c9099',
    letterSpacing: '0.1px',
    lineHeight: 1.6,
  },
});

type Props = {
  label: string,
  value: string, // eslint-disable-line
  id: string, // eslint-disable-line
  modalTitle: string,
  modalContent: string,
  classes: Object,
  onChange: Function,
};

type State = {
  checked: ?boolean,
  isOpen: boolean,
};

class Option extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.value && prevState.checked === undefined) {
      return {
        checked: true,
      };
    }
    return null;
  }
  state = {
    checked: undefined,
    isOpen: false,
  };
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  handleChange = () => {
    this.setState(
      state => ({
        checked: !state.checked,
      }),
      () => {
        this.props.onChange(this.props.id, this.state.checked);
      }
    );
  };
  enable = () => {
    this.setState({ checked: true, isOpen: false }, () => {
      this.props.onChange(this.props.id, this.state.checked);
    });
  };
  disable = () => {
    this.setState({ checked: false, isOpen: false }, () => {
      this.props.onChange(this.props.id, this.state.checked);
    });
  };
  render() {
    const { label, modalTitle, modalContent, classes } = this.props;
    const { checked, isOpen } = this.state;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item sm={9} lg={11}>
            <Typography variant="h6" className={classes.labelField}>
              {label}
            </Typography>
            <Typography
              className={classes.blueText}
              onClick={() => this.setState({ isOpen: true })}
            >
              What&apos;s this
            </Typography>
          </Grid>
          <Grid item sm={3} lg={1}>
            <Checkbox
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checkboxChecked,
              }}
              color="default"
              checked={checked}
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>
        <Divider />
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
        >
          <Typography variant="h6">{modalTitle}</Typography>
          <Typography
            variant="body2"
            component="p"
            className={classes.modalContent}
          >
            {modalContent}
          </Typography>
          <Grid container justify="flex-end">
            <Grid item>
              <Button color="primary" onClick={this.enable}>
                Enable
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" onClick={this.disable}>
                Disable
              </Button>
            </Grid>
          </Grid>
        </BaseModal>
      </div>
    );
  }
}

export default withStyles(styles)(Option);
