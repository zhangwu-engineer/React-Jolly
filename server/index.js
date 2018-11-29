// Fixme: OKSand, need complete cleanup.

/* eslint consistent-return:0 */

const CONFIG = require('../app/conf');
const HTTP_HEADER = require('../app/enum/http/headers');
const express = require('express');
const logger = require('./logger');
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;
const https = require('https');
const fs = require('fs');
const enforce = require('express-sslify');

const sslOptions = {
  key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
};

const APP_CONFIG = CONFIG.APP;

const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

/**
 * Set Application Server Headers
 */
app.set(HTTP_HEADER.X_POWERED_BY, APP_CONFIG.NAME);

app.use(enforce.HTTPS({ trustProtoHeader: true }));
/**
 * Express App Listening Port
 */
if (CONFIG.IS_DEV) {
  https
    .createServer(sslOptions, app)
    .listen(APP_CONFIG.PORT, APP_CONFIG.IP, err => {
      if (!err) {
        logger.appStarted(APP_CONFIG.PORT, APP_CONFIG.BASE_URL);
      } else {
        return logger.error(err.message);
      }
    });
} else {
  app.listen(APP_CONFIG.PORT, APP_CONFIG.IP, err => {
    if (!err) {
      logger.appStarted(APP_CONFIG.PORT, APP_CONFIG.BASE_URL);
    } else {
      return logger.error(err.message);
    }
  });
}
