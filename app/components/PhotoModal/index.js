// @flow

import React, { PureComponent, Fragment } from 'react';
import { generate } from 'shortid';
import Masonry from 'react-masonry-component';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CameraIcon from '@material-ui/icons/CameraAlt';
import CloseIcon from '@material-ui/icons/Close';

import BaseModal from 'components/BaseModal';
import DeleteImage from 'components/DeleteImage';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 940,
  },
  header: {
    backgroundColor: '#f4f4f4',
    padding: '7px 20px',
    borderBottom: '1px solid #e5e5e5',
  },
  title: {
    fontSize: 18,
    letterSpacing: 0.1,
    color: '#3b3b3b',
  },
  addButton: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
    textTransform: 'none',
    border: '1px solid #eaeaea',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  fileInput: {
    display: 'none',
  },
  contentWrapper: {
    padding: 20,
    height: 565,
    overflowY: 'scroll',
  },
  fileWrapper: {
    width: 174,
    padding: 5,
  },
  selected: {
    border: '2px solid #000000',
  },
  photoWrapper: {
    width: 164,
    height: 30,
    color: 'white',
    fontSize: 15,
    fontWeight: 550,
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
  },
  moreVertIconButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 0,
    cursor: 'pointer',
  },
});

type Props = {
  user: Object,
  type?: string,
  files: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  uploadPhoto?: Function,
  updateUser?: Function,
  isPrivate: boolean,
  deletePhoto: Function,
};

class PhotoModal extends PureComponent<Props> {
  onAddClick = (e: Event) => {
    e.preventDefault();
    if (this.fileInput.current) this.fileInput.current.click();
  };
  onCloseClick = () => {
    this.props.onCloseModal();
  };
  handleFileUpload = ({ target }: Event) => {
    const { type, user } = this.props;
    const slug = user && user.get('slug');
    const reader = new FileReader();
    reader.onload = e => {
      const block = e.target.result.split(';');
      const [, base64] = block;
      const [, realData] = base64.split(','); // eslint-disable-line
      this.props.uploadPhoto(realData, type, slug);
    };
    if (target instanceof HTMLInputElement) {
      const [file] = target.files;
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return;
      }
      reader.readAsDataURL(file);
    }
  };
  updateSelection = path => {
    const { updateUser, type } = this.props;
    if (updateUser && type && type !== 'gallery') {
      updateUser({
        profile: {
          [type]: path,
        },
      });
    }
  };
  handleDeletePhoto = (userId, image, avatar, backgroundImage) => {
    const { user } = this.props;
    const slug = user && user.get('slug');
    this.props.userPhotoDelete(userId, image, avatar, backgroundImage, slug);
  };
  fileInput = React.createRef();
  render() {
    const {
      user,
      type,
      files,
      isOpen,
      classes,
      uploadPhoto,
      isPrivate,
    } = this.props;
    let selectedFile = 'Gallery';
    if (uploadPhoto && type === 'avatar') {
      selectedFile = 'Profile Image';
    } else if (uploadPhoto && type === 'backgroundImage') {
      selectedFile = 'Cover Image';
    }
    const profilePhoto = user && user.getIn(['profile', 'avatar']);
    const coverPhoto = user && user.getIn(['profile', 'backgroundImage']);
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.props.onCloseModal}
      >
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <Typography variant="h6" className={classes.title}>
              {selectedFile}
            </Typography>
          </Grid>
          <Grid item>
            {type &&
              type !== 'gallery' && (
                <Fragment>
                  <Button
                    className={classes.addButton}
                    onClick={this.onAddClick}
                  >
                    <CameraIcon />
                    &nbsp;Add image
                  </Button>
                  <input
                    type="file"
                    className={classes.fileInput}
                    ref={this.fileInput}
                    onChange={this.handleFileUpload}
                  />
                </Fragment>
              )}
            {type === 'gallery' && (
              <IconButton onClick={this.onCloseClick}>
                <CloseIcon />
              </IconButton>
            )}
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
              <div
                className={classes.fileWrapper}
                key={generate()}
                role="button"
              >
                <div onClick={() => this.updateSelection(file.get('path'))}>
                  <img src={file.get('path')} alt={file.get('_id')} />
                </div>
                {isPrivate &&
                  profilePhoto === file.get('path') && (
                    <div className={classes.photoWrapper}>Profile</div>
                  )}
                {isPrivate &&
                  coverPhoto === file.get('path') && (
                    <div className={classes.photoWrapper}>Cover</div>
                  )}
                {isPrivate && (
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
      </BaseModal>
    );
  }
}

export default withStyles(styles)(PhotoModal);
