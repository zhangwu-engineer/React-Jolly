// @flow
import React, { Component } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import UserAvatar from 'components/UserAvatar';
import Link from 'components/Link';

const styles = theme => ({
  root: {
    padding: 0,
    marginBottom: 25,
  },
  avatar: {
    width: 34,
    height: 34,
  },
  name: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.palette.primary.main,
    textTransform: 'capitalize',
    textDecoration: 'none',
  },
  content: {
    fontSize: 14,
    fontWeight: 500,
    color: '#171717',
  },
  time: {
    color: '#afafaf',
  },
});

type Props = {
  comment: Map,
  classes: Object,
};

class CommentCard extends Component<Props> {
  render() {
    const { comment, classes } = this.props;
    const user = comment.get('user');
    const timeDistance = formatDistanceStrict(
      new Date(),
      new Date(comment.get('date_created'))
    );
    const timeAgo = timeDistance
      .replace(/ seconds| second/gi, 's')
      .replace(/ minutes| minute/gi, 'm')
      .replace(/ hours| hour/gi, 'h')
      .replace(/ days| day/gi, 'd');
    return (
      <ListItem className={classes.root}>
        <UserAvatar
          alt={`${user.get('firstName')} ${user.get('lastName')}`}
          src={user.getIn(['profile', 'avatar'])}
          className={classes.avatar}
        />
        <ListItemText
          primary={
            <Link to={`/f/${user.get('slug')}`} className={classes.name}>
              {`${user.get('firstName')} ${user.get('lastName').charAt(0)}.`}
            </Link>
          }
          secondary={
            <Typography className={classes.content}>
              {comment.get('content')}
              &nbsp;
              <span className={classes.time}>{timeAgo}</span>
            </Typography>
          }
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(CommentCard);
