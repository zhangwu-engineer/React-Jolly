// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as yup from 'yup';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { history } from 'components/ConnectedRouter';

import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestResetPassword } from 'containers/Password/sagas';

const styles = theme => ({
  root: {},
  panel: {
    maxWidth: 437,
    margin: 'auto',
    marginTop: 80,
    paddingTop: 46,
    paddingLeft: 30,
    paddingRight: 57,
    paddingBottom: 55,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 23,
      padding: 20,
    },
  },
  title: {
    marginBottom: 40,
    fontWeight: 500,
    fontSize: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  fieldMargin: {
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
    },
  },
  textInput: {
    '& input': {
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 10,
      },
    },
  },
  button: {
    fontSize: 13,
    fontWeight: 600,
    paddingTop: 15,
    paddingBottom: 15,
    letterSpacing: 1.3,
  },
  link: {
    color: theme.palette.primary,
    fontSize: 15,
    textDecoration: 'none',
    textTransform: 'none',
    fontWeight: 'normal',
  },
  modal: {
    padding: 15,
    width: 320,
  },
  emailText: {
    fontWeight: 500,
    color: theme.palette.common.grey,
    marginBottom: 30,
  },
  progress: {
    marginLeft: theme.spacing.unit,
  },
});

const schema = yup.object().shape({
  password: yup.string().required(),
});

type Props = {
  isLoading: boolean,
  error: string,
  classes: Object,
  match: Object,
  requestResetPassword: Function,
};

type State = {
  model: {
    password: string,
  },
  showPassword: boolean,
  validationError: Object,
};

class ResetPassword extends Component<Props, State> {
  state = {
    model: {
      password: '',
    },
    showPassword: false,
    validationError: {},
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      history.push('/email-sign-in');
    }
  }
  handleChange = (e: Object) => {
    e.persist();
    this.setState(state => ({
      model: {
        ...state.model,
        [e.target.id]: e.target.value,
      },
    }));
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleSubmit = () => {
    const {
      match: {
        params: { token },
      },
    } = this.props;
    const { model } = this.state;
    schema
      .validate(model)
      .then(() => {
        this.setState({ validationError: {} });
        this.props.requestResetPassword(Object.assign({}, model, { token }));
      })
      .catch(err => {
        this.setState({ validationError: err });
      });
  };
  render() {
    const { isLoading, error, classes } = this.props;
    const { model, showPassword, validationError } = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Paper className={classes.panel} elevation={1}>
            <Typography className={classes.title} variant="h5" component="h1">
              Reset Password
            </Typography>
            <FormControl
              className={classes.fieldMargin}
              fullWidth
              error={validationError && validationError.path === 'password'}
              aria-describedby="password-helper-text"
            >
              <InputLabel htmlFor="password">New Password</InputLabel>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={model.password}
                className={classes.textInput}
                onChange={this.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {validationError &&
                validationError.path === 'password' &&
                validationError.message && (
                  <FormHelperText id="password-helper-text">
                    {validationError &&
                      validationError.path === 'password' &&
                      validationError.message}
                  </FormHelperText>
                )}
            </FormControl>
            {error && (
              <FormHelperText className={classes.fieldMargin} error>
                {error}
              </FormHelperText>
            )}
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              Save
              {isLoading && (
                <CircularProgress
                  className={classes.progress}
                  size={15}
                  color="inherit"
                />
              )}
            </Button>
          </Paper>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['password', 'isLoading']),
  error: state.getIn(['password', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestResetPassword: payload => dispatch(requestResetPassword(payload)),
});

export default compose(
  injectSagas({ key: 'password', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(ResetPassword);
