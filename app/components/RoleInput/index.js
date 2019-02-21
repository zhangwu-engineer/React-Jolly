// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { debounce } from 'lodash-es';
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
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

import ROLES from 'enum/roles';

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
    position: 'relative',
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
    textTransform: 'capitalize',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
    },
  },
  editModeButtons: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'right',
    },
  },
  adornment: {
    marginRight: 0,
  },
  adornmentText: {
    color: theme.palette.text.main,
    fontSize: 18,
    paddingBottom: 8,
  },
  bottomMargin: {
    marginBottom: 20,
  },
  rangeButton: {
    fontSize: 12,
    paddingLeft: 0,
    paddingRight: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  searchResultList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: 'calc(100% - 30px)',
    maxHeight: 200,
    top: 49,
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  resultItem: {
    display: 'block',
    paddingLeft: 20,
    cursor: 'pointer',
  },
});

type Props = {
  data: Object,
  units: Array<string>,
  mode: string, // eslint-disable-line
  editable: boolean,
  classes: Object,
  onCancel: Function,
  addRole?: Function,
  updateRole?: Function,
  deleteRole?: Function,
};

type State = {
  mode: string,
  model: ?Object,
  rangeMode: boolean,
  filteredRoles: Array<string>,
};

class RoleInput extends Component<Props, State> {
  static defaultProps = {
    editable: true,
  };
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!prevState.model) {
      return {
        mode: nextProps.mode,
        model: {
          name: nextProps.data.name,
          years: nextProps.data.years,
          minRate: nextProps.data.minRate,
          maxRate: nextProps.data.maxRate,
          unit: nextProps.data.unit,
        },
        rangeMode: nextProps.data.minRate && nextProps.data.maxRate,
      };
    }
    return null;
  }
  state = {
    mode: '',
    model: null,
    rangeMode: false,
    filteredRoles: [],
  };
  // componentDidMount() {
  //   document.addEventListener('mousedown', this.handleClick, false);
  // }
  // componentWillUnmount() {
  //   document.addEventListener('mousedown', this.handleClick, false);
  // }
  onConfirm = (e: Object) => {
    e.stopPropagation();
    const { data, addRole, updateRole } = this.props;
    const { model } = this.state;
    if (!this.isEmpty() && this.isUpdated()) {
      if (data.id) {
        if (updateRole) {
          if (model && model.rate) {
            model.rate = parseFloat(model.rate);
          }
          updateRole(data.id, model);
        }
      } else if (addRole) {
        this.props.onCancel();
        if (model && model.rate) {
          model.rate = parseFloat(model.rate);
        }
        addRole(model);
      }
      document.getElementById('addButton').style.display = 'flex';
    } else if (data.id) {
      this.props.onCancel();
      document.getElementById('addButton').style.display = 'flex';
    }
  };
  onEdit = () => {
    const { editable } = this.props;
    if (editable) {
      this.setState({
        mode: 'edit',
      });
      document.getElementById('addButton').style.display = 'none';
    }
  };
  onDelete = () => {
    const { data, deleteRole } = this.props;
    if (deleteRole) {
      deleteRole({ id: data.id });
      document.getElementById('addButton').style.display = 'flex';
    }
  };
  isEmpty = () => {
    const { model } = this.state;
    if (!model) return true;
    if (!model.name) {
      return true;
    } else if (ROLES.indexOf(model.name) === -1) {
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
      data.years !== model.years ||
      data.minRate !== model.minRate ||
      data.maxRate !== model.maxRate ||
      data.unit !== model.unit
    ) {
      return true;
    }
    return false;
  };
  debouncedSearch = debounce((id, value) => {
    switch (id) {
      case 'name': {
        if (value) {
          const filteredRoles = ROLES.filter(
            r => r.toLowerCase().indexOf(value.toLowerCase()) !== -1
          );
          this.setState({ filteredRoles });
        } else {
          this.setState({ filteredRoles: ROLES });
        }
        break;
      }
      default:
        break;
    }
  }, 500);
  handleChange = (e: Object) => {
    e.persist();
    this.setState(
      state => ({
        model: {
          ...state.model,
          [e.target.id]: e.target.value,
        },
      }),
      () => {
        this.debouncedSearch(e.target.id, e.target.value);
      }
    );
  };
  handleRateChange = (e: Object) => {
    e.persist();
    const regEx = /^\d+$/;
    if (e.target.value === '' || regEx.test(e.target.value)) {
      this.setState(state => ({
        model: {
          ...state.model,
          [e.target.id]: e.target.value,
        },
      }));
    }
  };
  handleSelectChange = (e: Object) => {
    this.setState(state => ({
      model: {
        ...state.model,
        [e.target.name]: e.target.value,
      },
    }));
  };
  toggleRange = () => {
    this.setState(state => ({
      rangeMode: !state.rangeMode,
      model: {
        ...state.model,
        maxRate: '',
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
    const { mode, model, rangeMode, filteredRoles } = this.state;
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
                  {data.minRate && data.maxRate && data.unit
                    ? `$${data.minRate} - ${data.maxRate}/${data.unit}`
                    : ''}
                  {data.minRate && !data.maxRate && data.unit
                    ? `$${data.minRate}/${data.unit}`
                    : ''}
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
                <Grid container className={classes.bottomMargin}>
                  <Grid
                    item
                    xs={12}
                    lg={8}
                    className={classes.nameFieldWrapper}
                  >
                    <TextField
                      autoComplete="off"
                      id="name"
                      label="Type of Work"
                      value={model && model.name}
                      onChange={this.handleChange}
                      onBlur={() => {
                        setTimeout(() => {
                          this.setState({
                            filteredRoles: [],
                          });
                        }, 500);
                      }}
                      onFocus={() => {
                        if (!model.name) {
                          this.debouncedSearch('name', model.name);
                        }
                      }}
                      className={classes.textInput}
                      fullWidth
                      autoFocus
                    />
                    {filteredRoles.length ? (
                      <div className={classes.searchResultList}>
                        {filteredRoles.map(r => (
                          <ListItem
                            className={classes.resultItem}
                            key={generate()}
                            onClick={() =>
                              this.setState(state => ({
                                model: {
                                  ...state.model,
                                  name: r,
                                },
                                filteredRoles: [],
                              }))
                            }
                          >
                            <ListItemText
                              classes={{ primary: classes.resultText }}
                              primary={r}
                            />
                          </ListItem>
                        ))}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="years">Years Experience</InputLabel>
                      <Select
                        value={model && model.years}
                        onChange={this.handleSelectChange}
                        name="years"
                        inputProps={{
                          id: 'years',
                        }}
                        className={classes.selectInput}
                      >
                        <MenuItem value={0}>{'< 1'}</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={17}>17</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={19}>19</MenuItem>
                        <MenuItem value={20}>20 +</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3} lg={3} className={classes.rateFieldWrapper}>
                    <FormControl className={classes.textInput}>
                      <InputLabel htmlFor="minRate">Rate</InputLabel>
                      <Input
                        className={classes.textInput}
                        id="minRate"
                        value={model && model.minRate}
                        onChange={this.handleRateChange}
                        startAdornment={
                          <InputAdornment
                            position="start"
                            className={classes.adornment}
                          >
                            <Typography
                              variant="h6"
                              className={classes.adornmentText}
                            >
                              $
                            </Typography>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  {rangeMode && (
                    <Grid
                      item
                      xs={3}
                      lg={3}
                      className={classes.rateFieldWrapper}
                    >
                      <FormControl className={classes.textInput}>
                        <InputLabel htmlFor="maxRate" />
                        <Input
                          className={classes.textInput}
                          id="maxRate"
                          value={model && model.maxRate}
                          onChange={this.handleRateChange}
                          startAdornment={
                            <InputAdornment
                              position="start"
                              className={classes.adornment}
                            >
                              <Typography
                                variant="h6"
                                className={classes.adornmentText}
                              >
                                $
                              </Typography>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={6} lg={3} className={classes.unitFieldWrapper}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="unit">Unit</InputLabel>
                      <Select
                        value={model && model.unit}
                        onChange={this.handleSelectChange}
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
                <Button
                  color="primary"
                  className={classes.rangeButton}
                  onClick={this.toggleRange}
                >
                  {rangeMode ? 'Remove Range' : 'Add Rate Range'}
                </Button>
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
                    onClick={() => {
                      document.getElementById('addButton').style.display =
                        'flex';
                      this.props.onCancel();
                    }}
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

export default withStyles(styles)(RoleInput);
