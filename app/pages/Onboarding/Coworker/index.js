// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Link from 'components/Link';
import UserCard from 'components/UserCard';
import OnboardingSkipModal from 'components/OnboardingSkipModal';

import { requestCityUsers } from 'containers/App/sagas';

const perPage = 8;
const styles = theme => ({
  banner: {
    backgroundColor: theme.palette.common.darkBlue,
    paddingTop: 50,
    paddingBottom: 30,
    textAlign: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 1.46,
    letterSpacing: '0.6px',
    color: theme.palette.common.white,
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: theme.palette.common.white,
    marginBottom: 30,
  },
  skip: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: theme.palette.common.white,
    textTransform: 'none',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  content: {
    maxWidth: 830,
    margin: '0 auto',
    display: 'flex',
    paddingBottom: 137,
  },
  leftPanel: {
    width: 254,
    marginRight: 27,
  },
  rightPanel: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: '#1b1b1b',
    marginTop: 40,
    marginBottom: 30,
  },
  loadMoreButton: {
    backgroundColor: theme.palette.common.white,
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.3,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

type Props = {
  user: Object,
  cityUsers: List<Object>,
  total: number,
  page: number,
  classes: Object,
  requestCityUsers: Function,
};

type State = {
  isSkipOpen: boolean,
};

class OnboardingCoworkerPage extends Component<Props, State> {
  state = {
    isSkipOpen: false,
  };
  componentDidMount() {
    const { user, page } = this.props;
    this.props.requestCityUsers(
      user.getIn(['profile', 'location']),
      page || 1,
      perPage
    );
  }
  openSkipModal = () => {
    this.setState({ isSkipOpen: true });
  };
  closeSkipModal = () => {
    this.setState({ isSkipOpen: false });
  };
  handleUserSelection = () => {};
  render() {
    const { user, cityUsers, page, total, classes } = this.props;
    const { isSkipOpen } = this.state;
    const loadMore = total > page * perPage;
    return (
      <React.Fragment>
        <div className={classes.banner}>
          <Typography className={classes.bannerTitle} align="center">
            Select people you’ve worked with
          </Typography>
          <Typography className={classes.text} align="center">
            They&apos;ll be able to endorse you, tag you in jobs and help you
            find your next gig!
          </Typography>
          <Link className={classes.skip} onClick={this.openSkipModal}>
            Skip this Step
          </Link>
        </div>
        <div className={classes.content}>
          <div className={classes.leftPanel} />
          <div className={classes.rightPanel}>
            <Typography className={classes.title}>
              Find coworkers near{' '}
              <strong>{user.getIn(['profile', 'location'])}</strong>
            </Typography>
            <Grid container spacing={8}>
              {cityUsers.map(cityUser => (
                <Grid item key={generate()} xs={12} lg={6}>
                  <UserCard
                    user={cityUser}
                    onSelect={this.handleUserSelection}
                  />
                </Grid>
              ))}
              {loadMore && (
                <Grid item xs={12} lg={12}>
                  <Button
                    fullWidth
                    color="primary"
                    className={classes.loadMoreButton}
                    onClick={() => {
                      this.props.requestCityUsers(
                        user.getIn(['profile', 'location']),
                        page + 1,
                        perPage
                      );
                    }}
                  >
                    See More
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
        <OnboardingSkipModal
          isOpen={isSkipOpen}
          onCloseModal={this.closeSkipModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  cityUsers: state.getIn(['app', 'cityUsers', 'users']),
  total: state.getIn(['app', 'cityUsers', 'total']),
  page: state.getIn(['app', 'cityUsers', 'page']),
  isCityUsersLoading: state.getIn(['app', 'isCityUsersLoading']),
  cityUsersError: state.getIn(['app', 'cityUsersError']),
});

const mapDispatchToProps = dispatch => ({
  requestCityUsers: (city, page, usersPerPage) =>
    dispatch(requestCityUsers(city, page, usersPerPage)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OnboardingCoworkerPage);
