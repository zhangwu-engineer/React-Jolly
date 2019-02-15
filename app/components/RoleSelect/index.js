// @flow

import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
    padding: '8px 26px 5px',
    marginBottom: 12,
  },
  input: {
    display: 'flex',
    fontSize: 14,
    fontWeight: 600,
    color: '#434343',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#434343',
  },
  placeholder: {
    fontSize: 14,
    fontWeight: 600,
    color: '#434343',
    boxSizing: 'border-box',
    opacity: 0.5,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

const NoOptionsMessage = (props: any) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const inputComponent = ({ inputRef, ...props }: any) => (
  <div ref={inputRef} {...props} />
);

const Control = (props: any) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      },
      disableUnderline: true,
    }}
    {...props.selectProps.textFieldProps}
  />
);

const Option = (props: any) => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

const Placeholder = (props: any) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const SingleValue = (props: any) => (
  <Typography
    className={props.selectProps.classes.singleValue}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

const ValueContainer = (props: any) => (
  <div className={props.selectProps.classes.valueContainer}>
    {props.children}
  </div>
);

const MultiValue = (props: any) => (
  <Chip
    tabIndex={-1}
    label={props.children}
    className={classNames(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused,
    })}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon {...props.removeProps} />}
  />
);

const Menu = (props: any) => (
  <Paper
    square
    className={props.selectProps.classes.paper}
    {...props.innerProps}
  >
    {props.children}
  </Paper>
);

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

type Props = {
  options: Array<Object>,
  value: any,
  placeholder: string,
  isClearable: boolean,
  isMulti: boolean,
  theme: Object,
  classes: Object,
  onChange: Function,
};

class RoleSelect extends React.Component<Props> {
  render() {
    const {
      options,
      value,
      placeholder,
      isClearable,
      isMulti,
      classes,
      theme,
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          styles={selectStyles}
          options={options}
          components={components}
          value={value}
          onChange={this.props.onChange}
          placeholder={placeholder}
          isClearable={isClearable}
          isMulti={isMulti}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(RoleSelect);
