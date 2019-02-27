/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import ReduxToastr from 'react-redux-toastr';
import ScrollMemory from 'react-router-scroll-memory';
import { MuiThemeProvider } from '@material-ui/core/styles';

import ConnectedRouter from 'components/ConnectedRouter';

import App from 'containers/App';

// Import styles
import 'styles/all.scss';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess';
import 'file-loader?name=[name].[ext]!./robots.txt';
import 'file-loader?name=[name].[ext]!pace-js/pace.min.js';
/* eslint-enable import/no-unresolved, import/extensions */

// Load custom material theme
import theme from './theme';

ReactDOM.render(
  <ConnectedRouter>
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <ReduxToastr
          timeOut={3000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
        />
        <ScrollMemory />
        <App />
      </React.Fragment>
    </MuiThemeProvider>
  </ConnectedRouter>,
  document.getElementById('app')
);

if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
    if (registrations && registrations.length) {
      window.location.reload(true);
    }
  });
}
