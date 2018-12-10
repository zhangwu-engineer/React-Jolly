// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import WorkForm from 'components/WorkForm';

import saga, { reducer, requestRoles } from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

type Props = {
  user: Object,
  roles: Object,
  // isRolesLoading: boolean,
  // rolesError: string,
  requestRoles: Function,
};

class AddWorkPage extends Component<Props> {
  componentDidMount() {
    this.props.requestRoles();
  }
  render() {
    const { user, roles } = this.props;
    return <WorkForm user={user} roles={roles} />;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  roles: state.getIn(['work', 'roles']),
  isRolesLoading: state.getIn(['work', 'isRolesLoading']),
  rolesError: state.getIn(['work', 'rolesError']),
});

const mapDispatchToProps = dispatch => ({
  requestRoles: () => dispatch(requestRoles()),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddWorkPage);
