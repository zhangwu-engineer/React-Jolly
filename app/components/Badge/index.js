// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Icon from 'components/Icon';
import CityFreelancerIcon from 'images/sprite/city_freelancer.svg';
import ActiveFreelancerIcon from 'images/sprite/active_freelancer.svg';
import ReadyAndWillingIcon from 'images/sprite/ready_and_willing.svg';
import ConnectedIcon from 'images/sprite/connected.svg';

const styles = theme => ({
  root: {
    marginBottom: 15,
    cursor: 'pointer',
  },
  iconWrapper: {
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    border: '1px dashed #9c3ff5',
  },
  label: {
    fontWeight: 500,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  earnedLabel: {
    color: '#363636',
  },
});

type Props = {
  badge: Object,
  user: Object,
  classes: Object,
  viewProgress: ?Function,
};

class Badge extends Component<Props> {
  badgeIcon = () => {
    const { badge } = this.props;
    const badgeName = badge.get('name');
    if (badgeName === 'city_freelancer') {
      return CityFreelancerIcon;
    } else if (badgeName === 'active_freelancer') {
      return ActiveFreelancerIcon;
    } else if (badgeName === 'ready_and_willing') {
      return ReadyAndWillingIcon;
    }
    return ConnectedIcon;
  };
  badgeLabel = () => {
    const { badge, user } = this.props;
    const badgeName = badge.get('name');
    const location = user.getIn(['profile', 'location']);
    if (badgeName === 'city_freelancer') {
      if (location) {
        const [city] = location && location.split(',');
        return `${city} Freelancer`;
      }
      return 'Freelancer';
    } else if (badgeName === 'active_freelancer') {
      return 'Active Freelancer';
    } else if (badgeName === 'ready_and_willing') {
      return 'Ready & Willing';
    }
    return 'Connected';
  };
  viewProgress = () => {
    const { badge, viewProgress } = this.props;
    if (viewProgress) {
      viewProgress(badge);
    }
  };
  render() {
    const { badge, classes } = this.props;
    const earned = badge.get('earned');
    return (
      <Grid
        container
        className={classes.root}
        alignItems="center"
        onClick={this.viewProgress}
      >
        <Grid item className={classes.iconWrapper}>
          {earned ? (
            <Icon glyph={this.badgeIcon()} size={40} />
          ) : (
            <div className={classes.icon} />
          )}
        </Grid>
        <Grid item>
          <Typography
            className={cx(classes.label, {
              [classes.earnedLabel]: earned,
            })}
          >
            {this.badgeLabel()}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Badge);
