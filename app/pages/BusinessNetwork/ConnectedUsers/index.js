// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import cx from 'classnames';
import { debounce } from 'lodash-es';
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
import BusinessSidebar from 'components/BusinessSidebar';
import EditableInput from 'components/EditableInput';
import UserCard from 'components/UserCard';
import NetworkNav from 'components/NetworkNav';
import CustomSelect from 'components/CustomSelect';

import ROLES from 'enum/roles';
import { ACTIVE_OPTIONS } from 'enum/constants';

import { requestCityUsersConnected } from 'containers/App/sagas';
import saga, { reducer } from 'containers/Network/sagas';
import injectSagas from 'utils/injectSagas';

let roles = ROLES.sort().map(role => ({ value: role, label: role }));
roles = [{ value: '', label: 'All Positions' }].concat(roles);

const statuses = ACTIVE_OPTIONS.sort().map(status => status);
const perPage = 24;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    width: '100%',
    maxWidth: 1064,
    margin: '0 auto',
    display: 'flex',
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
  searchInputWrap: {
    marginBottom: 25,
    [theme.breakpoints.down('xs')]: {
      marginTop: 10,
      marginBottom: 0,
    },
  },
  findTitleWrap: {
    marginBottom: 0,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 20,
    },
  },
  findFreelancersTitle: {
    fontSize: 16,
    fontFamily: 'Avenir Next, Demi Bold',
    fontWeight: 600,
    color: '#4a4a4a',
  },
  findFreelancersCount: {
    color: '#6f6f73',
  },
  findFreelancersClearFilter: {
    color: '#1575d9',
    cursor: 'pointer',
    textDecoration: 'none',
    textTransform: 'none',
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
    paddingLeft: 25,
    paddingRight: 25,
    position: 'relative',
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
    top: 20,
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
  cityUsersContainer: {
    marginTop: 10,
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
  cityUsersConnected: List<Object>,
  total: number, // eslint-disable-line
  page: number, // eslint-disable-line
  isCityUsersConnectedLoading: boolean, // eslint-disable-line
  cityUsersConnectedError: string, // eslint-disable-line
  isCreating: boolean, // eslint-disable-line
  createError: string, // eslint-disable-line
  classes: Object,
  requestCityUsersConnected: Function,
};

type State = {
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

class ConnectedUsersPage extends Component<Props, State> {
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
    invitedUserIds: [],
    selectedTab: 0,
    query: '',
    filter: {
      location: '',
      selectedRole: '',
      activeStatus: '',
    },
    page: 1,
  };
  componentDidMount() {
    const { user } = this.props;
    const { query, filter, page } = this.state;
    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];
    if (user.getIn(['profile', 'location']) && currentBusiness) {
      this.props.requestCityUsersConnected(
        filter.location,
        query,
        page,
        perPage,
        filter.selectedRole,
        filter.activeStatus,
        currentBusiness.id
      );
    }
    window.localStorage.setItem('isBusinessActive', 'yes');
  }
  gotoUserProfile = user => {
    history.push(`/f/${user.get('slug')}`);
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
    const { user } = this.props;
    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];
    if (currentBusiness)
      this.props.requestCityUsersConnected(
        filter.location,
        query,
        page,
        perPage,
        filter.selectedRole,
        filter.activeStatus,
        currentBusiness.id
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
  handleActiveStatusChange = status => {
    this.setState(
      state => ({
        ...state,
        page: 1,
        filter: {
          ...state.filter,
          activeStatus: status,
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
  clearFilters = () => {
    this.setState(
      state => ({
        ...state,
        query: '',
        page: 1,
        selectedTab: 0,
        filter: {
          ...state.filter,
          location: '',
          selectedRole: '',
          activeStatus: '',
        },
      }),
      () => this.debouncedSearch()
    );
  };
  render() {
    const {
      cityUsersConnected,
      classes,
      total,
      user,
      isCityUsersConnectedLoading,
    } = this.props;
    const { invitedUserIds, selectedTab, query, filter, page } = this.state;
    const loadMore = total > page * perPage;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    return (
      <React.Fragment>
        <NetworkNav isBusinessNetwork />
        <div className={classes.root}>
          {currentBusiness && (
            <div className={classes.businessSidebar}>
              <BusinessSidebar business={currentBusiness} />
            </div>
          )}
          <div className={classes.content}>
            <div className={classes.rightPanel}>
              <Grid container alignItems="center" spacing={8}>
                <Grid item xs={12} md={8}>
                  <Typography
                    className={cx(
                      classes.findFreelancersTitle,
                      classes.findTitleWrap
                    )}
                  >
                    <span>Connections&nbsp;</span>
                    <span
                      className={cx(
                        classes.findFreelancersTitle,
                        classes.findFreelancersCount
                      )}
                    >
                      {`${
                        cityUsersConnected
                          ? cityUsersConnected.toJSON().length
                          : 0
                      } Filtered`}
                      &nbsp;&sdot;&nbsp;
                    </span>
                    <Link
                      className={cx(
                        classes.findFreelancersTitle,
                        classes.findFreelancersClearFilter
                      )}
                      onClick={() => this.clearFilters()}
                    >
                      Clear Filters
                    </Link>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  className={cx(classes.searchInputWrap, classes.hideForSmall)}
                >
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
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={8} className={classes.filterContainer}>
                <Grid item xs={6} md={4}>
                  <EditableInput
                    label="City"
                    id="location"
                    name="location"
                    value={filter.location}
                    onChange={this.handleLocationChange}
                    select
                  />
                </Grid>
                <Grid item xs={6} md={4} className={classes.searchInputWrapper}>
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
                  md={4}
                  className={classes.searchInputWrapper}
                >
                  <CustomSelect
                    placeholder="Active & Inactive"
                    options={statuses}
                    value={
                      filter.activeStatus
                        ? {
                            value: filter.activeStatus,
                            label: filter.activeStatus,
                          }
                        : null
                    }
                    onChange={value =>
                      this.handleActiveStatusChange(value.value)
                    }
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
                  md={4}
                  className={cx(classes.searchInputWrap, classes.showForSmall)}
                >
                  <FormControl
                    classes={{ root: classes.formControl }}
                    fullWidth
                  >
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
              {isCityUsersConnectedLoading && (
                <Grid container className={classes.progressContainer}>
                  <Preloader />
                </Grid>
              )}
              {selectedTab === 0 && (
                <Grid
                  container
                  spacing={8}
                  className={classes.cityUsersContainer}
                >
                  {cityUsersConnected.map(cityUser => (
                    <Grid item key={generate()} xs={12} lg={6}>
                      <UserCard
                        user={cityUser}
                        onSelect={this.gotoUserProfile}
                        selected={invitedUserIds.includes(cityUser.get('id'))}
                      />
                    </Grid>
                  ))}
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
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  cityUsersConnected: state.getIn(['app', 'cityUsersConnected', 'users']),
  total: state.getIn(['app', 'cityUsersConnected', 'total']),
  page: state.getIn(['app', 'cityUsersConnected', 'page']),
  isCityUsersConnectedLoading: state.getIn([
    'app',
    'isCityUsersConnectedLoading',
  ]),
  cityUsersConnectedError: state.getIn(['app', 'cityUsersConnectedError']),
});

const mapDispatchToProps = dispatch => ({
  requestCityUsersConnected: (
    city,
    query,
    page,
    usersPerPage,
    role,
    activeStatus,
    businessId
  ) =>
    dispatch(
      requestCityUsersConnected(
        city,
        query,
        page,
        usersPerPage,
        role,
        activeStatus,
        businessId
      )
    ),
});

export default compose(
  injectSagas({ key: 'network', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(ConnectedUsersPage);
