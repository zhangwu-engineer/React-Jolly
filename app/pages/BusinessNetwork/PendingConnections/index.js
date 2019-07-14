// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import BusinessSidebar from 'components/BusinessSidebar';
import ConnectionCard from 'components/ConnectionCard';
import Notification from 'components/Notification';
import NetworkNav from 'components/NetworkNav';
import { CONNECTION_REQUEST_MSG } from 'enum/connection';

import saga, {
  reducer,
  requestRemoveConnection,
  requestAcceptConnection,
  requestBusinessConnections,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    maxWidth: 1064,
    margin: '0 auto',
    display: 'flex',
    marginTop: 70,
    paddingBottom: 137,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingBottom: 50,
    },
  },
  businessSidebar: {
    width: 291,
    left: 0,
    minHeight: '100vh',
    background: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  leftPanel: {
    width: 353,
    marginRight: 26,
    paddingTop: 70,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
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
    paddingTop: 70,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 30,
    },
  },
  filterContainer: {
    marginBottom: 10,
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
  findTitle: {
    fontWeight: 600,
    letterSpacing: 0.33,
    marginBottom: 18,
    height: 19,
    color: '#272727',
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
    marginTop: 10,
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
  formControl: {
    marginBottom: 10,
  },
  textInput: {
    top: 9,
    fontSize: 14,
    fontWeight: 500,
    color: '#484848',
    '&:before': {
      borderBottom: '2px solid #4a4a4a',
    },
    '& input': {
      paddingTop: 5,
      '&::placeholder': {
        color: '#484848',
        opacity: 1,
      },
    },
    [theme.breakpoints.down('xs')]: {
      top: 0,
      width: '100%',
    },
  },
  adornment: {
    position: 'relative',
    top: -3,
  },
  hideForSmall: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  showForSmall: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
    },
  },
  searchInputWrapper: {
    position: 'relative',
  },
  searchResultList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    maxHeight: 200,
    top: '60px',
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  active: {
    backgroundColor: '#1575d9',
  },
  activeLink: {
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      color: theme.palette.common.white,
    },
  },
  progressContainer: {
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1000,
    marginLeft: -24,
  },
});

type Props = {
  user: Object, // eslint-disable-line
  connections: List<Object>,
  isRemoving: boolean,
  removeError: string,
  isAccepting: boolean,
  acceptError: string,
  classes: Object,
  requestRemoveConnection: Function,
  requestAcceptConnection: Function,
  requestBusinessConnections: Function,
};

type State = {
  sentTo: ?string,
  showNotification: boolean,
};

class PendingConnections extends Component<Props, State> {
  state = {
    sentTo: null,
    showNotification: false,
  };
  componentDidMount() {
    const { user } = this.props;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];
    this.props.requestBusinessConnections(currentBusiness.id);
    window.localStorage.setItem('isBusinessActive', 'yes');
  }
  componentDidUpdate(prevProps: Props) {
    const { user } = this.props;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    const { isRemoving, removeError, isAccepting, acceptError } = this.props;
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestBusinessConnections(currentBusiness.id);
    }
    if (prevProps.isAccepting && !isAccepting && !acceptError) {
      this.props.requestBusinessConnections(currentBusiness.id);
    }
  }
  closeNotification = () => {
    this.setState({
      sentTo: null,
      showNotification: false,
    });
  };
  closeConnectionNotification = () => {
    this.setState({
      connectedTo: null,
    });
  };
  render() {
    const { connections, classes, user } = this.props;
    const { sentTo, showNotification, connectedTo } = this.state;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    const pendingConnections =
      connections &&
      connections.filter(connection => connection.get('status') === 'PENDING');
    return (
      <React.Fragment>
        <NetworkNav />
        {showNotification && (
          <Notification
            msg={`Coworker connection request sent to ${sentTo}`}
            close={this.closeNotification}
          />
        )}
        {connectedTo && (
          <Notification
            msg={`${CONNECTION_REQUEST_MSG} to ${connectedTo}`}
            close={this.closeConnectionNotification}
          />
        )}
        <div className={classes.root}>
          {currentBusiness && (
            <div className={classes.businessSidebar}>
              <BusinessSidebar business={currentBusiness} />
            </div>
          )}
          <div className={classes.content}>
            <div>
              <Typography className={classes.pendingConnectionsTitle}>
                Pending freelancer connections &nbsp;
                {pendingConnections && pendingConnections.size}
              </Typography>
              {pendingConnections &&
                pendingConnections.size > 0 && (
                  <React.Fragment>
                    <Grid
                      container
                      spacing={8}
                      className={classes.pendingConnections}
                    >
                      {pendingConnections.map(connection => (
                        <Grid item key={generate()} xs={12} lg={12}>
                          {connection.get('connectionType') === 'f2b' && (
                            <ConnectionCard
                              connection={connection}
                              ignore={this.props.requestRemoveConnection}
                              accept={this.props.requestAcceptConnection}
                            />
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </React.Fragment>
                )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  connections: state.getIn(['network', 'connections']),
  isRemoving: state.getIn(['network', 'isRemoving']),
  removeError: state.getIn(['network', 'removeError']),
  isAccepting: state.getIn(['network', 'isAccepting']),
  acceptError: state.getIn(['network', 'acceptError']),
});

const mapDispatchToProps = dispatch => ({
  requestRemoveConnection: connectionId =>
    dispatch(requestRemoveConnection(connectionId)),
  requestAcceptConnection: connectionId =>
    dispatch(requestAcceptConnection(connectionId)),
  requestBusinessConnections: businessId =>
    dispatch(requestBusinessConnections(businessId)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(PendingConnections);
