// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import cx from 'classnames';
import { capitalize, debounce } from 'lodash-es';

import Link from 'components/Link';
import CoworkerCard from 'components/CoworkerCard';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';
import NetworkNav from 'components/NetworkNav';
import CustomSelect from 'components/CustomSelect';
import EditableInput from 'components/EditableInput';

import ROLES from 'enum/roles';
import CONNECTIONS from 'enum/connections';

import { requestUserCoworkers } from 'containers/App/sagas';
import saga, {
  reducer,
  requestCreateConnection,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

const roles = ROLES.sort().map(role => ({ value: role, label: role }));
const connections = CONNECTIONS.sort().map(connection => ({ value: connection, label: connection }));
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
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
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
    marginTop: 5,
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
  active: {
    backgroundColor: '#1575d9',
  },
  activeLink: {
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      color: theme.palette.common.white,
    },
  },
  searchInputWrapper: {
    position: 'relative',
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
  filterWrapper: {
    marginTop: 21,
  },
  filterWrapperMobile: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  selectedTab: {
    fontWeight: 600,
    color: '#484848',
  },
  editableInput: {
    backgroundColor: 'white',
  },
});

type Props = {
  user: Object, // eslint-disable-line
  coworkers: List<Object>,
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  isRemoving: boolean,
  removeError: string,
  isAccepting: boolean,
  acceptError: string,
  classes: Object,
  requestUserCoworkers: Function,
  requestCreateConnection: Function,
};

type State = {
  isFormOpen: boolean,
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
  connectedTo: ?string,
  invitedUserIds: Array<string>,
  selectedTab: number,
  filter: Object,
  query: string,
};

class CoworkersPage extends Component<Props, State> {
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
    selectedTab: 1,
    query: '',
    filter: {
      location: '',
      selectedRole: '',
      connections: '',
    },
  };
  componentDidMount() {
    const { user } = this.props;
    const { query, filter } = this.state;
    this.props.requestUserCoworkers(
      user.get('slug'),
      filter.location,
      query,
      filter.selectedRole
    );
  }
  componentDidUpdate(prevProps: Props) {
    const { query, filter } = this.state;
    const {
      user,
      isRemoving,
      removeError,
      isAccepting,
      acceptError,
    } = this.props;
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestUserCoworkers(
        user.get('slug'),
        filter.location,
        query,
        filter.selectedRole
      );
    }
    if (prevProps.isAccepting && !isAccepting && !acceptError) {
      this.props.requestUserCoworkers(
        user.get('slug'),
        filter.location,
        query,
        filter.selectedRole
      );
    }
  }
  debouncedSearch = debounce(() => {
    const { query, filter } = this.state;
    const { user } = this.props;
    this.props.requestUserCoworkers(
      user.get('slug'),
      filter.location,
      query,
      filter.selectedRole
    );
  }, 500);
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
  handleChange = e => {
    e.persist();
    this.setState({ query: e.target.value }, () => {
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
        filter: {
          ...state.filter,
          selectedRole: role,
        },
      }),
      () => this.debouncedSearch()
    );
  };
  handleConnectionsChange = connection => {
    this.setState(
      state => ({
        ...state,
        filter: {
          ...state.filter,
          connections: connection,
        },
      }),
      () => this.debouncedSearch()
    );
  };

  render() {
    const { coworkers, classes } = this.props;
    const {
      sentTo,
      isInviting,
      showNotification,
      selectedTab,
      connectedTo,
      query,
      filter,
    } = this.state;
    return (
      <React.Fragment>
        <NetworkNav />
        {showNotification && (
          <Notification
            msg={`Invite sent to ${sentTo}`}
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
            <Link to="/network" className={classes.coworkersTitle}>
              <div className={classes.coworkersBox}>Find Connections</div>
            </Link>
            <Link
              to="/network/connections"
              className={`${classes.activeLink} ${classes.coworkersTitle}`}
            >
              <div className={`${classes.coworkersBox} ${classes.active}`}>
                My Connections
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
            <Grid container spacing={8} className={classes.filterWrapperMobile}>
              <Grid item xs={12} lg={12}>
                <Grid container spacing={8} justify="flex-end">
                  <Grid item xs={12} lg={4}>
                    <FormControl
                      classes={{ root: classes.formControl }}
                      fullWidth
                    >
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
              </Grid>
              <Grid item xs={12} lg={12} className={classes.filterWrapper}>
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
                  <Grid
                    item
                    xs={6}
                    lg={4}
                    className={classes.searchInputWrapper}
                  >
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
                  <Grid
                    item
                    xs={12}
                    lg={4}
                    className={classes.searchInputWrapper}
                  >
                    <CustomSelect
                      placeholder="All Connections"
                      options={connections}
                      value={
                        filter.connections
                          ? {
                              value: filter.connections,
                              label: filter.connections,
                            }
                          : null
                      }
                      onChange={value => this.handleConnectionsChange(value.value)}
                      isMulti={false}
                      isClearable={false}
                      isSearchable={false}
                      stylesOverride={{
                        container: () => ({
                          backgroundColor: 'white',
                        }),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {selectedTab === 1 && (
              <Grid container spacing={8}>
                {coworkers &&
                  coworkers.map(coworker => (
                    <Grid item key={generate()} xs={12} lg={6}>
                      <CoworkerCard user={coworker} />
                    </Grid>
                  ))}
              </Grid>
            )}
            {coworkers &&
              coworkers.size === 0 && (
                <Grid container spacing={8}>
                  <Grid item xs={12} lg={12}>
                    <div className={classes.emptyCoworkersPanel}>
                      <div className={classes.emptyCoworkers}>
                        <Typography className={classes.descText}>
                          Build your network to <br />
                          find your next gig &amp; stay in the know!
                        </Typography>
                        <Link to="/network" className={classes.coworkersTitle}>
                          Find Connections
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
  coworkers: state.getIn(['app', 'coworkers']),
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
  requestUserCoworkers: (slug, city, query, role) =>
    dispatch(requestUserCoworkers(slug, city, query, role)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(CoworkersPage);
