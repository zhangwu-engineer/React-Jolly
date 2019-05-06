// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Icon from 'components/Icon';
import TrophyIcon from 'images/sprite/trophy.svg';

const styles = theme => ({
  root: {
    backgroundColor: '#914ceb',
    padding: 20,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 25px',
    },
  },
  title: {
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  description: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 75,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  todo: {
    width: 526,
    backgroundColor: theme.palette.common.white,
    padding: '25px 20px 20px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '25px 20px',
    },
  },
  todoContent: {
    flex: 1,
  },
  trophy: {
    marginRight: 30,
    width: 80,
    height: 80,
    [theme.breakpoints.down('xs')]: {
      width: 65,
      height: 65,
      marginRight: 20,
    },
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2b2b2b',
    marginBottom: 10,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      marginBottom: 5,
    },
  },
  badgeText: {
    fontWeight: 600,
    color: '#585858',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  action: {
    lineHeight: 1.57,
    color: theme.palette.primary.main,
    fontWeight: 600,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  completedAction: {
    textDecoration: 'line-through',
  },
});

type Props = {
  badge: Object,
  classes: Object,
};

class BadgeProgressBanner extends Component<Props> {
  render() {
    const { badge, classes } = this.props;
    let badgeName = '';
    if (badge.get('name') === 'city_freelancer') {
      badgeName = 'City Freelancer Badge';
    } else if (badge.get('name') === 'active_freelancer') {
      badgeName = 'Active Freelancer Badge';
    } else if (badge.get('name') === 'ready_and_willing') {
      badgeName = 'Ready & Willing Badge';
    } else {
      badgeName = 'Connected Badge';
    }
    return (
      <Grid container className={classes.root} alignItems="center">
        <Grid item className={classes.description}>
          <Typography className={classes.title}>
            Start Earning Some Serious Cred
          </Typography>
          <Typography className={classes.text}>
            Earn badges as you build up your profile and network to get noticed
            by potential employers.
          </Typography>
        </Grid>
        <Grid item className={classes.todo}>
          <Grid container>
            <Grid item>
              <Icon glyph={TrophyIcon} className={classes.trophy} />
            </Grid>
            <Grid item className={classes.todoContent}>
              <Typography className={classes.badgeName}>{badgeName}</Typography>
              <Typography className={classes.badgeText}>
                To earn this badge:
              </Typography>
              <Grid container>
                {badge.get('actions').map(action => (
                  <Grid item key={generate()} xs={12} md={6}>
                    <Typography
                      className={cx(classes.action, {
                        [classes.completedAction]: action.get('completed'),
                      })}
                    >
                      {action.get('name')}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(BadgeProgressBanner);
