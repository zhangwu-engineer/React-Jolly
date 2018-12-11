// @flow

import React, { Component } from 'react';
import ProgressBar from 'progressbar.js';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Link from 'components/Link';

const styles = theme => ({
  root: {
    padding: '20px 70px',
    backgroundColor: '#b8f3ce',
    [theme.breakpoints.down('sm')]: {
      padding: '8px 6px',
    },
    position: 'fixed',
    bottom: 0,
  },
  progressbar: {
    width: 54,
    height: 54,
    marginRight: 15,
    '& div': {
      fontSize: 14,
      fontWeight: 500,
      color: '#303532 !important',
    },
    [theme.breakpoints.down('sm')]: {
      width: 74,
      height: 74,
    },
  },
  textContent: {
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
  thickText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#303532',
  },
  thinText: {
    fontSize: 15,
    color: '#556059',
  },
  buttons: {
    textAlign: 'right',
  },
  button: {
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 500,
    padding: '11px 23px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
});

type Props = {
  user: Object,
  progress: number,
  classes: Object,
};

class CompletionBanner extends Component<Props> {
  componentDidMount() {
    this.drawCircle();
  }
  componentDidUpdate() {
    this.drawCircle();
  }
  drawCircle() {
    const { progress } = this.props;
    const options = {
      strokeWidth: 8,
      color: '#6bd258',
      trailColor: '#a9e7c0',
      trailWidth: 8,
    };
    if (this.shape === null) {
      this.shape = new ProgressBar.Circle(this.progressBar.current, options);
    }
    this.shape.set(progress / 8);
    if (this.shape) {
      this.shape.setText(`${progress * 12.5}%`);
    }
  }
  shape = null;
  progressBar = React.createRef();
  render() {
    const { user, classes } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={8} lg={8}>
          <Grid container>
            <Grid item>
              <div ref={this.progressBar} className={classes.progressbar} />
            </Grid>
            <Grid item className={classes.textContent}>
              <Typography className={classes.thickText}>
                Let&apos;s spice up your profile!
              </Typography>
              <Typography className={classes.thinText}>
                Upload a pic and show off your skills by adding talents and work
                experience.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} lg={4} className={classes.buttons}>
          <Button className={classes.button} color="primary">
            +&nbsp;Add Picture
          </Button>
          <Button
            className={classes.button}
            component={props => (
              <Link to={`/f/${user.get('slug')}/work`} {...props} />
            )}
            color="primary"
          >
            +&nbsp;Add Talents
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CompletionBanner);
