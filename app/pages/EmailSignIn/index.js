// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as yup from 'yup';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';

import { requestLogin } from 'containers/App/sagas';

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
  },
  title: {
    marginBottom: 40,
    fontWeight: 500,
    fontSize: 26,
  },
  fieldMargin: {
    marginBottom: 20,
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
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
});

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  classes: Object,
  requestLogin: Function,
};

type State = {
  model: {
    email: string,
    password: string,
  },
  showPassword: boolean,
  validationError: Object,
};

class EmailSignIn extends Component<Props, State> {
  state = {
    model: {
      email: '',
      password: '',
    },
    showPassword: false,
    validationError: {},
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error, user } = this.props;
    if (prevProps.isLoading && !isLoading && !error && user) {
      history.push(`/f/${user.get('slug')}/edit`);
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
  handleSignIn = () => {
    const { model } = this.state;
    schema
      .validate(model)
      .then(() => {
        this.setState({ validationError: {} });
        this.props.requestLogin(model);
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
              Sign in to your account
            </Typography>
            <TextField
              id="email"
              label="Email"
              value={model.email}
              onChange={this.handleChange}
              className={classes.fieldMargin}
              fullWidth
              error={validationError && validationError.path === 'email'}
              helperText={
                validationError &&
                validationError.path === 'email' &&
                validationError.message
              }
            />
            <FormControl
              className={classes.fieldMargin}
              fullWidth
              error={validationError && validationError.path === 'password'}
              aria-describedby="password-helper-text"
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={model.password}
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
              <FormHelperText id="password-helper-text">
                {validationError &&
                  validationError.path === 'password' &&
                  validationError.message}
              </FormHelperText>
            </FormControl>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Grid>
                <Link>Forgot password?</Link>
              </Grid>
            </Grid>
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
              onClick={this.handleSignIn}
              disabled={isLoading}
            >
              Sign In
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
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestLogin: payload => dispatch(requestLogin(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(EmailSignIn);
