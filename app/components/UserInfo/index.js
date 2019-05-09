// @flow

import React, { Component, Fragment } from 'react';
import { capitalize } from 'lodash-es';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PenIcon from '@material-ui/icons/CreateOutlined';
import OpenIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';
import isMobile from 'utils/checkMobile';
import FacebookIcon from 'images/sprite/facebook.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';
import YoutubeIcon from 'images/sprite/youtube.svg';

import PositionCard from './PositionCard';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '30px 25px 25px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 25px',
    },
  },
  title: {
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  position: {
    marginBottom: 35,
  },
  positionHeader: {
    marginBottom: 25,
  },
  bio: {
    color: '#373737',
    marginBottom: 30,
  },
  bioHeader: {
    marginBottom: 10,
  },
  editButton: {
    padding: 0,
    opacity: 0.38,
    '&:hover svg': {
      backgroundColor: theme.palette.common.white,
    },
  },
  iconButton: {
    padding: 10,
    '&:hover svg': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  icon: {
    color: '#b3b9bf',
    fill: '#b3b9bf',
  },
  resumeWrapper: {
    flex: 1,
  },
  resume: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  openButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f2f9ff',
    '&:hover': {
      backgroundColor: '#f2f9ff',
    },
    '& svg': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
});

type Props = {
  user: Object,
  roles: Object,
  isPrivate: ?boolean,
  classes: Object,
  uploadResume: Function,
  deleteResume: Function,
  onPositionClick: Function,
};

class UserInfo extends Component<Props> {
  static defaultProps = {
    isPrivate: true,
  };
  onUploadClick = () => {
    if (this.fileInput.current) this.fileInput.current.click();
  };
  handleFileUpload = ({ target }: Event) => {
    const reader = new FileReader();
    reader.onload = e => {
      const block = e.target.result.split(';');
      const [, base64] = block;
      const [, realData] = base64.split(','); // eslint-disable-line
      this.props.uploadResume(realData);
    };
    if (target instanceof HTMLInputElement) {
      const [file] = target.files;
      if (file && file.type !== 'application/pdf') {
        return;
      }
      reader.readAsDataURL(file);
    }
  };
  fileInput = React.createRef();
  editPositions = () => {
    history.push('/types-of-work');
  };
  editBio = () => {
    if (isMobile()) {
      history.push('/settings/profile');
    } else {
      history.push('/settings#profile');
    }
  };
  openResume = () => {
    const { user } = this.props;
    if (user && user.getIn(['profile', 'resume'])) {
      window.open(user.getIn(['profile', 'resume']), '_blank');
    }
  };
  removeResume = () => {
    this.props.deleteResume();
  };
  render() {
    const { user, roles, isPrivate, classes } = this.props;
    const hideResume = !isPrivate && !user.getIn(['profile', 'resume']);
    return (
      <div className={classes.root}>
        <div className={classes.position}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.positionHeader}
          >
            <Grid item>
              <Typography className={classes.title}>
                My Positions for Hire
              </Typography>
            </Grid>
            {isPrivate && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.editButton }}
                  onClick={this.editPositions}
                >
                  <PenIcon fontSize="small" />
                </IconButton>
              </Grid>
            )}
          </Grid>
          {roles && roles.size ? (
            roles.map(role => (
              <div
                key={generate()}
                onClick={() => {
                  this.props.onPositionClick(role.get('id'));
                }}
                role="button"
              >
                <PositionCard role={role.toJS()} />
              </div>
            ))
          ) : (
            <PositionCard />
          )}
        </div>
        <div className={classes.bio}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.bioHeader}
          >
            <Grid item>
              <Typography className={classes.title}>Bio</Typography>
            </Grid>
            {isPrivate && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.editButton }}
                  onClick={this.editBio}
                >
                  <PenIcon fontSize="small" />
                </IconButton>
              </Grid>
            )}
          </Grid>
          <Typography>
            {user.getIn(['profile', 'bio'])
              ? user.getIn(['profile', 'bio'])
              : `Hi, I'm ${capitalize(user.get('firstName'))} ${capitalize(
                  user.get('lastName')
                )}...`}
          </Typography>
          <Grid container className={classes.socialButtons}>
            {user.getIn(['profile', 'facebook']) && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() =>
                    this.openUrl(
                      `https://www.facebook.com/${user.getIn([
                        'profile',
                        'facebook',
                      ])}`
                    )
                  }
                >
                  <Icon
                    glyph={FacebookIcon}
                    className={classes.icon}
                    size={12}
                  />
                </IconButton>
              </Grid>
            )}
            {user.getIn(['profile', 'twitter']) && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() =>
                    this.openUrl(
                      `https://www.twitter.com/${user.getIn([
                        'profile',
                        'twitter',
                      ])}`
                    )
                  }
                >
                  <Icon
                    glyph={TwitterIcon}
                    className={classes.icon}
                    size={12}
                  />
                </IconButton>
              </Grid>
            )}
            {user.getIn(['profile', 'linkedin']) && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() =>
                    this.openUrl(
                      `https://www.linkedin.com/in/${user.getIn([
                        'profile',
                        'linkedin',
                      ])}`
                    )
                  }
                >
                  <Icon
                    glyph={LinkedInIcon}
                    className={classes.icon}
                    size={12}
                  />
                </IconButton>
              </Grid>
            )}
            {user.getIn(['profile', 'youtube']) && (
              <Grid item>
                <IconButton
                  classes={{ root: classes.iconButton }}
                  onClick={() =>
                    this.openUrl(
                      `https://www.youtube.com/${user.getIn([
                        'profile',
                        'youtube',
                      ])}`
                    )
                  }
                >
                  <Icon
                    glyph={YoutubeIcon}
                    className={classes.icon}
                    size={12}
                  />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </div>
        {!hideResume && (
          <Fragment>
            <Grid container alignItems="center">
              <Grid item>
                <IconButton
                  classes={{ root: classes.openButton }}
                  onClick={() => {
                    if (user && user.getIn(['profile', 'resume'])) {
                      this.openResume();
                    } else if (isPrivate) {
                      this.onUploadClick();
                    }
                  }}
                >
                  <OpenIcon fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item className={classes.resumeWrapper}>
                {user && user.getIn(['profile', 'resume']) ? (
                  <Typography
                    onClick={this.openResume}
                    className={classes.resume}
                  >
                    {isPrivate
                      ? `My Resume`
                      : `View ${capitalize(user.get('firstName'))}'s Resume`}
                  </Typography>
                ) : (
                  <Typography
                    onClick={this.onUploadClick}
                    className={classes.resume}
                    id="uploadResume"
                  >
                    Upload a resume (PDFs only)
                  </Typography>
                )}
              </Grid>
              {isPrivate &&
                user &&
                user.getIn(['profile', 'resume']) && (
                  <Grid item>
                    <IconButton
                      classes={{ root: classes.editButton }}
                      onClick={this.removeResume}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                )}
            </Grid>
            <input
              type="file"
              className={classes.fileInput}
              ref={this.fileInput}
              onChange={this.handleFileUpload}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UserInfo);
