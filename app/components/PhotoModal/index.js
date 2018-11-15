// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/CameraAlt';

import BaseModal from 'components/BaseModal';

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
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  fileWrapper: {
    width: 174,
    height: 174,
    padding: 3,
  },
  selected: {
    border: '2px solid #000000',
  },
});

type Props = {
  user: Object,
  type: string,
  files: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  uploadPhoto: Function,
  updateUser: Function,
};

class PhotoModal extends Component<Props> {
  onAddClick = (e: Event) => {
    e.preventDefault();
    if (this.fileInput.current) this.fileInput.current.click();
  };
  handleFileUpload = ({ target }: Event) => {
    const reader = new FileReader();
    reader.onload = e => {
      const block = e.target.result.split(';');
      const [, base64] = block;
      const [, realData] = base64.split(','); // eslint-disable-line
      this.props.uploadPhoto(realData);
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
    this.props.updateUser({
      profile: {
        [this.props.type]: path,
      },
    });
  };
  fileInput = React.createRef();
  render() {
    const { user, type, files, isOpen, classes } = this.props;
    let selectedFile = '';
    if (type === 'avatar') {
      selectedFile = user.getIn(['profile', 'avatar']);
    } else {
      selectedFile = user.getIn(['profile', 'backgroundImage']);
    }
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
              Profile Images &amp; Videos
            </Typography>
          </Grid>
          <Grid item>
            <Button className={classes.addButton} onClick={this.onAddClick}>
              <CameraIcon />
              &nbsp;Add image
            </Button>
            <input
              type="file"
              className={classes.fileInput}
              ref={this.fileInput}
              onChange={this.handleFileUpload}
            />
          </Grid>
        </Grid>
        <div className={classes.contentWrapper}>
          {files.map(file => (
            <div
              className={cx(classes.fileWrapper, {
                [classes.selected]: selectedFile === file.get('path'),
              })}
              key={generate()}
              onClick={() => this.updateSelection(file.get('path'))}
              role="button"
            >
              <img src={file.get('path')} alt={file.get('_id')} />
            </div>
          ))}
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(PhotoModal);
