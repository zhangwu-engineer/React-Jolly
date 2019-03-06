// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { capitalize } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import MoreIcon from '@material-ui/icons/MoreVert';

import WorkDetail from 'components/WorkDetail';
import Preloader from 'components/Preloader';
import Link from 'components/Link';

import LogoWhite from 'images/logo-white.png';

import saga, {
  reducer,
  requestWork,
  requestSearchUsers,
  requestWorkRelatedUsers,
  requestAddCoworker,
  requestVerifyCoworker,
  requestEndorseUser,
  requestEndorsements,
  requestEndorsers,
} from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  headerInner: {
    height: 70,
    maxWidth: 1063,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      height: 45,
    },
  },
  button: {
    color: theme.palette.common.white,
    textTransform: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  logo: {
    width: 70,
    height: 45,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

type Props = {
  user: Object,
  work: Object,
  isWorkLoading: boolean,
  workError: string,
  users: Object,
  relatedUsers: Object,
  isAddingCoworker: boolean,
  addCoworkerError: string,
  isVerifyingCoworker: boolean,
  verifyCoworkerError: string,
  isEndorsing: boolean,
  endorseError: string,
  endorsements: Object,
  endorsers: Object,
  match: Object,
  classes: Object,
  requestWork: Function,
  requestSearchUsers: Function,
  requestWorkRelatedUsers: Function,
  requestAddCoworker: Function,
  requestVerifyCoworker: Function,
  requestEndorseUser: Function,
  requestEndorsements: Function,
  requestEndorsers: Function,
};

class WorkDetailPage extends Component<Props> {
  componentDidMount() {
    const {
      match: {
        url,
        params: { eventSlug },
      },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventID',
    });
    this.props.requestWork({ slug: eventSlug, userSlug: slug });
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isWorkLoading,
      workError,
      isAddingCoworker,
      addCoworkerError,
      isVerifyingCoworker,
      verifyCoworkerError,
      isEndorsing,
      endorseError,
      match: { url },
      user,
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventID',
    });
    if (prevProps.isWorkLoading && !isWorkLoading && !workError) {
      this.props.requestWorkRelatedUsers(this.props.work.get('id'));
      this.props.requestEndorsers(this.props.work.get('slug'), slug);
      if (user && user.get('slug') === slug) {
        this.props.requestEndorsements(this.props.work.get('id'));
      }
    }
    if (prevProps.isAddingCoworker && !isAddingCoworker && !addCoworkerError) {
      this.props.requestWorkRelatedUsers(this.props.work.get('id'));
    }
    if (
      prevProps.isVerifyingCoworker &&
      !isVerifyingCoworker &&
      !verifyCoworkerError
    ) {
      this.props.requestWorkRelatedUsers(this.props.work.get('id'));
    }
    if (prevProps.isEndorsing && !isEndorsing && !endorseError) {
      this.props.requestEndorsements(this.props.work.get('id'));
    }
  }
  render() {
    const {
      work,
      user,
      isWorkLoading,
      workError,
      users,
      relatedUsers,
      endorsements,
      endorsers,
      classes,
      match: { url },
    } = this.props;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventID',
    });
    const displayMode =
      user && user.get('slug') === slug ? 'private' : 'public';
    if (isWorkLoading) {
      return <Preloader />;
    }
    return (
      <React.Fragment>
        <div className={classes.header}>
          <Grid
            className={classes.headerInner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Button
                className={classes.button}
                component={props => (
                  <Link
                    to={
                      user && user.get('slug') === slug ? '/edit' : `/f/${slug}`
                    }
                    {...props}
                  />
                )}
              >
                <ArrowBackIcon />
                &nbsp;&nbsp;&nbsp;
                <Typography className={classes.backButtonText}>
                  {displayMode === 'private'
                    ? 'Job Details'
                    : `${capitalize(
                        work.getIn(['user', 'firstName'])
                      )} ${capitalize(
                        work.getIn(['user', 'lastName']) &&
                          work.getIn(['user', 'lastName']).charAt(0)
                      )}.`}
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Link to="/">
                <img className={classes.logo} src={LogoWhite} alt="logo" />
              </Link>
            </Grid>
            <Grid item style={{ width: 68 }}>
              {/* <IconButton className={classes.button}>
                <MoreIcon />
              </IconButton> */}
            </Grid>
          </Grid>
        </div>
        {work.size > 0 && !workError ? (
          <WorkDetail
            work={work}
            users={users}
            relatedUsers={relatedUsers}
            endorsements={endorsements}
            endorsers={endorsers}
            searchUsers={this.props.requestSearchUsers}
            requestAddCoworker={this.props.requestAddCoworker}
            requestVerifyCoworker={this.props.requestVerifyCoworker}
            requestEndorseUser={this.props.requestEndorseUser}
            displayMode={displayMode}
          />
        ) : (
          <FormHelperText error>{workError}</FormHelperText>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['work', 'isLoading']),
  error: state.getIn(['work', 'error']),
  work: state.getIn(['work', 'work']),
  isWorkLoading: state.getIn(['work', 'isWorkLoading']),
  workError: state.getIn(['work', 'workError']),
  users: state.getIn(['work', 'users']),
  relatedUsers: state.getIn(['work', 'relatedUsers']),
  isAddingCoworker: state.getIn(['work', 'isAddingCoworker']),
  addCoworkerError: state.getIn(['work', 'addCoworkerError']),
  isVerifyingCoworker: state.getIn(['work', 'isVerifyingCoworker']),
  verifyCoworkerError: state.getIn(['work', 'verifyCoworkerError']),
  isEndorsing: state.getIn(['work', 'isEndorsing']),
  endorseError: state.getIn(['work', 'endorseError']),
  endorsements: state.getIn(['work', 'endorsements']),
  isEndorsementsLoading: state.getIn(['work', 'isEndorsementsLoading']),
  endorsementsError: state.getIn(['work', 'endorsementsError']),
  endorsers: state.getIn(['work', 'endorsers']),
});

const mapDispatchToProps = dispatch => ({
  requestWork: payload => dispatch(requestWork(payload)),
  requestSearchUsers: payload => dispatch(requestSearchUsers(payload)),
  requestWorkRelatedUsers: eventId =>
    dispatch(requestWorkRelatedUsers(eventId)),
  requestAddCoworker: (eventId, coworker) =>
    dispatch(requestAddCoworker(eventId, coworker)),
  requestVerifyCoworker: (payload, eventId) =>
    dispatch(requestVerifyCoworker(payload, eventId)),
  requestEndorseUser: payload => dispatch(requestEndorseUser(payload)),
  requestEndorsements: workId => dispatch(requestEndorsements(workId)),
  requestEndorsers: (workSlug, userSlug) =>
    dispatch(requestEndorsers(workSlug, userSlug)),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(WorkDetailPage);
