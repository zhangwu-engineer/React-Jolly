// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { capitalize } from 'lodash-es';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Link from 'components/Link';
import EditableInput from 'components/EditableInput';

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
  leftPanel: {
    width: 265,
    marginRight: 35,
    paddingTop: 35,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
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
  },
  activeMenuItem: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15,
    fontWeight: 500,
    color: '#5b5b5b',
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
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
  marginBottom: {
    marginBottom: '20px !important',
  },
  contactOptionsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#090909',
  },
  contactOptionsDesc: {
    fontSize: 14,
    fontWeight: 600,
    color: '#6b6464',
    marginBottom: 10,
  },
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
  },
  switchGroup: {
    marginBottom: 30,
  },
  switchRoot: {
    margin: 0,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#262626',
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
  requestUser: Function,
};

type State = {
  selectedSection: string,
  model: ?Object,
};

class SettingsPage extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user && !prevState.model) {
      const profile = nextProps.user.get('profile');
      const name = `${nextProps.user.get('firstName')} ${nextProps.user.get(
        'lastName'
      )}`;
      return {
        ...prevState,
        model: {
          name,
          email: nextProps.user.get('email'),
          profile: {
            phone: profile.get('phone') || '',
            bio: profile.get('bio') || '',
            receiveEmail: profile.get('receiveEmail'),
            receiveSMS: profile.get('receiveSMS'),
            receiveCall: profile.get('receiveCall'),
            location: profile.get('location') || '',
            distance: profile.get('distance') || '',
            facebook: profile.get('facebook') || '',
            twitter: profile.get('twitter') || '',
            linkedin: profile.get('linkedin') || '',
            youtube: profile.get('youtube') || '',
            showImageLibrary: profile.get('showImageLibrary'),
          },
        },
      };
    }
    if (prevState.model && prevState.model.profile) {
      const {
        model: {
          name,
          email,
          profile: { phone },
        },
      } = prevState;
      if (nextProps.user.getIn(['profile', 'phone']) !== phone) {
        const prevProfile = prevState.model ? prevState.model.profile : {};
        return {
          ...prevState,
          model: {
            name,
            email,
            profile: {
              ...prevProfile,
              phone: nextProps.user.getIn(['profile', 'phone']),
            },
          },
        };
      }
    }
    return null;
  }
  state = {
    selectedSection: 'general',
    model: null,
  };
  componentDidMount() {
    this.props.requestUser();
  }
  onChange = (id, value) => {
    if (id === 'name') {
      this.setState(
        update(this.state, {
          model: {
            name: { $set: value },
          },
        }),
        () => {
          if (value.split(' ').length >= 2) {
            const [firstName, ...rest] = value.split(' ');
            this.props.updateUser({
              firstName,
              lastName: rest.join(' '),
            });
          }
        }
      );
    } else if (id === 'email') {
      this.setState(
        update(this.state, {
          model: {
            email: { $set: value },
          },
        }),
        () => {
          this.props.updateUser({
            email: value,
          });
        }
      );
    } else {
      this.setState(
        update(this.state, {
          model: {
            profile: {
              [id]: { $set: value },
            },
          },
        }),
        () => {
          this.props.updateUser({
            profile: {
              [id]: value,
            },
          });
        }
      );
    }
  };
  handleSwitchChange = name => event => {
    this.onChange(name, event.target.checked);
  };
  render() {
    const { user, classes } = this.props;
    const { selectedSection, model } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.leftPanel}>
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

          <div
            className={
              selectedSection === 'general'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'general' })}
          >
            {selectedSection === 'general' && <div className={classes.line} />}
            General
          </div>
          <div
            className={
              selectedSection === 'profile'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'profile' })}
          >
            {selectedSection === 'profile' && <div className={classes.line} />}
            Profile
          </div>
        </div>
        <div className={classes.rightPanel}>
          <div className={classes.section}>
            <Typography variant="h6" className={classes.title}>
              General Account Settings
            </Typography>
            <EditableInput
              label="Name"
              id="name"
              value={model && model.name}
              onChange={this.onChange}
            />
            <EditableInput
              label="Email"
              id="email"
              value={model && model.email}
              onChange={this.onChange}
            />
            <EditableInput
              label={
                user.getIn(['profile', 'verifiedPhone'])
                  ? 'Phone (verified)'
                  : 'Phone (not verified)'
              }
              id="phone"
              value={model && model.profile.phone}
              slug={user.get('slug')}
            />
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  className={classes.saveButton}
                  color="primary"
                  variant="contained"
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.section}>
            <Typography
              variant="h6"
              className={cx(classes.title, classes.marginBottom)}
            >
              Edit Profile
            </Typography>
            <Typography className={classes.contactOptionsTitle}>
              Contact Options
            </Typography>
            <Typography className={classes.contactOptionsDesc}>
              Select how you’d like clients to contact you. Your phone number
              will never be displayed on your profile.
            </Typography>
            <Grid
              className={classes.switchGroup}
              container
              justify="space-between"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={model && model.profile.receiveEmail}
                      onChange={this.handleSwitchChange('receiveEmail')}
                      color="primary"
                    />
                  }
                  label="Email"
                  labelPlacement="start"
                  classes={{
                    root: classes.switchRoot,
                    label: classes.switchLabel,
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={model && model.profile.receiveSMS}
                      onChange={this.handleSwitchChange('receiveSMS')}
                      color="primary"
                    />
                  }
                  label="SMS"
                  labelPlacement="start"
                  classes={{
                    root: classes.switchRoot,
                    label: classes.switchLabel,
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={model && model.profile.receiveCall}
                      onChange={this.handleSwitchChange('receiveCall')}
                      color="primary"
                    />
                  }
                  label="Call"
                  labelPlacement="start"
                  classes={{
                    root: classes.switchRoot,
                    label: classes.switchLabel,
                  }}
                />
              </Grid>
            </Grid>
            <EditableInput
              label="Bio"
              id="bio"
              value={model && model.profile.bio}
              multiline
              onChange={this.onChange}
            />
            <EditableInput
              label="Location"
              id="location"
              value={model && model.profile.location}
              onChange={this.onChange}
            />
            <EditableInput
              label="Miles you'll travel for work"
              id="distance"
              value={model && model.profile.distance}
              onChange={this.onChange}
            />
            <EditableInput
              label="Facebook"
              id="facebook"
              value={model && model.profile.facebook}
              startWith="/"
              onChange={this.onChange}
            />
            <EditableInput
              label="Twitter"
              id="twitter"
              value={model && model.profile.twitter}
              startWith="@"
              onChange={this.onChange}
            />
            <EditableInput
              label="Linkedin"
              id="linkedin"
              value={model && model.profile.linkedin}
              startWith="/in/"
              onChange={this.onChange}
            />
            <EditableInput
              label="Youtube"
              id="youtube"
              value={model && model.profile.youtube}
              startWith="/"
              onChange={this.onChange}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={model && model.profile.showImageLibrary}
                  onChange={this.handleSwitchChange('showImageLibrary')}
                  color="primary"
                />
              }
              label="Show image library on public profile"
              labelPlacement="start"
              classes={{
                root: cx(classes.switchRoot, classes.marginBottom),
                label: classes.switchLabel,
              }}
            />
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  className={classes.saveButton}
                  color="primary"
                  variant="contained"
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
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
