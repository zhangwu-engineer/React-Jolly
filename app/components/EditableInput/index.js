// @flow

import React, { Component, Fragment } from 'react';
import { generate } from 'shortid';
import { capitalize } from 'lodash-es';
import PlacesAutocomplete from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

import { history } from 'components/ConnectedRouter';

const styles = theme => ({
  root: {
    marginBottom: 15,
  },
  nameFieldWrapper: {
    paddingRight: 30,
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
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
  labelField: {
    fontSize: 16,
    letterSpacing: '0.5px',
    color: '#a0a0a0',
    fontWeight: 500,
  },
  valueField: {
    fontSize: 18,
    letterSpacing: '0.5px',
    color: '#4a4a4a',
    marginBottom: 15,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
    },
  },
  nameField: {
    textTransform: 'capitalize',
  },
  textInput: {
    '& input': {
      paddingTop: 10,
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 10,
      },
    },
  },
  adornment: {
    marginRight: 0,
  },
  adornmentText: {
    color: theme.palette.text.main,
    fontSize: 18,
    paddingBottom: 5,
    lineHeight: '21px',
  },
  editModeButtons: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'right',
    },
  },
  placesList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: '100%',
    maxHeight: 200,
    top: 58,
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
  shrink: {
    transform: 'translate(0, 1.5px)',
    transformOrigin: 'top left',
  },
});

type Props = {
  label: string,
  value: string,
  id: string,
  slug?: string,
  classes: Object,
  multiline: boolean,
  startWith?: string,
  onChange: Function,
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
        value:
          nextProps.id === 'name'
            ? nextProps.value
                .split(' ')
                .map(s => capitalize(s))
                .join(' ')
            : nextProps.value,
      };
    }
    if (nextProps.id === 'phone' && prevState.value !== nextProps.value) {
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
  onConfirm = () => {
    this.setState({ isEditing: false }, () => {
      this.props.onChange(this.props.id, this.state.value);
    });
  };
  onEdit = () => {
    const { id, slug } = this.props;
    if (id === 'phone' && slug) {
      window.localStorage.setItem('mobilePrevPath', window.location.pathname);
      history.push(`/f/${slug}/mobile`);
    } else {
      this.setState({ isEditing: true });
    }
  };
  handleChange = (e: Object) => {
    e.persist();
    this.setState({
      value: e.target.value,
    });
  };
  handleLocationChange = address => {
    this.setState({ value: address });
  };
  render() {
    const { label, id, classes, multiline, startWith } = this.props;
    const { isEditing } = this.state;
    return (
      <div className={classes.root}>
        {isEditing ? (
          <Grid container>
            <Grid item xs={9} lg={10} className={classes.nameFieldWrapper}>
              <FormControl className={classes.fieldMargin} fullWidth>
                <InputLabel
                  htmlFor={id}
                  classes={{
                    root: classes.labelField,
                    shrink: classes.shrink,
                  }}
                >
                  {label}
                </InputLabel>
                {id === 'location' ? (
                  <PlacesAutocomplete
                    value={this.state.value}
                    onChange={this.handleLocationChange}
                    // onSelect={this.handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <Fragment>
                        <Input
                          className={classes.textInput}
                          id={id}
                          {...getInputProps({
                            placeholder: 'Search Places ...',
                          })}
                          autoFocus
                        />
                        {suggestions.length || loading ? (
                          <div className={classes.placesList}>
                            {loading && (
                              <ListItem>
                                <ListItemText primary="Loading..." />
                              </ListItem>
                            )}
                            {suggestions.map(suggestion => {
                              const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {
                                    backgroundColor: '#fafafa',
                                    cursor: 'pointer',
                                  }
                                : {
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                  };
                              return (
                                <ListItem
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                  key={generate()}
                                >
                                  <ListItemText
                                    primary={suggestion.description}
                                  />
                                </ListItem>
                              );
                            })}
                          </div>
                        ) : null}
                      </Fragment>
                    )}
                  </PlacesAutocomplete>
                ) : (
                  <Input
                    key="editMode"
                    className={classes.textInput}
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
                    autoFocus
                  />
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3} lg={2} className={classes.editModeButtons}>
              <IconButton
                className={classes.iconButton}
                onClick={this.onConfirm}
              >
                <DoneIcon />
              </IconButton>
              <IconButton className={classes.iconButton} onClick={this.onClear}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Grid container alignItems="center">
            <Grid item xs={11} lg={11}>
              <FormControl
                className={classes.fieldMargin}
                style={{ pointerEvents: 'none' }}
                fullWidth
              >
                <InputLabel
                  htmlFor={id}
                  classes={{
                    root: classes.labelField,
                    shrink: classes.shrink,
                  }}
                >
                  {label}
                </InputLabel>
                <Input
                  key="viewMode"
                  className={classes.textInput}
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
            <Grid item xs={1} lg={1}>
              <IconButton className={classes.iconButton} onClick={this.onEdit}>
                <EditIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(EditableInput);
