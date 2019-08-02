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
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { history } from 'components/ConnectedRouter';
import { BUSINESS_CATEGORY_OPTIONS } from 'enum/constants';
import Link from 'components/Link';

const styles = theme => ({
  root: {
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
    '& label': {
      marginTop: 8,
      paddingLeft: 20,
    },
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
    marginTop: '16px !important',
    '&:before': {
      borderBottom: '2px solid #f1f1f1',
    },
    '& input': {
      paddingTop: 10,
      paddingBottom: 11,
    },
  },
  selectInput: {
    paddingTop: 5,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: '16px !important',
    '&:before': {
      borderBottom: '2px solid #f1f1f1',
    },
    '& input': {
      paddingTop: 10,
      paddingBottom: 11,
    },
    '& #select-category': {
      background: 'transparent !important',
    },
    '& svg': {
      marginTop: -4,
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
  assistLabel: {
    fontSize: 12,
    marginLeft: 14,
  },
  limitLabel: {
    fontSize: 12,
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 28,
  },
  additionalText: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -6,
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
  limit?: number,
  assistiveText?: string,
  placeholder?: string,
  startWith?: string,
  onChange: Function,
  onLocationSelect: Function,
  onBlur: Function,
  select: boolean,
};

class EditableFormInput extends Component<Props> {
  static defaultProps = {
    multiline: false,
  };
  state = {
    charCount: 0,
  };
  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({ charCount: value ? value.length : 0 });
  }
  handleEditPhone = () => {
    const { backURL } = this.props;
    storage.set('mobilePrevPath', backURL);
    history.push('/mobile');
  };
  handleChange = e => {
    const { value } = e.target;
    const { limit } = this.props;
    this.setState({ charCount: value.length > limit ? limit : value.length });
    if (!limit || value.length <= limit) {
      this.props.onChange(e);
    }
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
    if (id === 'location' || id === 'otherLocations') {
      return (
        <PlacesAutocomplete
          value={value}
          onChange={address => {
            this.props.onChange({
              target: { value: address, id, name: id },
            });
            if (address === '') {
              this.props.onChange({
                target: { value: '', id: 'distance', name: 'distance' },
              });
            }
          }}
          onSelect={address => {
            this.props.onChange({
              target: { value: address, id, name: id },
            });
            this.props.onLocationSelect(address);
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

    if (id === 'category') {
      return (
        <Select
          value={value}
          name={name}
          inputProps={{
            id,
          }}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          IconComponent={ExpandMore}
          className={cx(classes.selectInput, {
            [classes.disabledTextInput]: disabled,
          })}
        >
          {BUSINESS_CATEGORY_OPTIONS.map(option => (
            <MenuItem value={option.value} key="menu">
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );
    }
    return (
      <Input
        id={id}
        name={name}
        value={value}
        onChange={this.handleChange}
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
    const {
      label,
      id,
      disabled,
      classes,
      select,
      limit,
      assistiveText,
    } = this.props;
    const { charCount } = this.state;
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
      <div>
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
        <Grid container className={classes.additionalText}>
          <Grid>
            {assistiveText && (
              <InputLabel className={classes.assistLabel}>
                {assistiveText}
              </InputLabel>
            )}
          </Grid>
          <Grid>
            {limit && (
              <InputLabel className={classes.limitLabel}>
                {`${charCount}/${limit}`}
              </InputLabel>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(EditableFormInput);
