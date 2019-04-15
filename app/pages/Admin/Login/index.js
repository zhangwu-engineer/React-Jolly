// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as yup from 'yup';
import cx from 'classnames';
import { Formik } from 'formik';

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
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { history } from 'components/ConnectedRouter';

import { requestAdminLogin } from 'containers/App/sagas';

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
  location: Object,
  requestAdminLogin: Function,
};

type State = {
  showPassword: boolean,
};

class AdminLogin extends Component<Props, State> {
  state = {
    showPassword: false,
  };
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      history.push('/admin');
    }
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isLoading,
      error,
      user,
      location: {
        query: { redirect },
      },
    } = this.props;
    if (prevProps.isLoading && !isLoading && !error && user) {
      const path = redirect || '/admin';
      history.push(path);
    }
  }
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleSave = (values, { resetForm }) => {
    this.props.requestAdminLogin(values);
    resetForm(values);
  };
  passwordInput = React.createRef();
  render() {
    const { isLoading, error, classes } = this.props;
    const { showPassword } = this.state;
    const initialValues = {
      email: '',
      password: '',
    };
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={this.handleSave}
      >
        {({
          values,
          // dirty,
          errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          // isSubmitting,
          /* and other goodies */
        }) => (
          <Fragment>
            <CssBaseline />
            <div className={classes.root}>
              <Paper className={classes.panel} elevation={1}>
                <Typography
                  className={classes.title}
                  variant="h5"
                  component="h1"
                >
                  Admin Panel
                </Typography>
                <TextField
                  id="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={e => {
                    if (e.keyCode === 13 && this.passwordInput.current) {
                      this.passwordInput.current.focus();
                    }
                  }}
                  className={cx(classes.fieldMargin, classes.textInput)}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                  autoFocus
                />
                <FormControl
                  className={classes.fieldMargin}
                  fullWidth
                  error={!!errors.password}
                  aria-describedby="password-helper-text"
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    className={classes.textInput}
                    inputRef={this.passwordInput}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        handleSubmit();
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
                  />
                  <FormHelperText id="password-helper-text">
                    {errors.message}
                  </FormHelperText>
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
                  onClick={handleSubmit}
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
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'adminUser']),
  isLoading: state.getIn(['app', 'isAdminLoading']),
  error: state.getIn(['app', 'adminError']),
});

const mapDispatchToProps = dispatch => ({
  requestAdminLogin: payload => dispatch(requestAdminLogin(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(AdminLogin);
