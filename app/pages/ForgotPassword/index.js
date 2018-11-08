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
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'components/ConnectedRouter';

import injectSagas from 'utils/injectSagas';
import saga, {
  reducer,
  requestForgotPassword,
} from 'containers/Password/sagas';

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
});

type Props = {
  isLoading: boolean,
  error: string,
  classes: Object,
  requestForgotPassword: Function,
};

type State = {
  model: {
    email: string,
  },
  validationError: Object,
};

class ForgotPassword extends Component<Props, State> {
  state = {
    model: {
      email: '',
    },
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
  handleSubmit = () => {
    const { model } = this.state;
    schema
      .validate(model)
      .then(() => {
        this.setState({ validationError: {} });
        this.props.requestForgotPassword(model);
      })
      .catch(err => {
        this.setState({ validationError: err });
      });
  };
  render() {
    const { isLoading, error, classes } = this.props;
    const { model, validationError } = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Paper className={classes.panel} elevation={1}>
            <Typography className={classes.title} variant="h5" component="h1">
              Forgot Password
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
              Continue
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
  requestForgotPassword: payload => dispatch(requestForgotPassword(payload)),
});

export default compose(
  injectSagas({ key: 'password', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(ForgotPassword);
