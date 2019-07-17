// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router';
import cx from 'classnames';
import 'react-image-lightbox/style.css';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Notification from 'components/Notification';
import BusinessProfileInfo from 'components/BusinessProfileInfo';
import BusinessMemberProfileInfo from 'components/BusinessMemberProfileInfo';
import BusinessSidebar from 'components/BusinessSidebar';
import { CONNECTION_REQUEST_MSG } from 'enum/connection';
import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestCreateConnection,
  requestCheckConnection,
} from 'containers/Member/sagas';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    width: '100%',
    maxWidth: 1064,
    margin: '0px auto 150px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      marginBottom: 120,
    },
  },
  businessSidebar: {
    width: 291,
    minHeight: '100vh',
    background: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  profileInfo: {
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0,
    },
  },
  panel: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  leftPanel: {
    width: 355,
    marginRight: 23,
    [theme.breakpoints.down('xs')]: {
      width: 'inherit',
      marginRight: 0,
    },
  },
  rightPanel: {
    flex: 1,
  },
  section: {},
  sectionHeader: {
    paddingLeft: 5,
    paddingTop: 25,
    paddingBottom: 30,
    paddingRight: 5,
    [theme.breakpoints.down('xs')]: {
      padding: '25px 30px 0px 30px',
    },
  },
  title: {
    color: '#252525',
    fontSize: 24,
    fontWeight: 600,
  },
  sectionBody: {
    [theme.breakpoints.down('xs')]: {
      padding: 25,
    },
  },
  shareSection: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginTop: 40,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      margin: '0px 25px 30px',
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    },
  },
  shareSectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 3,
      padding: 15,
    },
  },
  shareText: {
    fontSize: 20,
    fontWeight: 500,
  },
  shareProfileButton: {
    fontSize: 17,
    fontWeight: 500,
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    textTransform: 'none',
    padding: '10px 20px',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  contactBanner: {
    position: 'fixed',
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 -4px 20px 0 rgba(0, 0, 0, 0.07)',
  },
  contactBannerButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 600,
    padding: '10px 110px',
    textTransform: 'none',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  topBanner: {
    padding: '25px 70px',
    backgroundColor: '#b8f3ce',
    [theme.breakpoints.down('xs')]: {
      padding: '20px 10px',
    },
  },
  topBannerTextContainer: {
    width: '100%',
  },
  topBannerText: {
    color: '#303532',
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      marginBottom: 20,
    },
  },
  topBannerButtonsContainer: {
    width: '100%',
    textAlign: 'right',
  },
  topBannerButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 500,
    padding: '11px 23px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  backButton: {
    marginRight: 15,
  },
  fixedTopBanner: {
    position: 'fixed',
    top: 0,
    zIndex: 10,
  },
  bottomBannerContainer: {
    marginTop: 20,
    [theme.breakpoints.down('xs')]: {
      backgroundColor: '#f3faff',
      paddingLeft: 25,
      paddingRight: 25,
      marginTop: 0,
    },
  },
  bottomBanner: {
    padding: '25px 30px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      padding: '15px 20px',
      width: 'auto',
      borderRadius: 3,
    },
  },
  bannerText: {
    fontWeight: 500,
  },
  bannerButton: {
    fontSize: 17,
    fontWeight: 500,
    padding: '11px 20px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    textTransform: 'none',
    border: '1px solid #e5e5e5',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: 'transparent',
      fontSize: 16,
      color: theme.palette.primary.main,
      marginTop: 15,
    },
  },
  bannerButtonContainer: {
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
    },
  },
  link: {
    textTransform: 'none',
    textDecoration: 'none',
    fontSize: 16,
  },
  addPictureButton: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallAddPictureButton: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  badgeProgressBanner: {
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0,
    },
  },
  editPosition: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'none',
    textTransform: 'none',
  },
});

type Props = {
  currentUser: Object,
  business: Object,
  classes: Object,
  match: Object,
  connectionInformation: Object,
  requestCreateConnection: Function,
  requestCheckConnection: Function,
};

type State = {
  fixedTopBanner: boolean,
  isInviting: boolean,
  showNotification: boolean,
  isConnectionSent: boolean,
  isPublicViewMode: boolean,
  activeBadge: Object,
};

class BusinessMember extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const {
      match: { url },
      currentUser,
    } = nextProps;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/b/:slug',
    });
    const from = currentUser && currentUser.get('id');
    const state = { connection: { to: slug, from, type: 'f2b' } };

    if (nextProps.isCreatingConnection) {
      state.isInviting = true;
      return state;
    }
    if (
      !nextProps.isCreatingConnection &&
      !nextProps.createConnectionError &&
      prevState.isInviting
    ) {
      state.showNotification = true;
      state.isInviting = false;
      state.isConnectionSent = true;
    }
    if (
      !nextProps.isCreatingConnection &&
      nextProps.createConnectionError &&
      prevState.isInviting
    ) {
      state.showNotification = false;
      state.isInviting = false;
    }
    return state;
  }
  state = {
    fixedTopBanner: false,
    isInviting: false, // eslint-disable-line
    isConnectionSent: false,
    isPublicViewMode: false,
    showNotification: false,
  };
  componentDidMount() {
    const {
      currentUser,
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/b/:slug',
    });
    const { isPublicViewMode } = this.state;
    const businesses =
      currentUser &&
      currentUser.get('businesses') &&
      currentUser.get('businesses').toJSON();
    const currentBusiness =
      businesses && businesses.find(element => element.slug === slug);
    const isPrivate = (currentBusiness && !isPublicViewMode) || false;
    if (isPrivate) window.localStorage.setItem('isBusinessActive', 'yes');
    this.props.requestCheckConnection(this.state.connection);
  }
  toggleViewMode = () => {
    const { currentUser } = this.props;

    this.setState(
      state => ({
        isPublicViewMode: !state.isPublicViewMode,
      }),
      () => {
        window.scrollTo(0, 0);
        analytics.track('Public Profile Viewed', {
          userID: currentUser.get('id'),
        });
      }
    );
  };
  handleConnect = params => {
    this.props.requestCreateConnection(params);
  };
  closeNotification = () => {
    this.setState({
      isInviting: false, // eslint-disable-line
      showNotification: false,
    });
  };
  render() {
    const {
      currentUser,
      business,
      classes,
      connectionInformation,
      match: { url },
    } = this.props;
    const {
      fixedTopBanner,
      isConnectionSent,
      isPublicViewMode,
      showNotification,
    } = this.state;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/b/:slug',
    });
    const businesses =
      currentUser &&
      currentUser.get('businesses') &&
      currentUser.get('businesses').toJSON();
    const currentBusiness =
      businesses && businesses.find(element => element.slug === slug);
    const isPrivate = (currentBusiness && !isPublicViewMode) || false;
    return (
      <Fragment>
        {currentUser &&
          currentUser.get('slug') === slug &&
          isPublicViewMode && (
            <Grid
              className={cx(classes.topBanner, {
                [classes.fixedTopBanner]: fixedTopBanner === true,
              })}
              container
              justify="space-between"
              alignItems="center"
            >
              <Grid
                item
                xs={12}
                md={8}
                lg={8}
                className={classes.topBannerTextContainer}
              >
                <Typography className={classes.topBannerText}>
                  You&apos;re currently viewing your public profile.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                lg={4}
                className={classes.topBannerButtonsContainer}
              >
                <Button
                  className={classes.backButton}
                  color="primary"
                  onClick={this.toggleViewMode}
                >
                  Back
                </Button>
                <Button className={classes.topBannerButton}>Copy Link</Button>
              </Grid>
            </Grid>
          )}
        {showNotification &&
          isConnectionSent && (
            <Notification
              msg={CONNECTION_REQUEST_MSG}
              close={this.closeNotification}
            />
          )}
        <div className={classes.root}>
          {isPrivate && (
            <div className={classes.businessSidebar}>
              <BusinessSidebar business={currentBusiness} />
            </div>
          )}
          <div className={classes.content}>
            <div className={classes.profileInfo}>
              {isPrivate ? (
                <BusinessProfileInfo
                  user={currentUser}
                  business={currentBusiness}
                  openPhotoModal={this.openPhotoModal}
                  viewBadgeProgress={this.viewBadgeProgress}
                />
              ) : (
                <BusinessMemberProfileInfo
                  currentUser={currentUser}
                  business={business}
                  openPhotoModal={this.openPhotoModal}
                  isConnectionSent={isConnectionSent}
                  connect={this.handleConnect}
                  connectionInformation={connectionInformation}
                />
              )}
            </div>
            <div className={classes.panel}>
              <div className={classes.leftPanel} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['app', 'businessData']),
  error: state.getIn(['business', 'businessError']),
  connectionInformation: state.getIn(['member', 'connectionInformation']),
  isCreatingConnection: state.getIn(['member', 'isCreatingConnection']),
  createConnectionError: state.getIn(['member', 'createConnectionError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
  requestCheckConnection: payload => dispatch(requestCheckConnection(payload)),
});

export default compose(
  withRouter,
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessMember);
