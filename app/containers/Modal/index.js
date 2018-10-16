// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import FormModal from 'components/FormModal';
import MODAL from 'enum/modals';

import { requestRegister } from 'containers/App/sagas';

type Props = {
  isLoading: boolean,
  user: Object,
  error: string,
  requestRegister: Function,
  replace: Function,
  openModal: Function,
  onCloseModal: Function,
  modal: string,
  requestRegisterEmail: Function,
  requestLogin: Function,
};

class ModalContainer extends Component<Props, {}> {
  render() {
    const { modal } = this.props;
    return null;
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['app', 'isLoading']),
  user: state.getIn(['app', 'user']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (payload, type) => dispatch(requestRegister(payload, type)),
  replace: path => dispatch(replace(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer);
