// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreIcon from '@material-ui/icons/MoreVert';

import WorkDetail from 'components/WorkDetail';
import Preloader from 'components/Preloader';
import Link from 'components/Link';

import LogoWhite from 'images/logo-white.png';

import saga, {
  reducer,
  requestWork,
  requestSearchUsers,
} from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  headerInner: {
    height: 103,
    maxWidth: 1063,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      height: 45,
    },
  },
  button: {
    color: theme.palette.common.white,
    textTransform: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  logo: {
    width: 75,
    height: 50,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

type Props = {
  user: Object,
  work: Object,
  isWorkLoading: boolean,
  workError: string,
  users: Object,
  match: Object,
  classes: Object,
  requestWork: Function,
  requestSearchUsers: Function,
};

class WorkDetailPage extends Component<Props> {
  componentDidMount() {
    const {
      match: {
        params: { eventSlug },
      },
    } = this.props;
    this.props.requestWork(eventSlug);
  }
  render() {
    const { work, user, isWorkLoading, workError, users, classes } = this.props;
    if (isWorkLoading) {
      return <Preloader />;
    }
    return (
      <React.Fragment>
        <div className={classes.header}>
          <Grid
            className={classes.headerInner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Button
                className={classes.button}
                component={props => (
                  <Link to={`/f/${user.get('slug')}/edit`} {...props} />
                )}
              >
                <ArrowBackIcon />
                &nbsp;&nbsp;&nbsp;
                <Typography className={classes.backButtonText}>
                  Job Details
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Link to="/">
                <img className={classes.logo} src={LogoWhite} alt="logo" />
              </Link>
            </Grid>
            <Grid item>
              <IconButton className={classes.button}>
                <MoreIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        {work.size > 0 && !workError ? (
          <WorkDetail
            work={work}
            users={users}
            searchUsers={this.props.requestSearchUsers}
          />
        ) : (
          <FormHelperText error>{workError}</FormHelperText>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['work', 'isLoading']),
  error: state.getIn(['work', 'error']),
  work: state.getIn(['work', 'work']),
  isWorkLoading: state.getIn(['work', 'isWorkLoading']),
  workError: state.getIn(['work', 'workError']),
  users: state.getIn(['work', 'users']),
});

const mapDispatchToProps = dispatch => ({
  requestWork: payload => dispatch(requestWork(payload)),
  requestSearchUsers: payload => dispatch(requestSearchUsers(payload)),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(WorkDetailPage);
