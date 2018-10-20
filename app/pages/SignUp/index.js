// @flow

import React, { Component, Fragment } from 'react';
import cx from 'classnames';

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
import Grid from '@material-ui/core/Grid';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Link from 'components/Link';
import BaseModal from 'components/BaseModal';

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
});

type Props = {
  classes: Object,
};

type State = {
  model: {
    email: string,
    fullname: string,
    password: string,
  },
  showPassword: boolean,
  isOpen: boolean,
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
  };
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  confirmEmail = () => {
    this.setState({ isOpen: true });
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
  handleRegister = () => {};
  render() {
    const { classes } = this.props;
    const { model, showPassword, isOpen } = this.state;
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
            />
            <TextField
              id="fullname"
              label="Full name"
              value={model.fullname}
              onChange={this.handleChange}
              className={classes.fieldMargin}
              fullWidth
            />
            <FormControl className={classes.fieldMargin} fullWidth>
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
            </FormControl>
            <Typography className="mb-xl">
              Password must be 8+ characters containing uppercase, lower case,
              and number or special characters
            </Typography>
            <Button
              className={cx(classes.button, classes.fieldMargin)}
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.confirmEmail}
            >
              Join Now for Free
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

export default withStyles(styles)(SignUp);
