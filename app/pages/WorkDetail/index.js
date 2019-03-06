// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';

import FormHelperText from '@material-ui/core/FormHelperText';

import WorkDetail from 'components/WorkDetail';
import Preloader from 'components/Preloader';
import Header from 'components/Header';

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
  location: Object,
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
      match: { url },
      location: { pathname },
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
        {work.size > 0 && !workError ? (
          <React.Fragment>
            <Header user={user} pathname={pathname} work={work} />
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
          </React.Fragment>
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
  )
)(WorkDetailPage);
