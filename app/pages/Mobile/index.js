// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Link from 'components/Link';

import SuccessIcon from 'images/success_icon.png';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 300px auto',
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  title: {
    fontSize: 18,
    color: '#4a4a4a',
    marginBottom: 40,
  },
  inputPhone: {
    width: 324,
    marginBottom: 20,
    '& .react-phone-number-input__icon': {
      position: 'relative',
      border: 'none',
    },
    '& .react-phone-number-input__icon-image': {
      position: 'absolute',
    },
    '& .react-phone-number-input__input': {
      marginLeft: 15,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  inputPhoneDesc: {
    maxWidth: 337,
    color: '#4a4a4a',
    marginBottom: 70,
  },
  inputToken: {
    marginTop: 0,
    marginBottom: 130,
    width: 259,
  },
  successIcon: {
    marginTop: 30,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 33,
    color: '#1e1e1e',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    color: '#636363',
    lineHeight: 1.28,
    textAlign: 'center',
    width: 302,
    margin: '0px auto 40px auto',
  },
  backButton: {
    fontSize: 14,
    marginBottom: 90,
    padding: '12px 74px',
  },
});

type Props = {
  user: Object,
  classes: Object,
};

type State = {
  step: number,
  phone: string,
  token: string,
};

class Mobile extends Component<Props, State> {
  state = {
    step: 1,
    phone: '',
    token: '',
  };
  onChange = (e: Object) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  verifyPhone = () => {
    const { phone } = this.state;
    if (phone) {
      this.setState({ step: 2 });
    }
  };
  verifyToken = () => {
    const { token } = this.state;
    if (token) {
      this.setState({ step: 3 });
    }
  };
  render() {
    const { user, classes } = this.props;
    const { step, phone, token } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Typography variant="h6">
              Connect phone by text verification
            </Typography>
          </div>
          <div className={classes.sectionBody}>
            {step === 1 && (
              <Fragment>
                <Typography variant="h6" className={classes.title}>
                  Enter the number you&apos;d like to use
                </Typography>
                <PhoneInput
                  className={classes.inputPhone}
                  placeholder="Enter phone number"
                  value={phone}
                  country="US"
                  onChange={value => this.setState({ phone: value })}
                />
                <Typography className={classes.inputPhoneDesc}>
                  Please use a valid phone number. You need to verify this
                  number
                </Typography>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button color="primary" onClick={this.verifyPhone}>
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Fragment>
            )}
            {step === 2 && (
              <Fragment>
                <Typography variant="h6" className={classes.title}>
                  Enter the verification code
                </Typography>
                <TextField
                  label="Enter code"
                  id="token"
                  name="token"
                  value={token}
                  onChange={this.onChange}
                  className={classes.inputToken}
                />
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button color="primary" onClick={this.verifyToken}>
                      Verify
                    </Button>
                  </Grid>
                </Grid>
              </Fragment>
            )}
            {step === 3 && (
              <Fragment>
                <Grid container justify="center">
                  <Grid item>
                    <img
                      src={SuccessIcon}
                      alt="success"
                      className={classes.successIcon}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6" className={classes.successTitle}>
                  Successful
                </Typography>
                <Typography className={classes.successText}>
                  Your phone number has been added successfully
                </Typography>
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      className={classes.backButton}
                      color="primary"
                      component={props => (
                        <Link
                          to={`/f/${user.get(
                            'slug'
                          )}/edit/personal-information`}
                          {...props}
                        />
                      )}
                    >
                      Back to Settings
                    </Button>
                  </Grid>
                </Grid>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = () => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Mobile);
