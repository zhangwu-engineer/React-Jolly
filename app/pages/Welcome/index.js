// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import storage from 'store';

import CONFIG from 'conf';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import Button from 'components/Button';
import SocialButton from 'components/SocialButton';

import { requestSocialLogin } from 'containers/App/sagas';

import Logo from 'images/logo.png';
import MobileLogo from 'images/mobile_logo.png';

import './styles.scss';

type Props = {
  user: Object,
  location: Object,
  requestSocialLogin: Function,
};

class Welcome extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { user } = this.props;
    if (!prevProps.user && user) {
      storage.set('invite', null);
      if (user.getIn(['profile', 'location'])) {
        history.push(`/f/${user.get('slug')}`);
      } else {
        history.push('/ob/1');
      }
    }
  }
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
  handleLinkedInLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    const {
      location: { pathname },
    } = this.props;
    const isBusiness = pathname === '/business-signup';
    this.props.requestSocialLogin(
      { access_token: accessToken },
      'linkedin',
      isBusiness,
      storage.get('invite')
    );
  };

  handleLinkedInLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  render() {
    const {
      location: { pathname },
    } = this.props;
    const isBusiness = pathname === '/business-signup';
    return (
      <div className="welcome">
        <div className="welcome__leftPanel">
          <img className="welcome__logo" src={Logo} alt="logo" />
          <div className="welcome__leftPanelContent">
            <img
              className="welcome__mobileLogo"
              src={MobileLogo}
              alt="mobile logo"
            />
            <h1 className="welcome__title mb-xl">Create your FREE account</h1>
            <h1 className="welcome__mobileTitle">Better Work Together</h1>
            <SocialButton
              provider="facebook"
              appId={CONFIG.FACEBOOK.APP_ID}
              onLoginSuccess={this.handleFBLogin}
              onLoginFailure={this.handleFBLoginFailure}
              className="welcome__btn purple-blue"
            >
              Continue with facebook
            </SocialButton>
            <SocialButton
              provider="linkedin"
              appId={CONFIG.LINKEDIN.APP_ID}
              onLoginSuccess={this.handleLinkedInLogin}
              onLoginFailure={this.handleLinkedInLoginFailure}
              className="welcome__btn secondary"
            >
              Continue with linkedin
            </SocialButton>
            <h1 className="welcome__divider">or</h1>
            <Button
              className="welcome__btn light-green mb-lg"
              element={Link}
              to={isBusiness ? '/business-signup-2' : '/freelancer-signup-2'}
            >
              Continue with email
            </Button>
            <div className="welcome__signInLink">
              Already a user? <Link to="/sign-in">Sign In</Link>
            </div>
            <p className="welcome__pp">
              By continuing, I agree to Jolly&apos;s
              <br />
              <a
                href="https://company.jollyhq.com/terms"
                className="welcome__link"
              >
                Terms of Use
              </a>
              &nbsp;&amp;&nbsp;
              <a
                href="https://company.jollyhq.com/privacy"
                className="welcome__link"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
        <div className="welcome__rightPanel">
          <h1 className="welcome__bigTitle">
            Better Work
            <br />
            Together
          </h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isSocialLoading: state.getIn(['app', 'isSocialLoading']),
  socialError: state.getIn(['app', 'socialError']),
});

const mapDispatchToProps = dispatch => ({
  requestSocialLogin: (payload, type, isBusiness, invite) =>
    dispatch(requestSocialLogin(payload, type, isBusiness, invite)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
