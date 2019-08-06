// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import BusinessPositionsForm from 'components/BusinessPositionsForm';

import { requestUser } from 'containers/App/sagas';

const styles = () => ({});

type Props = {
  user: Object,
  requestUser: Function,
};

class BusinessSettingsPositions extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  render() {
    const { user } = this.props;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    return (
      <React.Fragment>
        <BusinessPositionsForm business={currentBusiness} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessSettingsPositions);
