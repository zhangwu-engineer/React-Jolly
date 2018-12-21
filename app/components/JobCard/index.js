// @flow

import React, { Component } from 'react';
import { format } from 'date-fns';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';

import RoleIcon from 'images/sprite/role.svg';
import PeopleIcon from 'images/sprite/people.svg';

const styles = theme => ({
  root: {
    marginBottom: 20,
    padding: '20px 30px',
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.5)',
  },
  content: {
    padding: 0,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#474747',
    cursor: 'pointer',
  },
  date: {
    fontSize: 14,
    fontWeight: 500,
    color: '#a1a1a1',
  },
  actionBar: {
    display: 'flex',
    padding: 0,
    paddingTop: 30,
  },
  icon: {
    fontSize: 17,
    color: '#9B9B9B',
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.4px',
    color: '#a3a3a3',
    textTransform: 'capitalize',
    margin: 0,
  },
  roleButton: {
    paddingLeft: 0,
  },
  coworkersButton: {
    marginLeft: 'auto',
  },
  disabled: {
    color: '#a3a3a3 !important',
  },
  photo: {
    width: 200,
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginRight: 5,
    cursor: 'pointer',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: 90,
      height: 90,
    },
  },
  photoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCount: {
    color: theme.palette.common.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

type Props = {
  job?: Object,
  classes: Object,
  openGallery: Function,
};

class JobCard extends Component<Props> {
  render() {
    const { job, classes } = this.props;
    const photo1 = job && job.getIn(['photos', 0]);
    const photo2 = job && job.getIn(['photos', 1]);
    const photo3 = job && job.getIn(['photos', 2]);
    if (!job) {
      return (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <Typography variant="h6" className={classes.name}>
              No Jobs added yet
            </Typography>
            <Typography className={classes.date}>
              Add your first job now
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() =>
              history.push(
                `/f/${job.getIn(['user', 'slug'])}/e/${job.get('slug')}`
              )
            }
          >
            {job.get('title')}
          </Typography>
          <Typography className={classes.date}>
            {format(new Date(job.get('from')), 'MMMM yyyy')}
          </Typography>
        </CardContent>
        <Grid container>
          {photo1 && (
            <Grid
              item
              className={classes.photo}
              style={{ backgroundImage: `url('${photo1}')` }}
              onClick={() =>
                this.props.openGallery(job.get('photos').toJS(), 0)
              }
            />
          )}
          {photo2 && (
            <Grid
              item
              className={classes.photo}
              style={{ backgroundImage: `url('${photo2}')` }}
              onClick={() =>
                this.props.openGallery(job.get('photos').toJS(), 1)
              }
            />
          )}
          {photo3 && (
            <Grid
              item
              className={classes.photo}
              style={{ backgroundImage: `url('${photo3}')` }}
              onClick={() =>
                this.props.openGallery(job.get('photos').toJS(), 2)
              }
            >
              {job.get('photos').size > 3 && (
                <div
                  className={classes.photoOverlay}
                  onClick={e => {
                    e.stopPropagation();
                    this.props.openGallery(job.get('photos').toJS(), 3);
                  }}
                  role="button"
                >
                  <Typography className={classes.photoCount}>
                    +{job.get('photos').size - 3}
                    <br /> More
                  </Typography>
                </div>
              )}
            </Grid>
          )}
        </Grid>
        <CardActions className={classes.actionBar}>
          <Button
            className={cx(classes.button, classes.roleButton)}
            disabled
            classes={{ disabled: classes.disabled }}
          >
            <Icon glyph={RoleIcon} />
            &nbsp;&nbsp;
            {job.get('role')}
          </Button>
          <Button
            className={cx(classes.button, classes.coworkersButton)}
            disabled
            classes={{ disabled: classes.disabled }}
          >
            <Icon glyph={PeopleIcon} />
            &nbsp;&nbsp;
            {job.get('coworkers').size}
          </Button>
          <Button
            className={classes.button}
            disabled
            classes={{ disabled: classes.disabled }}
          >
            <CheckCircle className={classes.icon} />
            &nbsp;&nbsp;0
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(JobCard);
