// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
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
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import BaseModal from 'components/BaseModal';

import { requestRegister } from 'containers/App/sagas';

const styles = theme => ({
  root: {},
  panel: {
    maxWidth: 437,
    margin: 'auto',
    marginTop: 80,
    paddingTop: 46,
    paddingLeft: 30,
    paddingRight: 57,
    paddingBottom: 64,
  },
  title: {
    marginBottom: 30,
    fontWeight: 500,
  },
  fieldMargin: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.palette.common.green,
    fontSize: 13,
    fontWeight: 600,
    paddingTop: 15,
    paddingBottom: 15,
    '&:hover': {
      backgroundColor: theme.palette.common.green,
    },
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
  fullname: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  isLoading: boolean,
  error: string,
  classes: Object,
  requestRegister: Function,
};

type State = {
  model: {
    email: string,
    fullname: string,
    password: string,
  },
  showPassword: boolean,
  isOpen: boolean,
  validationError: Object,
};

class SignUp extends Component<Props, State> {
  state = {
    model: {
      email: '',
      fullname: '',
      password: '',
    },
    showPassword: false,
    isOpen: false,
    validationError: {},
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      history.push('/me');
    }
  }
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  confirmEmail = () => {
    schema
      .validate(this.state.model)
      .then(() => {
        this.setState({ validationError: {} });
        this.setState({ isOpen: true });
      })
      .catch(err => {
        this.setState({ validationError: err });
      });
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
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleRegister = () => {
    const { model } = this.state;
    this.setState({ isOpen: false }, () => {
      this.props.requestRegister(model);
    });
  };
  render() {
    const { isLoading, error, classes } = this.props;
    const { model, showPassword, isOpen, validationError } = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Paper className={classes.panel} elevation={1}>
            <Typography className={classes.title} variant="h5" component="h1">
              Create your FREE account
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
            <TextField
              id="fullname"
              label="Full name"
              value={model.fullname}
              onChange={this.handleChange}
              className={classes.fieldMargin}
              fullWidth
              error={validationError && validationError.path === 'fullname'}
              helperText={
                validationError &&
                validationError.path === 'fullname' &&
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
            <Typography className="mb-xl">
              Password must be 8+ characters containing uppercase, lower case,
              and number or special characters
            </Typography>
            {error && (
              <FormHelperText className={classes.fieldMargin} error>
                {error}
              </FormHelperText>
            )}
            <Button
              className={cx(classes.button, classes.fieldMargin)}
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.confirmEmail}
              disabled={isLoading}
            >
              Join Now for Free
              {isLoading && (
                <CircularProgress
                  className={classes.progress}
                  size={15}
                  color="inherit"
                />
              )}
            </Button>
            <Typography align="center" color="textSecondary">
              By continuing, I agree to Jolly&apos;s
              <br />
              <Link className={classes.link}>Terms of Use</Link>
              &nbsp;&amp;&nbsp;
              <Link className={classes.link}>Privacy Policy</Link>
            </Typography>
          </Paper>
        </div>
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
        >
          <Typography variant="h6" component="h1">
            Is this email correct?
          </Typography>
          <Typography
            className={classes.emailText}
            variant="body2"
            component="p"
          >
            {model.email}
          </Typography>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={this.onCloseModal}>EDIT</Button>
            </Grid>
            <Grid item>
              <Button onClick={this.handleRegister}>YES</Button>
            </Grid>
          </Grid>
        </BaseModal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestRegister: payload => dispatch(requestRegister(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(SignUp);
