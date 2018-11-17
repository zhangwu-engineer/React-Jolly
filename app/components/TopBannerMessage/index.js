// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    padding: '25px 70px',
    backgroundColor: '#b8f3ce',
    [theme.breakpoints.down('xs')]: {
      padding: '20px 10px',
    },
  },
  textContainer: {
    width: '100%',
  },
  text: {
    color: '#303532',
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      marginBottom: 20,
    },
  },
});

type Props = {
  msg: string,
  classes: Object,
};

const TopBannerMessage = ({ msg, classes }: Props) => (
  <Grid
    className={classes.root}
    container
    justify="space-between"
    alignItems="center"
  >
    <Grid item xs={12} md={8} lg={8} className={classes.textContainer}>
      <Typography className={classes.text}>{msg}</Typography>
    </Grid>
  </Grid>
);

export default withStyles(styles)(TopBannerMessage);
