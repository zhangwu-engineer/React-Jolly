// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';

import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';
import NetworkNav from 'components/NetworkNav';

import saga, {
  reducer,
  requestCreateConnection,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  content: {
    maxWidth: 830,
    margin: '0 auto',
    display: 'flex',
    paddingBottom: 137,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      padding: '20px 10px',
    },
  },
  inviteBox: {
    backgroundColor: theme.palette.common.white,
    padding: '23px 16px 13px 16px',
  },
});

type Props = {
  user: Object, // eslint-disable-line
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  classes: Object,
  requestCreateConnection: Function,
};

type State = {
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
};

class NetworkInvitePage extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.isCreating && prevState.sentTo) {
      return {
        isInviting: true,
      };
    }
    if (
      !nextProps.isCreating &&
      !nextProps.createError &&
      prevState.isInviting
    ) {
      return {
        showNotification: true,
        isInviting: false,
      };
    }
    if (
      !nextProps.isCreating &&
      nextProps.createError &&
      prevState.isInviting
    ) {
      return {
        sentTo: null,
        showNotification: false,
        isInviting: false,
      };
    }
    return null;
  }
  state = {
    sentTo: null,
    isInviting: false,
    showNotification: false,
  };
  handleSendInvite = email => {
    this.setState(
      update(this.state, {
        sentTo: { $set: email },
      }),
      () => {
        this.props.requestCreateConnection({ email });
      }
    );
  };
  closeNotification = () => {
    this.setState({
      sentTo: null,
      isInviting: false,
      showNotification: false,
    });
  };
  render() {
    const { classes } = this.props;
    const { sentTo, isInviting, showNotification } = this.state;
    return (
      <React.Fragment>
        <NetworkNav />
        {showNotification && (
          <Notification
            msg={`Coworker connection request sent to ${sentTo}`}
            close={this.closeNotification}
          />
        )}
        <div className={classes.content}>
          <div className={classes.inviteBox}>
            <InviteForm
              sendInvite={this.handleSendInvite}
              isInviting={isInviting}
              text="Meet someone new?<br/>Invite them to connect with you<br/>as coworkers on Jolly"
              buttonTitle="Send Invitation"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isCreating: state.getIn(['network', 'isCreating']),
  createError: state.getIn(['network', 'createError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(NetworkInvitePage);
