// @flow

import React, { Component } from 'react';

import Link from 'components/Link';
import Button from 'components/Button';

import Logo from 'images/logo.png';

import './styles.scss';

class Welcome extends Component<{}> {
  render() {
    return (
      <div className="welcome">
        <div className="welcome__leftPanel">
          <img className="welcome__logo" src={Logo} alt="logo" />
          <div className="welcome__leftPanelContent">
            <h1 className="welcome__title mb-xl">Create your FREE account</h1>
            <Button className="welcome__btn purple-blue mb-md" type="button">
              Continue with facebook
            </Button>
            <Button className="welcome__btn secondary" type="button">
              Continue with linkedin
            </Button>
            <h1 className="welcome__divider">or</h1>
            <Button className="welcome__btn light-green mb-lg" type="button">
              Continue with email
            </Button>
            <div className="welcome__signInLink">
              Already a user? <Link>Sign In</Link>
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

export default Welcome;
