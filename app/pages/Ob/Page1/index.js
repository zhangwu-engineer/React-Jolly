// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import FreelancerOnboardingCity from 'containers/FreelancerOnboarding/City';
import BusinessOnboardingCity from 'containers/BusinessOnboarding/City';

type Props = {
  user: Object,
};

class ObPage1 extends Component<Props> {
  render() {
    const { user } = this.props;
    const isBusiness = user && user.get('isBusiness');
    if (isBusiness) {
      return <BusinessOnboardingCity />;
    }
    return <FreelancerOnboardingCity />;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

export default connect(
  mapStateToProps,
  null
)(ObPage1);
