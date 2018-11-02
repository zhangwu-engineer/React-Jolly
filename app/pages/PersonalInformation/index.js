// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import EditableInput from 'components/EditableInput';
import Option from 'components/Option';

const styles = theme => ({
  root: {
    maxWidth: '989px',
    margin: '50px auto 300px auto',
    display: 'flex',
  },
  leftPanel: {
    width: 242,
    marginRight: 35,
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
      margin: 5,
    },
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
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
});

type Props = {
  user: Object,
  classes: Object,
};

type State = {
  selectedSection: string,
};

class PersonalInformationPage extends Component<Props, State> {
  state = {
    selectedSection: 'basic',
  };
  render() {
    const { user, classes } = this.props;
    const { selectedSection } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.leftPanel}>
          <Typography className={classes.title} variant="h6">
            Profile Information
          </Typography>
          <div
            className={
              selectedSection === 'basic'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'basic' })}
          >
            {selectedSection === 'basic' && <div className={classes.line} />}
            Basic &amp; Contact information
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
            Public profile actions
          </div>
          <div
            className={
              selectedSection === 'location'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'location' })}
          >
            {selectedSection === 'location' && <div className={classes.line} />}
            Location
          </div>
          <div
            className={
              selectedSection === 'social'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'social' })}
          >
            {selectedSection === 'social' && <div className={classes.line} />}
            Social media
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
              <Typography variant="h6">
                Basic and contact information
              </Typography>
            </div>
            <div className={classes.sectionBody}>
              <EditableInput
                label="Name"
                id="name"
                value={`${user.get('firstName')} ${user.get('lastName')}`}
              />
              <EditableInput
                label="Email"
                id="email"
                value={user.get('email')}
              />
              <EditableInput
                label="Phone"
                id="phone"
                value={user.get('phone') || ''}
              />
              <EditableInput
                label="Bio"
                id="bio"
                value={user.get('bio') || ''}
                multiline
              />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6">Public profile actions</Typography>
            </div>
            <div className={classes.sectionBody}>
              <Option
                label="Email (your address will be hidden)"
                id="enableEmail"
                value={user.get('enableEmail') || false}
                modalTitle="Email Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send an email message"
              />
              <Option
                label="SMS (your phone # will be hidden)"
                id="enableSMS"
                value={user.get('enableSMS') || false}
                modalTitle="SMS Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send you a text (SMS) message"
              />
              <Option
                label="Call (your phone # will be hidden)"
                id="enableCall"
                value={user.get('enableCall') || false}
                modalTitle="Call Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to call you"
              />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6">Location</Typography>
            </div>
            <div className={classes.sectionBody}>
              <EditableInput
                label="Location"
                id="location"
                value={user.get('location') || ''}
              />
              <EditableInput
                label="Distance you'll travel for work"
                id="distance"
                value={user.get('distance') || ''}
              />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6">Social media</Typography>
            </div>
            <div className={classes.sectionBody}>
              <EditableInput
                label="Facebook"
                id="facebook"
                value={user.get('facebook') || ''}
                startWith="/"
              />
              <EditableInput
                label="Twitter"
                id="twitter"
                value={user.get('twitter') || ''}
                startWith="@"
              />
              <EditableInput
                label="Linkedin"
                id="linkedin"
                value={user.get('linkedin') || ''}
                startWith="/"
              />
              <EditableInput
                label="Youtube"
                id="youtube"
                value={user.get('youtube') || ''}
                startWith="/"
              />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Typography variant="h6">Privacy</Typography>
            </div>
            <div className={classes.sectionBody}>
              <Option
                label="Image library on public profile"
                id="showImageLibrary"
                value={user.get('showImageLibrary') || false}
                modalTitle="Email Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send an email message"
              />
              <Option
                label="Display social links on public profile"
                id="showSocialLinks"
                value={user.get('showSocialLinks') || false}
                modalTitle="SMS Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to send you a text (SMS) message"
              />
              <Option
                label="Public profile can be found on web"
                id="public"
                value={user.get('public') || false}
                modalTitle="Call Button on Profile"
                modalContent="When enabled, visitors to your public profile will see a button to call you"
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

const mapDispatchToProps = () => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(PersonalInformationPage);
