// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNewOutlined';

import { history } from 'components/ConnectedRouter';
import Option from 'components/Option';
import EditableInput from 'components/EditableInput';

import { requestUserDataUpdate, requestUser } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    maxWidth: '989px',
    margin: '50px auto 300px auto',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  leftPanel: {
    width: 242,
    marginRight: 35,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  title: {
    fontSize: 24,
    marginLeft: 20,
    marginBottom: 30,
  },
  menuItem: {
    color: '#5a5d64',
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
    backgroundColor: '#e4e6e6',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    display: 'block',
    content: '',
    width: 3,
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
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
      marginBottom: 0,
    },
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: 'transparent',
      padding: '25px 0px 15px 0px',
    },
  },
  sectionTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      borderRadius: 3,
      padding: '10px 15px',
    },
  },
  iconButton: {
    color: '#a4acb3',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 6,
    },
  },
  valueField: {
    fontSize: 18,
    letterSpacing: '0.5px',
    color: '#4a4a4a',
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
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
    selectedSection: 'personal',
    model: null,
  };
  componentDidMount() {
    this.props.requestUser();
  }
  componentDidUpdate(prevProps: Props) {
    const { user } = this.props;
    if (prevProps.user.get('slug') !== user.get('slug')) {
      window.location.href = `${window.location.origin}/f/${user.get(
        'slug'
      )}/settings`;
    }
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
  render() {
    const { user, classes } = this.props;
    const { selectedSection, model } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.leftPanel}>
          <Typography className={classes.title} variant="h6">
            Settings
          </Typography>
          <div
            className={
              selectedSection === 'personal'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'personal' })}
          >
            {selectedSection === 'personal' && <div className={classes.line} />}
            Personal information
          </div>
          <div
            className={
              selectedSection === 'public'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'public' })}
          >
            {selectedSection === 'public' && <div className={classes.line} />}
            Profile Contact Actions
          </div>
          <div
            className={
              selectedSection === 'privacy'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'privacy' })}
          >
            {selectedSection === 'privacy' && <div className={classes.line} />}
            Privacy
          </div>
        </div>
        <div className={classes.rightPanel}>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Personal information
              </Typography>
            </div>
            <div className={classes.sectionBody}>
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
              <Grid container alignItems="center">
                <Grid item xs={11} lg={11}>
                  <Typography variant="h6" className={classes.valueField}>
                    Edit profile details
                  </Typography>
                </Grid>
                <Grid item xs={1} lg={1}>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => {
                      history.push('/edit');
                    }}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Profile Contact Actions
              </Typography>
            </div>
            <div className={classes.sectionBody}>
              <Option
                label="Email"
                id="receiveEmail"
                value={model && model.profile.receiveEmail}
                modalTitle="Email Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send an email message"
                onChange={this.onChange}
              />
              <Option
                label="SMS"
                id="receiveSMS"
                value={model && model.profile.receiveSMS}
                modalTitle="SMS Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send you a text (SMS) message"
                onChange={this.onChange}
              />
              <Option
                label="Call"
                id="receiveCall"
                value={model && model.profile.receiveCall}
                modalTitle="Call Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to call you"
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Privacy
              </Typography>
            </div>
            <div className={classes.sectionBody}>
              <Option
                label="Image library on public profile"
                id="showImageLibrary"
                value={model && model.profile.showImageLibrary}
                modalTitle="Email Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send an email message"
                onChange={this.onChange}
              />
            </div>
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
