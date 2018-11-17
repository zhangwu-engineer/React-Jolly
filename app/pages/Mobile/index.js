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
import FormHelperText from '@material-ui/core/FormHelperText';

import Link from 'components/Link';

import injectSagas from 'utils/injectSagas';
import saga, {
  reducer,
  requestPhoneVerification,
  requestTokenVerification,
  resetState,
} from 'containers/Mobile/sagas';

import SuccessIcon from 'images/success_icon.png';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 300px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: '0px 10px',
    },
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
      marginBottom: 0,
    },
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: 'transparent',
      padding: '25px 0px 15px 0px',
    },
  },
  sectionTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      borderRadius: 3,
      padding: '10px 15px',
    },
  },
  title: {
    fontSize: 18,
    color: '#4a4a4a',
    marginBottom: 40,
  },
  inputPhone: {
    width: 324,
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
  phoneError: {
    marginLeft: 55,
  },
  inputPhoneDesc: {
    maxWidth: 337,
    color: '#4a4a4a',
    marginTop: 20,
  },
  nextButton: {
    marginTop: 70,
  },
  inputToken: {
    marginTop: 0,
    width: 259,
  },
  verifyButton: {
    marginTop: 130,
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
  step: number,
  user: Object,
  isPhoneLoading: boolean,
  phoneError: string,
  isTokenLoading: boolean,
  tokenError: string,
  classes: Object,
  requestPhoneVerification: Function,
  requestTokenVerification: Function,
  resetState: Function,
};

type State = {
  phone: string,
  token: string,
};

class Mobile extends Component<Props, State> {
  state = {
    phone: '',
    token: '',
  };
  componentWillUnmount() {
    this.props.resetState();
  }
  onChange = (e: Object) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  verifyPhone = () => {
    const { user } = this.props;
    const { phone } = this.state;
    if (phone) {
      this.props.requestPhoneVerification({ slug: user.get('slug'), phone });
    }
  };
  verifyToken = () => {
    const { token } = this.state;
    if (token) {
      this.props.requestTokenVerification({ token });
    }
  };
  render() {
    const { step, user, classes, phoneError, tokenError } = this.props;
    const { phone, token } = this.state;
    const prevPath = window.localStorage.getItem('mobilePrevPath');
    const title =
      prevPath && prevPath.includes('/personal-information')
        ? 'Personal Information'
        : 'Settings';
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Typography variant="h6" className={classes.sectionTitle}>
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
                {phoneError && (
                  <FormHelperText className={classes.phoneError} error>
                    {phoneError}
                  </FormHelperText>
                )}
                <Typography className={classes.inputPhoneDesc}>
                  Please use a valid phone number. You need to verify this
                  number
                </Typography>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button
                      className={classes.nextButton}
                      color="primary"
                      onClick={this.verifyPhone}
                    >
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
                <FormHelperText error>{tokenError}</FormHelperText>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button
                      className={classes.verifyButton}
                      color="primary"
                      onClick={this.verifyToken}
                    >
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
                          to={prevPath || `/f/${user.get('slug')}/settings`}
                          {...props}
                        />
                      )}
                    >
                      Back to {title}
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
  step: state.getIn(['mobile', 'step']),
  isPhoneLoading: state.getIn(['mobile', 'isPhoneLoading']),
  phoneError: state.getIn(['mobile', 'phoneError']),
  isTokenLoading: state.getIn(['mobile', 'isTokenLoading']),
  tokenError: state.getIn(['mobile', 'tokenError']),
});

const mapDispatchToProps = dispatch => ({
  requestPhoneVerification: payload =>
    dispatch(requestPhoneVerification(payload)),
  requestTokenVerification: payload =>
    dispatch(requestTokenVerification(payload)),
  resetState: () => dispatch(resetState()),
});

export default compose(
  injectSagas({ key: 'mobile', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Mobile);
