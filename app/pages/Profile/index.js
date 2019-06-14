// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import cx from 'classnames';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/ShareOutlined';

import { history } from 'components/ConnectedRouter';
import ProfileInfo from 'components/ProfileInfo';
import UserInfo from 'components/UserInfo';
import Link from 'components/Link';
import Icon from 'components/Icon';
import ShareProfileModal from 'components/ShareProfileModal';
import RoleCard from 'components/RoleCard';
import JobCard from 'components/JobCard';
import PhotoModal from 'components/PhotoModal';
import UserEndorsements from 'components/UserEndorsements';

import AddPhotoIcon from 'images/sprite/add-photo-blue.svg';

import {
  requestUser,
  requestUserPhotoUpload,
  requestUserResumeUpload,
  requestUserResumeDelete,
  requestUserFiles,
  requestUserDataUpdate,
  requestWorks,
  requestEndorsements,
} from 'containers/App/sagas';
import saga, { reducer, requestRoles } from 'containers/Role/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '1064px',
    margin: '0 auto 300px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  rootExtraSpace: {
    paddingBottom: 10,
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 130,
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
  bottomBannerContainer: {
    marginTop: 20,
    [theme.breakpoints.down('xs')]: {
      backgroundColor: '#f3faff',
      padding: '30px 10px',
      marginTop: 0,
    },
  },
  bottomBanner: {
    padding: '25px 30px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    borderRadius: 3,
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
  addRoleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0074d7',
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
});

type Props = {
  user: Object,
  files: Object,
  isUploading: boolean,
  uploadError: string,
  roles: Object,
  works: Object,
  endorsements: Object,
  classes: Object,
  match: Object,
  requestUser: Function,
  requestUserFiles: Function,
  requestUserPhotoUpload: Function,
  requestUserResumeUpload: Function,
  requestUserResumeDelete: Function,
  updateUser: Function,
  requestRoles: Function,
  requestWorks: Function,
  requestEndorsements: Function,
};

type State = {
  isOpen: boolean,
  type: string,
  isPhotoModalOpen: boolean,
  photos: Array<string>,
  photoIndex: number,
  isGalleryOpen: boolean,
};

class Profile extends Component<Props, State> {
  state = {
    isOpen: false,
    type: '',
    isPhotoModalOpen: false,
    photos: [],
    photoIndex: 0,
    isGalleryOpen: false,
  };
  componentDidMount() {
    const { user } = this.props;
    history.push(`/f/${user.get('slug')}`);

    // this.props.requestUser();
    // this.props.requestUserFiles();
    // this.props.requestRoles();
    // this.props.requestWorks();
    // this.props.requestEndorsements();
  }
  componentDidUpdate(prevProps: Props) {
    const { isUploading, uploadError } = this.props;
    if (prevProps.isUploading && !isUploading && !uploadError) {
      this.props.requestUserFiles();
    }
  }
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  openShareModal = location => {
    const { user } = this.props;
    this.setState({ isOpen: true }, () => {
      analytics.track('Share Button Clicked', {
        userID: user.get('id'),
        location,
      });
    });
  };
  seePublicProfile = () => {
    const { user } = this.props;
    history.push(`/f/${user.get('slug')}`);
  };
  openPhotoModal = type => {
    this.setState({ type, isPhotoModalOpen: true });
  };
  closePhotoModal = () => {
    this.setState({ isPhotoModalOpen: false });
  };
  openGallery = (photos, index) => {
    this.setState({
      photos,
      photoIndex: index,
      isGalleryOpen: true,
    });
  };
  render() {
    const { user, files, roles, works, endorsements, classes } = this.props;
    const {
      isOpen,
      type,
      isPhotoModalOpen,
      photos,
      photoIndex,
      isGalleryOpen,
    } = this.state;
    const numberOfJobs = works ? works.size : 0;
    let numberOfVerifications = 0;
    if (works) {
      works.forEach(work => {
        numberOfVerifications += work.get('verifiers').size;
      });
    }
    const numberOfEndorsements = endorsements ? endorsements.size : 0;
    return (
      <Fragment>
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            <ProfileInfo
              user={user}
              numberOfJobs={numberOfJobs}
              numberOfVerifications={numberOfVerifications}
              numberOfEndorsements={numberOfEndorsements}
              openShareModal={this.openShareModal}
              openPhotoModal={this.openPhotoModal}
            />
          </div>
          <div className={classes.panel}>
            <div className={classes.leftPanel}>
              <UserInfo
                user={user}
                roles={roles}
                uploadResume={this.props.requestUserResumeUpload}
                deleteResume={this.props.requestUserResumeDelete}
              />
            </div>
            <div className={classes.rightPanel}>
              <UserEndorsements user={user} endorsements={endorsements} />
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
                        user={user}
                        openGallery={this.openGallery}
                      />
                    ))
                  ) : (
                    <JobCard user={user} />
                  )}
                  <Grid container justify="center">
                    <Grid item>
                      <Button
                        component={props => <Link to="/add" {...props} />}
                        classes={{
                          root: classes.addRoleButton,
                          label: classes.addRoleLabel,
                        }}
                      >
                        + Add Experience
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className={classes.section}>
                <div className={classes.sectionHeader}>
                  <Typography variant="h6">Roles</Typography>
                </div>
                <div className={classes.sectionBody}>
                  {roles && roles.size ? (
                    roles.map(role => (
                      <RoleCard
                        key={generate()}
                        role={role.toJS()}
                        user={user}
                      />
                    ))
                  ) : (
                    <RoleCard user={user} />
                  )}
                  <Grid container justify="center">
                    <Grid item>
                      <Button
                        component={props => (
                          <Link to="/types-of-work" {...props} />
                        )}
                        classes={{
                          root: classes.addRoleButton,
                          label: classes.addRoleLabel,
                        }}
                      >
                        Edit Positions
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className={classes.bottomBannerContainer}>
                {user.getIn(['profile', 'avatar']) ? (
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
                          to={`/f/${user.get('slug')}`}
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
            </div>
          </div>
        </div>
        <ShareProfileModal
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
          shareURL={`/f/${user.get('slug')}`}
        />
        <PhotoModal
          user={user}
          type={type}
          files={files}
          isOpen={isPhotoModalOpen}
          onCloseModal={this.closePhotoModal}
          uploadPhoto={this.props.requestUserPhotoUpload}
          updateUser={this.props.updateUser}
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
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
  files: state.getIn(['app', 'files']),
  isFileLoading: state.getIn(['app', 'isFileLoading']),
  fileError: state.getIn(['app', 'fileError']),
  isUploading: state.getIn(['app', 'isUploading']),
  uploadError: state.getIn(['app', 'uploadError']),
  roles: state.getIn(['role', 'roles']),
  works: state.getIn(['app', 'works']),
  endorsements: state.getIn(['app', 'endorsements']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
  requestRoles: () => dispatch(requestRoles()),
  requestUserPhotoUpload: (photo, type, slug) =>
    dispatch(requestUserPhotoUpload(photo, type, slug)),
  requestUserResumeUpload: resume => dispatch(requestUserResumeUpload(resume)),
  requestUserResumeDelete: () => dispatch(requestUserResumeDelete()),
  requestUserFiles: () => dispatch(requestUserFiles()),
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
  requestWorks: () => dispatch(requestWorks()),
  requestEndorsements: () => dispatch(requestEndorsements()),
});

export default compose(
  injectSagas({ key: 'role', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Profile);
