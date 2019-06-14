// @flow

import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { generate } from 'shortid';
import Masonry from 'react-masonry-component';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';

import Link from 'components/Link';
import DeleteImage from 'components/DeleteImage';

import {
  requestUser,
  requestUserFiles,
  requestUserPhotoDelete,
} from 'containers/App/sagas';
import saga, {
  reducer,
  requestMemberProfile,
  requestMemberFiles,
} from 'containers/Member/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {},
  header: {
    flexGrow: 1,
    padding: '10px 15px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    paddingLeft: 0,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  fileInput: {
    display: 'none',
  },
  contentWrapper: {
    padding: 10,
  },
  fileWrapper: {
    width: 174,
    padding: 3,
  },
  selected: {
    border: '2px solid #000000',
  },
  photoWrapper: {
    width: 168,
    height: 29,
    color: 'white',
    fontSize: 15,
    fontWeight: 550,
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreVertIconButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 0,
    cursor: 'pointer',
  },
  headerText: {
    fontSize: 18,
    color: theme.palette.common.white,
    fontWeight: 500,
    marginLeft: 21,
  },
});

type Props = {
  member: Object,
  files: Object,
  classes: Object,
  match: Object,
  requestMemberProfile: Function,
  requestMemberFiles: Function,
  requestUser: Function,
  requestUserFiles: Function,
  user: Object,
  requestPhotoDelete: Function,
};

class MemberGallery extends PureComponent<Props> {
  componentDidMount() {
    const {
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/gallery',
    });
    this.props.requestMemberProfile(slug);
    this.props.requestMemberFiles(slug);
    this.props.requestUser();
    this.props.requestUserFiles();
  }
  componentWillUnmount() {
    window.localStorage.removeItem('privateGallery');
    this.props.requestUser();
    this.props.requestUserFiles();
  }
  handleDeletePhoto = (userId, image, avatar, backgroundImage) => {
    const {
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/gallery',
    });
    this.props.requestPhotoDelete(userId, image, avatar, backgroundImage, slug);
  };
  render() {
    const { classes, member, files, user } = this.props;
    const profilePhoto = user && user.getIn(['profile', 'avatar']);
    const coverPhoto = user && user.getIn(['profile', 'backgroundImage']);
    const privateGallery =
      window.localStorage.getItem('privateGallery') === 'yes';
    const {
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/gallery',
    });
    return (
      <div className={classes.root}>
        <Grid
          className={classes.header}
          container
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Button
              className={classes.backButton}
              component={props => (
                <Link
                  to={privateGallery ? `/edit` : `/f/${member.get('slug')}`}
                  {...props}
                />
              )}
            >
              <ArrowBackIcon />
              <Typography className={classes.headerText}>
                Gallery
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <div className={classes.contentWrapper}>
          <Masonry
            className="my-gallery-class" // default ''
            // elementType={'ul'} // default 'div'
            // options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            imagesLoadedOptions={{ background: '.my-bg-image-el' }} // default {}
          >
            {files.map(file => (
              <div className={classes.fileWrapper} key={generate()}>
                <img src={file.get('path')} alt={file.get('_id')} />
                {profilePhoto === file.get('path') && (
                  <div className={classes.photoWrapper}>Profile</div>
                )}
                {coverPhoto === file.get('path') && (
                  <div className={classes.photoWrapper}>Cover</div>
                )}
                {user &&
                  user.get('slug') === slug && (
                    <div className={classes.moreVertIconButton}>
                      <DeleteImage
                        deletePhoto={this.handleDeletePhoto}
                        userId={user && user.get('id')}
                        image={file.get('path')}
                        avatar={profilePhoto === file.get('path')}
                        backgroundImage={coverPhoto === file.get('path')}
                      />
                    </div>
                  )}
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  member: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isMemberLoading']),
  error: state.getIn(['member', 'memberError']),
  files: state.getIn(['member', 'files']),
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  requestMemberFiles: slug => dispatch(requestMemberFiles(slug)),
  requestUser: () => dispatch(requestUser()),
  requestUserFiles: () => dispatch(requestUserFiles()),
  requestPhotoDelete: (userId, image, avatar, backgroundImage, slug) =>
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
)(MemberGallery);
