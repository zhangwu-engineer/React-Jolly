/**
 Application Configuration File
 */

const path = require('path');
const ENVIRONMENTS = require('../enum/environments');

const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV || ENVIRONMENTS.DEV;
const isDev = NODE_ENV === ENVIRONMENTS.DEV;
const DOMAIN = isDev ? 'dev-jolly.co' : ENV.HOST;
const PROTOCOL = 'https';
const ROOT_DIR = process.cwd();

const API_URLS = {
  staging: 'https://jollyapi-staging.herokuapp.com',
  production: 'https://jollyapi.herokuapp.com',
};

const INTERCOM_APP_IDS = {
  staging: 'wz8qfqtl',
  production: 'lkedu906',
};

module.exports = {
  /** Logging */
  LOG: isDev,

  /** Application Running Environment */
  ENV: NODE_ENV,

  /** If Application Running In Development Environment. */
  IS_DEV: isDev,

  /**
   * Determine if we need to run the final result within pre-render engine.
   */
  IS_USE_PRE_RENDER_ENGINE: !isDev,

  /**
   * Determine if we need to run the final result within pre-render engine.
   */
  // Todo: OKSand, fix this, currently application fails in webpack script minification process.
  IS_MINIFY_SCRIPTS: false,

  /** If Application Running In Production Environment. */
  IS_BUILD_DEPENDENCY: ENV.BUILD_LIB ? ENV.BUILD_LIB === 'true' : false,

  /**
   * Determine if analytic service should be active.
   */
  IS_ANALYTIC: !isDev,

  /** Application Root Directory */
  ROOT: ROOT_DIR,

  /** Application Build Directory */
  BUILD_DIR: path.resolve(ROOT_DIR, 'build'),

  /** APP Configs */
  APP: {
    /** Application Name */
    NAME: 'Jolly',

    /** Application Version */
    VERSION: '2.0.0',

    /** Application Main Script */
    ENTRY: 'app/app.js',

    PROTOCOL,

    /** Application Domain Name */
    DOMAIN_NAME: DOMAIN,

    /** Application Base Url */
    BASE_URL: `${PROTOCOL}://${DOMAIN}`,

    PRE_RENDER_SERVICE_URL: 'http://localhost:3001',

    /** IP to listen on */
    IP: ENV.HOST || '0.0.0.0',

    /** Port Number To Listen To */
    PORT: ENV.PORT || 3000,

    /** Application Id */
    ID: isDev ? 'lkedu906' : 'lkedu906',
  },

  FACEBOOK: {
    APP_ID: isDev ? '306996470119992' : '335568877232309',
  },
  LINKEDIN: {
    APP_ID: isDev ? '862j54unk910vg' : '78qrisch5bmx23',
  },
  INTERCOM: {
    APP_ID: isDev ? 'wz8qfqtl' : INTERCOM_APP_IDS[process.env.API_ENV],
  },
  /** Application API */
  API: {
    /** Application API Base Url */
    // URL: `${PROTOCOL}://${DOMAIN}/api`,
    URL: isDev ? 'http://localhost:3001' : API_URLS[process.env.API_ENV],
  },
};
