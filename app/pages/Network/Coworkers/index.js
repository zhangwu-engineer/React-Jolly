// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { fromJS } from 'immutable';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import CoworkerCard from 'components/CoworkerCard';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';

import { requestSignupInvite } from 'containers/App/sagas';
import saga, { reducer, requestConnections } from 'containers/Network/sagas';
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
    paddingTop: 30,
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
    paddingTop: 30,
    paddingBottom: 20,
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
  emptyCoworkersPanel: {
    backgroundColor: theme.palette.common.white,
    height: 356,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 190,
    },
  },
  emptyCoworkers: {
    textAlign: 'center',
  },
  descText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.5,
    color: '#2f2f2f',
    maxWidth: 280,
    textAlign: 'center',
    marginBottom: 20,
  },
});

type Props = {
  user: Object,
  isSignupInviteLoading: boolean,
  signupInviteError: string,
  connections: List<Object>,
  classes: Object,
  requestSignupInvite: Function,
  requestConnections: Function,
};

type State = {
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
  invitedEmails: Array<string>,
};

class CoworkersPage extends Component<Props, State> {
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
    invitedEmails: [],
    sentTo: null,
    isInviting: false,
    showNotification: false,
  };
  componentDidMount() {
    this.props.requestConnections();
  }
  handleSendInvite = email => {
    this.setState(
      update(this.state, {
        invitedEmails: { $push: [email] },
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
  render() {
    const { user, connections, classes } = this.props;
    const { sentTo, isInviting, showNotification } = this.state;
    const coworkersCount =
      connections &&
      connections.filter(connection => connection.get('status') === 'CONNECTED')
        .size;
    return (
      <React.Fragment>
        {showNotification && (
          <Notification
            msg={`Invite sent to ${sentTo}`}
            close={this.closeNotification}
          />
        )}
        <div className={classes.smallCoworkersBox}>
          <Link to="/network" className={classes.coworkersTitle}>
            Find Coworkers
          </Link>
        </div>
        <div className={classes.content}>
          <div className={classes.leftPanel}>
            <div className={classes.coworkersBox}>
              <Link to="/network" className={classes.coworkersTitle}>
                Find Coworkers
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
            <Grid container spacing={8}>
              <Grid item xs={12} lg={12}>
                <Typography className={classes.title}>
                  {`${coworkersCount} Coworkers`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              {connections &&
                connections.map(
                  connection =>
                    connection.get('status') === 'CONNECTED' ? (
                      <Grid item key={generate()} xs={12} lg={12}>
                        <CoworkerCard user={connection.get('from')} />
                      </Grid>
                    ) : null
                )}
            </Grid>
            {coworkersCount === 0 && (
              <Grid container spacing={8}>
                <Grid item xs={12} lg={12}>
                  <div className={classes.emptyCoworkersPanel}>
                    <div className={classes.emptyCoworkers}>
                      <Typography className={classes.descText}>
                        Build your network to <br />
                        find your next gig &amp; stay in the know!
                      </Typography>
                      <Link to="/network" className={classes.coworkersTitle}>
                        Find Coworkers
                      </Link>
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isSignupInviteLoading: state.getIn(['app', 'isSignupInviteLoading']),
  signupInviteError: state.getIn(['app', 'signupInviteError']),
  connections: state.getIn(['network', 'connections']),
});

const mapDispatchToProps = dispatch => ({
  requestConnections: () => dispatch(requestConnections()),
  requestSignupInvite: email => dispatch(requestSignupInvite(email)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(CoworkersPage);
