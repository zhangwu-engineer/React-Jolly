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
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      padding: 20,
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
      color: '#ffffff !important',
    },
    [theme.breakpoints.down('xs')]: {
      width: 80,
      height: 80,
    },
  },
  textContent: {
    [theme.breakpoints.down('xs')]: {
      flex: 1,
    },
  },
  thickText: {
    fontSize: 19,
    fontWeight: 500,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 13,
    },
  },
  buttons: {
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallButtons: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  button: {
    backgroundColor: theme.palette.common.white,
    fontSize: 15,
    fontWeight: 600,
    color: theme.palette.primary.main,
    padding: '11px 23px',
    '&:first-child': {
      marginRight: 25,
    },
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
  },
});

type Props = {
  user: Object,
  showJobButton: boolean,
  showRoleButton: boolean,
  showTagButton: boolean,
  progress: number,
  classes: Object,
  updateUser: Function,
  openPhotoModal: Function,
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
      trailColor: '#ffffff',
      trailWidth: 8,
    };
    if (this.shape === null) {
      this.shape = new ProgressBar.Circle(this.progressBar.current, options);
    }
    this.shape.set(progress / 10);
    if (this.shape) {
      this.shape.setText(`${progress * 10}%`);
    }
  }
  shape = null;
  progressBar = React.createRef();
  render() {
    const {
      user,
      showTagButton,
      showRoleButton,
      showJobButton,
      classes,
    } = this.props;
    const showPictureButton =
      (!showRoleButton || !showJobButton) && !user.getIn(['profile', 'avatar']);
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={8} lg={8}>
          <Grid container alignItems="center">
            <Grid item>
              <div ref={this.progressBar} className={classes.progressbar} />
            </Grid>
            <Grid item className={classes.textContent}>
              <Typography className={classes.thickText}>
                Your profile is incomplete!
              </Typography>
              <div className={classes.smallButtons}>
                {showPictureButton && (
                  <Button
                    className={classes.button}
                    color="primary"
                    component={props => (
                      <Link to="/profile-picture" {...props} />
                    )}
                  >
                    +&nbsp;Picture
                  </Button>
                )}
                {showRoleButton && (
                  <Button
                    className={classes.button}
                    color="primary"
                    component={props => <Link to="/types-of-work" {...props} />}
                  >
                    +&nbsp;Role
                  </Button>
                )}
                {showJobButton && (
                  <Button
                    className={classes.button}
                    component={props => (
                      <Link to={`/f/${user.get('slug')}/add`} {...props} />
                    )}
                    color="primary"
                  >
                    +&nbsp;Job
                  </Button>
                )}
                {showTagButton && (
                  <Button
                    className={classes.button}
                    color="primary"
                    component={props => (
                      <Link to={`/f/${user.get('slug')}/add`} {...props} />
                    )}
                  >
                    Tag a Coworker
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} lg={4} className={classes.buttons}>
          {showPictureButton && (
            <Button
              className={classes.button}
              color="primary"
              onClick={() => {
                this.props.openPhotoModal('avatar');
              }}
            >
              +&nbsp;Picture
            </Button>
          )}
          {showRoleButton && (
            <Button
              className={classes.button}
              color="primary"
              component={props => (
                <Link to={`/f/${user.get('slug')}/work`} {...props} />
              )}
            >
              +&nbsp;Role
            </Button>
          )}
          {showJobButton && (
            <Button
              className={classes.button}
              component={props => (
                <Link to={`/f/${user.get('slug')}/add`} {...props} />
              )}
              color="primary"
            >
              +&nbsp;Job
            </Button>
          )}
          {showTagButton && (
            <Button
              className={classes.button}
              color="primary"
              component={props => (
                <Link to={`/f/${user.get('slug')}/add`} {...props} />
              )}
            >
              Tag a Coworker
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CompletionBanner);
