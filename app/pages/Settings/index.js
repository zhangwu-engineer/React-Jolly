// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { capitalize } from 'lodash-es';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import UserGeneralForm from 'components/UserForm/General';
import UserProfileForm from 'components/UserForm/Profile';
import Link from 'components/Link';

import { requestUserDataUpdate, requestUser } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    maxWidth: '860px',
    margin: '10px auto 300px auto',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  mobileMenu: {
    width: '100%',
    height: 'calc(100vh - 48px)',
    background: theme.palette.common.white,
    padding: 20,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  mobileMenuItem: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '0.3px',
    color: '#2e2e2e',
    textTransform: 'none',
    textDecoration: 'none',
    display: 'block',
    padding: '15px 0px',
  },
  leftPanel: {
    width: 265,
    marginRight: 35,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  leftMenu: {
    position: 'fixed',
    paddingTop: 35,
  },
  profileInfo: {
    marginBottom: 30,
    paddingLeft: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  greetings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373737',
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'none',
    textDecoration: 'none',
  },
  menuItem: {
    color: '#5b5b5b',
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15,
    fontWeight: 500,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
    fontSize: 16,
    textTransform: 'none',
    textDecoration: 'none',
  },
  activeMenuItem: {
    backgroundColor: theme.palette.common.white,
  },
  line: {
    position: 'absolute',
    display: 'block',
    width: 4,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    top: 0,
    left: 0,
  },
  rightPanel: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      margin: 10,
      display: 'none',
    },
  },
  section: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      padding: '10px 15px',
      marginBottom: 0,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: '0.2px',
    color: '#2e2e2e',
    marginBottom: 40,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  editProfile: {
    marginBottom: 20,
  },
});

type Props = {
  user: Object,
  location: Object,
  classes: Object,
  updateUser: Function,
  requestUser: Function,
};

class SettingsPage extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  componentDidUpdate() {
    const {
      location: { hash },
    } = this.props;
    if (hash === '#general' || hash === '') {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    } else if (hash === '#profile') {
      setTimeout(() => {
        if (this.profileForm.current) {
          window.scrollTo(0, this.profileForm.current.offsetTop);
        }
      }, 50);
    }
  }
  profileForm = React.createRef();
  render() {
    const {
      user,
      location: { hash },
      classes,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.mobileMenu}>
          <Link to="/settings/general" className={classes.mobileMenuItem}>
            General Account Settings
          </Link>
          <Link to="/settings/profile" className={classes.mobileMenuItem}>
            Edit Profile
          </Link>
        </div>
        <div className={classes.leftPanel}>
          <div className={classes.leftMenu}>
            <Grid
              container
              alignItems="center"
              classes={{
                container: classes.profileInfo,
              }}
            >
              <Grid item>
                <Avatar
                  className={classes.avatar}
                  src={user.getIn(['profile', 'avatar'])}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6" className={classes.greetings}>
                  {`Hi, ${capitalize(user.get('firstName'))}!`}
                </Typography>
                <Link to="/edit" className={classes.link}>
                  View Profile
                </Link>
              </Grid>
            </Grid>
            <Link
              className={cx(classes.menuItem, {
                [classes.activeMenuItem]: hash === '#general' || hash === '',
              })}
              to="/settings#general"
            >
              {(hash === '#general' || hash === '') && (
                <div className={classes.line} />
              )}
              General
            </Link>
            <Link
              className={cx(classes.menuItem, {
                [classes.activeMenuItem]: hash === '#profile',
              })}
              to="/settings#profile"
            >
              {hash === '#profile' && <div className={classes.line} />}
              Profile
            </Link>
          </div>
        </div>
        <div className={classes.rightPanel}>
          <div className={classes.section}>
            <Typography variant="h6" className={classes.title}>
              General Account Settings
            </Typography>
            <UserGeneralForm
              user={user}
              updateUser={this.props.updateUser}
              backURL="/settings#general"
            />
          </div>
          <div className={classes.section} ref={this.profileForm}>
            <Typography
              variant="h6"
              className={cx(classes.title, classes.editProfile)}
            >
              Edit Profile
            </Typography>
            <UserProfileForm user={user} updateUser={this.props.updateUser} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(SettingsPage);
