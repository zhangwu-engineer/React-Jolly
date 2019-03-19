// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { formatDistanceStrict } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';

import CredIcon from 'images/sprite/cred.svg';
import CredFilledIcon from 'images/sprite/cred_filled.svg';
import CredBlueIcon from 'images/sprite/cred_blue.svg';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '22px 23px 15px 24px',
    marginBottom: 10,
  },
  userInfo: {
    padding: 0,
  },
  avatar: {
    width: 46,
    height: 46,
  },
  username: {
    fontSize: 14,
    fontWeight: 600,
    color: '#464646',
    textTransform: 'capitalize',
    marginRight: 7,
  },
  category: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  time: {
    fontSize: 14,
    fontWeight: 600,
    color: '#7f7f7f',
  },
  content: {
    fontSize: 14,
    fontWeight: 600,
    color: '#464646',
    marginTop: 20,
    marginBottom: 30,
  },
  bottom: {
    borderTop: '1px solid #f1f1f1',
    paddingTop: 15,
  },
  helpfulButton: {
    cursor: 'pointer',
  },
  helpful: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#6f6f73',
    paddingLeft: 5,
  },
  votes: {
    fontSize: 14,
    color: '#404040',
    paddingLeft: 5,
  },
  blue: {
    color: theme.palette.primary.main,
  },
});

type Props = {
  post: Map,
  currentUser: Map,
  classes: Object,
  votePost: Function,
};

class PostCard extends Component<Props> {
  render() {
    const { post, currentUser, classes } = this.props;
    const user = post.get('user');
    const category = CATEGORY_OPTIONS.filter(
      option => option.value === post.get('category')
    );
    const voted = post.get('votes').includes(currentUser.get('id'));
    const timeDistance = formatDistanceStrict(
      new Date(),
      new Date(post.get('date_created'))
    );
    const timeAgo = timeDistance
      .replace(/ seconds| second/gi, 's')
      .replace(/ minutes| minute/gi, 'm')
      .replace(/ hours| hour/gi, 'h')
      .replace(/ days| day/gi, 'd');
    return (
      <div className={classes.root}>
        <ListItem className={classes.userInfo}>
          <UserAvatar
            alt={`${user.get('firstName')} ${user.get('lastName')}`}
            src={user.getIn(['profile', 'avatar'])}
            className={classes.avatar}
          />
          <ListItemText
            primary={
              <Grid container alignItems="center">
                <Grid item>
                  <Typography className={classes.username}>{`${user.get(
                    'firstName'
                  )} ${user.get('lastName').charAt(0)}.`}</Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.category}>
                    {category[0].label}
                  </Typography>
                </Grid>
              </Grid>
            }
            secondary={`${timeAgo} ago`}
            classes={{
              secondary: classes.time,
            }}
          />
        </ListItem>
        <Typography className={classes.content}>
          {post.get('content')}
        </Typography>
        <Grid container justify="space-between" className={classes.bottom}>
          <Grid
            item
            className={classes.helpfulButton}
            onClick={() => {
              if (
                post.getIn(['user', 'id']) !== currentUser.get('id') &&
                !voted
              ) {
                this.props.votePost(post.get('id'));
              }
            }}
          >
            <Grid container alignItems="center">
              <Grid item>
                <Icon glyph={voted ? CredBlueIcon : CredIcon} size={16} />
              </Grid>
              <Grid item>
                <Typography
                  className={cx(classes.helpful, {
                    [classes.blue]: voted,
                  })}
                >
                  Helpful
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Icon glyph={voted ? CredBlueIcon : CredFilledIcon} size={16} />
              </Grid>
              <Grid item>
                <Typography className={classes.votes}>
                  {post.get('votes').size}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PostCard);
