// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import BaseModal from 'components/BaseModal';
import Icon from 'components/Icon';

import FacebookIcon from 'images/sprite/facebook.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';
import YoutubeIcon from 'images/sprite/youtube.svg';

const styles = theme => ({
  modal: {
    padding: 15,
    width: 380,
  },
  socialButtons: {
    marginBottom: 20,
    marginLeft: 15,
  },
  iconButton: {
    '&:hover svg': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  icon: {
    color: '#b3b9bf',
    fill: '#b3b9bf',
  },
  modalTitle: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 15,
  },
  linkField: {
    marginLeft: 15,
    paddingBottom: 6,
    paddingLeft: 9,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRight: 'none',
    border: '1px solid #ececec',
    width: 215,
  },
  adornment: {
    marginLeft: 0,
  },
  copyButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '4px 16px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
});

type Props = {
  classes: Object,
  isOpen: boolean,
  onCloseModal: Function,
};

type State = {
  copied: boolean,
};

class ShareProfileModal extends Component<Props, State> {
  state = {
    copied: false,
  };
  share = () => {};
  copy = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    if (document.body) {
      document.body.appendChild(el);
    }
    el.select();
    document.execCommand('copy');
    if (document.body) {
      document.body.removeChild(el);
    }
    this.setState({ copied: true });
  };
  closeModal = () => {
    this.setState({ copied: false });
    this.props.onCloseModal();
  };
  render() {
    const { classes, isOpen } = this.props;
    const { copied } = this.state;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <Typography variant="h6" component="h1" className={classes.modalTitle}>
          {copied ? 'Link copied to clickboard' : 'Share this profile'}
        </Typography>
        {copied ? (
          <Typography
            className={classes.modalText}
            variant="body2"
            component="p"
          >
            Your Jolly profile is a living resume to showcase the best of your
            skills and work experience. Add your skills and rates, and share it
            when you&apos;re applying for new work.
          </Typography>
        ) : (
          <Fragment>
            <Input
              classes={{
                input: classes.linkField,
              }}
              id="link"
              type="text"
              value={window.location.href}
              readOnly
              disableUnderline
              disabled
              endAdornment={
                <InputAdornment position="end" className={classes.adornment}>
                  <Button className={classes.copyButton} onClick={this.copy}>
                    Copy
                  </Button>
                </InputAdornment>
              }
            />
            <Typography
              className={classes.modalText}
              variant="body2"
              component="p"
            >
              OR share on social media
            </Typography>
            <Grid container className={classes.socialButtons}>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => {
                    this.share();
                  }}
                >
                  <Icon
                    glyph={FacebookIcon}
                    className={classes.icon}
                    size={18}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => {
                    this.share();
                  }}
                >
                  <Icon
                    glyph={TwitterIcon}
                    className={classes.icon}
                    size={18}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => {
                    this.share();
                  }}
                >
                  <Icon
                    glyph={LinkedInIcon}
                    className={classes.icon}
                    size={18}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => {
                    this.share();
                  }}
                >
                  <Icon
                    glyph={YoutubeIcon}
                    className={classes.icon}
                    size={18}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Fragment>
        )}
        <Grid container justify="flex-end">
          <Grid item>
            <Button color="primary" onClick={this.closeModal}>
              Ok
            </Button>
          </Grid>
        </Grid>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(ShareProfileModal);
