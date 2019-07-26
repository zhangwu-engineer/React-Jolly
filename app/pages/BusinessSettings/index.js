// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import UserAvatar from 'components/UserAvatar';
import BusinessProfileForm from 'components/BusinessProfileForm';
import BusinessPositionsForm from 'components/BusinessPositionsForm';

import { requestUser, requestBusinessDataUpdate } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    maxWidth: 1064,
    margin: '21px auto 300px auto',
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
    width: 353,
    marginRight: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  leftMenu: {
    width: 353,
    position: 'fixed',
    paddingTop: 35,
  },
  profileInfo: {
    marginBottom: 30,
    paddingLeft: 5,
  },
  avatar: {
    width: 65,
    height: 65,
    marginRight: 20,
    paddingTop: 2,
    fontWeight: 600,
    backgroundColor: theme.palette.primary.main,
  },
  greetings: {
    fontSize: 18,
    fontWeight: 600,
    color: '#323232',
  },
  link: {
    fontSize: 16,
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
  requestUser: Function,
  updateBusiness: Function,
};

class SettingsPage extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  componentDidUpdate() {
    const {
      location: { hash },
    } = this.props;
    if (hash === '#profile' || hash === '') {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    } else if (hash === '#positions') {
      setTimeout(() => {
        if (this.positionsForm.current) {
          window.scrollTo(0, this.positionsForm.current.offsetTop);
        }
      }, 50);
    }
  }
  goToProfilePage = slug => {
    history.push(`/b/${slug}`);
  };
  positionsForm = React.createRef();
  render() {
    const {
      user,
      location: { hash },
      classes,
    } = this.props;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    return (
      <div className={classes.root}>
        <div className={classes.mobileMenu}>
          <Link to="/b/settings/profile" className={classes.mobileMenuItem}>
            Business Profile Info
          </Link>
          <Link to="/b/settings/positions" className={classes.mobileMenuItem}>
            Positions
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
                <UserAvatar
                  className={classes.avatar}
                  content={currentBusiness && currentBusiness.name}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6" className={classes.greetings}>
                  {currentBusiness && currentBusiness.name}
                </Typography>
                <Link
                  className={classes.link}
                  onClick={() => this.goToProfilePage(currentBusiness.slug)}
                >
                  View Business Profile
                </Link>
              </Grid>
            </Grid>
            <Link
              className={cx(classes.menuItem, {
                [classes.activeMenuItem]: hash === '#profile' || hash === '',
              })}
              to="/b/settings#profile"
            >
              {(hash === '#profile' || hash === '') && (
                <div className={classes.line} />
              )}
              Business Profile Info
            </Link>
            <Link
              className={cx(classes.menuItem, {
                [classes.activeMenuItem]: hash === '#positions',
              })}
              to="/b/settings#positions"
            >
              {hash === '#positions' && <div className={classes.line} />}
              Positions
            </Link>
          </div>
        </div>
        <div className={classes.rightPanel}>
          <div className={classes.section}>
            <Typography variant="h6" className={classes.title}>
              Business Profile
            </Typography>
            <BusinessProfileForm
              business={currentBusiness}
              updateBusiness={this.props.updateBusiness}
            />
          </div>
          <div className={classes.section} ref={this.positionsForm}>
            <BusinessPositionsForm />
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
  requestUser: () => dispatch(requestUser()),
  updateBusiness: payload => dispatch(requestBusinessDataUpdate(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(SettingsPage);
