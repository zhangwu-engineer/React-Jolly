// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { format } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Table from 'components/Table';

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
  pageSize: number,
};

class User extends Component<Props, State> {
  state = {
    pageSize: 10,
  };
  componentDidMount() {
    const { page } = this.props;
    const { pageSize } = this.state;
    if (page === null) {
      this.props.requestUsers({ page: 1, perPage: pageSize });
    }
  }
  onPageChange = e => {
    const { pageSize } = this.state;
    this.props.requestUsers({ page: e + 1, perPage: pageSize });
  };
  renderInput = ({ column: { id } }) => (
    <input
      id={id}
      onChange={this.handleFilterChange}
      style={{ width: '100%' }}
      value={this.state[id]}
    />
  );
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
              accessor: d => d.get('jobs'),
            },
            {
              Header: 'Top Position',
              id: 'topPosition',
              accessor: d => d.get('topPosition'),
            },
            {
              Header: '2nd Top Position',
              id: 'top2ndPosition',
              accessor: d => d.get('top2ndPosition'),
            },
            {
              Header: 'Posts Made',
              id: 'posts',
              accessor: d => d.get('posts'),
            },
            {
              Header: 'Coworker Connections',
              id: 'coworkers',
              accessor: d => d.get('coworkers'),
            },
            {
              Header: 'Created On',
              id: 'createdOn',
              accessor: d =>
                format(new Date(d.get('date_created')), 'MMMM do, yyyy'),
            },
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={users}
          pages={pages} // Display the total number of pages
          loading={isLoading} // Display the loading overlay when we need it
          noDataText="No users found"
          onPageChange={this.onPageChange}
          // onPageSizeChange={this.onPageSizeChange}
          // onFilteredChange={this.handleFilterChange}
          page={page - 1}
          pageSize={pageSize}
          // filterable
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
