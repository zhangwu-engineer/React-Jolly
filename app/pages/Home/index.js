// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import * as yup from 'yup';
import { cloneDeep } from 'lodash-es';
import storage from 'store';
import CONFIG from 'conf';
import { withStyles } from '@material-ui/core/styles';
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
import Divider from '@material-ui/core/Divider';
import SocialButton from 'components/SocialButton';
import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import BaseModal from 'components/BaseModal';
import Logo from 'images/logo.png';
import homeMobile from 'images/welcome-image.png';
import { requestRegister, requestSocialLogin } from 'containers/App/sagas';

const styles = theme => ({
  root: {},
  panel: {
    maxWidth: 400,
    paddingTop: 42.4,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 16,
    marginLeft: 40,
    marginTop: 80,
    marginBottom: 80,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 37.4,
      paddingLeft: 27,
      paddingRight: 28,
      paddingBottom: 46,
      maxWidth: '100%',
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 0,
    },
    boxShadow: 'none',
  },
  title: {
    marginBottom: 30,
    fontSize: 20,
    fontWeight: 600,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.2,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: '#484848',
  },
  fieldMargin: {
    marginBottom: 10,
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
    backgroundColor: theme.palette.common.darkgreen,
    fontSize: 13,
    fontWeight: 600,
    paddingTop: 14,
    borderRadius: 0,
    paddingBottom: 14,
    '&:hover': {
      backgroundColor: theme.palette.common.darkgreen,
    },
  },
  agree: {
    fontSize: 13,
    fontWeight: 500,
    color: '#484848',
    marginTop: 20,
  },
  link: {
    fontWeight: 500,
    fontSize: 13,
    textDecoration: 'none',
    textTransform: 'none',
    color: '#1575d9',
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
  haveAccountText: {
    marginTop: 27,
    fontWeight: 600,
    fontSize: 14,
    color: '#484848',
  },
  signInLink: {
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    textTransform: 'none',
    color: '#1575d9',
  },
  panelBox: {
    display: 'flex',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionDevider: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
  textOr: {
    paddingTop: 17,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.29,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#484848',
  },
  header: {
    width: '100%',
    height: 77,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  headerText: {
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 500,
    lineGeight: 1.29,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    minHeight: 77,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    paddingTop: 25,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 2.14,
    color: '#7cc6fe',
    padding: 7,
    textTransform: 'none',
    textDecoration: 'none',
    '&:hover, &:focus': {
      color: '#7cc6fe',
    },
  },
  fbButton: {
    borderRadius: 0,
    fontSize: 12,
    fontWeight: 600,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.5,
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.palette.common.white,
    width: '100%',
  },
  mobileImage: {
    width: 447,
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
  requestSocialLogin: Function,
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

class HomePage extends Component<Props, State> {
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
  handleFBLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    const {
      location: { pathname },
    } = this.props;
    const isBusiness = pathname === '/business-signup';
    this.props.requestSocialLogin(
      { access_token: accessToken },
      'facebook',
      isBusiness,
      storage.get('invite')
    );
  };

  handleFBLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  nameInput = React.createRef();
  passwordInput = React.createRef();
  render() {
    const { isLoading, error, classes } = this.props;
    const { model, showPassword, isOpen, validationError } = this.state;
    return (
      <React.Fragment>
        <div className={classes.header}>
          <Typography className={classes.headerText}>
            Friday 6/14 · New in Jolly: Add badges on your profile · Search nationwide and filter by location+position
          </Typography>
        </div>
        <div className={classes.panelBox}>
          <div className={classes.leftPanel}>
            <div>
              <img className={classes.mobileImage} src={homeMobile} alt="" />
            </div>
          </div>
          <div className={classes.rightPanel}>
            <Paper className={classes.panel} elevation={1}>
              <Typography className={classes.title}>
                <img src={Logo} alt="logo" />
              </Typography>
              <Typography className={classes.title} variant="h5" component="h1">
                Join your local network of event freelancers, hirers &
                businesses
              </Typography>
              <SocialButton
                provider="facebook"
                appId={CONFIG.FACEBOOK.APP_ID}
                onLoginSuccess={this.handleFBLogin}
                onLoginFailure={this.handleFBLoginFailure}
                className={classes.fbButton}
              >
                LOGIN WITH FACEBOOK
              </SocialButton>
              <div className={classes.sectionDevider}>
                <div className={classes.flexOne}>
                  <Divider style={{ backgroundColor: '#e4e4e4', height: 1}} />
                </div>
                <p className={classes.textOr}>OR</p>
                <div className={classes.flexOne}>
                  <Divider style={{ backgroundColor: '#e4e4e4', height: 1}} />
                </div>
              </div>
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
              {error && error === 'email exists' ? (
                <FormHelperText className={classes.fieldMargin} error>
                  There is already an account associated with this email address. Please&nbsp;
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
                SIGN UP WITH EMAIL
                {isLoading && (
                  <CircularProgress
                    className={classes.progress}
                    size={15}
                    color="inherit"
                  />
                )}
              </Button>
              <Typography
                className={classes.agree}
                align="center"
                color="textSecondary"
              >
                By continuing, I agree to Jolly&apos;s
                <br />
                <Link to="/terms" className={classes.link}>Terms of Use</Link>
                &nbsp;&amp;&nbsp;
                <Link to="/privacy-policy" className={classes.link}>
                  Privacy Policy
                </Link>
              </Typography>
              <Typography
                className={classes.haveAccountText}
                align="center"
                color="textSecondary"
              >
                Already have an account?
                <Link to="/email-sign-in" className={classes.signInLink}> Sign in</Link>
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
        </div>
        <div className={classes.footer}>
          <Link target="_blank" className={classes.footerLink} to="https://www.joinjolly.com/">Freelancers </Link>
          <Link target="_blank" className={classes.footerLink} to="">Hirers</Link>
          <Link target="_blank" className={classes.footerLink} to="https://business.jollyhq.com/" >Businesses</Link>
          <Link target="_blank" className={classes.footerLink} to="https://company.jollyhq.com/get-started" >Get started</Link>
          <Link target="_blank" className={classes.footerLink} to="https://business.jollyhq.com/freelancer-management-system">FMS</Link>
          <Link target="_blank" className={classes.footerLink} to="https://company.jollyhq.com/">About</Link>
          <Link target="_blank" className={classes.footerLink} to="https://company.jollyhq.com/contact">Contact</Link>
          <Link target="_blank" className={classes.footerLink} to="https://company.jollyhq.com/terms">Terms</Link>
          <Link target="_blank" className={classes.footerLink} to="https://company.jollyhq.com/privacy">Privacy</Link>
          <Link className={classes.footerLink}> ©2019 Jolly</Link>
        </div>
      </React.Fragment>
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
  requestSocialLogin: (payload, type, isBusiness, invite) =>
    dispatch(requestSocialLogin(payload, type, isBusiness, invite)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(HomePage);
