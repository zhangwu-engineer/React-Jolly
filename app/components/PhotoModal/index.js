// @flow

import React, { Component } from 'react';
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
  },
});

type Props = {
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
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
    };
    if (target instanceof HTMLInputElement) {
      const [file] = target.files;
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return;
      }
      reader.readAsDataURL(file);
    }
  };
  fileInput = React.createRef();
  render() {
    const { isOpen, classes } = this.props;
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
        <div className={classes.contentWrapper} />
      </BaseModal>
    );
  }
}

export default withStyles(styles)(PhotoModal);
