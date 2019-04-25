// @flow

import React, { Component } from 'react';
import { capitalize } from 'lodash-es';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PenIcon from '@material-ui/icons/CreateOutlined';

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
});

type Props = {
  user: Object,
  roles: Object,
  classes: Object,
};

class UserInfo extends Component<Props> {
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
  render() {
    const { user, roles, classes } = this.props;
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
            <Grid item>
              <IconButton
                classes={{ root: classes.editButton }}
                onClick={this.editPositions}
              >
                <PenIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          {roles && roles.size ? (
            roles.map(role => (
              <PositionCard key={generate()} role={role.toJS()} />
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
            <Grid item>
              <IconButton
                classes={{ root: classes.editButton }}
                onClick={this.editBio}
              >
                <PenIcon fontSize="small" />
              </IconButton>
            </Grid>
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
      </div>
    );
  }
}

export default withStyles(styles)(UserInfo);
