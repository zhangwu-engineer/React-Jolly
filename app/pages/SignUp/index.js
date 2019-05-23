// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import * as yup from 'yup';
import { cloneDeep } from 'lodash-es';
import storage from 'store';

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
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 23,
      padding: 20,
    },
  },
  title: {
    marginBottom: 30,
    fontWeight: 500,
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
  passwordDesc: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
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
    color: theme.palette.primary.main,
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
  signinLink: {
    color: '#f44336',
    '&:hover': {
      color: '#f44336',
    },
  },
  modalTitle: {
    fontSize: 18,
  },
});

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  fullname: yup
    .string()
    .test(
      'is-valid-fullname',
      'Fullname is not valid',
      value => value.trim().split(' ').length >= 2
    ),
  password: yup.string().required(),
});

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  classes: Object,
  location: Object,
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
    const { isLoading, error, user } = this.props;
    if (prevProps.isLoading && !isLoading && !error && user) {
      storage.set('invite', null);
      history.push('/ob/1');
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
    const {
      location: { pathname },
    } = this.props;
    const isBusiness = pathname === '/business-signup-2';
    const { email, fullname, password } = cloneDeep(this.state.model);
    const [firstName, ...rest] = fullname.split(' ');
    this.setState({ isOpen: false }, () => {
      this.props.requestRegister(
        {
          email,
          firstName,
          lastName: rest.join(' '),
          password,
          isBusiness,
        },
        storage.get('invite')
      );
    });
  };
  nameInput = React.createRef();
  passwordInput = React.createRef();
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
              onKeyDown={e => {
                if (e.keyCode === 13 && this.nameInput.current) {
                  this.nameInput.current.focus();
                }
              }}
              className={cx(classes.fieldMargin, classes.textInput)}
              fullWidth
              error={validationError && validationError.path === 'email'}
              helperText={
                validationError &&
                validationError.path === 'email' &&
                validationError.message
              }
              autoFocus
            />
            <TextField
              id="fullname"
              label="Full name"
              value={model.fullname}
              onChange={this.handleChange}
              onKeyDown={e => {
                if (e.keyCode === 13 && this.passwordInput.current) {
                  this.passwordInput.current.focus();
                }
              }}
              className={cx(classes.fieldMargin, classes.textInput)}
              fullWidth
              error={validationError && validationError.path === 'fullname'}
              helperText={
                validationError &&
                validationError.path === 'fullname' &&
                validationError.message
              }
              inputRef={this.nameInput}
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
                className={classes.textInput}
                onChange={this.handleChange}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.confirmEmail();
                  }
                }}
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
                inputRef={this.passwordInput}
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
            <Typography className={classes.passwordDesc}>
              Password must be 8+ characters containing uppercase, lower case,
              and number or special characters
            </Typography>
            {error && error === 'email exists' ? (
              <FormHelperText className={classes.fieldMargin} error>
                There is already an account associated with this email address.
                Please&nbsp;
                <Link to="/email-sign-in" className={classes.signinLink}>
                  sign in
                </Link>
                &nbsp;here.
              </FormHelperText>
            ) : (
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
              <Link to="/privacy-policy" className={classes.link}>
                Privacy Policy
              </Link>
            </Typography>
          </Paper>
        </div>
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
        >
          <Typography
            variant="h6"
            component="h1"
            className={classes.modalTitle}
          >
            Did you type your email correctly?
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
              <Button onClick={this.onCloseModal}>No, Update</Button>
            </Grid>
            <Grid item>
              <Button onClick={this.handleRegister}>Yes</Button>
            </Grid>
          </Grid>
        </BaseModal>
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
  requestRegister: (payload, invite) =>
    dispatch(requestRegister(payload, invite)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(SignUp);
