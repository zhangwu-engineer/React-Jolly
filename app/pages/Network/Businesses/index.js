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

import { history } from 'components/ConnectedRouter';
import Preloader from 'components/Preloader';
import Link from 'components/Link';
import Tabs from 'components/Tabs';
import EditableInput from 'components/EditableInput';
import BusinessCard from 'components/BusinessCard';
import ConnectionCard from 'components/ConnectionCard';
import ConnectionFromBusinessCard from 'components/ConnectionFromBusinessCard';
import VouchBusinessInviteFormModal from 'components/VouchBusinessInviteFormModal';
import InviteForm from 'components/InviteForm';
import Notification from 'components/Notification';
import NetworkNav from 'components/NetworkNav';
import CustomSelect from 'components/CustomSelect';

import ROLES from 'enum/roles';
import ConnectionTabs from 'enum/ConnectionTabs';

import { requestCityBusinesses } from 'containers/App/sagas';
import saga, {
  reducer,
  requestCreateConnection,
  requestRemoveConnection,
  requestAcceptConnection,
  requestConnections,
} from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

let roles = ROLES.sort().map(role => ({ value: role, label: role }));
roles = [{ value: '', label: 'All Positions' }].concat(roles);
const mailTo = 'mailto:community@jollyhq.com';

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
  underContructionPanel: {
    backgroundColor: theme.palette.common.white,
    height: 356,
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 300,
    },
  },
  emptyPanel: {
    backgroundColor: theme.palette.common.white,
    height: 356,
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 300,
    },
  },
  underConstruction: {
    textAlign: 'center',
  },
  setUpInterviewButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    padding: '11px 35px',
    marginTop: 40,
    borderRadius: 0,
    boxShadow: 'none',
  },
  emptyContainer: {
    textAlign: 'center',
  },
  panelButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    padding: '11px 35px',
    marginTop: 40,
    borderRadius: 0,
    boxShadow: 'none',
  },
  alertHeading: {
    marginBottom: 12,
  },
  mailToLink: {
    fontSize: 14,
    color: 'white',
    textDecoration: 'none',
    textTransform: 'none',
    '&:hover': {
      color: 'white',
    },
  },
});

type Props = {
  user: Object, // eslint-disable-line
  cityBusinesses: List<Object>,
  total: number, // eslint-disable-line
  page: number, // eslint-disable-line
  isCityBusinessesLoading: boolean, // eslint-disable-line
  cityBusinessesError: string, // eslint-disable-line
  connections: List<Object>,
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  isRemoving: boolean,
  removeError: string,
  isAccepting: boolean,
  acceptError: string,
  classes: Object,
  requestCityBusinesses: Function,
  requestCreateConnection: Function,
  requestRemoveConnection: Function,
  requestAcceptConnection: Function,
  requestConnections: Function,
};

type State = {
  isFormOpen: boolean,
  selectedBusiness: ?Object,
  initialValues: Object,
  jobs: Array<Object>,
  sentTo: ?string,
  isInviting: boolean,
  showNotification: boolean,
  connectedTo: ?string,
  invitedBusinessIds: Array<string>,
  selectedTab: number,
  filter: Object,
  query: string,
  page: number,
  isUnderConstruction: boolean,
};

class NetworkBusinessesPage extends Component<Props, State> {
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
    selectedBusiness: null,
    invitedBusinessIds: [],
    sentTo: null,
    isInviting: false,
    isCoworker: false,
    showNotification: false,
    query: '',
    filter: {
      location: '',
      selectedRole: '',
    },
    page: 1,
    isUnderConstruction: false,
  };
  componentDidMount() {
    const { user } = this.props;
    const { query, filter, page } = this.state;
    if (user.getIn(['profile', 'location'])) {
      this.props.requestCityBusinesses(
        filter.location,
        query,
        page,
        perPage,
        filter.selectedRole
      );
    }
    this.props.requestConnections();
    window.localStorage.setItem('isBusinessActive', 'no');
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
  openFormModal = business => {
    this.setState({ selectedBusiness: business, isFormOpen: true });
  };
  handleConnectionInvite = business => {
    const { user } = this.props;
    this.setState(
      update(this.state, {
        invitedBusinessIds: { $push: [business.get('id')] },
        connectedTo: { $set: capitalize(business.get('name')) },
        isFormOpen: { $set: false },
      }),
      () => {
        this.props.requestCreateConnection({
          to: business.get('id'),
          toUserId: null,
          from: user.get('id'),
          fromUserId: user.get('id'),
          connectionType: 'f2b',
        });
      }
    );
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
      isCoworker: false,
    });
  };
  closeConnectionNotification = () => {
    this.setState({
      connectedTo: null,
    });
  };
  handleChangeTab = link => {
    history.push(link);
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
    this.props.requestCityBusinesses(
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
        page: 1,
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
    const {
      connections,
      cityBusinesses,
      isCityBusinessesLoading,
      classes,
      total,
    } = this.props;
    const {
      isFormOpen,
      selectedBusiness,
      invitedBusinessIds,
      sentTo,
      isInviting,
      isCoworker,
      showNotification,
      connectedTo,
      query,
      filter,
      page,
      isUnderConstruction,
    } = this.state;
    const pendingConnections =
      connections &&
      connections.filter(connection => connection.get('status') === 'PENDING');
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
        {connectedTo &&
          isCoworker && (
            <Notification
              msg={`Coworker connection request sent to ${connectedTo}`}
              close={this.closeConnectionNotification}
            />
          )}
        {connectedTo &&
          !isCoworker && (
            <Notification
              msg={`Connection Request sent to ${connectedTo}`}
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
            <Link to="/network/connections" className={classes.coworkersTitle}>
              <div className={classes.coworkersBox}>My Connections</div>
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
                        {connection.get('connectionType') === 'f2f' && (
                          <ConnectionCard
                            connection={connection}
                            ignore={this.props.requestRemoveConnection}
                            accept={this.props.requestAcceptConnection}
                          />
                        )}
                        {connection.get('connectionType') === 'b2f' && (
                          <ConnectionFromBusinessCard
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

            <Typography className={cx(classes.showForSmall, classes.findTitle)}>
              Find Connections
            </Typography>
            <Tabs
              items={ConnectionTabs.NETWORK}
              handleChange={link => this.handleChangeTab(link)}
              activeIndex={1}
            />
            {isUnderConstruction && (
              <Grid container spacing={8}>
                <Grid item xs={12} lg={12}>
                  <div className={classes.underContructionPanel}>
                    <div className={classes.underConstruction}>
                      <Typography>
                        <Typography className={classes.alertHeading}>
                          Businesses are coming soon to Jolly!
                        </Typography>
                        <strong>Want early exposure to hirers on Jolly?</strong>
                        <br />
                        Set up an interview by emailing our Community Team to
                        <br /> become a Trusted Jolly Freelancer!
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.setUpInterviewButton}
                      >
                        <a href={`${mailTo}`} className={classes.mailToLink}>
                          Email Us
                        </a>
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
            {!isUnderConstruction && (
              <Grid container spacing={8} className={classes.filterContainer}>
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
            )}
            {!isUnderConstruction &&
              isCityBusinessesLoading && (
                <Grid container className={classes.progressContainer}>
                  <Preloader />
                </Grid>
              )}
            <Grid container spacing={8}>
              {!isUnderConstruction &&
                cityBusinesses &&
                cityBusinesses.size > 0 &&
                cityBusinesses.map(cityBusiness => (
                  <Grid item key={generate()} xs={12} lg={6}>
                    <BusinessCard
                      business={cityBusiness}
                      onSelect={this.openFormModal}
                      selected={invitedBusinessIds.includes(
                        cityBusiness.get('id')
                      )}
                    />
                  </Grid>
                ))}
              {!isUnderConstruction &&
                cityBusinesses &&
                cityBusinesses.size === 0 && (
                  <Grid container spacing={8}>
                    <Grid item xs={12} lg={12}>
                      <div className={classes.emptyPanel}>
                        <div className={classes.emptyContainer}>
                          <Typography>
                            No businesses match your selection. <br />
                            Please modify the filters or your search.
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                )}
            </Grid>
            {!isUnderConstruction &&
              loadMore && (
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
        <VouchBusinessInviteFormModal
          isOpen={isFormOpen}
          business={selectedBusiness}
          onCloseModal={this.closeFormModal}
          onInvite={this.handleConnectionInvite}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  cityBusinesses: state.getIn(['app', 'cityBusinesses', 'businesses']),
  total: state.getIn(['app', 'cityBusinesses', 'total']),
  page: state.getIn(['app', 'cityBusinesses', 'page']),
  isCityBusinessesLoading: state.getIn(['app', 'isCityBusinessesLoading']),
  cityBusinessesError: state.getIn(['app', 'cityBusinessesError']),
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
  requestCityBusinesses: (city, query, page, usersPerPage, role) =>
    dispatch(requestCityBusinesses(city, query, page, usersPerPage, role)),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(NetworkBusinessesPage);
