// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import UserCard from 'components/UserCard';
import Icon from 'components/Icon';
import Link from 'components/Link';
import ConnectIcon from 'images/sprite/connect_white.svg';
import ConnectSentIcon from 'images/sprite/connect_sent.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '25px 40px',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      padding: 25,
      borderTop: '1px solid #979797',
      marginBottom: 0,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2c2c2c',
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 700,
    },
  },
  count: {
    fontSize: 20,
    fontWeight: 600,
    textDecoration: 'none',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  },
  emptyCount: {
    color: '#999999',
    '&:hover': {
      color: '#999999',
    },
  },
  user: {
    marginBottom: 15,
  },
  connectBox: {
    paddingTop: 60,
    paddingBottom: 60,
  },
  desc: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2c2c2c',
    marginBottom: 20,
  },
  connectButton: {
    textTransform: 'none',
    padding: '10px 45px 10px 40px',
    borderRadius: 0,
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  connectIcon: {
    marginRight: 5,
    position: 'relative',
    top: -1,
  },
});

type Props = {
  coworkers: Object,
  currentUser: Object,
  user: Object,
  isPrivate: boolean,
  isConnectionSent: boolean,
  classes: Object,
  connect: Function,
};

class UserCoworkers extends Component<Props> {
  connect = () => {
    const { currentUser, user } = this.props;
    if (currentUser && currentUser.get('id') !== user.get('id')) {
      this.props.connect(user.get('id'));
    } else {
      history.push('/freelancer-signup');
    }
  };
  render() {
    const {
      coworkers,
      user,
      isPrivate,
      isConnectionSent,
      classes,
    } = this.props;
    const coworkersToShow = coworkers && coworkers.slice(0, 6);
    return (
      <div className={classes.root}>
        <Typography className={classes.title}>
          {isPrivate
            ? `My Coworkers · `
            : `${capitalize(user.get('firstName'))}'s Coworkers · `}
          <Link
            to={isPrivate ? '/network/coworkers' : ''}
            className={cx(classes.count, {
              [classes.emptyCount]: coworkers && coworkers.size === 0,
            })}
          >
            {coworkers ? coworkers.size : ''}
          </Link>
        </Typography>
        <Grid container spacing={8}>
          {coworkersToShow &&
            coworkersToShow.map(coworker => (
              <Grid
                item
                key={generate()}
                xs={12}
                lg={6}
                className={classes.user}
              >
                <UserCard user={coworker} size="small" />
              </Grid>
            ))}
        </Grid>
        {coworkers &&
          coworkers.size === 0 &&
          !isPrivate && (
            <Grid container justify="center" className={classes.connectBox}>
              <Grid item xs={12}>
                <Typography className={classes.desc} align="center">
                  {`Have you worked with ${capitalize(
                    user.get('firstName')
                  )} before?`}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  className={classes.connectButton}
                  onClick={this.connect}
                  variant="contained"
                  color="primary"
                >
                  <Icon
                    glyph={isConnectionSent ? ConnectSentIcon : ConnectIcon}
                    width={23}
                    height={13}
                    className={classes.connectIcon}
                  />
                  {isConnectionSent ? 'Request Sent' : 'Connect'}
                </Button>
              </Grid>
            </Grid>
          )}
      </div>
    );
  }
}

export default withStyles(styles)(UserCoworkers);
