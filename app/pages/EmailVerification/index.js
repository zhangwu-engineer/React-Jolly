// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requestUserEmailVerification } from 'containers/App/sagas';

import { history } from 'components/ConnectedRouter';
import Preloader from 'components/Preloader';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  match: Object,
  requestUserEmailVerification: Function,
};

class EmailVerificationPage extends Component<Props> {
  componentDidMount() {
    const {
      match: {
        params: { token },
      },
    } = this.props;

    this.props.requestUserEmailVerification({ token });
  }
  componentDidUpdate(prevProps: Props) {
    const { user, isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      if (user) {
        history.push(`/f/${user.get('slug')}/edit`);
      } else {
        history.push('/sign-in');
      }
    }
  }
  render() {
    const { isLoading, error } = this.props;
    return (
      <div>
        {isLoading && <Preloader height={400} />}
        {error}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestUserEmailVerification: payload =>
    dispatch(requestUserEmailVerification(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailVerificationPage);
