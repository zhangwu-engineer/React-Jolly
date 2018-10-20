// @flow

import React, { Component } from 'react';

import Link from 'components/Link';
import Button from 'components/Button';

import Logo from 'images/logo.png';

import './styles.scss';

class SignIn extends Component<{}> {
  render() {
    return (
      <div className="signin">
        <div className="signin__leftPanel">
          <img className="signin__logo" src={Logo} alt="logo" />
          <div className="signin__leftPanelContent">
            <h1 className="signin__title mb-xl">
              Sign in to your Jolly account
            </h1>
            <Button className="signin__btn purple-blue mb-md" type="button">
              Sign In with facebook
            </Button>
            <Button className="signin__btn secondary nm" type="button">
              Sign In with linkedin
            </Button>
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

export default SignIn;
