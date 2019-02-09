// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import UserProfileForm from 'components/UserForm/Profile';

import { requestUserDataUpdate, requestUser } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
  requestUser: Function,
};

class ProfileSettingsPage extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  render() {
    const { user, classes } = this.props;
    return (
      <div className={classes.root}>
        <UserProfileForm user={user} updateUser={this.props.updateUser} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(ProfileSettingsPage);
