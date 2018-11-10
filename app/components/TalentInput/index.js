// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
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
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
      marginBottom: 10,
    },
  },
  rateFieldWrapper: {
    paddingRight: 30,
    [theme.breakpoints.down('xs')]: {
      paddingRight: 10,
    },
  },
  unitFieldWrapper: {
    paddingRight: 30,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 10,
      paddingRight: 0,
    },
  },
  textInput: {
    '& input': {
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 10,
      },
    },
  },
  selectInput: {
    '& div>div': {
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 10,
      },
    },
  },
  iconButton: {
    color: '#a4acb3',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 6,
    },
  },
  name: {
    fontSize: 18,
    color: '#4a4a4a',
  },
  rate: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
    },
  },
  editModeButtons: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'right',
    },
  },
});

type Props = {
  data: Object,
  units: Array<string>,
  mode: string, // eslint-disable-line
  editable: boolean,
  classes: Object,
  onCancel: Function,
  addTalent?: Function,
  updateTalent?: Function,
  deleteTalent?: Function,
};

type State = {
  mode: string,
  model: ?Object,
};

class TalentInput extends Component<Props, State> {
  static defaultProps = {
    editable: true,
  };
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!prevState.model) {
      return {
        mode: nextProps.mode,
        model: {
          name: nextProps.data.name,
          rate: nextProps.data.rate,
          unit: nextProps.data.unit,
        },
      };
    }
    return null;
  }
  state = {
    mode: '',
    model: null,
  };
  // componentDidMount() {
  //   document.addEventListener('mousedown', this.handleClick, false);
  // }
  // componentWillUnmount() {
  //   document.addEventListener('mousedown', this.handleClick, false);
  // }
  onConfirm = (e: Object) => {
    e.stopPropagation();
    const { data, addTalent, updateTalent } = this.props;
    const { model } = this.state;
    if (!this.isEmpty() && this.isUpdated()) {
      if (data.id) {
        if (updateTalent) {
          updateTalent(data.id, model);
        }
      } else if (addTalent) {
        this.props.onCancel();
        addTalent(model);
      }
    } else if (data.id) {
      this.props.onCancel();
    }
  };
  onEdit = () => {
    const { editable } = this.props;
    if (editable) {
      this.setState({
        mode: 'edit',
      });
    }
  };
  onDelete = () => {
    const { data, deleteTalent } = this.props;
    if (deleteTalent) {
      deleteTalent({ id: data.id });
    }
  };
  isEmpty = () => {
    const { model } = this.state;
    if (!model) return true;
    if (!model.name) {
      return true;
    }
    return false;
  };
  isUpdated = () => {
    const { data } = this.props;
    const { model } = this.state;
    if (!model) return false;
    if (
      data.name !== model.name ||
      data.rate !== model.rate ||
      data.unit !== model.unit
    ) {
      return true;
    }
    return false;
  };
  handleChange = (e: Object) => {
    e.persist();
    this.setState(state => ({
      model: {
        ...state.model,
        [e.target.id]: e.target.value,
      },
    }));
  };
  handleUnitChange = (e: Object) => {
    this.setState(state => ({
      model: {
        ...state.model,
        unit: e.target.value,
      },
    }));
  };
  // handleClick = (e: Object) => {
  //   if (this.node && !this.node.contains(e.target)) {
  //     this.setState({ mode: 'read' });
  //     this.props.onCancel();
  //   }
  // };
  node: ?HTMLElement;
  render() {
    const { data, units, classes, editable } = this.props;
    const { mode, model } = this.state;
    return (
      <div
        className={classes.root}
        ref={node => {
          this.node = node;
        }}
      >
        {mode === 'read' && (
          <div className={classes.readView}>
            <Grid container>
              <Grid item xs={11} lg={11}>
                <Typography variant="h6" className={classes.name}>
                  {data.name}
                </Typography>
                <Typography variant="body1" className={classes.rate}>
                  {data.rate && data.unit ? `$${data.rate}/${data.unit}` : ''}
                </Typography>
              </Grid>
              <Grid item xs={1} lg={1}>
                {editable && (
                  <IconButton
                    className={cx(classes.iconButton, classes.doneButton)}
                    onClick={this.onEdit}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Divider />
          </div>
        )}
        {mode === 'edit' && (
          <div className={classes.editView}>
            <Grid container>
              <Grid item xs={9} lg={10}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    className={classes.nameFieldWrapper}
                  >
                    <TextField
                      id="name"
                      label="Name"
                      value={model && model.name}
                      onChange={this.handleChange}
                      className={cx(classes.fieldMargin, classes.textInput)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Grid container>
                      <Grid item xs={6} className={classes.rateFieldWrapper}>
                        <TextField
                          id="rate"
                          label="Rate"
                          value={model && model.rate}
                          onChange={this.handleChange}
                          className={cx(classes.fieldMargin, classes.textInput)}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.unitFieldWrapper}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="unit">Unit</InputLabel>
                          <Select
                            value={model && model.unit}
                            onChange={this.handleUnitChange}
                            name="unit"
                            inputProps={{
                              id: 'unit',
                            }}
                            className={classes.selectInput}
                          >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="hour">Hour</MenuItem>
                            <MenuItem value="day">Day</MenuItem>
                            <MenuItem value="event">Event</MenuItem>
                            {units &&
                              units.map(unit => (
                                <MenuItem key={generate()} value={unit}>
                                  {unit}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} lg={2} className={classes.editModeButtons}>
                <IconButton
                  className={cx(classes.iconButton, classes.doneButton)}
                  onClick={this.onConfirm}
                >
                  <DoneIcon />
                </IconButton>
                {data.id ? (
                  <IconButton
                    className={cx(classes.iconButton, classes.deleteButton)}
                    onClick={this.onDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className={cx(classes.iconButton, classes.deleteButton)}
                    onClick={() => this.props.onCancel()}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(TalentInput);
