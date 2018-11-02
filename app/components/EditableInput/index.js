// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
    marginBottom: 15,
  },
  readView: {
    position: 'relative',
  },
  editView: {
    position: 'relative',
    marginBottom: 20,
  },
  nameFieldWrapper: {
    paddingRight: 30,
  },
  iconButton: {
    color: '#a4acb3',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  labelField: {
    fontSize: 16,
    letterSpacing: '0.5px',
    color: '#a0a0a0',
  },
  valueField: {
    fontSize: 18,
    letterSpacing: '0.5px',
    color: '#4a4a4a',
    marginBottom: 15,
  },
  adornment: {
    marginRight: 0,
  },
  adornmentText: {
    color: theme.palette.text.main,
    fontSize: 18,
    paddingBottom: 5,
  },
});

type Props = {
  label: string,
  value: string,
  id: string,
  classes: Object,
  multiline: boolean,
  startWith?: string,
};

type State = {
  value: ?string,
  isEditing: boolean,
};

class EditableInput extends Component<Props, State> {
  static defaultProps = {
    multiline: false,
  };
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.value === undefined) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }
  state = {
    value: undefined,
    isEditing: false,
  };
  onClear = () => {
    this.setState({
      value: undefined,
      isEditing: false,
    });
  };
  onConfirm = () => {};
  handleChange = (e: Object) => {
    e.persist();
    this.setState({
      value: e.target.value,
    });
  };
  render() {
    const { label, value, id, classes, multiline, startWith } = this.props;
    const { isEditing } = this.state;
    return (
      <div className={classes.root}>
        {isEditing ? (
          <div className={classes.editView}>
            <Grid container>
              <Grid item sm={10} className={classes.nameFieldWrapper}>
                <FormControl className={classes.fieldMargin} fullWidth>
                  <InputLabel htmlFor={id}>{label}</InputLabel>
                  <Input
                    id={id}
                    value={this.state.value}
                    onChange={this.handleChange}
                    multiline={multiline}
                    startAdornment={
                      startWith ? (
                        <InputAdornment
                          position="start"
                          className={classes.adornment}
                        >
                          <Typography
                            variant="h6"
                            className={classes.adornmentText}
                          >
                            {startWith}
                          </Typography>
                        </InputAdornment>
                      ) : null
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item sm={2}>
                <IconButton
                  className={cx(classes.iconButton, classes.doneButton)}
                  onClick={this.onConfirm}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  className={cx(classes.iconButton, classes.deleteButton)}
                  onClick={this.onClear}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className={classes.readView}>
            <Grid container alignItems="center">
              <Grid item sm={9} lg={11}>
                <Typography variant="h6" className={classes.labelField}>
                  {label}
                </Typography>
                <Typography
                  variant="h6"
                  component={multiline ? 'div' : 'h6'}
                  className={classes.valueField}
                >
                  {value}
                </Typography>
              </Grid>
              <Grid item sm={3} lg={1}>
                <IconButton
                  className={cx(classes.iconButton, classes.doneButton)}
                  onClick={() => this.setState({ isEditing: true })}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Divider />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(EditableInput);
