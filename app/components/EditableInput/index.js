// @flow

import React, { Component, Fragment } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import storage from 'store';
import PlacesAutocomplete from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';

const styles = theme => ({
  root: {
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
  },
  rootSelect: {
    backgroundColor: '#FFFFFF',
    height: 40,
  },
  disabledRoot: {
    backgroundColor: 'rgba(241, 241, 241, 0.45)',
  },
  labelField: {
    fontSize: 14,
    color: '#212121',
    fontWeight: 600,
    paddingLeft: 10,
    transform: 'translate(0, 14px) scale(1)',
  },
  textInput: {
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: '7px !important',
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
  disabledTextInput: {
    '&:before': {
      borderBottom: 'none !important',
    },
  },
  adornment: {
    marginRight: 0,
  },
  adornmentText: {
    color: theme.palette.text.main,
    fontSize: 14,
    fontWeight: 600,
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
    transform: 'translate(0px, 2px) scale(0.85)',
    transformOrigin: 'top',
    color: '#9b9b9b',
    fontSize: 13,
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    textDecoration: 'none',
    color: '#3a81e0',
    position: 'relative',
    top: -9,
    right: 20,
  },
  marginTop: {
    marginTop: '12px !important',
  },
});

type Props = {
  label: string,
  value: string,
  id: string,
  name: string,
  backURL: string,
  classes: Object,
  multiline: boolean,
  disabled?: boolean,
  rows?: number,
  placeholder?: string,
  startWith?: string,
  onChange: Function,
  onBlur: Function,
  select: boolean,
};

class EditableInput extends Component<Props> {
  static defaultProps = {
    multiline: false,
  };
  handleEditPhone = () => {
    const { backURL } = this.props;
    storage.set('mobilePrevPath', backURL);
    history.push('/mobile');
  };
  renderInput = () => {
    const {
      value,
      id,
      name,
      disabled,
      classes,
      multiline,
      startWith,
      rows,
      placeholder,
    } = this.props;
    if (id === 'location') {
      return (
        <PlacesAutocomplete
          value={value}
          onChange={address => {
            this.props.onChange({
              target: { value: address, id: 'location', name: 'location' },
            });
            if (address === '') {
              this.props.onChange({
                target: { value: '', id: 'distance', name: 'distance' },
              });
            }
          }}
          onSelect={address => {
            this.props.onChange({
              target: { value: address, id: 'location', name: 'location' },
            });
            this.props.onChange({
              target: { value: '', id: 'distance', name: 'distance' },
            });
          }}
          searchOptions={{ types: ['(cities)'] }}
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
    if (id === 'distance') {
      return (
        <Select
          value={value}
          name={name}
          inputProps={{
            id,
          }}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          className={cx(classes.textInput, {
            [classes.disabledTextInput]: disabled,
          })}
          disabled={disabled}
        >
          <MenuItem value="">Don&apos;t Indicate</MenuItem>
          <MenuItem value="less than 5">&lt; 5</MenuItem>
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="15">15</MenuItem>
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="30">30</MenuItem>
          <MenuItem value="35">35</MenuItem>
          <MenuItem value="40">40</MenuItem>
          <MenuItem value="45">45</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="60">60</MenuItem>
          <MenuItem value="70">70</MenuItem>
          <MenuItem value="80">80</MenuItem>
          <MenuItem value="90">90</MenuItem>
          <MenuItem value="more than 100">100 +</MenuItem>
        </Select>
      );
    }
    return (
      <Input
        id={id}
        name={name}
        value={value}
        onChange={this.props.onChange}
        multiline={multiline}
        onBlur={this.props.onBlur}
        startAdornment={
          startWith ? (
            <InputAdornment position="start" className={classes.adornment}>
              <Typography variant="h6" className={classes.adornmentText}>
                {startWith}
              </Typography>
            </InputAdornment>
          ) : null
        }
        endAdornment={
          id === 'phone' ? (
            <InputAdornment position="end">
              <Link className={classes.link} onClick={this.handleEditPhone}>
                Edit
              </Link>
            </InputAdornment>
          ) : null
        }
        autoComplete="off"
        disabled={disabled}
        classes={{
          root: cx(classes.textInput, { [classes.marginTop]: placeholder }),
          disabled: classes.disabledTextInput,
        }}
        rows={rows}
        placeholder={placeholder}
      />
    );
  };
  render() {
    const { label, id, disabled, classes, select } = this.props;
    let cssStyles = {};

    if (select) {
      cssStyles = {
        root: cx(classes.rootSelect),
      };
    } else {
      cssStyles = {
        root: cx(classes.root, { [classes.disabledRoot]: disabled }),
      };
    }

    return (
      <FormControl classes={cssStyles} fullWidth>
        {label && (
          <InputLabel
            htmlFor={id}
            classes={{
              root: classes.labelField,
              shrink: classes.shrink,
            }}
          >
            {label}
          </InputLabel>
        )}
        {this.renderInput()}
      </FormControl>
    );
  }
}

export default withStyles(styles)(EditableInput);
