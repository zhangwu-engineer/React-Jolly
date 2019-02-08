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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Link from 'components/Link';

const styles = theme => ({
  root: {
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
  },
  labelField: {
    fontSize: 14,
    color: '#212121',
    fontWeight: 600,
    paddingLeft: 20,
  },
  textInput: {
    paddingLeft: 18,
    marginTop: 20,
    '&:before': {
      borderBottom: '2px solid #f1f1f1',
    },
    '& input': {
      paddingTop: 5,
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
    fontSize: 14,
    paddingBottom: 5,
    lineHeight: '21px',
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
    transform: 'translate(0px, 10px) scale(0.85)',
    transformOrigin: 'top left',
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    textDecoration: 'none',
    color: '#3a81e0',
    position: 'relative',
    top: -8,
    right: 20,
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
        value: nextProps.value || '',
      };
    }
    return null;
  }
  state = {
    value: undefined,
  };
  onClear = () => {
    this.setState({
      value: undefined,
    });
  };
  onConfirm = () => {
    this.props.onChange(this.props.id, this.state.value);
  };
  handleChange = (e: Object) => {
    e.persist();
    if (e.target.id === 'distance') {
      const regEx = /^\d+(\.)?(\d)?$/;
      if (e.target.value === '' || regEx.test(e.target.value)) {
        this.setState({
          value: e.target.value,
        });
      }
    } else {
      this.setState({
        value: e.target.value,
      });
    }
  };
  handleLocationChange = address => {
    this.setState({ value: address });
  };
  textInput = React.createRef();
  renderInput = () => {
    const { id, classes, multiline, startWith } = this.props;
    if (id === 'location') {
      return (
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
                        <ListItemText primary={suggestion.description} />
                      </ListItem>
                    );
                  })}
                </div>
              ) : null}
            </Fragment>
          )}
        </PlacesAutocomplete>
      );
    }
    if (id === 'phone') {
      return (
        <Input
          className={classes.textInput}
          id={id}
          value={this.state.value}
          inputRef={this.textInput}
          endAdornment={
            <InputAdornment position="end">
              <Link to="/mobile" className={classes.link}>
                Edit
              </Link>
            </InputAdornment>
          }
          autoComplete="off"
        />
      );
    }
    return (
      <Input
        className={classes.textInput}
        id={id}
        value={this.state.value}
        onChange={this.handleChange}
        multiline={multiline}
        inputRef={this.textInput}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            if (this.textInput.current) {
              this.textInput.current.blur();
            }
            this.onConfirm();
          }
        }}
        onBlur={this.onConfirm}
        startAdornment={
          startWith ? (
            <InputAdornment position="start" className={classes.adornment}>
              <Typography variant="h6" className={classes.adornmentText}>
                {startWith}
              </Typography>
            </InputAdornment>
          ) : null
        }
        autoComplete="off"
      />
    );
  };
  render() {
    const { label, id, classes } = this.props;
    return (
      <FormControl classes={{ root: classes.root }} fullWidth>
        <InputLabel
          htmlFor={id}
          classes={{
            root: classes.labelField,
            shrink: classes.shrink,
          }}
        >
          {label}
        </InputLabel>
        {this.renderInput()}
      </FormControl>
    );
  }
}

export default withStyles(styles)(EditableInput);
