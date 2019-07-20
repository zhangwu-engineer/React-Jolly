// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import NotificationForm from 'components/UserForm/Notification';

import { requestUserDataUpdate, requestUser } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#404040',
    padding: 20,
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
  requestUser: Function,
};

class NotificationSettingsPage extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  render() {
    const { user, classes } = this.props;
    return (
      <React.Fragment>
        <Typography variant="h1" className={classes.title}>
          Notification Settings
        </Typography>
        <div className={classes.root}>
          <NotificationForm user={user} updateUser={this.props.updateUser} />
        </div>
      </React.Fragment>
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
)(NotificationSettingsPage);
