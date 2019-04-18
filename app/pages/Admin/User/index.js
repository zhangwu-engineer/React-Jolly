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
import saga, { reducer, requestUsers } from './sagas';

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
});

type Props = {
  users: List,
  page: number,
  pages: number,
  isLoading: boolean,
  classes: Object,
  requestUsers: Function,
};

type State = {
  filter: Array<Object>,
  pageSize: number,
};

class User extends Component<Props, State> {
  state = {
    filter: [],
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
  debounceSearch = debounce(() => {
    this.fetchUsers(1);
  }, 500);

  fetchUsers = page => {
    const { filter, pageSize } = this.state;
    const payload = {
      page,
      perPage: pageSize,
    };
    filter.forEach(f => {
      payload[f.id] = f.value;
    });
    this.props.requestUsers(payload);
  };

  render() {
    const { users, page, pages, isLoading, classes } = this.props;
    const { pageSize } = this.state;
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
              Header: 'First Name',
              id: 'firstName',
              accessor: d => d.get('firstName'),
            },
            {
              Header: 'Last Name',
              id: 'lastName',
              accessor: d => d.get('lastName'),
            },
            {
              Header: 'Jobs Entered',
              id: 'jobs',
              filterable: false,
              accessor: d => d.get('jobs'),
            },
            {
              Header: 'Top Position',
              id: 'topPosition',
              filterable: false,
              accessor: d => d.get('topPosition'),
            },
            {
              Header: '2nd Top Position',
              id: 'top2ndPosition',
              filterable: false,
              accessor: d => d.get('top2ndPosition'),
            },
            {
              Header: 'Posts Made',
              id: 'posts',
              filterable: false,
              accessor: d => d.get('posts'),
            },
            {
              Header: 'Coworker Connections',
              id: 'coworkers',
              filterable: false,
              accessor: d => d.get('coworkers'),
            },
            {
              Header: 'Created On',
              id: 'createdOn',
              filterable: false,
              accessor: d =>
                format(new Date(d.get('date_created')), 'MMMM do, yyyy'),
            },
            {
              Header: 'Actions',
              filterable: false,
              Cell: props => <ActionMenu data={props.row} />,
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
});

export default compose(
  injectSagas({ key: 'adminUser', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(User);
