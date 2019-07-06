// @flow

import React, { Component } from 'react';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
  },
  userInfo: {
    paddingLeft: 20,
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 12,
    },
  },
  location: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.3,
    color: '#9b9b9b',
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#4a4a4a',
  },
  viewProfileButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    padding: '11px 35px',
    borderRadius: 0,
    boxShadow: 'none',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 30px',
      fontWeight: 600,
      display: 'none',
    },
  },
});

type Props = {
  user: Object,
  classes: Object,
};

class CoworkerCard extends Component<Props> {
  viewProfile = () => {
    const { user } = this.props;
    window.open(`/f/${user.get('slug')}`, '_blank');
  };
  render() {
    const { user, classes } = this.props;
    return (
      <div className={classes.root} onClick={this.viewProfile} role="button">
        <UserAvatar
          className={classes.avatar}
          src={user && user.getIn(['profile', 'avatar'])}
          alt={user && user.get('firstName')}
        />
        <div className={classes.userInfo}>
          <Typography className={classes.location}>
            {user.get('isCoworker') && (
              <strong>Coworker&nbsp;&sdot;&nbsp;</strong>
            )}
            {user.getIn(['profile', 'location'])}
          </Typography>
          <Typography className={classes.name}>
            {`${capitalize(user && user.get('firstName'))} ${capitalize(
              user && user.get('lastName')
            )}`}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CoworkerCard);
