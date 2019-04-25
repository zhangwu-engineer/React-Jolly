// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    backgroundColor: '#f7f7f7',
    marginBottom: 6,
    padding: '15px 20px',
  },
  name: {
    color: '#2c2c2c',
  },
  rate: {
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#2e2e2e',
  },
});

type Props = {
  role?: Object,
  classes: Object,
};

class PositionCard extends Component<Props> {
  render() {
    const { role, classes } = this.props;
    if (!role) {
      return (
        <Grid container>
          <Grid item>
            <Typography className={classes.name}>No Roles added yet</Typography>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container justify="space-between" className={classes.root}>
        <Grid item>
          <Typography className={classes.name}>{role.name}</Typography>
        </Grid>
        <Grid item>
          {role.minRate &&
            role.maxRate &&
            role.unit && (
              <Typography className={classes.rate}>
                {`$${role.minRate} - ${role.maxRate} / ${role.unit}`}
              </Typography>
            )}
          {role.minRate &&
            !role.maxRate &&
            role.unit && (
              <Typography className={classes.rate}>
                {`$${role.minRate} / ${role.unit}`}
              </Typography>
            )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PositionCard);
