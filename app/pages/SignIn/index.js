// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import CONFIG from 'conf';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import Button from 'components/Button';
import SocialButton from 'components/SocialButton';

import { requestSocialLogin } from 'containers/App/sagas';

import Logo from 'images/logo.png';

import './styles.scss';

type Props = {
  user: Object,
  requestSocialLogin: Function,
};

class SignIn extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { user } = this.props;
    if (!prevProps.user && user) {
      history.push(`/f/${user.get('slug')}/edit`);
    }
  }
  handleFBLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    this.props.requestSocialLogin({ access_token: accessToken }, 'facebook');
  };

  handleFBLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  handleLinkedInLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    this.props.requestSocialLogin({ access_token: accessToken }, 'linkedin');
  };

  handleLinkedInLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  render() {
    return (
      <div className="signin">
        <div className="signin__leftPanel">
          <img className="signin__logo" src={Logo} alt="logo" />
          <div className="signin__leftPanelContent">
            <h1 className="signin__title mb-xl">
              Sign in to your Jolly account
            </h1>
            <SocialButton
              provider="facebook"
              appId={CONFIG.FACEBOOK.APP_ID}
              onLoginSuccess={this.handleFBLogin}
              onLoginFailure={this.handleFBLoginFailure}
              className="signin__btn purple-blue mb-md"
            >
              Sign In with facebook
            </SocialButton>
            <SocialButton
              provider="linkedin"
              appId={CONFIG.LINKEDIN.APP_ID}
              onLoginSuccess={this.handleLinkedInLogin}
              onLoginFailure={this.handleLinkedInLoginFailure}
              className="signin__btn secondary nm"
            >
              Sign In with linkedin
            </SocialButton>
            <h1 className="signin__divider">or</h1>
            <Button className="signin__btn" element={Link} to="/email-sign-in">
              Sign in with email
            </Button>
            <div className="signin__signUpLink">
              Don&apos;t have an account?{' '}
              <Link to="/freelancer-signup">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="signin__rightPanel">
          <div className="signin__overlay" />
          <h1 className="signin__bigTitle">
            Bring Your Work
            <br />
            to Life
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
  requestSocialLogin: (payload, type) =>
    dispatch(requestSocialLogin(payload, type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
