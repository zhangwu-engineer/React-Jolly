// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';

import { history } from 'components/ConnectedRouter';
import ProfileInfo from 'components/ProfileInfo';
import TalentInput from 'components/TalentInput';
import Link from 'components/Link';

import { requestUser } from 'containers/App/sagas';
import saga, { reducer, requestTalents } from 'containers/Talent/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 300px auto',
  },
  profileInfo: {
    marginBottom: 20,
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  editButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  bottomBanner: {
    padding: '25px 70px',
    backgroundColor: '#2b2b2b',
  },
  bannerText: {
    color: theme.palette.common.white,
    fontWeight: 500,
  },
  bannerButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 500,
    padding: '11px 20px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  topBanner: {
    padding: '25px 70px',
    backgroundColor: '#b8f3ce',
  },
  topBannerText: {
    color: '#303532',
    fontWeight: 500,
    fontSize: 18,
  },
});

type Props = {
  user: Object,
  talents: Object,
  classes: Object,
  match: Object,
  requestUser: Function,
  requestTalents: Function,
};

type State = {
  showEmailConfirmed: boolean,
};

class Profile extends Component<Props, State> {
  static getDerivedStateFromProps() {
    if (window.localStorage.getItem('emailConfirmed') === 'yes') {
      window.localStorage.removeItem('emailConfirmed');
      return {
        showEmailConfirmed: true,
      };
    }
    return null;
  }
  state = {
    showEmailConfirmed: false,
  };
  componentDidMount() {
    this.props.requestUser();
    this.props.requestTalents();
  }
  seePublicProfile = () => {
    const { user } = this.props;
    history.push(`/f/${user.get('slug')}`);
  };
  render() {
    const {
      user,
      talents,
      classes,
      match: {
        params: { slug },
      },
    } = this.props;
    const { showEmailConfirmed } = this.state;
    if (user.get('slug') !== slug) {
      return null;
    }
    return (
      <Fragment>
        {showEmailConfirmed && (
          <Grid
            className={classes.topBanner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.topBannerText}>
                Email Address Confirmed!
              </Typography>
            </Grid>
          </Grid>
        )}
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            <ProfileInfo user={user} />
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6">Talents</Typography>
            </div>
            <div className={classes.sectionBody}>
              {talents &&
                talents.map(talent => (
                  <TalentInput
                    key={generate()}
                    mode="read"
                    data={talent.toJS()}
                    editable={false}
                  />
                ))}
              <Button
                className={classes.editButton}
                component={props => (
                  <Link to={`/f/${user.get('slug')}/work`} {...props} />
                )}
              >
                <EditIcon />
                &nbsp;Edit Talents and Rates
              </Button>
            </div>
          </div>
        </div>
        {user.getIn(['profile', 'avatar']) ? (
          <Grid
            className={classes.bottomBanner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.bannerText}>
                Ready to share? View your new public page and grab the&nbsp;
                link to share it!
              </Typography>
            </Grid>
            <Grid item>
              <Button
                className={classes.bannerButton}
                onClick={() => this.seePublicProfile()}
              >
                SEE MY PULIC PROFILE
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid
            className={classes.bottomBanner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.bannerText}>
                Before you share your profile, you need to add a&nbsp;profile
                picture.
              </Typography>
            </Grid>
            <Grid item>
              <Button className={classes.bannerButton}>
                Add PICTURE&nbsp;+
              </Button>
            </Grid>
          </Grid>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
  talents: state.getIn(['talent', 'talents']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
  requestTalents: () => dispatch(requestTalents()),
});

export default compose(
  injectSagas({ key: 'talent', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Profile);
