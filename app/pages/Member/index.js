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

import MemberProfileInfo from 'components/MemberProfileInfo';
import UserInfo from 'components/UserInfo';
import Link from 'components/Link';
import RoleCard from 'components/RoleCard';
import JobCard from 'components/JobCard';
import ShareProfileModal from 'components/ShareProfileModal';
import ContactOptionModal from 'components/ContactOptionModal';
import UserEndorsements from 'components/UserEndorsements';

import saga, {
  reducer,
  requestMemberRoles,
  requestMemberProfile,
  requestMemberFiles,
  requestMemberWorks,
  requestMemberEndorsements,
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
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    [theme.breakpoints.down('xs')]: {
      padding: '25px 15px 0px 15px',
    },
  },
  sectionBody: {
    [theme.breakpoints.down('xs')]: {
      padding: 15,
    },
  },
  shareSection: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginTop: 40,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      margin: '30px 10px',
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
  bottomBanner: {
    position: 'fixed',
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 -4px 20px 0 rgba(0, 0, 0, 0.07)',
  },
  bannerButton: {
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
});

type Props = {
  currentUser: Object,
  member: Object,
  isLoading: boolean,
  error: string,
  files: Object,
  roles: Object,
  works: Object,
  endorsements: Object,
  classes: Object,
  match: Object,
  requestMemberProfile: Function,
  requestMemberRoles: Function,
  requestMemberFiles: Function,
  requestMemberWorks: Function,
  requestMemberEndorsements: Function,
};

type State = {
  isOpen: boolean,
  isContactOpen: boolean,
  fixedTopBanner: boolean,
  photos: Array<string>,
  photoIndex: number,
  isGalleryOpen: boolean,
};

class Member extends Component<Props, State> {
  state = {
    isOpen: false,
    isContactOpen: false,
    fixedTopBanner: false,
    photos: [],
    photoIndex: 0,
    isGalleryOpen: false,
  };
  componentDidMount() {
    const {
      currentUser,
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug',
    });
    if (currentUser && currentUser.get('slug') === slug) {
      analytics.track('Public Profile Viewed', {
        userID: currentUser.get('id'),
      });
    }
    this.props.requestMemberProfile(slug);
    this.props.requestMemberFiles(slug);
    this.props.requestMemberRoles(slug);
    this.props.requestMemberWorks(slug);
    this.props.requestMemberEndorsements(slug);
  }
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  onCloseContactModal = () => {
    this.setState({ isContactOpen: false });
  };
  openShareModal = location => {
    const { member } = this.props;
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
  render() {
    const {
      currentUser,
      member,
      files,
      roles,
      works,
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
    return (
      <Fragment>
        <Waypoint onPositionChange={this.positionChange} />
        {currentUser &&
          currentUser.get('slug') === slug && (
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
                  component={props => <Link to="/edit" {...props} />}
                  color="primary"
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
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            <MemberProfileInfo
              user={member}
              files={files}
              openShareModal={this.openShareModal}
            />
          </div>
          <div className={classes.panel}>
            <div className={classes.leftPanel}>
              <UserInfo user={member} roles={roles} isPrivate={false} />
            </div>
            <div className={classes.rightPanel}>
              <UserEndorsements
                user={member}
                endorsements={endorsements}
                publicMode
              />
              <div className={classes.section}>
                <div className={classes.sectionHeader}>
                  <Typography variant="h6">Past Event Gigs</Typography>
                </div>
                <div className={classes.sectionBody}>
                  {works && works.size ? (
                    works.map(work => (
                      <JobCard
                        key={generate()}
                        job={work}
                        openGallery={this.openGallery}
                      />
                    ))
                  ) : (
                    <JobCard />
                  )}
                </div>
              </div>
              <div className={classes.section}>
                <div className={classes.sectionHeader}>
                  <Typography variant="h6">Roles</Typography>
                </div>
                <div className={classes.sectionBody}>
                  {roles.size ? (
                    roles.map(role => (
                      <RoleCard key={generate()} role={role.toJS()} />
                    ))
                  ) : (
                    <RoleCard />
                  )}
                </div>
              </div>
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
            </div>
          </div>
        </div>
        {showContactOptions && (
          <Grid
            className={classes.bottomBanner}
            container
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                className={classes.bannerButton}
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  member: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isMemberLoading']),
  error: state.getIn(['member', 'memberError']),
  roles: state.getIn(['member', 'roles']),
  files: state.getIn(['member', 'files']),
  works: state.getIn(['member', 'works']),
  endorsements: state.getIn(['member', 'endorsements']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  requestMemberRoles: slug => dispatch(requestMemberRoles(slug)),
  requestMemberFiles: slug => dispatch(requestMemberFiles(slug)),
  requestMemberWorks: slug => dispatch(requestMemberWorks(slug)),
  requestMemberEndorsements: slug => dispatch(requestMemberEndorsements(slug)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Member);
