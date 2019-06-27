// @flow

import React, { Component } from 'react';

import './styles.scss';

class FourOneFourPage extends Component<{}> {
  render() {
    return (
      <div className="notFound">
        <div className="row column text-center">
          <div className="notFound__titleWrapper">
            <br />
            <br />
            <p>
              <strong>404 Error</strong>
            </p>
            <p>
              {
                "That means the page you're looking for, unfortunately, doesn't exist."
              }
            </p>
            <p>
              <a href="https://www.jollyhq.com">
                Please try again from the home page
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default FourOneFourPage;
