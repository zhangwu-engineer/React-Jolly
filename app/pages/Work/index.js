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
  requestCreateWork: Function,
  requestRoles: Function,
};

class AddWorkPage extends Component<Props> {
  componentDidMount() {
    this.props.requestRoles();
  }
  componentDidUpdate(prevProps: Props) {
    const { user, isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      history.push(`/f/${user.get('slug')}/edit`);
    }
  }
  render() {
    const { user, isLoading, error, roles } = this.props;
    const filteredRoles = this.props.roles.toJS().map(r => r.name);
    return (
      <React.Fragment>
        <MobileWorkForm
          user={user}
          isLoading={isLoading}
          error={error}
          roles={filteredRoles}
          requestCreateWork={this.props.requestCreateWork}
        />
        <WorkForm
          user={user}
          isLoading={isLoading}
          error={error}
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
  roles: state.getIn(['work', 'roles']),
  isRolesLoading: state.getIn(['work', 'isRolesLoading']),
  rolesError: state.getIn(['work', 'rolesError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateWork: payload => dispatch(requestCreateWork(payload)),
  requestRoles: () => dispatch(requestRoles()),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddWorkPage);
