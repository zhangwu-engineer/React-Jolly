// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { generate } from 'shortid';
import cx from 'classnames';
import Waypoint from 'react-waypoint';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/Share';
import PenIcon from '@material-ui/icons/CreateOutlined';

import ProfileInfo from 'components/ProfileInfo';
import MemberProfileInfo from 'components/MemberProfileInfo';
import UserInfo from 'components/UserInfo';
import Link from 'components/Link';
import RoleCard from 'components/RoleCard';
import ShareProfileModal from 'components/ShareProfileModal';
import ContactOptionModal from 'components/ContactOptionModal';
import PhotoModal from 'components/PhotoModal';
import UserRecommendations from 'components/UserRecommendations';
import Notification from 'components/Notification';
import Icon from 'components/Icon';
import FloatingAddButton from 'components/FloatingAddButton';
import BadgeProgressBanner from 'components/BadgeProgressBanner';
import UserWorkList from 'components/UserWorkList';
import UserCoworkers from 'components/UserCoworkers';
import AddPhotoIcon from 'images/sprite/add-photo-blue.svg';

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
import {
  requestUserPhotoUpload,
  requestUserResumeUpload,
  requestUserResumeDelete,
  requestUserDataUpdate,
  requestUserPhotoDelete,
} from 'containers/App/sagas';
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
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  editPositionIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'none',
    textTransform: 'none',
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
});

type Props = {
  currentUser: Object,
  member: Object,
  badges: Object,
  files: Object,
  roles: Object,
  works: Object,
  coworkers: Object,
  endorsements: Object,
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
  requestUserPhotoUpload: Function,
  requestUserResumeUpload: Function,
  requestUserResumeDelete: Function,
  updateUser: Function,
  requestCreateConnection: Function,
  requestUserPhotoDelete: Function,
};

type State = {
  isOpen: boolean,
  isContactOpen: boolean,
  fixedTopBanner: boolean,
  photos: Array<string>,
  photoIndex: number,
  isGalleryOpen: boolean,
  isInviting: boolean,
  showNotification: boolean,
  isConnectionSent: boolean,
  type: string,
  isPhotoModalOpen: boolean,
  isPublicViewMode: boolean,
  activeBadge: Object,
};

class Member extends Component<Props, State> {
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
    isOpen: false,
    isContactOpen: false,
    fixedTopBanner: false,
    photos: [],
    photoIndex: 0,
    isGalleryOpen: false,
    isInviting: false, // eslint-disable-line
    showNotification: false,
    isConnectionSent: false,
    type: '',
    isPhotoModalOpen: false,
    isPublicViewMode: false,
    activeBadge: null,
  };
  componentDidMount() {
    const {
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug',
    });
    this.props.requestMemberProfile(slug);
    this.props.requestMemberBadges(slug);
    this.props.requestMemberFiles(slug);
    this.props.requestMemberRoles(slug);
    this.props.requestMemberWorks(slug);
    this.props.requestMemberCoworkers(slug);
    this.props.requestMemberEndorsements(slug);
  }
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  onCloseContactModal = () => {
    this.setState({ isContactOpen: false });
  };
  onPositionClick = id => {
    const positionCardWrapper = document.getElementById(id);
    if (positionCardWrapper) {
      window.scrollTo({
        top: positionCardWrapper.offsetTop,
        behavior: 'smooth',
      });
    }
  };
  openShareModal = location => {
    const { currentUser, member } = this.props;
    if (
      currentUser &&
      member &&
      currentUser.get('id') === member.get('id') &&
      !currentUser.getIn(['profile', 'openedShareModal'])
    ) {
      this.props.updateUser({
        profile: {
          openedShareModal: true,
        },
      });
    }
    this.setState({ isOpen: true }, () => {
      analytics.track('Share Button Clicked', {
        userID: member.get('id'),
        location,
      });
    });
  };
  openGallery = (photos, index) => {
    this.setState({
      photos,
      photoIndex: index,
      isGalleryOpen: true,
    });
  };
  positionChange = ({ currentPosition, previousPosition }) => {
    if (currentPosition === 'above' && previousPosition === 'inside') {
      this.setState({ fixedTopBanner: true });
    }
    if (currentPosition === 'inside' && previousPosition === 'above') {
      this.setState({ fixedTopBanner: false });
    }
  };
  closeNotification = () => {
    this.setState({
      isInviting: false, // eslint-disable-line
      showNotification: false,
    });
  };
  openPhotoModal = type => {
    this.setState({ type, isPhotoModalOpen: true });
  };
  closePhotoModal = () => {
    this.setState({ isPhotoModalOpen: false });
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
  viewBadgeProgress = badge => {
    this.setState({ activeBadge: badge });
  };
  render() {
    const {
      currentUser,
      member,
      badges,
      files,
      roles,
      works,
      coworkers,
      endorsements,
      classes,
      match: { url },
    } = this.props;
    const {
      isOpen,
      isContactOpen,
      fixedTopBanner,
      photos,
      photoIndex,
      isGalleryOpen,
      showNotification,
      isConnectionSent,
      type,
      isPhotoModalOpen,
      isPublicViewMode,
      activeBadge,
    } = this.state;
    const showContactOptions =
      member.getIn(['profile', 'receiveEmail']) ||
      member.getIn(['profile', 'receiveSMS']) ||
      member.getIn(['profile', 'receiveCall']);
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug',
    });
    const isPrivate =
      (currentUser && currentUser.get('slug') === slug && !isPublicViewMode) ||
      false;
    const unearnedBadges =
      badges && badges.filter(b => b.get('earned') === false);
    const nextBadgeToEarn = unearnedBadges && unearnedBadges.get(0);
    let isCoworker = false;
    if (!isPrivate) {
      if (currentUser && coworkers) {
        const matchingCoworkers = coworkers.filter(
          c => c.get('id') === currentUser.get('id')
        );
        if (matchingCoworkers && matchingCoworkers.size > 0) {
          isCoworker = true;
        }
      }
    }
    const showResume = (currentUser && isCoworker) || false;
    return (
      <Fragment>
        <Waypoint onPositionChange={this.positionChange} />
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
                <Button
                  className={classes.topBannerButton}
                  onClick={() => {
                    this.setState({ isOpen: true });
                  }}
                >
                  Copy Link
                </Button>
              </Grid>
            </Grid>
          )}
        {showNotification && (
          <Notification
            msg="Coworker connection request sent."
            close={this.closeNotification}
          />
        )}
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            {isPrivate ? (
              <ProfileInfo
                user={currentUser}
                badges={badges}
                openShareModal={this.openShareModal}
                openPhotoModal={this.openPhotoModal}
                viewBadgeProgress={this.viewBadgeProgress}
              />
            ) : (
              <MemberProfileInfo
                currentUser={currentUser}
                user={member}
                badges={badges}
                openShareModal={this.openShareModal}
                openPhotoModal={this.openPhotoModal}
                connect={this.props.requestCreateConnection}
                isConnectionSent={isConnectionSent}
              />
            )}
          </div>
          {isPrivate &&
            nextBadgeToEarn && (
              <div className={classes.badgeProgressBanner}>
                <BadgeProgressBanner
                  badge={activeBadge || nextBadgeToEarn}
                  openShareModal={this.openShareModal}
                />
              </div>
            )}
          <div className={classes.panel}>
            <div className={classes.leftPanel}>
              <UserInfo
                user={isPrivate ? currentUser : member}
                roles={roles}
                isPrivate={isPrivate}
                uploadResume={this.props.requestUserResumeUpload}
                deleteResume={this.props.requestUserResumeDelete}
                onPositionClick={this.onPositionClick}
                showResume={isPrivate || showResume}
              />
            </div>
            <div className={classes.rightPanel}>
              <UserCoworkers
                coworkers={coworkers}
                currentUser={currentUser}
                user={member}
                isPrivate={isPrivate}
                connect={this.props.requestCreateConnection}
                isConnectionSent={isConnectionSent}
              />
              <UserRecommendations
                user={member}
                endorsements={endorsements}
                publicMode={!isPrivate}
                currentUser={currentUser}
                coworkers={coworkers}
              />
              <UserWorkList
                works={works}
                user={member}
                isPrivate={isPrivate}
                openGallery={this.openGallery}
              />
              <div className={classes.section}>
                <div className={classes.sectionHeader}>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.header}
                  >
                    <Grid item>
                      <Typography className={classes.title}>
                        Positions for Hire
                      </Typography>
                    </Grid>
                    <Grid item>
                      {isPrivate && (
                        <React.Fragment>
                          <Link
                            className={classes.editPosition}
                            to="/types-of-work"
                          >
                            Edit Positions
                          </Link>
                          <Link
                            className={classes.editPositionIcon}
                            to="/types-of-work"
                          >
                            <PenIcon fontSize="small" />
                          </Link>
                        </React.Fragment>
                      )}
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.sectionBody}>
                  {roles.size ? (
                    roles.map(role => (
                      <div key={generate()} id={role.get('id')}>
                        <RoleCard role={role.toJS()} user={member} />
                      </div>
                    ))
                  ) : (
                    <RoleCard isPrivate={isPrivate} user={member} />
                  )}
                </div>
              </div>
              {isPrivate ? (
                <div className={classes.bottomBannerContainer}>
                  {currentUser.getIn(['profile', 'avatar']) ? (
                    <Grid
                      className={classes.bottomBanner}
                      container
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={12} lg={6}>
                        <Typography className={classes.bannerText}>
                          {`Ready to share your profile? Grab the link here (`}
                          <Link
                            className={classes.link}
                            onClick={this.toggleViewMode}
                          >
                            or view as public
                          </Link>
                          {'):'}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        lg={6}
                        className={classes.bannerButtonContainer}
                      >
                        <Button
                          color="primary"
                          className={classes.bannerButton}
                          onClick={() => this.openShareModal('Bottom Profile')}
                        >
                          <ShareIcon />
                          &nbsp;&nbsp;Share my profile
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      className={classes.bottomBanner}
                      container
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={12} lg={6}>
                        <Typography className={classes.bannerText}>
                          {`Before you share your profile, you need to add a profile picture.`}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        lg={6}
                        className={classes.bannerButtonContainer}
                      >
                        <Button
                          color="primary"
                          className={cx(
                            classes.bannerButton,
                            classes.addPictureButton
                          )}
                          onClick={() => this.openPhotoModal('avatar')}
                        >
                          <Icon glyph={AddPhotoIcon} size={20} />
                          &nbsp;&nbsp;Add picture
                        </Button>
                        <Button
                          color="primary"
                          className={cx(
                            classes.bannerButton,
                            classes.smallAddPictureButton
                          )}
                          onClick={() => {
                            history.push('/profile-picture');
                          }}
                        >
                          <Icon glyph={AddPhotoIcon} size={20} />
                          &nbsp;&nbsp;Add picture
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </div>
              ) : (
                <div className={classes.shareSection}>
                  <div className={classes.shareSectionBody}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item lg={6}>
                        <Typography className={classes.shareText}>
                          Know someone who needs this freelancer’s talents?
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          className={classes.shareProfileButton}
                          onClick={() => this.openShareModal('Bottom Profile')}
                        >
                          <ShareIcon />
                          &nbsp;Share this profile
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showContactOptions &&
          !isPrivate && (
            <Grid
              className={classes.contactBanner}
              container
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Button
                  className={classes.contactBannerButton}
                  onClick={() => {
                    this.setState({ isContactOpen: true });
                  }}
                  color="primary"
                >
                  Contact Me
                </Button>
              </Grid>
            </Grid>
          )}
        <ShareProfileModal
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
          shareURL={`/f/${member.get('slug')}`}
        />
        <ContactOptionModal
          isOpen={isContactOpen}
          onCloseModal={this.onCloseContactModal}
          data={member}
        />
        <PhotoModal
          user={isPrivate ? currentUser : member}
          type={type}
          files={files}
          isOpen={isPhotoModalOpen}
          onCloseModal={this.closePhotoModal}
          uploadPhoto={this.props.requestUserPhotoUpload}
          updateUser={this.props.updateUser}
          isPrivate={isPrivate}
          userPhotoDelete={this.props.requestUserPhotoDelete}
        />
        {isGalleryOpen && (
          <Lightbox
            mainSrc={photos[photoIndex]}
            nextSrc={photos[(photoIndex + 1) % photos.length]}
            prevSrc={photos[(photoIndex + photos.length - 1) % photos.length]}
            onCloseRequest={() => this.setState({ isGalleryOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + photos.length - 1) % photos.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % photos.length,
              })
            }
          />
        )}
        <FloatingAddButton />
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
  roles: state.getIn(['member', 'roles']),
  files: state.getIn(['member', 'files']),
  works: state.getIn(['member', 'works']),
  coworkers: state.getIn(['member', 'coworkers']),
  endorsements: state.getIn(['member', 'endorsements']),
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
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
  requestUserPhotoUpload: (photo, type, slug) =>
    dispatch(requestUserPhotoUpload(photo, type, slug)),
  requestUserResumeUpload: resume => dispatch(requestUserResumeUpload(resume)),
  requestUserResumeDelete: () => dispatch(requestUserResumeDelete()),
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
  requestUserPhotoDelete: (userId, image, avatar, backgroundImage, slug) =>
    dispatch(
      requestUserPhotoDelete(userId, image, avatar, backgroundImage, slug)
    ),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Member);
