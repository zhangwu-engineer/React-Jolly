// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { history } from 'components/ConnectedRouter';
import MobileWorkForm from 'components/MobileWorkForm';
import WorkForm from 'components/WorkForm';

import saga, {
  reducer,
  requestCreateWork,
  requestWorks,
  requestRoles,
} from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  roles: Object,
  // isRolesLoading: boolean,
  // rolesError: string,
  works: Object,
  requestCreateWork: Function,
  requestWorks: Function,
  requestRoles: Function,
};

class AddWorkPage extends Component<Props> {
  componentDidMount() {
    this.props.requestRoles();
    this.props.requestWorks();
  }
  componentDidUpdate(prevProps: Props) {
    const { user, isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      history.push(`/f/${user.get('slug')}/edit`);
    }
  }
  render() {
    const { user, isLoading, error, works, roles } = this.props;
    const filteredRoles = this.props.roles.toJS().map(r => r.name);
    return (
      <React.Fragment>
        <MobileWorkForm
          user={user}
          isLoading={isLoading}
          error={error}
          works={works}
          roles={filteredRoles}
          requestCreateWork={this.props.requestCreateWork}
        />
        <WorkForm
          user={user}
          isLoading={isLoading}
          error={error}
          works={works}
          roles={roles}
          requestCreateWork={this.props.requestCreateWork}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['work', 'isLoading']),
  error: state.getIn(['work', 'error']),
  works: state.getIn(['work', 'works']),
  isWorksLoading: state.getIn(['work', 'isWorksLoading']),
  worksError: state.getIn(['work', 'worksError']),
  roles: state.getIn(['work', 'roles']),
  isRolesLoading: state.getIn(['work', 'isRolesLoading']),
  rolesError: state.getIn(['work', 'rolesError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateWork: payload => dispatch(requestCreateWork(payload)),
  requestWorks: () => dispatch(requestWorks()),
  requestRoles: () => dispatch(requestRoles()),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddWorkPage);
