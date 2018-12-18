// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/ShareOutlined';

import { history } from 'components/ConnectedRouter';
import ProfileInfo from 'components/ProfileInfo';
import CompletionBanner from 'components/CompletionBanner';
import Link from 'components/Link';
import Icon from 'components/Icon';
import ShareProfileModal from 'components/ShareProfileModal';
import RoleCard from 'components/RoleCard';
import PhotoModal from 'components/PhotoModal';

import AddPhotoIcon from 'images/sprite/add-photo-blue.svg';

import {
  requestUser,
  requestUserPhotoUpload,
  requestUserFiles,
  requestUserDataUpdate,
  requestWorks,
} from 'containers/App/sagas';
import saga, { reducer, requestTalents } from 'containers/Talent/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 100px auto',
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
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
    },
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.palette.common.white,
      padding: '25px 15px 0px 15px',
      borderTop: '2px solid #eef2f2',
    },
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      padding: 15,
    },
  },
  editButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
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
  rolesSection: {
    backgroundColor: '#f3faff',
  },
  rolesSectionHeader: {
    backgroundColor: '#f3faff',
    paddingBottom: 20,
  },
  rolesSectionBody: {
    backgroundColor: '#f3faff',
    paddingTop: 0,
  },
  addRoleLabel: {
    fontSize: 14,
    fontWeight: 600,
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
  talents: Object,
  works: Object,
  classes: Object,
  match: Object,
  requestUser: Function,
  requestUserFiles: Function,
  requestUserPhotoUpload: Function,
  updateUser: Function,
  requestTalents: Function,
  requestWorks: Function,
};

type State = {
  isOpen: boolean,
  type: string,
  isPhotoModalOpen: boolean,
};

class Profile extends Component<Props, State> {
  state = {
    isOpen: false,
    type: '',
    isPhotoModalOpen: false,
  };
  componentDidMount() {
    this.props.requestUser();
    this.props.requestUserFiles();
    this.props.requestTalents();
    this.props.requestWorks();
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
  openShareModal = () => {
    this.setState({ isOpen: true });
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
  render() {
    const { user, files, talents, works, classes } = this.props;
    const { isOpen, type, isPhotoModalOpen } = this.state;
    let progress = 0;
    let tagged = false;
    if (user.get('email')) {
      progress += 1;
    }
    if (user.getIn(['profile', 'avatar'])) {
      progress += 1;
    }
    if (user.getIn(['profile', 'backgroundImage'])) {
      progress += 1;
    }
    if (user.getIn(['profile', 'phone'])) {
      progress += 1;
    }
    if (user.getIn(['profile', 'bio'])) {
      progress += 1;
    }
    if (
      user.getIn(['profile', 'location']) ||
      user.getIn(['profile', 'distance'])
    ) {
      progress += 1;
    }
    if (talents.size > 0) {
      progress += 1;
    }
    if (
      user.getIn(['profile', 'facebook']) ||
      user.getIn(['profile', 'twitter']) ||
      user.getIn(['profile', 'linkedin']) ||
      user.getIn(['profile', 'youtube'])
    ) {
      progress += 1;
    }
    if (works.size > 0) {
      progress += 1;
      tagged = works.toJS().some(w => w.coworkers.length > 0);
      if (tagged) {
        progress += 1;
      }
    }
    const showTagButton =
      user.getIn(['profile', 'clickedRoleButton']) &&
      user.getIn(['profile', 'clickedJobButton']) &&
      user.getIn(['profile', 'avatar']) &&
      works.size > 0 &&
      !tagged;
    return (
      <Fragment>
        <div
          className={cx(classes.root, {
            [classes.rootExtraSpace]: progress < 8,
          })}
        >
          <div className={classes.profileInfo}>
            <ProfileInfo
              user={user}
              openShareModal={this.openShareModal}
              openPhotoModal={this.openPhotoModal}
            />
          </div>
          <div className={cx(classes.section, classes.rolesSection)}>
            <div
              className={cx(classes.sectionHeader, classes.rolesSectionHeader)}
            >
              <Typography variant="h6">Roles</Typography>
            </div>
            <div className={cx(classes.sectionBody, classes.rolesSectionBody)}>
              {talents &&
                talents.map(talent => (
                  <RoleCard key={generate()} role={talent.toJS()} />
                ))}
              <Grid container justify="center">
                <Grid item>
                  <Button
                    component={props => (
                      <Link to={`/f/${user.get('slug')}/work`} {...props} />
                    )}
                    classes={{
                      root: classes.addRoleButton,
                      label: classes.addRoleLabel,
                    }}
                  >
                    + Add Role
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
                    onClick={this.openShareModal}
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
                      history.push(`/f/${user.get('slug')}/edit/avatar`);
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
        {progress < 8 && (
          <CompletionBanner
            progress={progress}
            user={user}
            showTagButton={showTagButton}
            updateUser={this.props.updateUser}
          />
        )}
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
  talents: state.getIn(['talent', 'talents']),
  works: state.getIn(['app', 'works']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
  requestTalents: () => dispatch(requestTalents()),
  requestUserPhotoUpload: payload => dispatch(requestUserPhotoUpload(payload)),
  requestUserFiles: () => dispatch(requestUserFiles()),
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
  requestWorks: () => dispatch(requestWorks()),
});

export default compose(
  injectSagas({ key: 'talent', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Profile);
