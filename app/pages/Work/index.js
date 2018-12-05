// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import WorkForm from 'components/WorkForm';

type Props = {
  user: Object,
};

class AddWorkPage extends Component<Props> {
  render() {
    const { user } = this.props;
    return <WorkForm user={user} />;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddWorkPage);
