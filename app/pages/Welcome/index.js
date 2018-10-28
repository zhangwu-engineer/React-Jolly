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

class Welcome extends Component<Props> {
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
      <div className="welcome">
        <div className="welcome__leftPanel">
          <img className="welcome__logo" src={Logo} alt="logo" />
          <div className="welcome__leftPanelContent">
            <h1 className="welcome__title mb-xl">Create your FREE account</h1>
            <SocialButton
              provider="facebook"
              appId={CONFIG.FACEBOOK.APP_ID}
              onLoginSuccess={this.handleFBLogin}
              onLoginFailure={this.handleFBLoginFailure}
              className="welcome__btn purple-blue mb-md"
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
              to="/freelancer-signup-2"
            >
              Continue with email
            </Button>
            <div className="welcome__signInLink">
              Already a user? <Link to="/sign-in">Sign In</Link>
            </div>
          </div>
        </div>
        <div className="welcome__rightPanel">
          <h1 className="welcome__bigTitle">
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
)(Welcome);
