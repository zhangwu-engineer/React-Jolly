// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { debounce, capitalize } from 'lodash-es';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import UserCard from 'components/UserCard';
import OnboardingSkipModal from 'components/OnboardingSkipModal';
import VouchInviteFormModal from 'components/VouchInviteFormModal';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';
import UserAvatar from 'components/UserAvatar';

import { requestCityUsers, requestSignupInvite } from 'containers/App/sagas';
import saga, {
  reducer,
  requestCreateConnection,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

const perPage = 8;
const styles = theme => ({
  banner: {
    backgroundColor: theme.palette.common.darkBlue,
    paddingTop: 50,
    paddingBottom: 30,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '35px 20px 40px 20px',
    },
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 1.46,
    letterSpacing: 0.6,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: 1.94,
      letterSpacing: 0.4,
    },
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: theme.palette.common.white,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      lineHeight: 1.75,
      letterSpacing: 0.4,
    },
  },
  skip: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: theme.palette.common.white,
    textTransform: 'none',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      letterSpacing: 0.4,
    },
  },
  content: {
    maxWidth: 1064,
    margin: '0 auto',
    display: 'flex',
    paddingBottom: 137,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingBottom: 50,
    },
  },
  leftPanel: {
    width: 353,
    marginRight: 26,
    paddingTop: 100,
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
    fontWeight: 500,
    color: '#4a4a4a',
    marginBottom: 20,
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
  title: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: '#1b1b1b',
    marginTop: 40,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      letterSpacing: 0.3,
      marginTop: 30,
      marginBottom: 20,
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
  nextButtonWrapper: {
    textAlign: 'right',
  },
  nextButton: {
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 70px',
    marginTop: 12,
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
    },
  },
  emailCard: {
    padding: 0,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  email: {
    fontSize: 14,
    fontWeight: 500,
    color: '#383838',
  },
  formControl: {
    backgroundColor: theme.palette.common.white,
    marginTop: 20,
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
  },
  textInput: {
    paddingLeft: 18,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 600,
    color: '#555555',
    '& input': {
      paddingTop: 5,
      paddingBottom: 20,
      '&::placeholder': {
        color: '#555555',
        opacity: 1,
      },
    },
  },
  adornment: {
    position: 'relative',
    top: -8,
  },
});

type Props = {
  user: Object,
  cityUsers: List<Object>,
  total: number,
  page: number,
  isCityUsersLoading: boolean,
  cityUsersError: string,
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  isSignupInviteLoading: boolean, // eslint-disable-line
  signupInviteError: string, // eslint-disable-line
  classes: Object,
  requestCityUsers: Function,
  requestSignupInvite: Function,
  requestCreateConnection: Function,
};

type State = {
  isSkipOpen: boolean,
  isFormOpen: boolean,
  selectedUser: ?Object,
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
  connectedTo: ?string,
  isConnecting: boolean,
  showConnectionNotification: boolean,
  invitedUserIds: Array<string>,
  invitedEmails: Array<string>,
  query: string,
};

class OnboardingCoworkerPage extends Component<Props, State> {
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
    // if (nextProps.isCreating && prevState.connectedTo) {
    //   return {
    //     isConnecting: true,
    //   };
    // }
    // if (
    //   !nextProps.isCreating &&
    //   !nextProps.createError &&
    //   prevState.isConnecting
    // ) {
    //   return {
    //     showConnectionNotification: true,
    //     isConnecting: false,
    //   };
    // }
    // if (
    //   !nextProps.isCreating &&
    //   nextProps.createError &&
    //   prevState.isConnecting
    // ) {
    //   return {
    //     connectedTo: null,
    //     showConnectionNotification: false,
    //     isConnecting: false,
    //   };
    // }
    return null;
  }
  state = {
    isSkipOpen: false,
    isFormOpen: false,
    selectedUser: null,
    invitedUserIds: [],
    invitedEmails: [],
    sentTo: null,
    isInviting: false,
    showNotification: false,
    isConnecting: false, // eslint-disable-line
    connectedTo: null,
    showConnectionNotification: false, // eslint-disable-line
    query: '',
  };
  componentDidMount() {
    const { user, page } = this.props;
    const { query } = this.state;
    if (user.getIn(['profile', 'location'])) {
      this.props.requestCityUsers('', query, page || 1, perPage);
    } else {
      history.push(`/f/${user.get('slug')}`);
    }
  }
  componentDidUpdate(prevProps: Props) {
    const { cityUsers, isCityUsersLoading, cityUsersError } = this.props;
    const { query } = this.state;
    if (
      prevProps.isCityUsersLoading &&
      !isCityUsersLoading &&
      !cityUsersError &&
      cityUsers.size === 0 &&
      query === ''
    ) {
      history.push('/ob/3');
    }
  }
  openSkipModal = () => {
    this.setState({ isSkipOpen: true });
  };
  closeSkipModal = () => {
    this.setState({ isSkipOpen: false });
  };
  closeFormModal = () => {
    this.setState({ isFormOpen: false });
  };
  openFormModal = user => {
    this.setState({ selectedUser: user, isFormOpen: true });
  };
  handleNext = () => {
    const { invitedUserIds, invitedEmails } = this.state;
    if (invitedUserIds.length === 0 && invitedEmails.length === 0) {
      this.setState({ isSkipOpen: true });
    } else {
      history.push('/ob/3');
    }
  };
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
  closeConnectionNotification = () => {
    this.setState({
      connectedTo: null,
      isConnecting: false, // eslint-disable-line
      showConnectionNotification: false, // eslint-disable-line
    });
  };
  handleConnectionInvite = (user, isCoworker) => {
    this.setState(
      update(this.state, {
        invitedUserIds: { $push: [user.get('id')] },
        connectedTo: { $set: capitalize(user.get('firstName')) },
        isFormOpen: { $set: false },
      }),
      () => {
        this.props.requestCreateConnection({
          toUserId: user.get('id'),
          isCoworker,
        });
      }
    );
  };
  debouncedSearch = debounce(query => {
    this.props.requestCityUsers('', query, 1, perPage);
  }, 500);
  handleChange = e => {
    e.persist();
    this.setState({ query: e.target.value }, () => {
      this.debouncedSearch(e.target.value);
    });
  };
  render() {
    const { cityUsers, page, total, classes } = this.props;
    const {
      isSkipOpen,
      isFormOpen,
      selectedUser,
      sentTo,
      isInviting,
      showNotification,
      connectedTo,
      invitedEmails,
      invitedUserIds,
      query,
    } = this.state;
    const loadMore = total > page * perPage;
    return (
      <React.Fragment>
        <div className={classes.banner}>
          <Typography className={classes.bannerTitle} align="center">
            Start Connecting to Find Opportunities
          </Typography>
          <Typography className={classes.text} align="center">
            Your connections can recommend you and help find your next gig!
          </Typography>
          <Link className={classes.skip} onClick={this.openSkipModal}>
            Skip this Step
          </Link>
        </div>
        {showNotification && (
          <Notification
            msg={`Invite sent to ${sentTo}`}
            close={this.closeNotification}
          />
        )}
        {connectedTo && (
          <Notification
            msg={`Connection request sent to ${connectedTo}`}
            close={this.closeConnectionNotification}
          />
        )}
        <div className={classes.content}>
          <div className={classes.leftPanel}>
            <div className={classes.coworkersBox}>
              <Typography className={classes.coworkersTitle}>
                Connections
              </Typography>
              {cityUsers.map(
                cityUser =>
                  invitedUserIds.includes(cityUser.get('id')) ? (
                    <UserCard
                      key={generate()}
                      user={cityUser}
                      onSelect={this.openFormModal}
                      size="small"
                    />
                  ) : null
              )}
              {invitedEmails.map(email => (
                <ListItem key={generate()} className={classes.emailCard}>
                  <UserAvatar className={classes.avatar} />
                  <ListItemText
                    primary={
                      email.length > 18 ? `${email.substr(0, 18)}...` : email
                    }
                    classes={{ primary: classes.email }}
                  />
                </ListItem>
              ))}
            </div>
            <div className={classes.inviteBox}>
              <InviteForm
                sendInvite={this.handleSendInvite}
                isInviting={isInviting}
              />
            </div>
          </div>
          <div className={classes.rightPanel}>
            <FormControl classes={{ root: classes.formControl }} fullWidth>
              <Input
                value={query}
                onChange={this.handleChange}
                className={classes.textInput}
                placeholder="Search Jolly for Connections"
                fullWidth
                disableUnderline
                startAdornment={
                  <InputAdornment
                    position="start"
                    className={classes.adornment}
                  >
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <Typography className={classes.title}>Find connections</Typography>
            <Grid container spacing={8}>
              {cityUsers.map(cityUser => (
                <Grid item key={generate()} xs={12} lg={6}>
                  <UserCard
                    user={cityUser}
                    onSelect={this.openFormModal}
                    selected={invitedUserIds.includes(cityUser.get('id'))}
                  />
                </Grid>
              ))}
              {loadMore && (
                <Grid item xs={12} lg={12}>
                  <Button
                    fullWidth
                    color="primary"
                    className={classes.loadMoreButton}
                    onClick={() => {
                      this.props.requestCityUsers('', query, page + 1, perPage);
                    }}
                  >
                    See More
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} lg={12} className={classes.nextButtonWrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.nextButton}
                  onClick={this.handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
        <OnboardingSkipModal
          isOpen={isSkipOpen}
          onCloseModal={this.closeSkipModal}
        />
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
  isCreating: state.getIn(['network', 'isCreating']),
  createError: state.getIn(['network', 'createError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateConnection: payload =>
    dispatch(requestCreateConnection(payload)),
  requestCityUsers: (city, query, page, usersPerPage) =>
    dispatch(requestCityUsers(city, query, page, usersPerPage)),
  requestSignupInvite: email => dispatch(requestSignupInvite(email)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OnboardingCoworkerPage);
