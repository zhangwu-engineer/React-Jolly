// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'components/Link';
import JobCard from 'components/JobCard';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  },
  header: {
    marginBottom: 30,
    paddingLeft: 5,
    paddingRight: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#252525',
  },
  new: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'none',
    textTransform: 'none',
  },
});

type Props = {
  works: Object,
  isPrivate: boolean,
  classes: Object,
  openGallery: Function,
  user: Object,
};

type State = {
  page: number,
};

class UserWorkList extends Component<Props, State> {
  state = {
    page: 1,
  };
  seeMore = () => {
    this.setState(state => ({ page: state.page + 1 }));
  };
  render() {
    const { isPrivate, works, classes, user } = this.props;
    const { page } = this.state;
    const jobCountToShow = (page - 1) * 3 + 2;
    return (
      <div className={classes.root}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <Typography className={classes.title}>Past Event Gigs</Typography>
          </Grid>
          <Grid item>
            {isPrivate && (
              <Link to="/add" className={classes.new}>
                + New
              </Link>
            )}
          </Grid>
        </Grid>
        {works && works.size ? (
          works.map(
            (work, index) =>
              index < jobCountToShow ? (
                <JobCard
                  key={generate()}
                  job={work}
                  openGallery={this.props.openGallery}
                />
              ) : null
          )
        ) : (
          <JobCard isPrivate={isPrivate} firstName={user.get('firstName')} />
        )}
        {works &&
          jobCountToShow < works.size && (
            <Grid container justify="center">
              <Grid item>
                <Link className={classes.new} onClick={this.seeMore}>
                  See More
                </Link>
              </Grid>
            </Grid>
          )}
      </div>
    );
  }
}

export default withStyles(styles)(UserWorkList);
