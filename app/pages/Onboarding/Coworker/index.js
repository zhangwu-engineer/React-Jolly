// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { fromJS } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import UserCard from 'components/UserCard';
import OnboardingSkipModal from 'components/OnboardingSkipModal';
import OnboardingJobFormModal from 'components/OnboardingJobFormModal';

import { requestCityUsers } from 'containers/App/sagas';
import saga, { reducer, requestCreateWork } from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

const perPage = 8;
const styles = theme => ({
  banner: {
    backgroundColor: theme.palette.common.darkBlue,
    paddingTop: 50,
    paddingBottom: 30,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '35px 20px 40px 20px',
    },
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 1.46,
    letterSpacing: 0.6,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: 1.94,
      letterSpacing: 0.4,
    },
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: theme.palette.common.white,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      lineHeight: 1.75,
      letterSpacing: 0.4,
    },
  },
  skip: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: theme.palette.common.white,
    textTransform: 'none',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      letterSpacing: 0.4,
    },
  },
  content: {
    maxWidth: 830,
    margin: '0 auto',
    display: 'flex',
    paddingBottom: 137,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingBottom: 50,
    },
  },
  leftPanel: {
    width: 254,
    marginRight: 27,
    paddingTop: 100,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  coworkersBox: {
    backgroundColor: theme.palette.common.white,
    padding: 25,
    marginBottom: 12,
  },
  coworkersTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  inviteBox: {
    backgroundColor: theme.palette.common.white,
    padding: '23px 16px 13px 16px',
    display: 'none',
  },
  inviteBoxTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  emailInputLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#8c8c8c',
  },
  inviteButton: {
    fontSize: 14,
    fontWeight: 600,
    paddingTop: 14,
    paddingBottom: 13,
    borderRadius: 0,
    marginTop: 8,
  },
  rightPanel: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: '#1b1b1b',
    marginTop: 40,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      letterSpacing: 0.3,
      marginTop: 30,
      marginBottom: 20,
    },
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
    [theme.breakpoints.down('xs')]: {
      paddingTop: 15,
      paddingBottom: 15,
    },
  },
  nextButtonWrapper: {
    textAlign: 'right',
  },
  nextButton: {
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 70px',
    marginTop: 12,
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
    },
  },
});

type Props = {
  user: Object,
  cityUsers: List<Object>,
  total: number,
  page: number,
  isSaving: boolean,
  saveError: string,
  classes: Object,
  requestCityUsers: Function,
  requestCreateWork: Function,
};

type State = {
  isSkipOpen: boolean,
  isFormOpen: boolean,
  selectedUser: ?Object,
  initialValues: Object,
  jobs: Array<Object>,
  selectedUserIds: Array<string>,
};

class OnboardingCoworkerPage extends Component<Props, State> {
  state = {
    isSkipOpen: false,
    isFormOpen: false,
    selectedUser: null,
    initialValues: {
      title: '',
      from: new Date(),
      role: '',
    },
    jobs: [],
    selectedUserIds: [],
  };
  componentDidMount() {
    const { user, page } = this.props;
    this.props.requestCityUsers(
      user.getIn(['profile', 'location']),
      page || 1,
      perPage
    );
  }
  componentDidUpdate(prevProps: Props) {
    const { isSaving, saveError } = this.props;
    if (prevProps.isSaving && !isSaving && !saveError) {
      history.push('/edit');
    }
  }
  openSkipModal = () => {
    this.setState({ isSkipOpen: true });
  };
  closeSkipModal = () => {
    this.setState({ isSkipOpen: false });
  };
  closeFormModal = () => {
    this.setState({ isFormOpen: false });
  };
  openFormModal = user => {
    this.setState({ selectedUser: user, isFormOpen: true });
  };
  handleSave = (data, user) => {
    this.setState(state => ({
      isFormOpen: false,
      jobs: [...state.jobs, data],
      selectedUserIds: [...state.selectedUserIds, user.id],
      initialValues: {
        title: data.title,
        role: data.role,
        from: data.from,
      },
    }));
  };
  handleNext = () => {
    const { jobs } = this.state;
    if (jobs.length) {
      this.props.requestCreateWork(jobs);
    }
  };
  render() {
    const { user, cityUsers, page, total, classes } = this.props;
    const {
      isSkipOpen,
      isFormOpen,
      selectedUser,
      initialValues,
      jobs,
      selectedUserIds,
    } = this.state;
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
          <div className={classes.leftPanel}>
            <div className={classes.coworkersBox}>
              <Typography className={classes.coworkersTitle}>
                Coworkers
              </Typography>
              {jobs.map(job =>
                job.coworkers.map(coworker => (
                  <UserCard
                    key={generate()}
                    user={fromJS(coworker)}
                    onSelect={this.openFormModal}
                    size="small"
                  />
                ))
              )}
            </div>
            <div className={classes.inviteBox}>
              <Typography className={classes.inviteBoxTitle} align="center">
                Don&apos;t see any coworkers? Invite them to Jolly
              </Typography>
              <TextField
                variant="filled"
                fullWidth
                label="Enter email"
                InputLabelProps={{
                  classes: {
                    root: classes.emailInputLabel,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.inviteButton}
              >
                Send Invite
              </Button>
            </div>
          </div>
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
                    onSelect={this.openFormModal}
                    selected={selectedUserIds.includes(cityUser.get('id'))}
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
              <Grid item xs={12} lg={12} className={classes.nextButtonWrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.nextButton}
                  onClick={this.handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
        <OnboardingSkipModal
          isOpen={isSkipOpen}
          onCloseModal={this.closeSkipModal}
        />
        <OnboardingJobFormModal
          isOpen={isFormOpen}
          user={selectedUser}
          initialValues={initialValues}
          onCloseModal={this.closeFormModal}
          onSave={this.handleSave}
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
  isSaving: state.getIn(['work', 'isLoading']),
  saveError: state.getIn(['work', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateWork: payload => dispatch(requestCreateWork(payload)),
  requestCityUsers: (city, page, usersPerPage) =>
    dispatch(requestCityUsers(city, page, usersPerPage)),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OnboardingCoworkerPage);
