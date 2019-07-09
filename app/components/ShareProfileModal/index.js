// @flow

import React, { Component, Fragment } from 'react';
import { ShareButtons } from 'react-share';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinkIcon from '@material-ui/icons/Link';
import ClearIcon from '@material-ui/icons/Clear';

import BaseModal from 'components/BaseModal';
import Icon from 'components/Icon';
import copyToClipBoard from 'utils/copyToClipBoard';

import FacebookIcon from 'images/sprite/facebook.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';

const styles = theme => ({
  modal: {
    padding: '15px 30px',
    width: 380,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 30px)',
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  socialButtons: {
    marginBottom: 20,
  },
  iconButton: {
    padding: 12,
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: '#f2f2f2',
    marginLeft: 8,
    marginRight: 8,
    '&:focus': {
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
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
    marginTop: 15,
    marginBottom: 10,
    fontSize: 20,
  },
  modalText: {
    marginBottom: 10,
    marginTop: 30,
  },
  linkField: {
    paddingBottom: 6,
    paddingLeft: 9,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRight: 'none',
    border: '1px solid #ececec',
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
  closeButton: {
    position: 'absolute',
    right: -15,
    top: -50,
    color: theme.palette.common.white,
  },
});

type Props = {
  classes: Object,
  isOpen: boolean,
  shareURL: string,
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
    const { shareURL } = this.props;
    copyToClipBoard(shareURL);
    this.setState({ copied: true });
  };
  closeModal = () => {
    this.setState({ copied: false });
    this.props.onCloseModal();
  };
  render() {
    const { classes, isOpen } = this.props;
    const { copied } = this.state;
    const shareURL = window.location.href;
    const shareTitle = 'Jolly profile page';
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
      >
        <Typography variant="h6" component="h1" className={classes.modalTitle}>
          {copied ? 'Link copied to clickboard' : 'Share this page:'}
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
                    <LinkIcon />
                  </Button>
                </InputAdornment>
              }
              fullWidth
            />
            <Typography
              className={classes.modalText}
              variant="body2"
              component="p"
            >
              or share to social media:
            </Typography>
            <Grid container justify="center" className={classes.socialButtons}>
              <Grid item>
                <ShareButtons.FacebookShareButton
                  url={shareURL}
                  quote={shareTitle}
                  className={classes.iconButton}
                >
                  <Icon
                    glyph={FacebookIcon}
                    className={classes.icon}
                    size={18}
                  />
                </ShareButtons.FacebookShareButton>
              </Grid>
              <Grid item>
                <ShareButtons.TwitterShareButton
                  url={shareURL}
                  title={shareTitle}
                  className={classes.iconButton}
                >
                  <Icon
                    glyph={TwitterIcon}
                    className={classes.icon}
                    size={18}
                  />
                </ShareButtons.TwitterShareButton>
              </Grid>
              <Grid item>
                <ShareButtons.LinkedinShareButton
                  url={shareURL}
                  title={shareTitle}
                  windowWidth={375}
                  windowHeight={300}
                  className={classes.iconButton}
                >
                  <Icon
                    glyph={LinkedInIcon}
                    className={classes.icon}
                    size={18}
                  />
                </ShareButtons.LinkedinShareButton>
              </Grid>
            </Grid>
          </Fragment>
        )}

        <IconButton
          className={classes.closeButton}
          color="default"
          onClick={this.closeModal}
        >
          <ClearIcon />
        </IconButton>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(ShareProfileModal);
