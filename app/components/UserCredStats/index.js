// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { generate } from 'shortid';
import { capitalize } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Tooltip from 'components/Tooltip';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import CredIcon from 'images/sprite/cred_filled.svg';
import CredJollyIcon from 'images/sprite/cred_jolly.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2b2b2b',
    display: 'flex',
  },
  text: {
    fontSize: 13,
    fontWeight: 500,
    color: '#7f7f7f',
    marginBottom: 10,
  },
  stats: {
    borderTop: '1px solid #f1f1f1',
    borderBottom: '1px solid #f1f1f1',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  topStatsWrapper: {
    borderBottom: '1px solid #f1f1f1',
    marginBottom: 30,
    paddingBottom: 8,
  },
  topStats: {
    marginTop: 16,
    marginBottom: 16,
  },
  viewMoreCTA: {
    paddingTop: 5,
    paddingBottom: 14,
  },
  primaryTitle: {
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  avatar: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  nameWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e1e24',
    cursor: 'pointer',
  },
  headingTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#6f6f73',
    marginBottom: 18,
  },
  credTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2b2b2b',
    marginLeft: 8,
  },
  cred: {
    fontSize: 14,
    color: '#6f6f73',
    marginLeft: 3,
  },
  desc: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2b2b2b',
    marginBottom: 20,
  },
  createPostButton: {
    borderRadius: 0,
    fontWeight: 700,
    textTransform: 'none',
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    paddingLeft: 46,
    paddingRight: 46,
    marginBottom: 25,
    '&:hover': {
      borderWidth: 2,
    },
  },
});

type Props = {
  user: Object,
  topUsers: List<Map>,
  classes: Object,
  onClick: Function,
};

type State = {
  isMoreOpen: boolean,
};

class UserCredStats extends Component<Props, State> {
  state = {
    isMoreOpen: false,
  };
  onViewMore = () => {
    const { isMoreOpen } = this.state;
    this.setState({ isMoreOpen: !isMoreOpen });
  };
  gotoProfile = slug => {
    window.open(`/f/${slug}`, '_blank');
  };
  render() {
    const { user, topUsers, classes } = this.props;
    const { isMoreOpen } = this.state;
    return (
      <div className={classes.root}>
        <Grid container className={classes.titleSection}>
          <Typography className={classes.title}>
            <Icon glyph={CredJollyIcon} size={19} />
            <Grid item className={classes.nameWrapper}>
              <Typography className={classes.credTitle}>Cred</Typography>
            </Grid>
          </Typography>
          <Tooltip
            trigger={
              <Typography
                className={classes.primaryTitle}
                color="primary"
                size="large"
              >
                {`What's cred?`}
              </Typography>
            }
            position="bottom right"
            content="Cred is a measure of how helpful you are to the community.
            Increase your cred by helping others: post gigs and job
            opportunities, answer questions, or comment in the feed. Earn cred
            when people mark your posts as helpful."
            closeOnDocumentClick
          />
        </Grid>
        <Grid container alignItems="center" className={classes.stats}>
          <Grid item>
            <UserAvatar
              src={user.getIn(['profile', 'avatar'])}
              className={classes.avatar}
            />
          </Grid>
          <Grid item className={classes.nameWrapper}>
            <Typography className={classes.name}>You</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Icon glyph={CredIcon} />
              </Grid>
              <Grid item>
                <Typography className={classes.cred}>
                  {user.getIn(['profile', 'cred'])}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Typography className={classes.headingTitle}>
          Most helpful in {user.getIn(['profile', 'location'])}
        </Typography>
        <Grid className={classes.topStatsWrapper}>
          {topUsers &&
            topUsers.toJSON().map((topUser, index) => {
              if (index < 5 || (index > 4 && isMoreOpen))
                return (
                  <Grid
                    container
                    alignItems="center"
                    className={classes.topStats}
                    key={generate()}
                  >
                    <Grid item>
                      <UserAvatar
                        src={topUser.user.profile.avatar}
                        className={classes.avatar}
                      />
                    </Grid>
                    <Grid item className={classes.nameWrapper}>
                      <Typography
                        className={classes.name}
                        onClick={() => this.gotoProfile(topUser.user.slug)}
                      >
                        {`${capitalize(topUser.user.firstName)}
                        ${capitalize(topUser.user.lastName.charAt(0))}.`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Icon glyph={CredIcon} />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.cred}>
                            {topUser.cred}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              return null;
            })}
          {!isMoreOpen &&
            topUsers &&
            topUsers.size > 5 && (
              <Grid className={classes.viewMoreCTA}>
                <Typography
                  className={classes.primaryTitle}
                  color="primary"
                  size="large"
                  onClick={this.onViewMore}
                >
                  View More
                </Typography>
              </Grid>
            )}
        </Grid>
        <Typography className={classes.desc} align="center">
          Build your cred by helping
          <br />
          your community
        </Typography>
        <Grid container justify="center">
          <Grid item>
            <Button
              className={classes.createPostButton}
              variant="outlined"
              color="primary"
              size="large"
              onClick={this.props.onClick}
            >
              Post
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(UserCredStats);
