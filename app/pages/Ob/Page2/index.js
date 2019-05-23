// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import FreelancerOnboardingCoworker from 'containers/FreelancerOnboarding/Coworker';
import BusinessOnboardingPosition from 'containers/BusinessOnboarding/Position';

type Props = {
  user: Object,
};

class ObPage2 extends Component<Props> {
  render() {
    const { user } = this.props;
    const isBusiness = user.get('role') === 'BUSINESS';
    if (isBusiness) {
      return <BusinessOnboardingPosition />;
    }
    return <FreelancerOnboardingCoworker />;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

export default connect(
  mapStateToProps,
  null
)(ObPage2);
