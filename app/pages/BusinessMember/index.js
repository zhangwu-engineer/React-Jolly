// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import cx from 'classnames';
import 'react-image-lightbox/style.css';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import BusinessProfileInfo from 'components/BusinessProfileInfo';
import MemberProfileInfo from 'components/MemberProfileInfo';
import BusinessSidebar from 'components/BusinessSidebar';

import saga, {
  reducer,
  requestMemberProfile,
  requestMemberBadges,
  requestMemberFiles,
  requestMemberRoles,
  requestMemberWorks,
  requestMemberCoworkers,
  requestMemberEndorsements,
  requestCreateConnection,
} from 'containers/Member/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '1064px',
    margin: '0px auto 150px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      marginBottom: 120,
    },
  },
  businessSidebar: {
    position: 'fixed',
    width: 291,
    minHeight: '100vh',
    background: theme.palette.common.white,
    [theme.breakpoints.down('lg')]: {
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
  member: Object,
  badges: Object,
  isCreatingConnection: boolean, // eslint-disable-line
  createConnectionError: string, // eslint-disable-line
  classes: Object,
  match: Object,
  requestMemberProfile: Function,
  requestMemberBadges: Function,
  requestMemberRoles: Function,
  requestMemberFiles: Function,
  requestMemberWorks: Function,
  requestMemberCoworkers: Function,
  requestMemberEndorsements: Function,
  requestCreateConnection: Function,
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
    if (nextProps.isCreatingConnection) {
      return {
        isInviting: true,
      };
    }
    if (
      !nextProps.isCreatingConnection &&
      !nextProps.createConnectionError &&
      prevState.isInviting
    ) {
      return {
        showNotification: true,
        isInviting: false,
        isConnectionSent: true,
      };
    }
    if (
      !nextProps.isCreatingConnection &&
      nextProps.createConnectionError &&
      prevState.isInviting
    ) {
      return {
        showNotification: false,
        isInviting: false,
      };
    }
    return null;
  }
  state = {
    fixedTopBanner: false,
    isInviting: false, // eslint-disable-line
    isConnectionSent: false,
    isPublicViewMode: false,
  };
  componentDidMount() {
    const {
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/b/:slug',
    });
    this.props.requestMemberProfile(slug);
    this.props.requestMemberBadges(slug);
    this.props.requestMemberFiles(slug);
    this.props.requestMemberRoles(slug);
    this.props.requestMemberWorks(slug);
    this.props.requestMemberCoworkers(slug);
    this.props.requestMemberEndorsements(slug);
  }
  positionChange = ({ currentPosition, previousPosition }) => {
    if (currentPosition === 'above' && previousPosition === 'inside') {
      this.setState({ fixedTopBanner: true });
    }
    if (currentPosition === 'inside' && previousPosition === 'above') {
      this.setState({ fixedTopBanner: false });
    }
  };
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
  render() {
    const {
      currentUser,
      member,
      badges,
      classes,
      match: { url },
    } = this.props;
    const { fixedTopBanner, isConnectionSent, isPublicViewMode } = this.state;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/b/:slug',
    });
    const businesses =
      currentUser.get('businesses') && currentUser.get('businesses').toJSON();
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
        {isPrivate && (
          <div className={classes.businessSidebar}>
            <BusinessSidebar business={currentBusiness} />
          </div>
        )}
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            {isPrivate ? (
              <BusinessProfileInfo
                user={currentUser}
                business={currentBusiness}
                badges={badges}
                openPhotoModal={this.openPhotoModal}
                viewBadgeProgress={this.viewBadgeProgress}
              />
            ) : (
              <MemberProfileInfo
                currentUser={currentUser}
                user={member}
                business={currentBusiness}
                badges={badges}
                openPhotoModal={this.openPhotoModal}
                connect={this.props.requestCreateConnection}
                isConnectionSent={isConnectionSent}
              />
            )}
          </div>
          <div className={classes.panel}>
            <div className={classes.leftPanel} />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  member: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isMemberLoading']),
  error: state.getIn(['member', 'memberError']),
  badges: state.getIn(['member', 'badges']),
  coworkers: state.getIn(['member', 'coworkers']),
  isCreatingConnection: state.getIn(['member', 'isCreatingConnection']),
  createConnectionError: state.getIn(['member', 'createConnectionError']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  requestMemberBadges: slug => dispatch(requestMemberBadges(slug)),
  requestMemberRoles: slug => dispatch(requestMemberRoles(slug)),
  requestMemberFiles: slug => dispatch(requestMemberFiles(slug)),
  requestMemberWorks: slug => dispatch(requestMemberWorks(slug)),
  requestMemberCoworkers: slug => dispatch(requestMemberCoworkers(slug)),
  requestMemberEndorsements: slug => dispatch(requestMemberEndorsements(slug)),
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessMember);
