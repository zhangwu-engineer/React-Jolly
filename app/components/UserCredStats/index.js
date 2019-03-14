// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import CredIcon from 'images/sprite/cred_filled.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2b2b2b',
    marginBottom: 5,
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
    marginBottom: 30,
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
  },
  cred: {
    fontSize: 14,
    color: '#6f6f73',
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
  classes: Object,
  onClick: Function,
};

class UserCredStats extends Component<Props> {
  render() {
    const { user, classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.title}>Cred</Typography>
        <Typography className={classes.text}>
          Increase your cred by helping your fellow event freelancers: share
          knowledge, answer questions, or comment in the feed. Soon, you’ll be
          able to see how you stack up against other helpful freelancers in your
          city.
        </Typography>
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
