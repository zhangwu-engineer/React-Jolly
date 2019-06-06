// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import cx from 'classnames';
import { debounce, capitalize } from 'lodash-es';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';

import Button from '@material-ui/core/Button';

import Link from 'components/Link';
import EditableInput from 'components/EditableInput';
import UserCard from 'components/UserCard';
import ConnectionCard from 'components/ConnectionCard';
import VouchInviteFormModal from 'components/VouchInviteFormModal';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';
import NetworkNav from 'components/NetworkNav';
import CustomSelect from 'components/CustomSelect';

import ROLES from 'enum/roles';

import { requestCityUsers, requestUserCoworkers } from 'containers/App/sagas';
import saga, {
  reducer,
  requestCreateConnection,
  requestRemoveConnection,
  requestAcceptConnection,
  requestConnections,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

const roles = ROLES.sort().map(role => ({ value: role, label: role }));
const perPage = 16;
const styles = theme => ({
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
    top: '25px',
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
});

type Props = {
  user: Object, // eslint-disable-line
  cityUsers: List<Object>,
  total: number, // eslint-disable-line
  page: number, // eslint-disable-line
  isCityUsersLoading: boolean, // eslint-disable-line
  cityUsersError: string, // eslint-disable-line
  coworkers: List<Object>,
  connections: List<Object>,
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  isRemoving: boolean,
  removeError: string,
  isAccepting: boolean,
  acceptError: string,
  classes: Object,
  requestCityUsers: Function,
  requestUserCoworkers: Function,
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
  connectedTo: ?string,
  invitedUserIds: Array<string>,
  selectedTab: number,
  filter: Object,
  query: string,
  page: number,
};

class NetworkPage extends Component<Props, State> {
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
    isFormOpen: false,
    selectedUser: null,
    invitedUserIds: [],
    sentTo: null,
    isInviting: false,
    showNotification: false,
    selectedTab: 0,
    query: '',
    filter: {
      location: '',
      selectedRole: '',
    },
    page: 1,
  };
  componentDidMount() {
    const { user } = this.props;
    const { query, filter, page } = this.state;
    if (user.getIn(['profile', 'location'])) {
      this.props.requestCityUsers(
        filter.location,
        query,
        page,
        perPage,
        filter.selectedRole
      );
    }
    this.props.requestConnections();
    this.props.requestUserCoworkers(user.get('slug'));
  }
  componentDidUpdate(prevProps: Props) {
    const {
      user,
      isRemoving,
      removeError,
      isAccepting,
      acceptError,
    } = this.props;
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestConnections();
      this.props.requestUserCoworkers(user.get('slug'));
    }
    if (prevProps.isAccepting && !isAccepting && !acceptError) {
      this.props.requestConnections();
      this.props.requestUserCoworkers(user.get('slug'));
    }
  }
  closeFormModal = () => {
    this.setState({ isFormOpen: false });
  };
  openFormModal = user => {
    this.setState({ selectedUser: user, isFormOpen: true });
  };
  handleConnectionInvite = user => {
    this.setState(
      update(this.state, {
        invitedUserIds: { $push: [user.get('id')] },
        connectedTo: { $set: capitalize(user.get('firstName')) },
        isFormOpen: { $set: false },
      }),
      () => {
        this.props.requestCreateConnection(user.get('id'));
      }
    );
  };
  handleSendInvite = email => {
    this.setState(
      update(this.state, {
        sentTo: { $set: email },
      }),
      () => {
        this.props.requestCreateConnection(email);
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
    });
  };
  handleChangeTab = (e, value) => {
    this.setState({ selectedTab: value });
  };
  filterRole = e => {
    const { id, value } = e.target;
    if (id) {
      this.setState(state => ({
        ...state,
        page: 1,
        filter: {
          ...state.filter,
          [id]: value,
        },
      }));
    }
  };
  debouncedSearch = debounce(() => {
    const { query, filter, page } = this.state;
    this.props.requestCityUsers(
      filter.location,
      query,
      page,
      perPage,
      filter.selectedRole
    );
  }, 500);
  handleChange = e => {
    e.persist();
    this.setState({ query: e.target.value, page: 1 }, () => {
      this.debouncedSearch();
    });
  };
  handleLocationChange = e => {
    const { id, value } = e.target;
    this.setState(
      state => ({
        ...state,
        filter: {
          ...state.filter,
          [id]: value,
        },
      }),
      () => {
        this.debouncedSearch();
      }
    );
  };
  handleRoleChange = role => {
    this.setState(
      state => ({
        ...state,
        page: 1,
        filter: {
          ...state.filter,
          selectedRole: role,
        },
      }),
      () => this.debouncedSearch()
    );
  };
  loadMoreData = () => {
    this.setState(
      state => ({
        ...state,
        page: state.page + 1,
      }),
      () => this.debouncedSearch()
    );
  };
  render() {
    const { coworkers, connections, cityUsers, classes, total } = this.props;
    const {
      isFormOpen,
      selectedUser,
      sentTo,
      isInviting,
      showNotification,
      invitedUserIds,
      connectedTo,
      selectedTab,
      query,
      filter,
      page,
    } = this.state;
    const pendingConnections =
      connections &&
      connections.filter(connection => connection.get('status') === 'PENDING');
    const coworkerIds = coworkers ? coworkers.map(c => c.get('id')).toJS() : [];
    const loadMore = total > page * perPage;
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
            msg={`Coworker connection request sent to ${connectedTo}`}
            close={this.closeConnectionNotification}
          />
        )}
        <div className={classes.content}>
          <div className={classes.leftPanel}>
            <Link
              to="/network/"
              className={`${classes.activeLink} ${classes.coworkersTitle}`}
            >
              <div className={`${classes.coworkersBox} ${classes.active}`}>
                Find Connections
              </div>
            </Link>
            <Link to="/network/coworkers" className={classes.coworkersTitle}>
              <div className={classes.coworkersBox}>
                {`My Connections ${coworkers ? `(${coworkers.size})` : ''}`}
              </div>
            </Link>
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
              <Grid item xs={6} lg={4}>
                <EditableInput
                  label="City"
                  id="location"
                  name="location"
                  value={filter.location}
                  onChange={this.handleLocationChange}
                  select
                />
              </Grid>
              <Grid item xs={6} lg={4} className={classes.searchInputWrapper}>
                <CustomSelect
                  placeholder="All Positions"
                  options={roles}
                  value={
                    filter.selectedRole
                      ? {
                          value: filter.selectedRole,
                          label: filter.selectedRole,
                        }
                      : null
                  }
                  onChange={value => this.handleRoleChange(value.value)}
                  isMulti={false}
                  isClearable={false}
                  stylesOverride={{
                    container: () => ({
                      backgroundColor: 'white',
                    }),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl classes={{ root: classes.formControl }} fullWidth>
                  <Input
                    value={query}
                    onChange={this.handleChange}
                    className={cx(classes.textInput, classes.hideForSmall)}
                    placeholder="Search by name"
                    fullWidth
                    startAdornment={
                      <InputAdornment
                        position="start"
                        className={classes.adornment}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                  <Input
                    value={query}
                    onChange={this.handleChange}
                    className={cx(classes.textInput, classes.showForSmall)}
                    placeholder="Search"
                    fullWidth
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
              </Grid>
            </Grid>
            {selectedTab === 0 && (
              <Grid container spacing={8}>
                {cityUsers.map(
                  cityUser =>
                    !coworkerIds.includes(cityUser.get('id')) ? (
                      <Grid item key={generate()} xs={12} lg={6}>
                        <UserCard
                          user={cityUser}
                          onSelect={this.openFormModal}
                          selected={invitedUserIds.includes(cityUser.get('id'))}
                        />
                      </Grid>
                    ) : null
                )}
              </Grid>
            )}
            {loadMore && (
              <Grid item xs={12} lg={12}>
                <Button
                  fullWidth
                  color="primary"
                  className={`${classes.loadMoreButton}`}
                  mt={1}
                  onClick={() => this.loadMoreData()}
                >
                  See More
                </Button>
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
  coworkers: state.getIn(['app', 'coworkers']),
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
  requestUserCoworkers: slug => dispatch(requestUserCoworkers(slug)),
  requestRemoveConnection: connectionId =>
    dispatch(requestRemoveConnection(connectionId)),
  requestAcceptConnection: connectionId =>
    dispatch(requestAcceptConnection(connectionId)),
  requestConnections: () => dispatch(requestConnections()),
  requestCityUsers: (city, query, page, usersPerPage, role) =>
    dispatch(requestCityUsers(city, query, page, usersPerPage, role)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(NetworkPage);
