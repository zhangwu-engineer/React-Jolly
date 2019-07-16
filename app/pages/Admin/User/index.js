// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Table from 'components/Table';
import ActionMenu from 'components/ActionMenu';
import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestUsers, requestSetUserTrusted } from './sagas';

const styles = theme => ({
  root: {
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 10px',
    },
  },
  table: {
    backgroundColor: theme.palette.common.white,
  },
  title: {
    marginBottom: 30,
  },
  exportCsv: {
    marginBottom: 10,
    textDecoration: 'none',
  },
});

type Props = {
  users: List,
  page: number,
  pages: number,
  isLoading: boolean,
  classes: Object,
  requestUsers: Function,
  requestSetUserTrusted: Function,
};

type State = {
  filter: Array<Object>,
  sort: Array<Object>,
  pageSize: number,
};

class User extends Component<Props, State> {
  state = {
    filter: [],
    sort: [
      {
        id: 'date_created',
        desc: true,
      },
    ],
    pageSize: 100,
  };
  componentDidMount() {
    const { page } = this.props;
    if (page === null) {
      this.fetchUsers(1);
    }
  }
  onPageChange = e => {
    this.fetchUsers(e + 1);
  };
  onPageSizeChange = e => {
    const { page } = this.props;
    this.setState({ pageSize: e }, () => {
      this.fetchUsers(page);
    });
  };
  handleFilterChange = filter => {
    this.setState({ filter }, () => this.debounceSearch());
  };
  handleSortChange = sort => {
    this.setState({ sort }, () => this.fetchUsers(1));
  };
  handleTrustFreelancerAction = userId => {
    this.props.requestSetUserTrusted(userId);
    this.debounceSearch();
  };

  debounceSearch = debounce(() => {
    this.fetchUsers(1);
  }, 500);

  fetchUsers = page => {
    const { filter, sort, pageSize } = this.state;
    const payload = {
      page,
      perPage: pageSize,
    };
    filter.forEach(f => {
      payload[f.id] = f.value;
    });
    payload.sort = { [sort[0].id]: sort[0].desc ? -1 : 1 };
    this.props.requestUsers(payload);
  };

  render() {
    const { users, page, pages, isLoading, classes } = this.props;
    const { pageSize, sort } = this.state;
    return (
      <div className={classes.root}>
        <Typography variant="h6" classes={{ root: classes.title }}>
          Users
        </Typography>
        <Table
          columns={[
            {
              Header: 'Email',
              id: 'email',
              accessor: d => d.get('email'),
            },
            {
              Header: 'First',
              id: 'firstName',
              accessor: d => d.get('firstName'),
            },
            {
              Header: 'Last',
              id: 'lastName',
              accessor: d => d.get('lastName'),
            },
            {
              Header: 'City',
              id: 'city',
              filterable: false,
              sortable: false,
              accessor: d => d.get('city'),
            },
            {
              Header: 'Connections',
              id: 'connections',
              filterable: false,
              sortable: false,
              accessor: d => d.get('connections'),
            },
            {
              Header: 'Trusted',
              id: 'trusted',
              filterable: false,
              sortable: false,
              accessor: d => (d.get('trusted') ? 'Y' : ''),
            },
            {
              Header: 'Jobs',
              id: 'jobs',
              filterable: false,
              sortable: false,
              accessor: d => d.get('jobs'),
            },
            {
              Header: 'Top Position',
              id: 'topPosition',
              filterable: false,
              sortable: false,
              accessor: d => d.get('topPosition'),
            },
            {
              Header: '2nd Top Position',
              id: 'top2ndPosition',
              filterable: false,
              sortable: false,
              accessor: d => d.get('top2ndPosition'),
            },
            {
              Header: 'Posts',
              id: 'posts',
              filterable: false,
              sortable: false,
              accessor: d => d.get('posts'),
            },
            {
              Header: 'Coworkers',
              id: 'coworkers',
              filterable: false,
              sortable: false,
              accessor: d => d.get('coworkers'),
            },
            {
              Header: 'Created On',
              id: 'date_created',
              filterable: false,
              accessor: d =>
                format(new Date(d.get('date_created')), 'MMMM do, yyyy'),
            },
            {
              Header: 'Actions',
              filterable: false,
              sortable: false,
              Cell: props => (
                <ActionMenu
                  data={props.row}
                  handleTrustFreelancerAction={this.handleTrustFreelancerAction}
                />
              ),
            },
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={users}
          pages={pages} // Display the total number of pages
          loading={isLoading} // Display the loading overlay when we need it
          noDataText="No users found"
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          onFilteredChange={this.handleFilterChange}
          page={page - 1}
          pageSize={pageSize}
          filterable
          defaultPageSize={pageSize}
          className={classes.table}
          getNoDataProps={() => ({
            style: { display: !users || users.size === 0 ? 'block' : 'none' },
          })}
          sorted={sort}
          onSortedChange={this.handleSortChange}
          // SubComponent={row => (
          //   <Menu data={row} onBan={this.banUser} onLoginAs={this.loginAs} />
          // )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.getIn(['adminUser', 'users', 'data']),
  page: state.getIn(['adminUser', 'users', 'page']),
  pages: state.getIn(['adminUser', 'users', 'pages']),
  isLoading: state.getIn(['adminUser', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestUsers: payload => dispatch(requestUsers(payload)),
  requestSetUserTrusted: userId => dispatch(requestSetUserTrusted(userId)),
});

export default compose(
  injectSagas({ key: 'adminUser', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(User);
