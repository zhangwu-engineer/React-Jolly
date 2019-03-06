// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Link from 'components/Link';
import UserCard from 'components/UserCard';
import ConnectionCard from 'components/ConnectionCard';
import VouchInviteFormModal from 'components/VouchInviteFormModal';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';

import { requestCityUsers, requestSignupInvite } from 'containers/App/sagas';
import saga, {
  reducer,
  requestCreateConnection,
  requestRemoveConnection,
  requestAcceptConnection,
  requestConnections,
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
      paddingBottom: 50,
    },
  },
  leftPanel: {
    width: 254,
    marginRight: 27,
    paddingTop: 70,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallCoworkersBox: {
    display: 'none',
    backgroundColor: theme.palette.common.white,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    borderBottom: 'solid 1px rgba(0, 117, 216, 0.21)',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  coworkersBox: {
    backgroundColor: theme.palette.common.white,
    padding: 25,
    paddingRight: 2,
    marginBottom: 12,
  },
  coworkersTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    textTransform: 'none',
  },
  inviteBox: {
    backgroundColor: theme.palette.common.white,
    padding: '23px 16px 13px 16px',
  },
  rightPanel: {
    flex: 1,
    paddingTop: 30,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  },
  pendingConnectionsTitle: {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#272727',
    paddingBottom: 15,
    [theme.breakpoints.down('xs')]: {
      fontWeight: 600,
      letterSpacing: 0.3,
    },
  },
  pendingConnections: {
    marginBottom: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#1b1b1b',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 600,
      letterSpacing: 0.3,
    },
  },
  loadMoreButton: {
    backgroundColor: theme.palette.common.white,
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.3,
    paddingTop: 20,
    paddingBottom: 20,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 15,
      paddingBottom: 15,
    },
  },
  emailCard: {
    padding: 0,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f1f1',
  },
  email: {
    fontSize: 14,
    fontWeight: 500,
    color: '#383838',
  },
  tabs: {
    backgroundColor: theme.palette.common.white,
    marginBottom: 3,
  },
  tab: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#4c4c4c',
    textTransform: 'none',
  },
  selectedTab: {
    fontWeight: 600,
    color: '#484848',
  },
  tabIndicator: {
    height: 3,
    backgroundColor: '#6b6b6b',
  },
});

type Props = {
  user: Object,
  cityUsers: List<Object>,
  total: number,
  page: number,
  isCityUsersLoading: boolean,
  cityUsersError: string,
  isSignupInviteLoading: boolean,
  signupInviteError: string,
  connections: List<Object>,
  isCreating: boolean,
  createError: string,
  isRemoving: boolean,
  removeError: string,
  isAccepting: boolean,
  acceptError: string,
  classes: Object,
  requestCityUsers: Function,
  requestSignupInvite: Function,
  requestCreateConnection: Function,
  requestRemoveConnection: Function,
  requestAcceptConnection: Function,
  requestConnections: Function,
};

type State = {
  isFormOpen: boolean,
  selectedUser: ?Object,
  initialValues: Object,
  jobs: Array<Object>,
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
  selectedUserIds: Array<string>,
  selectedTab: number,
};

class NetworkPage extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.isSignupInviteLoading) {
      return {
        isInviting: true,
      };
    }
    if (
      !nextProps.isSignupInviteLoading &&
      !nextProps.signupInviteError &&
      prevState.isInviting
    ) {
      return {
        showNotification: true,
        isInviting: false,
      };
    }
    if (
      !nextProps.isSignupInviteLoading &&
      nextProps.signupInviteError &&
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
    isFormOpen: false,
    selectedUser: null,
    selectedUserIds: [],
    sentTo: null,
    isInviting: false,
    showNotification: false,
    selectedTab: 0,
  };
  componentDidMount() {
    const { user } = this.props;
    if (user.getIn(['profile', 'location'])) {
      this.props.requestCityUsers(user.getIn(['profile', 'location']));
    }
    this.props.requestConnections();
  }
  componentDidUpdate(prevProps: Props) {
    const { isRemoving, removeError, isAccepting, acceptError } = this.props;
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestConnections();
    }
    if (prevProps.isAccepting && !isAccepting && !acceptError) {
      this.props.requestConnections();
    }
  }
  closeFormModal = () => {
    this.setState({ isFormOpen: false });
  };
  openFormModal = user => {
    this.setState({ selectedUser: user, isFormOpen: true });
  };
  handleConnectionInvite = user => {
    this.setState({ isFormOpen: false }, () => {
      this.props.requestCreateConnection(user.get('id'));
    });
  };
  handleSendInvite = email => {
    this.setState(
      update(this.state, {
        sentTo: { $set: email },
      }),
      () => {
        this.props.requestSignupInvite(email);
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
  handleChangeTab = (e, value) => {
    this.setState({ selectedTab: value });
  };
  render() {
    const { user, connections, cityUsers, classes } = this.props;
    const {
      isFormOpen,
      selectedUser,
      sentTo,
      isInviting,
      showNotification,
      selectedUserIds,
      selectedTab,
    } = this.state;
    const coworkersCount =
      connections &&
      connections.filter(connection => connection.get('status') === 'CONNECTED')
        .size;
    const pendingConnections =
      connections &&
      connections.filter(connection => connection.get('status') === 'PENDING');
    return (
      <React.Fragment>
        {showNotification && (
          <Notification
            msg={`Invite sent to ${sentTo}`}
            close={this.closeNotification}
          />
        )}
        <div className={classes.smallCoworkersBox}>
          <Link to="/network/coworkers" className={classes.coworkersTitle}>
            {`My Coworkers (${coworkersCount || 0})`}
          </Link>
        </div>
        <div className={classes.content}>
          <div className={classes.leftPanel}>
            <div className={classes.coworkersBox}>
              <Link to="/network/coworkers" className={classes.coworkersTitle}>
                {`My Coworkers (${coworkersCount || 0})`}
              </Link>
            </div>
            <div className={classes.inviteBox}>
              <InviteForm
                sendInvite={this.handleSendInvite}
                isInviting={isInviting}
              />
            </div>
          </div>
          <div className={classes.rightPanel}>
            {pendingConnections &&
              pendingConnections.size > 0 && (
                <React.Fragment>
                  <Grid container spacing={8}>
                    <Grid item xs={12} lg={12}>
                      <Typography className={classes.pendingConnectionsTitle}>
                        Pending Connections
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={8}
                    className={classes.pendingConnections}
                  >
                    {pendingConnections.map(connection => (
                      <Grid item key={generate()} xs={12} lg={12}>
                        <ConnectionCard
                          connection={connection}
                          ignore={this.props.requestRemoveConnection}
                          accept={this.props.requestAcceptConnection}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </React.Fragment>
              )}

            <Grid container spacing={8}>
              <Grid item xs={6} lg={6}>
                <Typography className={classes.title}>
                  Find coworkers
                </Typography>
              </Grid>
              <Grid item xs={6} lg={6} />
              <Grid item xs={12} lg={12}>
                <Tabs
                  value={selectedTab}
                  onChange={this.handleChangeTab}
                  classes={{
                    root: classes.tabs,
                    indicator: classes.tabIndicator,
                  }}
                >
                  <Tab
                    label="Nearby"
                    classes={{
                      root: classes.tab,
                      selected: classes.selectedTab,
                    }}
                  />
                  {/* <Tab
                    label="Recommended"
                    classes={{
                      root: classes.tab,
                      selected: classes.selectedTab,
                    }}
                  />
                  <Tab
                    label="Facebook Friends"
                    classes={{
                      root: classes.tab,
                      selected: classes.selectedTab,
                    }}
                  /> */}
                </Tabs>
              </Grid>
            </Grid>
            {selectedTab === 0 && (
              <Grid container spacing={8}>
                {cityUsers.map(cityUser => (
                  <Grid item key={generate()} xs={12} lg={6}>
                    <UserCard
                      user={cityUser}
                      onSelect={this.openFormModal}
                      selected={selectedUserIds.includes(cityUser.get('id'))}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        </div>
        <VouchInviteFormModal
          isOpen={isFormOpen}
          user={selectedUser}
          onCloseModal={this.closeFormModal}
          onInvite={this.handleConnectionInvite}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  cityUsers: state.getIn(['app', 'cityUsers', 'users']),
  total: state.getIn(['app', 'cityUsers', 'total']),
  page: state.getIn(['app', 'cityUsers', 'page']),
  isCityUsersLoading: state.getIn(['app', 'isCityUsersLoading']),
  cityUsersError: state.getIn(['app', 'cityUsersError']),
  isSignupInviteLoading: state.getIn(['app', 'isSignupInviteLoading']),
  signupInviteError: state.getIn(['app', 'signupInviteError']),
  connections: state.getIn(['network', 'connections']),
  isCreating: state.getIn(['network', 'isCreating']),
  createError: state.getIn(['network', 'createError']),
  isRemoving: state.getIn(['network', 'isRemoving']),
  removeError: state.getIn(['network', 'removeError']),
  isAccepting: state.getIn(['network', 'isAccepting']),
  acceptError: state.getIn(['network', 'acceptError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
  requestRemoveConnection: connectionId =>
    dispatch(requestRemoveConnection(connectionId)),
  requestAcceptConnection: connectionId =>
    dispatch(requestAcceptConnection(connectionId)),
  requestConnections: () => dispatch(requestConnections()),
  requestCityUsers: (city, page, usersPerPage) =>
    dispatch(requestCityUsers(city, page, usersPerPage)),
  requestSignupInvite: email => dispatch(requestSignupInvite(email)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(NetworkPage);
